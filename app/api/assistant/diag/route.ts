import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LLM_TIMEOUT_MS = 9000;
const DEFAULT_DAILY_MAX = 45;

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

async function probeModel(
  base: string,
  key: string,
  model: string,
): Promise<{
  model: string;
  status: number | "timeout" | "network";
  ok: boolean;
  error: string | null;
  usedModel: string | null;
}> {
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

export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  const vercelEnv = process.env.VERCEL_ENV ?? null;
  const base = process.env.ASSISTANT_BASE_URL?.trim().replace(/\/$/, "") ?? "";
  const key = process.env.ASSISTANT_API_KEY?.trim() ?? "";
  const models = parseModels(process.env.ASSISTANT_MODEL ?? "");
  const dailyMax = Number(process.env.ASSISTANT_DAILY_MAX) || DEFAULT_DAILY_MAX;

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

  return NextResponse.json({
    vercelEnv,
    hasBaseUrl: base.length > 0,
    baseUrlHost: base.length > 0 ? hostOf(base) : null,
    hasKey: key.length > 0,
    keyLength: key.length,
    models,
    dailyMax,
    probes,
  });
}
