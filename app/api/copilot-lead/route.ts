import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { apiCopilotStrings, apiErrors } from "@/lib/copilot-labels";
import { sanitizeText } from "@/lib/contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_STATUS = ["evaluating", "name_decided", "had_issues"] as const;

type CopilotStatus = (typeof VALID_STATUS)[number];

function isCopilotStatus(v: string): v is CopilotStatus {
  return (VALID_STATUS as readonly string[]).includes(v);
}

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

function getRequestLocale(request: Request): "it" | "en" {
  const referer = request.headers.get("referer") ?? "";
  if (referer.includes("/en/") || referer.endsWith("/en")) return "en";
  if (referer.includes("/it/") || referer.endsWith("/it")) return "it";

  const accept = request.headers.get("accept-language") ?? "";
  if (accept.toLowerCase().startsWith("it")) return "it";
  return "en";
}

export async function POST(request: Request) {
  const fallbackLocale = getRequestLocale(request);
  const fallbackErrors = apiErrors(fallbackLocale);

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
      { error: fallbackErrors.config },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: fallbackErrors.json },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: fallbackErrors.body },
      { status: 400 },
    );
  }

  const o = body as Record<string, unknown>;
  const uiLocale = sanitizeText(o.locale, 5) === "en" ? "en" : "it";
  const errors = apiErrors(uiLocale);
  const L = apiCopilotStrings(uiLocale);

  const name = sanitizeText(o.name, 200);
  const email = sanitizeText(o.email, 254);
  const statusRaw = sanitizeText(o.status, 32);

  if (!name || !email || !statusRaw || !isCopilotStatus(statusRaw)) {
    return NextResponse.json({ error: errors.fields }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: errors.emailInvalid }, { status: 400 });
  }

  const statusLabel = L.statusLabels[statusRaw];

  const internalHtml = `
    <h2>${escapeHtml(L.emailHeading)}</h2>
    <p><strong>${escapeHtml(L.emailName)}:</strong> ${escapeHtml(name)}</p>
    <p><strong>${escapeHtml(L.emailEmail)}:</strong> ${escapeHtml(email)}</p>
    <p><strong>${escapeHtml(L.emailStatus)}:</strong> ${escapeHtml(statusLabel)}</p>
  `;

  const autoReplyHtml =
    uiLocale === "en"
      ? `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <img src="https://www.qc-tech.co.uk/logo-full.svg" alt="QC Tech" style="height:48px;margin-bottom:24px" />
  <p>${escapeHtml(L.autoReplyBody.replace("{name}", name))}</p>
</div>
`
      : `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <img src="https://www.qc-tech.co.uk/logo-full.svg" alt="QC Tech" style="height:48px;margin-bottom:24px" />
  <p>${escapeHtml(L.autoReplyBody.replace("{name}", name))}</p>
</div>
`;

  try {
    await transporter.sendMail({
      from: `"QC Tech Copilot" <${from}>`,
      to,
      replyTo: email,
      subject: L.emailSubject.replace("{name}", name),
      html: internalHtml,
    });
  } catch (err) {
    console.error("[copilot-lead] SMTP internal:", err);
    return NextResponse.json({ error: errors.sendFailed }, { status: 502 });
  }

  try {
    await transporterNoReply.sendMail({
      from: `"Quantum Code Technologies Ltd" <${noReplyFrom}>`,
      to: email,
      subject: L.autoReplySubject,
      html: autoReplyHtml,
    });
  } catch (err) {
    console.error("[copilot-lead] SMTP autoreply:", err);
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
