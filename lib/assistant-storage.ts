import { isContactTopic, type ContactTopic } from "@/lib/contact";
import type { ChatTurn } from "@/lib/assistant-prompt";

export const DRAFT_STORAGE_KEY = "qct-assistant-draft";
export const HISTORY_STORAGE_KEY = "qct-assistant-history";
export const KEEP_OPEN_STORAGE_KEY = "qct-assistant-keep-open";
export const DRAFT_TTL_MS = 2 * 60 * 60 * 1000;

export type StoredDraft = {
  topic: ContactTopic;
  message: string;
  createdAt: number;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function readJson(key: string): unknown {
  if (!canUseStorage()) return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function readAssistantDraft(): StoredDraft | null {
  const value = readJson(DRAFT_STORAGE_KEY);
  if (!value || typeof value !== "object") return null;
  const rec = value as Record<string, unknown>;
  const createdAt = typeof rec.createdAt === "number" ? rec.createdAt : 0;
  if (!createdAt || Date.now() - createdAt > DRAFT_TTL_MS) {
    clearAssistantDraft();
    return null;
  }
  if (typeof rec.message !== "string" || !isContactTopic(String(rec.topic))) {
    return null;
  }
  return {
    topic: rec.topic as ContactTopic,
    message: rec.message,
    createdAt,
  };
}

export function writeAssistantDraft(draft: {
  topic: ContactTopic;
  message: string;
}): void {
  if (!canUseStorage()) return;
  const payload: StoredDraft = {
    topic: draft.topic,
    message: draft.message,
    createdAt: Date.now(),
  };
  sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
}

export function clearAssistantDraft(): void {
  if (!canUseStorage()) return;
  sessionStorage.removeItem(DRAFT_STORAGE_KEY);
}

export function readAssistantHistory(): ChatTurn[] {
  const value = readJson(HISTORY_STORAGE_KEY);
  const list = Array.isArray(value)
    ? value
    : value && typeof value === "object" && Array.isArray((value as { turns?: unknown }).turns)
      ? ((value as { turns: unknown[] }).turns)
      : null;
  const createdAt =
    value && typeof value === "object" && !Array.isArray(value)
      ? Number((value as { createdAt?: unknown }).createdAt)
      : 0;
  if (createdAt && Date.now() - createdAt > DRAFT_TTL_MS) {
    clearAssistantHistory();
    return [];
  }
  if (!list) return [];
  const turns: ChatTurn[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const role = rec.role === "assistant" ? "assistant" : rec.role === "user" ? "user" : null;
    const content = typeof rec.content === "string" ? rec.content : "";
    if (!role || !content) continue;
    turns.push({ role, content });
  }
  return turns.slice(-12);
}

export function writeAssistantHistory(history: ChatTurn[]): void {
  if (!canUseStorage()) return;
  sessionStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify({ createdAt: Date.now(), turns: history.slice(-12) }),
  );
}

export function clearAssistantHistory(): void {
  if (!canUseStorage()) return;
  sessionStorage.removeItem(HISTORY_STORAGE_KEY);
}

export function setAssistantKeepOpen(value: boolean): void {
  if (!canUseStorage()) return;
  if (value) sessionStorage.setItem(KEEP_OPEN_STORAGE_KEY, "1");
  else sessionStorage.removeItem(KEEP_OPEN_STORAGE_KEY);
}

export function shouldKeepAssistantOpen(): boolean {
  if (!canUseStorage()) return false;
  return sessionStorage.getItem(KEEP_OPEN_STORAGE_KEY) === "1";
}

export function clearAssistantHandoff(): void {
  clearAssistantDraft();
  clearAssistantHistory();
  setAssistantKeepOpen(false);
}

export const DRAFT_UPDATED_EVENT = "qct-assistant-draft-updated";

export function emitDraftUpdated(): void {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event(DRAFT_UPDATED_EVENT));
}
