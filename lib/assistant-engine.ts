import { matchFaqByKeywords, type KbEntry } from "@/lib/assistant-kb";
import {
  ASSISTANT_LLM_BUDGET_MS,
  ASSISTANT_LLM_MAX_ATTEMPTS,
  ASSISTANT_LLM_MAX_TOKENS,
  ASSISTANT_LLM_TEMPERATURE,
  ASSISTANT_LLM_TIMEOUT_MS,
  buildAssistantSystemPrompt,
  detectReplyLocale,
  sanitizeHistory,
  stripThinkBlocks,
} from "@/lib/assistant-prompt";

export const MAX_CHARS = 300;
const DEFAULT_DAILY_MAX = 45;
const ANSWER_MAX_CHARS = 900;

type MinuteBucket = number[];
const hitsByIp = new Map<string, MinuteBucket>();
const dailyByIp = new Map<string, { day: string; count: number }>();

export type AssistantTried = {
  model: string;
  status: number | "timeout" | "network" | "empty";
};

export type AssistantResult = {
  type: "ai" | "faq" | "fallback" | "too_long";
  answer: string;
  question?: string;
  id?: string;
  tried: AssistantTried[];
  latencyMs: number;
  usedModel: string | null;
  finishReason: string | null;
  contentLength: number;
  error: string | null;
  replyLocale: "it" | "en";
};

export type RunAssistantInput = {
  message: string;
  pageLocale: "it" | "en";
  history?: unknown;
  ip?: string;
  consumeDaily?: boolean;
  dailyMax?: number;
};

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

export function allowRate(ip: string, maxPerMinute = 10): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const prev = hitsByIp.get(ip) ?? [];
  const recent = prev.filter((t) => t > windowStart);
  if (recent.length >= maxPerMinute) {
    hitsByIp.set(ip, recent);
    return false;
  }
  recent.push(now);
  hitsByIp.set(ip, recent);
  return true;
}

function toPlainText(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, ANSWER_MAX_CHARS);
}

function assistantModelId(): string {
  return (process.env.ASSISTANT_MODEL ?? "").trim();
}

function faqPayload(entry: KbEntry): Pick<AssistantResult, "type" | "answer" | "question" | "id"> {
  return {
    type: "faq",
    id: entry.id,
    question: entry.question,
    answer: entry.answer,
  };
}

function keywordOrFallback(locale: string, message: string) {
  const hit = matchFaqByKeywords(locale, message);
  if (hit) return faqPayload(hit);
  return { type: "fallback" as const, answer: "" };
}

function contentFromChoice(choice: {
  message?: {
    content?: string;
    reasoning?: unknown;
    reasoning_content?: unknown;
  };
}): string {
  const message = choice.message;
  const raw = stripThinkBlocks(
    typeof message?.content === "string" ? message.content : "",
  );
  return toPlainText(raw);
}

