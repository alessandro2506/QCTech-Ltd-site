import { NextResponse } from "next/server";
import {
  getAssistantKb,
  isFaqId,
  matchFaqByKeywords,
  type FaqId,
  type KbEntry,
} from "@/lib/assistant-kb";

export const runtime = "nodejs";

const MAX_CHARS = 300;
const MAX_PER_MINUTE = 10;
const DEFAULT_DAILY_MAX = 40;
const LLM_TIMEOUT_MS = 3000;
const LLM_MAX_TOKENS = 30;

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

function allowDaily(ip: string, max: number): boolean {
  const day = new Date().toISOString().slice(0, 10);
  const prev = dailyByIp.get(ip);
  if (!prev || prev.day !== day) {
    dailyByIp.set(ip, { day, count: 1 });
    return true;
  }
  if (prev.count >= max) return false;
  prev.count += 1;
  return true;
}

function faqPayload(entry: KbEntry) {
  return {
    type: "faq" as const,
    id: entry.id,
    question: entry.question,
    answer: entry.answer,
  };
}

async function matchViaLlm(
  locale: string,
  message: string,
): Promise<FaqId | null> {
  const base = process.env.ASSISTANT_BASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.ASSISTANT_API_KEY?.trim();
  const model = process.env.ASSISTANT_MODEL?.trim();
  if (!base || !key || !model) return null;

  const ids = getAssistantKb(locale).map((item) => item.id);
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
        temperature: 0,
        max_tokens: LLM_MAX_TOKENS,
        messages: [
          {
            role: "system",
            content: `Return only JSON {"id":"<id>"}. Allowed ids: ${ids.join(",")}. If none apply, {"id":"none"}.`,
          },
          { role: "user", content: message },
        ],
      }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content ?? "";
    const found = raw.match(/"id"\s*:\s*"([^"]+)"/);
    const id = found?.[1];
    if (!id || id === "none" || !isFaqId(id)) return null;
    return id;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  const dailyMax = Number(process.env.ASSISTANT_DAILY_MAX) || DEFAULT_DAILY_MAX;
  const ip = clientIp(request);

  if (!allowRate(ip) || !allowDaily(ip, dailyMax)) {
    return NextResponse.json({ type: "fallback" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ type: "fallback" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ type: "fallback" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const locale = o.locale === "en" ? "en" : "it";
  const message = typeof o.message === "string" ? o.message.trim() : "";

  if (message.length > MAX_CHARS) {
    return NextResponse.json({ type: "too_long" }, { status: 400 });
  }
  if (message.length === 0) {
    return NextResponse.json({ type: "fallback" }, { status: 400 });
  }

  const kb = getAssistantKb(locale);
  const llmId = await matchViaLlm(locale, message);
  if (llmId) {
    const hit = kb.find((item) => item.id === llmId);
    if (hit) return NextResponse.json(faqPayload(hit));
  }

  const keywordHit = matchFaqByKeywords(locale, message);
  if (keywordHit) return NextResponse.json(faqPayload(keywordHit));

  return NextResponse.json({ type: "fallback" });
}
