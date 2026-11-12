import { NextResponse } from "next/server";
import { matchFaqByKeywords, type KbEntry } from "@/lib/assistant-kb";
import {
  buildAssistantSystemPrompt,
  sanitizeHistory,
} from "@/lib/assistant-prompt";

export const runtime = "nodejs";

const MAX_CHARS = 300;
const MAX_PER_MINUTE = 10;
const DEFAULT_DAILY_MAX = 45;
const LLM_TIMEOUT_MS = 9000;
const LLM_MAX_TOKENS = 320;
const LLM_TEMPERATURE = 0.3;
const ANSWER_MAX_CHARS = 900;

type MinuteBucket = number[];
const hitsByIp = new Map<string, MinuteBucket>();
const dailyByIp = new Map<string, { day: string; count: number }>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function allowRate(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const prev = hitsByIp.get(ip) ?? [];
  const recent = prev.filter((t) => t > windowStart);
  if (recent.length >= MAX_PER_MINUTE) {
    hitsByIp.set(ip, recent);
    return false;
  }
  recent.push(now);
  hitsByIp.set(ip, recent);
  return true;
}

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

function dailyCount(ip: string): number {
  const prev = dailyByIp.get(ip);
  if (!prev || prev.day !== utcDay()) return 0;
  return prev.count;
}

function consumeDaily(ip: string): void {
  const day = utcDay();
  const prev = dailyByIp.get(ip);
  if (!prev || prev.day !== day) {
    dailyByIp.set(ip, { day, count: 1 });
    return;
  }
  prev.count += 1;
}

function faqPayload(entry: KbEntry) {
  return {
    type: "faq" as const,
    id: entry.id,
    question: entry.question,
    answer: entry.answer,
  };
}

function fallbackPayload() {
  return { type: "fallback" as const, answer: "" };
}

function keywordOrFallback(locale: string, message: string) {
  const hit = matchFaqByKeywords(locale, message);
  if (hit) return NextResponse.json(faqPayload(hit));
  return NextResponse.json(fallbackPayload());
}

function toPlainText(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, ANSWER_MAX_CHARS);
}

function parseModels(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

async function generateAiAnswer(input: {
  pageLocale: "it" | "en";
  message: string;
  history: unknown;
  ip: string;
  dailyMax: number;
}): Promise<string | null> {
  const base = process.env.ASSISTANT_BASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.ASSISTANT_API_KEY?.trim();
  const models = parseModels(process.env.ASSISTANT_MODEL ?? "");
  if (!base || !key || models.length === 0) return null;
  if (dailyCount(input.ip) >= input.dailyMax) return null;

  const system = buildAssistantSystemPrompt({
    pageLocale: input.pageLocale,
    userMessage: input.message,
  });
  const conversation = sanitizeHistory(input.history, input.message);

  for (const model of models) {
    if (dailyCount(input.ip) >= input.dailyMax) return null;
    consumeDaily(input.ip);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
    try {
      const response = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: LLM_TEMPERATURE,
          max_tokens: LLM_MAX_TOKENS,
          messages: [{ role: "system", content: system }, ...conversation],
        }),
        signal: controller.signal,
      });
      if (response.status === 429 || response.status >= 500) continue;
      if (!response.ok) continue;
      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = toPlainText(data.choices?.[0]?.message?.content ?? "");
      if (text.length > 0) return text;
    } catch {
      continue;
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

export async function POST(request: Request) {
  const dailyMax = Number(process.env.ASSISTANT_DAILY_MAX) || DEFAULT_DAILY_MAX;
  const ip = clientIp(request);

  if (!allowRate(ip)) {
    return NextResponse.json(fallbackPayload(), { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(fallbackPayload(), { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(fallbackPayload(), { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const locale = o.locale === "en" ? "en" : "it";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (message.length > MAX_CHARS) {
    return NextResponse.json({ type: "too_long", answer: "" }, { status: 400 });
  }
  if (message.length === 0) {
    return NextResponse.json(fallbackPayload(), { status: 400 });
  }

  const generated = await generateAiAnswer({
    pageLocale: locale,
    message,
    history: o.history,
    ip,
    dailyMax,
  });
  if (generated) {
    return NextResponse.json({ type: "ai", answer: generated });
  }

  return keywordOrFallback(locale, message);
}