async function callModel(input: {
  base: string;
  key: string;
  model: string;
  system: string;
  conversation: { role: "user" | "assistant"; content: string }[];
  timeoutMs: number;
}): Promise<{
  tried: AssistantTried;
  text: string | null;
  usedModel: string | null;
  finishReason: string | null;
  contentLength: number;
  error: string | null;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs);
  try {
    const response = await fetch(`${input.base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: input.model,
        temperature: ASSISTANT_LLM_TEMPERATURE,
        max_tokens: ASSISTANT_LLM_MAX_TOKENS,
        messages: [{ role: "system", content: input.system }, ...input.conversation],
      }),
      signal: controller.signal,
    });
    const raw = await response.text();
    if (response.status === 429 || response.status >= 500 || !response.ok) {
      return {
        tried: { model: input.model, status: response.status },
        text: null,
        usedModel: null,
        finishReason: null,
        contentLength: 0,
        error: raw.slice(0, 300),
      };
    }
    let data: {
      model?: unknown;
      choices?: {
        finish_reason?: string;
        message?: {
          content?: string;
          reasoning?: unknown;
          reasoning_content?: unknown;
        };
      }[];
    } = {};
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      data = {};
    }
    const choice = data.choices?.[0];
    const text = choice ? contentFromChoice(choice) : "";
    const usedModel = typeof data.model === "string" ? data.model : null;
    const finishReason = choice?.finish_reason ?? null;
    if (text.length === 0) {
      return {
        tried: { model: input.model, status: "empty" },
        text: null,
        usedModel,
        finishReason,
        contentLength: 0,
        error: null,
      };
    }
    return {
      tried: { model: input.model, status: response.status },
      text,
      usedModel,
      finishReason,
      contentLength: text.length,
      error: null,
    };
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError");
    const message = error instanceof Error ? error.message : "error";
    return {
      tried: { model: input.model, status: timedOut ? "timeout" : "network" },
      text: null,
      usedModel: null,
      finishReason: null,
      contentLength: 0,
      error: message.slice(0, 300),
    };
  } finally {
    clearTimeout(timer);
  }
}

function shouldRetry(status: AssistantTried["status"]): boolean {
  return (
    status === "empty" ||
    status === "timeout" ||
    status === 429 ||
    (typeof status === "number" && status >= 500)
  );
}

export async function runAssistant(
  input: RunAssistantInput,
): Promise<AssistantResult> {
  const started = Date.now();
  const message = input.message.trim();
  const pageLocale = input.pageLocale;
  const replyLocale = detectReplyLocale(message, pageLocale);
  const emptyMeta = {
    tried: [] as AssistantTried[],
    latencyMs: 0,
    usedModel: null as string | null,
    finishReason: null as string | null,
    contentLength: 0,
    error: null as string | null,
    replyLocale,
  };

  if (message.length > MAX_CHARS) {
    return {
      type: "too_long",
      answer: "",
      ...emptyMeta,
      latencyMs: Date.now() - started,
    };
  }
  if (message.length === 0) {
    return {
      type: "fallback",
      answer: "",
      ...emptyMeta,
      latencyMs: Date.now() - started,
    };
  }

  const base = process.env.ASSISTANT_BASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.ASSISTANT_API_KEY?.trim();
  const model = assistantModelId();
  const consume = input.consumeDaily !== false;
  const ip = input.ip ?? "unknown";
  const dailyMax = input.dailyMax ?? (Number(process.env.ASSISTANT_DAILY_MAX) || DEFAULT_DAILY_MAX);
  const tried: AssistantTried[] = [];
  let usedModel: string | null = null;
  let finishReason: string | null = null;
  let contentLength = 0;
  let error: string | null = null;

  const canCallLlm = Boolean(base && key && model);
  const underDaily = !consume || dailyCount(ip) < dailyMax;

  if (canCallLlm && underDaily) {
    const system = buildAssistantSystemPrompt({
      pageLocale,
      userMessage: message,
    });
    const conversation = sanitizeHistory(input.history, message);
    const budgetEnd = Date.now() + ASSISTANT_LLM_BUDGET_MS;

    for (let attempt = 0; attempt < ASSISTANT_LLM_MAX_ATTEMPTS; attempt += 1) {
      const remaining = budgetEnd - Date.now();
      if (remaining < 400) break;
      if (consume && dailyCount(ip) >= dailyMax) break;
      if (consume) consumeDaily(ip);
      const timeoutMs = Math.min(ASSISTANT_LLM_TIMEOUT_MS, remaining);
      const result = await callModel({
        base: base as string,
        key: key as string,
        model,
        system,
        conversation,
        timeoutMs,
      });
      tried.push(result.tried);
      usedModel = result.usedModel;
      finishReason = result.finishReason;
      contentLength = result.contentLength;
      error = result.error;
      if (result.text) {
        return {
          type: "ai",
          answer: result.text,
          tried,
          latencyMs: Date.now() - started,
          usedModel,
          finishReason,
          contentLength,
          error,
          replyLocale,
        };
      }
      if (!shouldRetry(result.tried.status)) break;
    }
  }

  const fallback = keywordOrFallback(replyLocale, message);
  return {
    ...fallback,
    tried,
    latencyMs: Date.now() - started,
    usedModel,
    finishReason,
    contentLength,
    error,
    replyLocale,
  };
}

export function isPreviewEnv(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

export function withAssistantDebug<T extends Record<string, unknown>>(
  body: T,
  tried: AssistantTried[],
): T | (T & { debug: { tried: AssistantTried[] } }) {
  if (!isPreviewEnv()) return body;
  return { ...body, debug: { tried } };
}
