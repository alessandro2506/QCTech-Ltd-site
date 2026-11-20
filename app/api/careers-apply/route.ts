import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { apiErrors } from "@/lib/copilot-labels";
import { sanitizeText } from "@/lib/contact";
import { CAREER_COUNTRIES, findJobById } from "@/lib/careers-data";
import itMessages from "@/messages/it.json";
import enMessages from "@/messages/en.json";

/**
 * Candidature sezione Careers / Lavora con noi.
 * Nessun salvataggio: i dati vanno solo via email a CONTACT_TO_EMAIL.
 * Nessun log dei dati personali (solo l'errore SMTP).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINK_RE = /^https:\/\/\S+$/i;
const LANG_VALUES = ["it", "en", "both"] as const;
const EXP_VALUES = ["none", "lt3", "gte3"] as const;

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > RATE_MAX;
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

function optional(value: unknown, maxLen: number): string | null | false {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return false;
  const t = value.trim();
  if (!t) return null;
  if (t.length > maxLen) return false;
  return t;
}

function oneOf<T extends string>(
  list: readonly T[],
  value: string | null,
): value is T {
  return !!value && (list as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  const fallbackLocale = getRequestLocale(request);
  const fallbackErrors = apiErrors(fallbackLocale);

  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.SMTP_USER?.trim();
  const noReplyFrom = process.env.SMTP_NOREPLY_USER?.trim();
  const noReplyEnabled = !!noReplyFrom && !!process.env.SMTP_NOREPLY_PASS;

  if (!to || !from || !process.env.SMTP_PASS) {
    return NextResponse.json({ error: fallbackErrors.config }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: fallbackErrors.json }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: fallbackErrors.body }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const locale = sanitizeText(o.locale, 5) === "en" ? "en" : "it";
  const errors = apiErrors(locale);
  const M = (locale === "en" ? enMessages : itMessages).careers;

  // Honeypot: se compilato, risposta di successo senza inviare nulla.
  if (typeof o.website === "string" && o.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: M.api.rateLimited }, { status: 429 });
  }

  const job = findJobById(sanitizeText(o.jobId, 64) ?? "");
  const name = sanitizeText(o.name, 200);
  const email = sanitizeText(o.email, 254);
  const country = sanitizeText(o.country, 4);
  const languages = sanitizeText(o.languages, 8);
  const experience = sanitizeText(o.experience, 8);
  const network = sanitizeText(o.network, 1000);
  const phone = optional(o.phone, 40);
  const city = optional(o.city, 100);
  const link = optional(o.link, 300);

  if (
    !job ||
    !name ||
    !email ||
    !network ||
    !oneOf(CAREER_COUNTRIES, country) ||
    !oneOf(LANG_VALUES, languages) ||
    !oneOf(EXP_VALUES, experience) ||
    phone === false ||
    city === false ||
    link === false
  ) {
    return NextResponse.json({ error: errors.fields }, { status: 400 });
  }
  if (o.consent !== true) {
    return NextResponse.json({ error: errors.fields }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: errors.emailInvalid }, { status: 400 });
  }
  if (link && !LINK_RE.test(link)) {
    return NextResponse.json({ error: M.form.errorLink }, { status: 400 });
  }

  // Email interna sempre in italiano, con il titolo della posizione IT.
  const I = itMessages.careers;
  const jobTitleInternal = job.content.it.title;
  const jobTitleUser = job.content[locale].title;
  const rows: [string, string][] = [
    [I.api.emailJob, jobTitleInternal],
    [I.api.emailName, name],
    [I.api.emailEmail, email],
    [I.api.emailPhone, phone || "—"],
    [I.api.emailCountry, I.values.country[country]],
    [I.api.emailCity, city || "—"],
    [I.api.emailLanguages, I.form.languagesOptions[languages]],
    [I.api.emailExperience, I.form.experienceOptions[experience]],
    [I.api.emailNetwork, network],
    [I.api.emailLink, link || "—"],
    [I.api.emailWhen, new Date().toISOString()],
    [I.api.emailLocale, locale.toUpperCase()],
  ];
  const internalHtml = `
    <h2>${escapeHtml(I.api.emailHeading)}</h2>
    ${rows
      .map(
        ([k, v]) =>
          `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v).replace(/\n/g, "<br />")}</p>`,
      )
      .join("\n")}
  `;

  const autoReplyHtml = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <img src="https://www.qc-tech.co.uk/logo-full.svg" alt="QC Tech" style="height:48px;margin-bottom:24px" />
  <p>${escapeHtml(M.api.autoReplyBody.replace("{name}", name).replace("{job}", jobTitleUser))}</p>
</div>
`;

  try {
    await transporter.sendMail({
      from: `"QC Tech Careers" <${from}>`,
      to,
      replyTo: email,
      subject: I.api.emailSubject
        .replace("{job}", jobTitleInternal)
        .replace("{name}", name),
      html: internalHtml,
    });
  } catch (err) {
    console.error("[careers-apply] SMTP internal:", err);
    return NextResponse.json({ error: errors.sendFailed }, { status: 502 });
  }

  if (noReplyEnabled) {
    try {
      await transporterNoReply.sendMail({
        from: `"Quantum Code Technologies Ltd" <${noReplyFrom}>`,
        to: email,
        subject: M.api.autoReplySubject,
        html: autoReplyHtml,
      });
    } catch (err) {
      console.error("[careers-apply] SMTP autoreply:", err);
    }
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
