import { NextResponse } from "next/server";
import {
  allowRate,
  runAssistantDraft,
  withAssistantDebug,
} from "@/lib/assistant-engine";
import { logAssistantCall } from "@/lib/assistant-log";

export const runtime = "nodejs";
export const maxDuration = 30;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (!allowRate(ip)) {
    logAssistantCall({
      endpoint: "/api/assistant/draft",
      model: null,
      status: 429,
      latencyMs: 0,
      fallback: "429",
    });
    return NextResponse.json(
      withAssistantDebug({ type: "draft", topic: "other", message: "", source: "fallback" }, []),
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logAssistantCall({
      endpoint: "/api/assistant/draft",
      model: null,
      status: 400,
      latencyMs: 0,
      fallback: "400",
    });
    return NextResponse.json(
      withAssistantDebug({ type: "draft", topic: "other", message: "", source: "fallback" }, []),
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    logAssistantCall({
      endpoint: "/api/assistant/draft",
      model: null,
      status: 400,
      latencyMs: 0,
      fallback: "400",
    });
    return NextResponse.json(
      withAssistantDebug({ type: "draft", topic: "other", message: "", source: "fallback" }, []),
      { status: 400 },
    );
  }

  const o = body as Record<string, unknown>;
  const locale = o.locale === "en" ? "en" : "it";
  const draft = await runAssistantDraft({
    pageLocale: locale,
    history: o.history,
    ip,
    consumeDaily: true,
  });
  return NextResponse.json(
    withAssistantDebug(
      {
        type: "draft",
        topic: draft.topic,
        message: draft.message,
        source: draft.source,
      },
      draft.tried,
    ),
  );
}
