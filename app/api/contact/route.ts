import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/app.config";
import {
  apiContactStrings,
  apiErrors,
  contactTopicLabel,
} from "@/lib/contact-labels";
import { isContactTopic, sanitizeText } from "@/lib/contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transporter = nodemailer.createTransport({
  host: "smtps.aruba.it",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const transporterNoReply = nodemailer.createTransport({
  host: "smtps.aruba.it",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_NOREPLY_USER,
    pass: process.env.SMTP_NOREPLY_PASS,
  },
});

export async function POST(request: Request) {
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.SMTP_USER?.trim();
  const noReplyFrom = process.env.SMTP_NOREPLY_USER?.trim();

  if (
    !to ||
    !from ||
    !process.env.SMTP_PASS ||
    !noReplyFrom ||
    !process.env.SMTP_NOREPLY_PASS
  ) {
    return NextResponse.json(
      { error: apiErrors("it").config },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: apiErrors("it").json }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: apiErrors("it").body }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const uiLocale = sanitizeText(o.locale, 5) === "en" ? "en" : "it";
  const errors = apiErrors(uiLocale);
  const L = apiContactStrings(uiLocale);

  const name = sanitizeText(o.name, 200);
  const email = sanitizeText(o.email, 254);
  const message = sanitizeText(o.message, 8000);
  const topicRaw = sanitizeText(o.topic, 32);
  const plan = sanitizeText(o.plan, 120) ?? "";
  const section = sanitizeText(o.section, 200) ?? "";

  if (!name || !email || !message || !topicRaw || !isContactTopic(topicRaw)) {
    return NextResponse.json({ error: errors.fields }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: errors.emailInvalid }, { status: 400 });
  }

  const topicLabel = contactTopicLabel(uiLocale, topicRaw);
  const subjectParts = [L.emailSubjectPrefix, topicLabel];
  if (plan) subjectParts.push(`— ${plan}`);

  const internalHtml = `
    <h2>${escapeHtml(L.emailHeading)}</h2>
    <p><strong>${escapeHtml(L.emailTopic)}:</strong> ${escapeHtml(topicLabel)}</p>
    ${plan ? `<p><strong>${escapeHtml(L.emailPlan)}:</strong> ${escapeHtml(plan)}</p>` : ""}
    ${section ? `<p><strong>${escapeHtml(L.emailSection)}:</strong> ${escapeHtml(section)}</p>` : ""}
    <p><strong>${escapeHtml(L.emailName)}:</strong> ${escapeHtml(name)}</p>
    <p><strong>${escapeHtml(L.emailEmail)}:</strong> ${escapeHtml(email)}</p>
    <hr />
    <p><strong>${escapeHtml(L.emailMessage)}</strong></p>
    <pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(message)}</pre>
  `;

  const autoReplyHtml =
    uiLocale === "en"
      ? `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <img src="https://www.alvencoltd.co.uk/logo-full.svg" alt="Alvenco Ltd" style="height:48px;margin-bottom:24px" />
  <h2 style="color:#1A3A5C">Thank you, ${escapeHtml(name)}!</h2>
  <p>We have received your message and will get back to you within <strong>48 hours</strong>.</p>
  <p><strong>Your enquiry:</strong> ${escapeHtml(topicLabel)}${plan ? ` — ${escapeHtml(plan)}` : ""}</p>
  <p><strong>Message:</strong></p>
  <p style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap">${escapeHtml(message)}</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
  <p style="color:#666;font-size:14px">For urgent questions contact us at <a href="mailto:hello@alvencoltd.co.uk">hello@alvencoltd.co.uk</a> or WhatsApp us at <a href="tel:+447754812247">+44 7754 812247</a>.</p>
  <p style="color:#666;font-size:14px">— The Alvenco Team<br/>${siteConfig.address.full}, UK</p>
</div>
`
      : `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <img src="https://www.alvencoltd.co.uk/logo-full.svg" alt="Alvenco Ltd" style="height:48px;margin-bottom:24px" />
  <h2 style="color:#1A3A5C">Grazie, ${escapeHtml(name)}!</h2>
  <p>Abbiamo ricevuto il tuo messaggio e ti risponderemo entro <strong>48 ore</strong>.</p>
  <p><strong>La tua richiesta:</strong> ${escapeHtml(topicLabel)}${plan ? ` — ${escapeHtml(plan)}` : ""}</p>
  <p><strong>Messaggio:</strong></p>
  <p style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap">${escapeHtml(message)}</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
  <p style="color:#666;font-size:14px">Per domande urgenti scrivici a <a href="mailto:hello@alvencoltd.co.uk">hello@alvencoltd.co.uk</a> o su WhatsApp al <a href="tel:+447754812247">+44 7754 812247</a>.</p>
  <p style="color:#666;font-size:14px">— Il team Alvenco<br/>${siteConfig.address.full}, UK</p>
</div>
`;

  try {
    // Email interna al team Alvenco
    await transporter.sendMail({
      from: `"Alvenco Contact Form" <${from}>`,
      to,
      replyTo: email,
      subject: subjectParts.join(" "),
      html: internalHtml,
    });

    // Email automatica di conferma al cliente
    await transporterNoReply.sendMail({
      from: `"Alvenco Ltd" <${noReplyFrom}>`,
      to: email,
      subject:
        uiLocale === "en"
          ? "We received your enquiry — Alvenco Ltd"
          : "Abbiamo ricevuto la tua richiesta — Alvenco Ltd",
      html: autoReplyHtml,
    });
  } catch (err) {
    console.error("[contact] SMTP:", err);
    return NextResponse.json({ error: errors.sendFailed }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
