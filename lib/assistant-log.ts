export type AssistantFallbackReason =
  | "timeout"
  | "empty"
  | "parse"
  | "pii"
  | "400"
  | "429"
  | "none";

export function logAssistantCall(input: {
  endpoint: "/api/assistant" | "/api/assistant/draft";
  model: string | null;
  status: number | string;
  latencyMs: number;
  fallback: AssistantFallbackReason;
}): void {
  console.warn(
    JSON.stringify({
      tag: "assistant",
      endpoint: input.endpoint,
      model: input.model,
      status: input.status,
      latencyMs: input.latencyMs,
      fallback: input.fallback,
    }),
  );
}

export function fallbackFromTriedStatus(
  status: number | "timeout" | "network" | "empty" | undefined,
): AssistantFallbackReason {
  if (status === "timeout" || status === "network") return "timeout";
  if (status === "empty") return "empty";
  if (status === 400) return "400";
  if (status === 429) return "429";
  return "none";
}
