import {
  CONTACT_TOPICS,
  isContactTopic,
  type ContactTopic,
} from "@/lib/contact";
import type { ChatTurn } from "@/lib/assistant-prompt";

export const DRAFT_MESSAGE_MAX = 1200;
export const DRAFT_TURN_MAX = 200;

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi;
const IBAN_RE = /\b(?:IBAN\s*)?[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/gi;
const PHONE_RE =
  /(?:\+|00)\s*(?:39|44)(?:[\s./()-]*\d){6,}|\b0\d{2,4}[\s./-]\d{3,}(?:[\s./-]\d{2,})?|\b07\d{8,9}\b|\b3\d{2}[\s./-]\d{6,7}\b/g;

export type AssistantDraft = {
  topic: ContactTopic;
  message: string;
};

export function stripPersonalData(text: string): string {
  return text
    .replace(EMAIL_RE, " ")
    .replace(URL_RE, " ")
    .replace(IBAN_RE, " ")
    .replace(PHONE_RE, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

export function parseDraftTopic(value: unknown): ContactTopic {
  if (typeof value === "string" && isContactTopic(value)) return value;
  return "other";
}

export function sanitizeDraftMessage(value: unknown): string {
  if (typeof value !== "string") return "";
  return stripPersonalData(value).slice(0, DRAFT_MESSAGE_MAX);
}

export function parseDraftPayload(raw: unknown): AssistantDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const message = sanitizeDraftMessage(rec.message);
  if (!message) return null;
  return { topic: parseDraftTopic(rec.topic), message };
}

export function extractJsonObject(text: string): unknown | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as unknown;
  } catch {
    return null;
  }
}

function inferTopic(text: string): ContactTopic {
  const t = text.toLowerCase();
  if (/app\b|ios|android|iphone|flutter/.test(t)) return "mobile";
  if (/e-?commerce|negozio online|shop online|checkout|catalogo/.test(t)) {
    return "ecommerce";
  }
  if (
    /\bseo\b|google|visibilit|visibility|presenza digitale|digital presence/.test(
      t,
    )
  ) {
    return "presence";
  }
  if (/sito|website|restyle|vetrina|prenotaz|booking/.test(t)) return "web";
  return "other";
}

function serviceLine(topic: ContactTopic, locale: "it" | "en"): string {
  if (locale === "it") {
    switch (topic) {
      case "mobile":
        return "un'app mobile da 7.700 €";
      case "ecommerce":
        return "un e-commerce da 3.800 €";
      case "presence":
        return "la presenza digitale da 90 € al mese";
      case "web":
        return "un sito web da 1.100 €";
      default:
        return "un servizio QC Tech da valutare insieme";
    }
  }
  switch (topic) {
    case "mobile":
      return "a mobile app from £6,500";
    case "ecommerce":
      return "an online shop from £3,200";
    case "presence":
      return "digital presence from £75 per month";
    case "web":
      return "a website from £900";
    default:
      return "a QC Tech service to scope together";
  }
}

export function buildFallbackDraft(
  locale: "it" | "en",
  history: ChatTurn[],
): AssistantDraft {
  const userTurns = history
    .filter((turn) => turn.role === "user")
    .slice(-3)
    .map((turn) => stripPersonalData(turn.content).slice(0, DRAFT_TURN_MAX))
    .filter(Boolean);
  const joined = userTurns.join(" ");
  const topic = inferTopic(joined);
  const service = serviceLine(topic, locale);
  const snapshot = userTurns.join(" ");
  const message =
    locale === "it"
      ? [
          snapshot
            ? `Vi scrivo dopo una chiacchierata con Q.U.A.N.T.I.S sul mio progetto: ${snapshot}.`
            : "Vi scrivo per una richiesta nata dalla chat con Q.U.A.N.T.I.S.",
          `Mi interessa ${service}.`,
          "Vorrei un preventivo senza impegno, con tempi e passi successivi.",
        ].join(" ")
      : [
          snapshot
            ? `I am writing after speaking with Q.U.A.N.T.I.S about my project: ${snapshot}.`
            : "I am writing with a request started in the Q.U.A.N.T.I.S chat.",
          `I am interested in ${service}.`,
          "Please send a no-obligation quote with timings and next steps.",
        ].join(" ");
  return {
    topic,
    message: sanitizeDraftMessage(message) || serviceLine("other", locale),
  };
}

export function buildDraftSystemPrompt(locale: "it" | "en"): string {
  const language = locale === "it" ? "Italian" : "English";
  return `You draft a contact-form message for Quantum Code Technologies Ltd. Return ONLY JSON with keys topic and message. No markdown, no extra keys.
topic must be one of: ${CONTACT_TOPICS.join(", ")}.
message: first person of the visitor, 3-6 short sentences in ${language}, max ${DRAFT_MESSAGE_MAX} characters, plain text.
Include: activity/sector, goal, current situation if known, the fitting QC Tech service with a "from"/"da" price from the knowledge already in the conversation, indicative timing if said, a closing ask for a quote.
Never invent prices, timelines, discounts or clients. Never include name, email, phone, address, URLs or IBAN. Currency: euro if Italian, pounds if English.`;
}
