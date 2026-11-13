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

function parseJsonSlice(slice: string): unknown | null {
  try {
    return JSON.parse(slice) as unknown;
  } catch {
    try {
      return JSON.parse(slice.replace(/,\s*([}\]])/g, "$1")) as unknown;
    } catch {
      return null;
    }
  }
}

export function extractJsonObject(text: string): unknown | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = (fenced?.[1] ?? trimmed).trim();
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return parseJsonSlice(body.slice(start, end + 1));
}

export type DraftModelParse = {
  draft: AssistantDraft | null;
  reason: "ok" | "empty" | "parse" | "pii";
};

function usefulProse(text: string): string {
  return sanitizeDraftMessage(
    text
      .replace(/```(?:json)?/gi, " ")
      .replace(/```/g, " ")
      .replace(/^\s*\{[\s\S]*\}\s*$/m, " ")
      .trim(),
  );
}

export function draftFromModelOutput(
  raw: string,
  history: ChatTurn[],
): DraftModelParse {
  const text = raw.trim();
  if (text.length === 0) return { draft: null, reason: "empty" };

  const obj = extractJsonObject(text);
  if (obj && typeof obj === "object") {
    const rec = obj as Record<string, unknown>;
    const original =
      typeof rec.message === "string" ? rec.message.trim() : "";
    const parsed = parseDraftPayload(obj);
    if (parsed) return { draft: parsed, reason: "ok" };
    if (original.length > 0 && sanitizeDraftMessage(original).length === 0) {
      return { draft: null, reason: "pii" };
    }
  }

  const prose = usefulProse(text);
  if (prose.length >= 24) {
    const firstUser =
      history.find((turn) => turn.role === "user")?.content ?? prose;
    return {
      draft: { topic: inferTopic(firstUser), message: prose },
      reason: "ok",
    };
  }
  return { draft: null, reason: "parse" };
}

export function inferTopic(text: string): ContactTopic {
  const t = text.toLowerCase();
  if (
    /ristorant|hotel|b&b|bed and breakfast|prenotaz|booking/.test(t) &&
    !/e-?commerce|negozio online|shop online/.test(t)
  ) {
    return "web";
  }
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
  if (/sito|website|restyle|vetrina/.test(t)) return "web";
  return "other";
}

function cleanSentence(text: string): string {
  let value = stripPersonalData(text)
    .replace(/\s+/g, " ")
    .replace(/\?+\.+/g, "?")
    .replace(/\.+\?+/g, "?")
    .replace(/\.{2,}/g, ".")
    .replace(/\s+([?!.,])/g, "$1")
    .trim()
    .slice(0, DRAFT_TURN_MAX);
  if (!value) return "";
  if (!/[.!?]$/.test(value)) value += ".";
  return value;
}

function conversationHasPrice(history: ChatTurn[]): boolean {
  return history.some((turn) =>
    /(?:da|from)\s+[£€]?\s*[\d.,]+|[£€]\s*[\d.,]+/.test(turn.content),
  );
}

function serviceWithoutPrice(topic: ContactTopic, locale: "it" | "en"): string {
  switch (topic) {
    case "mobile":
      return locale === "it" ? "un'app mobile" : "a mobile app";
    case "ecommerce":
      return locale === "it" ? "un e-commerce" : "an online shop";
    case "presence":
      return locale === "it" ? "la presenza digitale" : "digital presence";
    case "web":
      return locale === "it" ? "un sito vetrina" : "a brochure website";
    case "other":
      return locale === "it" ? "un servizio QC Tech" : "a QC Tech service";
    default: {
      const _exhaustive: never = topic;
      return _exhaustive;
    }
  }
}

function serviceWithPrice(topic: ContactTopic, locale: "it" | "en"): string {
  switch (topic) {
    case "mobile":
      return locale === "it" ? "un'app mobile da 7.700 €" : "a mobile app from £6,500";
    case "ecommerce":
      return locale === "it" ? "un e-commerce da 3.800 €" : "an online shop from £3,200";
    case "presence":
      return locale === "it"
        ? "la presenza digitale da 90 € al mese"
        : "digital presence from £75 per month";
    case "web":
      return locale === "it"
        ? "un sito vetrina da 1.100 €"
        : "a brochure website from £900";
    case "other":
      return locale === "it" ? "un servizio QC Tech" : "a QC Tech service";
    default: {
      const _exhaustive: never = topic;
      return _exhaustive;
    }
  }
}

export function buildFallbackDraft(
  locale: "it" | "en",
  history: ChatTurn[],
): AssistantDraft {
  const firstUser = history.find((turn) => turn.role === "user")?.content ?? "";
  const topic = inferTopic(firstUser);
  const userTurns = history
    .filter((turn) => turn.role === "user")
    .slice(-3)
    .map((turn) => cleanSentence(turn.content))
    .filter(Boolean);
  const priced = conversationHasPrice(history);
  const service = priced
    ? serviceWithPrice(topic, locale)
    : serviceWithoutPrice(topic, locale);
  const sentences =
    locale === "it"
      ? [
          ...userTurns,
          `Mi interessa ${service}.`,
          "Vorrei un preventivo senza impegno.",
        ]
      : [
          ...userTurns,
          `I am interested in ${service}.`,
          "Please send a no-obligation quote.",
        ];
  const message = sentences.join(" ");
  return {
    topic,
    message: sanitizeDraftMessage(message) || serviceWithoutPrice("other", locale),
  };
}

export function buildDraftSystemPrompt(locale: "it" | "en"): string {
  const language = locale === "it" ? "Italian" : "English";
  return `You draft a contact-form message for Quantum Code Technologies Ltd. Return JSON with keys topic and message. A markdown json fence is allowed. Extra prose around the JSON is ignored.
topic must be one of: ${CONTACT_TOPICS.join(", ")}. Restaurant/hotel bookings with a website = topic web, never ecommerce unless they sell products online.
message: first person, ${language}, max ${DRAFT_MESSAGE_MAX} characters, plain text, one idea per sentence, clean punctuation (never "?.").
Use only the service and "from"/"da" price already stated in the conversation. If no price was stated, omit the price. Never invent a different service.
Never include name, email, phone, address, URLs or IBAN.`;
}
