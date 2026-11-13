import { matchFaqByKeywords, type KbEntry } from "@/lib/assistant-kb";
import { stripCallSuggestions } from "@/lib/assistant-phone";
import {
  ASSISTANT_LLM_BUDGET_MS,
  ASSISTANT_LLM_MAX_TOKENS,
  ASSISTANT_LLM_REASONING_MAX_TOKENS,
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

export type ReasoningSent =
  | { effort: "none" }
  | { effort: "low"; exclude: true };

export type AssistantTried = {
  model: string;
  status: number | "timeout" | "network" | "empty";
  reasoning: ReasoningSent;
  maxTokens: number;
  reasoningTokens: number | null;
  promptTokens: number | null;
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
  reasoningSent: ReasoningSent | null;
  reasoningTokens: number | null;
  promptTokens: number | null;
  userChars: number;
  lastUserContent: string;
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

function consumeDailySlot(ip: string): void {
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

export function parseAssistantModels(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function toPlainText(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, ANSWER_MAX_CHARS);
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
  const raw = stripThinkBlocks(
    typeof choice.message?.content === "string" ? choice.message.content : "",
  );
  return toPlainText(raw);
}

function isReasoningRequiredError(status: number, body: string): boolean {
  if (status !== 400) return false;
  return /reasoning/i.test(body);
}

async function callModel(input: {
  base: string;
  key: string;
  model: string;
  system: string;
  conversation: { role: "user" | "assistant"; content: string }[];
  timeoutMs: number;
  reasoning: ReasoningSent;
  maxTokens: number;
}): Promise<{
  tried: AssistantTried;
  text: string | null;
  usedModel: string | null;
  finishReason: string | null;
  contentLength: number;
  error: string | null;
  reasoningTokens: number | null;
  promptTokens: number | null;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs);
  const emptyTried = {
    model: input.model,
    reasoning: input.reasoning,
    maxTokens: input.maxTokens,
    reasoningTokens: null as number | null,
    promptTokens: null as number | null,
  };
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
        max_tokens: input.maxTokens,
        reasoning: input.reasoning,
        messages: [{ role: "system", content: input.system }, ...input.conversation],
      }),
      signal: controller.signal,
    });
    const raw = await response.text();
    if (!response.ok) {
      return {
        tried: { ...emptyTried, status: response.status },
        text: null,
        usedModel: null,
        finishReason: null,
        contentLength: 0,
        error: raw.slice(0, 300),
        reasoningTokens: null,
        promptTokens: null,
      };
    }
    let data: {
      model?: unknown;
      usage?: {
        prompt_tokens?: number;
        completion_tokens_details?: { reasoning_tokens?: number };
      };
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
    const reasoningTokens =
      typeof data.usage?.completion_tokens_details?.reasoning_tokens === "number"
        ? data.usage.completion_tokens_details.reasoning_tokens
        : null;
    const promptTokens =
      typeof data.usage?.prompt_tokens === "number"
        ? data.usage.prompt_tokens
        : null;
    const triedBase = {
      ...emptyTried,
      reasoningTokens,
      promptTokens,
    };
    if (text.length === 0) {
      return {
        tried: { ...triedBase, status: "empty" },
        text: null,
        usedModel,
        finishReason,
        contentLength: 0,
        error: null,
        reasoningTokens,
        promptTokens,
      };
    }
    return {
      tried: { ...triedBase, status: response.status },
      text,
      usedModel,
      finishReason,
      contentLength: text.length,
      error: null,
      reasoningTokens,
      promptTokens,
    };
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError");
    const message = error instanceof Error ? error.message : "error";
    return {
      tried: { ...emptyTried, status: timedOut ? "timeout" : "network" },
      text: null,
      usedModel: null,
      finishReason: null,
      contentLength: 0,
      error: message.slice(0, 300),
      reasoningTokens: null,
      promptTokens: null,
    };
  } finally {
    clearTimeout(timer);
  }
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
    reasoningSent: null as ReasoningSent | null,
    reasoningTokens: null as number | null,
    promptTokens: null as number | null,
    userChars: message.length,
    lastUserContent: message,
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
  const models = parseAssistantModels(process.env.ASSISTANT_MODEL ?? "");
  const consume = input.consumeDaily !== false;
  const ip = input.ip ?? "unknown";
  const dailyMax =
    input.dailyMax ?? (Number(process.env.ASSISTANT_DAILY_MAX) || DEFAULT_DAILY_MAX);
  const tried: AssistantTried[] = [];
  let usedModel: string | null = null;
  let finishReason: string | null = null;
  let contentLength = 0;
  let error: string | null = null;
  let reasoningSent: ReasoningSent | null = null;
  let reasoningTokens: number | null = null;
  let promptTokens: number | null = null;

  const canCallLlm = Boolean(base && key && models.length > 0);
  const underDaily = !consume || dailyCount(ip) < dailyMax;
  const conversation = sanitizeHistory(input.history, message);
  let lastUserContent = message;
  for (let i = conversation.length - 1; i >= 0; i -= 1) {
    const turn = conversation[i];
    if (turn?.role === "user") {
      lastUserContent = turn.content;
      break;
    }
  }
  const userChars = lastUserContent.length;

  if (canCallLlm && underDaily) {
    const system = buildAssistantSystemPrompt({
      pageLocale,
      userMessage: message,
    });
    const budgetEnd = Date.now() + ASSISTANT_LLM_BUDGET_MS;

    for (const model of models) {
      const remaining = budgetEnd - Date.now();
      if (remaining < 400) break;
      if (consume && dailyCount(ip) >= dailyMax) break;
      if (consume) consumeDailySlot(ip);

      const first = await callModel({
        base: base as string,
        key: key as string,
        model,
        system,
        conversation,
        timeoutMs: Math.min(ASSISTANT_LLM_TIMEOUT_MS, remaining),
        reasoning: { effort: "none" },
        maxTokens: ASSISTANT_LLM_MAX_TOKENS,
      });
      tried.push(first.tried);
      usedModel = first.usedModel;
      finishReason = first.finishReason;
      contentLength = first.contentLength;
      error = first.error;
      reasoningSent = first.tried.reasoning;
      reasoningTokens = first.reasoningTokens;
      promptTokens = first.promptTokens;
      if (first.text) {
        const cleaned = stripCallSuggestions(first.text);
        if (cleaned.length > 0) {
          return {
            type: "ai",
            answer: cleaned,
            tried,
            latencyMs: Date.now() - started,
            usedModel,
            finishReason,
            contentLength: cleaned.length,
            error,
            replyLocale,
            reasoningSent,
            reasoningTokens,
            promptTokens,
            userChars,
            lastUserContent,
          };
        }
        break;
      }

      const reasoningRetry =
        first.tried.status === 400 &&
        isReasoningRequiredError(400, first.error ?? "");
      if (reasoningRetry) {
        const left = budgetEnd - Date.now();
        if (left >= 400) {
          if (consume && dailyCount(ip) < dailyMax) consumeDailySlot(ip);
          const second = await callModel({
            base: base as string,
            key: key as string,
            model,
            system,
            conversation,
            timeoutMs: Math.min(ASSISTANT_LLM_TIMEOUT_MS, left),
            reasoning: { effort: "low", exclude: true },
            maxTokens: ASSISTANT_LLM_REASONING_MAX_TOKENS,
          });
          tried.push(second.tried);
          usedModel = second.usedModel;
          finishReason = second.finishReason;
          contentLength = second.contentLength;
          error = second.error;
          reasoningSent = second.tried.reasoning;
          reasoningTokens = second.reasoningTokens;
          promptTokens = second.promptTokens;
          if (second.text) {
            const cleaned = stripCallSuggestions(second.text);
            if (cleaned.length > 0) {
              return {
                type: "ai",
                answer: cleaned,
                tried,
                latencyMs: Date.now() - started,
                usedModel,
                finishReason,
                contentLength: cleaned.length,
                error,
                replyLocale,
                reasoningSent,
                reasoningTokens,
                promptTokens,
                userChars,
                lastUserContent,
              };
            }
            break;
          }
        }
      }
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
    reasoningSent,
    reasoningTokens,
    promptTokens,
    userChars,
    lastUserContent,
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
