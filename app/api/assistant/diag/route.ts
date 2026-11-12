import { NextResponse } from "next/server";
import { runAssistant } from "@/lib/assistant-engine";
import { getAssistantKb } from "@/lib/assistant-kb";
import {
  ASSISTANT_LLM_MAX_TOKENS,
  ASSISTANT_LLM_TEMPERATURE,
  ASSISTANT_LLM_TIMEOUT_MS,
  buildAssistantSystemPrompt,
  sanitizeHistory,
} from "@/lib/assistant-prompt";
import enMessages from "@/messages/en.json";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const DEFAULT_DAILY_MAX = 45;
const PING_TIMEOUT_MS = 9000;
const FULL_QUESTION = "Che ore sono a Londra?";

function parseModels(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function hostOf(baseUrl: string): string | null {
  try {
    return new URL(baseUrl).host || null;
  } catch {
    return null;
  }
}

type PingProbe = {
  model: string;
  status: number | "timeout" | "network";
  ok: boolean;
  error: string | null;
  usedModel: string | null;
};

type FullProbe = {
  model: string;
  case: "current-only" | "with-history";
  status: number | "timeout" | "network";
  ok: boolean;
  latencyMs: number;
  finishReason: string | null;
  contentLength: number;
  contentPreview: string | null;
  hasReasoningField: boolean;
  usage: { prompt_tokens: number | null; completion_tokens: number | null };
  error: string | null;
  systemPromptChars: number;
  messagesSentRoles: string[];
};

async function probeModel(
  base: string,
  key: string,
  model: string,
): Promise<PingProbe> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  try {
    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 5,
        messages: [{ role: "user", content: "ping" }],
      }),
      signal: controller.signal,
    });
    const raw = await response.text();
    let usedModel: string | null = null;
    if (response.ok) {
      try {
        const data = JSON.parse(raw) as { model?: unknown };
        usedModel = typeof data.model === "string" ? data.model : null;
      } catch {
        usedModel = null;
      }
    }
    return {
      model,
      status: response.status,
      ok: response.ok,
      error: response.ok ? null : raw.slice(0, 300),
      usedModel,
    };
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError");
    return {
      model,
      status: timedOut ? "timeout" : "network",
      ok: false,
      error: null,
      usedModel: null,
    };
  } finally {
    clearTimeout(timer);
  }
}

function chatHistoryAfterOpen(): { role: "user" | "assistant"; content: string }[] {
  const faq = getAssistantKb("en").find((entry) => entry.id === "a1");
  return [
    { role: "assistant", content: enMessages.assistant.intro },
    {
      role: "user",
      content: faq?.question ?? "How much does a website cost?",
    },
    {
      role: "assistant",
      content: faq?.answer ?? "",
    },
  ];
}

