import { NextResponse } from "next/server";
import { matchFaqByKeywords, type KbEntry } from "@/lib/assistant-kb";
import {
  ASSISTANT_LLM_MAX_TOKENS,
  ASSISTANT_LLM_TEMPERATURE,
  ASSISTANT_LLM_TIMEOUT_MS,
  buildAssistantSystemPrompt,
  sanitizeHistory,
  stripThinkBlocks,
} from "@/lib/assistant-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_CHARS = 300;
const MAX_PER_MINUTE = 10;
const DEFAULT_DAILY_MAX = 45;
const ANSWER_MAX_CHARS = 900;

type MinuteBucket = number[];
const hitsByIp = new Map<string, MinuteBucket>();
const dailyByIp = new Map<string, { day: string; count: number }>();

export type AssistantTried = {
  model: string;
  status: number | "timeout" | "network" | "empty";
};

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
  if (hit) return faqPayload(hit);
  return fallbackPayload();
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

function isPreview(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

function withDebug<T extends Record<string, unknown>>(
  body: T,
  tried: AssistantTried[],
): T | (T & { debug: { tried: AssistantTried[] } }) {
  if (!isPreview()) return body;
  return { ...body, debug: { tried } };
}

async function generateAiAnswer(input: {
  pageLocale: "it" | "en";
  message: string;
  history: unknown;
  ip: string;
  dailyMax: number;
}): Promise<{ text: string | null; tried: AssistantTried[] }> {
  const tried: AssistantTried[] = [];
  const base = process.env.ASSISTANT_BASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.ASSISTANT_API_KEY?.trim();
  const models = parseModels(process.env.ASSISTANT_MODEL ?? "");
  if (!base || !key || models.length === 0) return { text: null, tried };
  if (dailyCount(input.ip) >= input.dailyMax) return { text: null, tried };

  const system = buildAssistantSystemPrompt({
    pageLocale: input.pageLocale,
    userMessage: input.message,
  });
  const conversation = sanitizeHistory(input.history, input.message);

  for (const model of models) {
    if (dailyCount(input.ip) >= input.dailyMax) return { text: null, tried };
    consumeDaily(input.ip);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ASSISTANT_LLM_TIMEOUT_MS);
    try {
      const response = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: ASSISTANT_LLM_TEMPERATURE,
          max_tokens: ASSISTANT_LLM_MAX_TOKENS,
          messages: [{ role: "system", content: system }, ...conversation],
        }),
        signal: controller.signal,
      });
      if (response.status === 429 || response.status >= 500) {
        tried.push({ model, status: response.status });
        continue;
      }
      if (!response.ok) {
        tried.push({ model, status: response.status });
        continue;
      }
      const data = (await response.json()) as {
        choices?: {
          finish_reason?: string;
          message?: { content?: string };
        }[];
      };
      const choice = data.choices?.[0];
      const raw = stripThinkBlocks(choice?.message?.content ?? "");
      const text = toPlainText(raw);
      if (text.length === 0) {
        tried.push({ model, status: "empty" });
        continue;
      }
      tried.push({ model, status: response.status });
      return { text, tried };
    } catch (error) {
      const timedOut =
        error instanceof Error &&
        (error.name === "AbortError" || error.name === "TimeoutError");
      tried.push({ model, status: timedOut ? "timeout" : "network" });
      continue;
    } finally {
      clearTimeout(timer);
    }
  }
  return { text: null, tried };
}

export async function POST(request: Request) {
  const dailyMax = Number(process.env.ASSISTANT_DAILY_MAX) || DEFAULT_DAILY_MAX;
  const ip = clientIp(request);

  if (!allowRate(ip)) {
    return NextResponse.json(withDebug(fallbackPayload(), []), { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(withDebug(fallbackPayload(), []), { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(withDebug(fallbackPayload(), []), { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const locale = o.locale === "en" ? "en" : "it";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (message.length > MAX_CHARS) {
    return NextResponse.json(
      withDebug({ type: "too_long", answer: "" }, []),
      { status: 400 },
    );
  }
  if (message.length === 0) {
    return NextResponse.json(withDebug(fallbackPayload(), []), { status: 400 });
  }

  const generated = await generateAiAnswer({
    pageLocale: locale,
    message,
    history: o.history,
    ip,
    dailyMax,
  });
  if (generated.text) {
    return NextResponse.json(
      withDebug({ type: "ai", answer: generated.text }, generated.tried),
    );
  }

  return NextResponse.json(
    withDebug(keywordOrFallback(locale, message), generated.tried),
  );
}