async function fullProbe(
  base: string,
  key: string,
  model: string,
  probeCase: FullProbe["case"],
  history: unknown,
): Promise<FullProbe> {
  const system = buildAssistantSystemPrompt({
    pageLocale: "en",
    userMessage: FULL_QUESTION,
  });
  const conversation = sanitizeHistory(history, FULL_QUESTION);
  const messages = [{ role: "system", content: system }, ...conversation];
  const messagesSentRoles = messages.map((item) => item.role);
  const started = Date.now();

  if (!base || !key) {
    return {
      model,
      case: probeCase,
      status: "network",
      ok: false,
      latencyMs: 0,
      finishReason: null,
      contentLength: 0,
      contentPreview: null,
      hasReasoningField: false,
      usage: { prompt_tokens: null, completion_tokens: null },
      error: null,
      systemPromptChars: system.length,
      messagesSentRoles,
    };
  }

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
        messages,
      }),
      signal: controller.signal,
    });
    const latencyMs = Date.now() - started;
    const raw = await response.text();
    if (!response.ok) {
      return {
        model,
        case: probeCase,
        status: response.status,
        ok: false,
        latencyMs,
        finishReason: null,
        contentLength: 0,
        contentPreview: null,
        hasReasoningField: false,
        usage: { prompt_tokens: null, completion_tokens: null },
        error: raw.slice(0, 300),
        systemPromptChars: system.length,
        messagesSentRoles,
      };
    }
    let parsed: {
      choices?: {
        finish_reason?: string;
        message?: {
          content?: string;
          reasoning?: unknown;
          reasoning_content?: unknown;
        };
      }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    } = {};
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      parsed = {};
    }
    const choice = parsed.choices?.[0];
    const message = choice?.message;
    const content = typeof message?.content === "string" ? message.content : "";
    const hasReasoningField = Boolean(
      message &&
        ("reasoning" in message || "reasoning_content" in message) &&
        (message.reasoning != null || message.reasoning_content != null),
    );
    return {
      model,
      case: probeCase,
      status: response.status,
      ok: true,
      latencyMs,
      finishReason: choice?.finish_reason ?? null,
      contentLength: content.length,
      contentPreview: content.slice(0, 200) || null,
      hasReasoningField,
      usage: {
        prompt_tokens:
          typeof parsed.usage?.prompt_tokens === "number"
            ? parsed.usage.prompt_tokens
            : null,
        completion_tokens:
          typeof parsed.usage?.completion_tokens === "number"
            ? parsed.usage.completion_tokens
            : null,
      },
      error: null,
      systemPromptChars: system.length,
      messagesSentRoles,
    };
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError");
    const message = error instanceof Error ? error.message : "error";
    return {
      model,
      case: probeCase,
      status: timedOut ? "timeout" : "network",
      ok: false,
      latencyMs: Date.now() - started,
      finishReason: null,
      contentLength: 0,
      contentPreview: null,
      hasReasoningField: false,
      usage: { prompt_tokens: null, completion_tokens: null },
      error: message.slice(0, 300),
      systemPromptChars: system.length,
      messagesSentRoles,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: Request) {
  if (process.env.VERCEL_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  const vercelEnv = process.env.VERCEL_ENV ?? null;
  const base = process.env.ASSISTANT_BASE_URL?.trim().replace(/\/$/, "") ?? "";
  const key = process.env.ASSISTANT_API_KEY?.trim() ?? "";
  const models = parseModels(process.env.ASSISTANT_MODEL ?? "");
  const dailyMax = Number(process.env.ASSISTANT_DAILY_MAX) || DEFAULT_DAILY_MAX;
  const url = new URL(request.url);
  const question = url.searchParams.get("q")?.trim() ?? "";
  const locale = url.searchParams.get("locale") === "it" ? "it" : "en";
  const runsRaw = Number(url.searchParams.get("runs") ?? 3);
  const runs = Number.isFinite(runsRaw)
    ? Math.min(5, Math.max(1, Math.floor(runsRaw)))
    : 3;

  if (question.length > 0) {
    const questionRuns = [];
    for (let i = 0; i < runs; i += 1) {
      const result = await runAssistant({
        message: question,
        pageLocale: locale,
        history: [],
        consumeDaily: false,
      });
      questionRuns.push({
        type: result.type,
        latencyMs: result.latencyMs,
        usedModel: result.usedModel,
        finishReason: result.finishReason,
        contentLength: result.contentLength,
        tried: result.tried,
        error: result.error,
        id: result.id ?? null,
        replyLocale: result.replyLocale,
      });
    }
    return NextResponse.json({
      vercelEnv,
      hasBaseUrl: base.length > 0,
      baseUrlHost: base.length > 0 ? hostOf(base) : null,
      hasKey: key.length > 0,
      keyLength: key.length,
      models,
      dailyMax,
      question,
      locale,
      runs: questionRuns,
    });
  }

  const historyAfterOpen = chatHistoryAfterOpen();

  const probes =
    base.length > 0
      ? await Promise.all(models.map((model) => probeModel(base, key, model)))
      : models.map((model) => ({
          model,
          status: "network" as const,
          ok: false,
          error: null,
          usedModel: null,
        }));

  const fullProbes: FullProbe[] = [];
  for (const model of models) {
    fullProbes.push(
      await fullProbe(base, key, model, "current-only", []),
    );
    fullProbes.push(
      await fullProbe(base, key, model, "with-history", historyAfterOpen),
    );
  }

  return NextResponse.json({
    vercelEnv,
    hasBaseUrl: base.length > 0,
    baseUrlHost: base.length > 0 ? hostOf(base) : null,
    hasKey: key.length > 0,
    keyLength: key.length,
    models,
    dailyMax,
    probes,
    fullProbes,
  });
}
