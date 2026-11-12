"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CHIP_FAQ_IDS, getAssistantKb, type KbEntry } from "@/lib/assistant-kb";
import { getWhatsAppHref } from "@/lib/get-whatsapp-href";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import {
  emitQuantisAiState,
  type QuantisAiState,
} from "@/components/quantis-float";
import { Link } from "@/i18n/routing";

type ChatLine =
  | { kind: "intro" }
  | { kind: "user"; text: string }
  | { kind: "ai"; text: string }
  | { kind: "faq"; entry: KbEntry }
  | { kind: "fallback" }
  | { kind: "too_long" };

function liveStatusLabel(
  state: QuantisAiState,
  t: (key: string) => string,
): string {
  switch (state) {
    case "idle":
      return "";
    case "listening":
      return t("statusListening");
    case "thinking":
      return t("statusThinking");
    case "answered":
      return t("statusAnswered");
    case "error":
      return t("statusError");
    case "closed":
      return t("statusClosed");
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

function historyFromLines(lines: ChatLine[]): { role: "user" | "assistant"; content: string }[] {
  const turns: { role: "user" | "assistant"; content: string }[] = [];
  for (const line of lines) {
    switch (line.kind) {
      case "user":
        turns.push({ role: "user", content: line.text });
        break;
      case "ai":
        turns.push({ role: "assistant", content: line.text });
        break;
      case "faq":
        turns.push({ role: "assistant", content: line.entry.answer });
        break;
      case "fallback":
      case "too_long":
      case "intro":
        break;
      default: {
        const _exhaustive: never = line;
        return _exhaustive;
      }
    }
  }
  return turns.slice(-12);
}

type Props = {
  open: boolean;
  onClose: () => void;
};

type Offset = { x: number; y: number };

function desktopDragEnabled(): boolean {
  return window.matchMedia(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
  ).matches;
}

function clampPanelOffset(
  next: Offset,
  visual: { left: number; top: number; width: number; height: number },
  current: Offset,
): Offset {
  const header = document.querySelector(".site-header-pill");
  const headerBottom =
    header instanceof HTMLElement && getComputedStyle(header).display !== "none"
      ? header.getBoundingClientRect().bottom
      : 0;
  const minLeft = 8;
  const maxLeft = window.innerWidth - 8 - visual.width;
  const minTop = Math.max(8, headerBottom + 8);
  const maxTop = window.innerHeight - 8 - visual.height;
  const baseLeft = visual.left - current.x;
  const baseTop = visual.top - current.y;
  return {
    x: Math.min(maxLeft - baseLeft, Math.max(minLeft - baseLeft, next.x)),
    y: Math.min(maxTop - baseTop, Math.max(minTop - baseTop, next.y)),
  };
}

export function AssistantChat({ open, onClose }: Props) {
  const locale = useLocale();
  const t = useTranslations("assistant");
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const offsetRef = useRef<Offset>({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    orig: Offset;
    visLeft: number;
    visTop: number;
    width: number;
    height: number;
  } | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [desktopDrag, setDesktopDrag] = useState(false);
  const [lines, setLines] = useState<ChatLine[]>([{ kind: "intro" }]);
  const [liveState, setLiveState] = useState<QuantisAiState>("idle");
  const liveRef = useRef<QuantisAiState>("idle");

  function setAiLive(next: QuantisAiState) {
    liveRef.current = next;
    setLiveState(next);
    emitQuantisAiState(next);
  }
  const kb = getAssistantKb(locale);
  const chips = CHIP_FAQ_IDS.map(
    (id) => kb.find((item) => item.id === id) ?? null,
  ).filter((item): item is KbEntry => item !== null);

  useEffect(() => {
    if (!open) {
      setAiLive("closed");
      const idleId = window.setTimeout(() => setAiLive("idle"), 1200);
      return () => window.clearTimeout(idleId);
    }
    setAiLive("listening");
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [lines, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    const sync = () => setDesktopDrag(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open || !desktopDrag) return;
    const panel = panelRef.current;
    if (!panel) return;

    const apply = (next: Offset, visual: DOMRect | { left: number; top: number; width: number; height: number }, current: Offset) => {
      const clamped = clampPanelOffset(next, visual, current);
      offsetRef.current = clamped;
      setOffset(clamped);
    };

    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      apply(
        {
          x: drag.orig.x + event.clientX - drag.startX,
          y: drag.orig.y + event.clientY - drag.startY,
        },
        {
          left: drag.visLeft,
          top: drag.visTop,
          width: drag.width,
          height: drag.height,
        },
        drag.orig,
      );
    };

    const onUp = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      dragRef.current = null;
      setDragging(false);
    };

    const onResize = () => {
      const vis = panel.getBoundingClientRect();
      apply(offsetRef.current, vis, offsetRef.current);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, [open, desktopDrag]);

  async function ask(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setDraft("");
    setLines((prev) => [...prev, { kind: "user", text: message }]);
    if (message.length > 300) {
      setLines((prev) => [...prev, { kind: "too_long" }]);
      setAiLive("error");
      return;
    }
    setBusy(true);
    setAiLive("thinking");
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          message,
          history: historyFromLines(lines),
        }),
      });
      const data: unknown = await response.json();
      const type =
        data && typeof data === "object" && "type" in data
          ? String((data as { type: unknown }).type)
          : "";
      const answer =
        data && typeof data === "object" && "answer" in data
          ? String((data as { answer: unknown }).answer ?? "")
          : "";
      switch (type) {
        case "ai":
          if (answer.length > 0) {
            setLines((prev) => [...prev, { kind: "ai", text: answer }]);
            setAiLive("answered");
          } else {
            setLines((prev) => [...prev, { kind: "fallback" }]);
            setAiLive("error");
          }
          break;
        case "faq": {
          const id =
            data && typeof data === "object" && "id" in data
              ? String((data as { id: unknown }).id)
              : "";
          const entry = kb.find((item) => item.id === id);
          if (entry) {
            setLines((prev) => [...prev, { kind: "faq", entry }]);
            setAiLive("answered");
          } else {
            setLines((prev) => [...prev, { kind: "fallback" }]);
            setAiLive("error");
          }
          break;
        }
        case "too_long":
          setLines((prev) => [...prev, { kind: "too_long" }]);
          setAiLive("error");
          break;
        case "fallback":
          setLines((prev) => [...prev, { kind: "fallback" }]);
          setAiLive("error");
          break;
        default:
          setLines((prev) => [...prev, { kind: "fallback" }]);
          setAiLive("error");
      }
    } catch {
      setLines((prev) => [...prev, { kind: "fallback" }]);
      setAiLive("error");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="assistant-layer">
      <button
        type="button"
        className="assistant-backdrop"
        aria-label={t("close")}
        onClick={onClose}
      />
      <section
        ref={panelRef}
        className={`assistant-panel${dragging ? " is-dragging" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={
          desktopDrag
            ? { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
            : undefined
        }
      >
        <p className="sr-only" aria-live="polite">
          {liveStatusLabel(liveState, t)}
        </p>
        <header
          className="assistant-panel-head"
          onPointerDown={(event) => {
            if (!desktopDragEnabled() || event.button !== 0) return;
            const target = event.target;
            if (
              target instanceof Element &&
              target.closest(".assistant-panel-close")
            ) {
              return;
            }
            const panel = panelRef.current;
            if (!panel) return;
            const vis = panel.getBoundingClientRect();
            dragRef.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              startY: event.clientY,
              orig: { ...offsetRef.current },
              visLeft: vis.left,
              visTop: vis.top,
              width: vis.width,
              height: vis.height,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
          }}
          onDoubleClick={(event) => {
            if (!desktopDragEnabled()) return;
            const target = event.target;
            if (
              target instanceof Element &&
              target.closest(".assistant-panel-close")
            ) {
              return;
            }
            offsetRef.current = { x: 0, y: 0 };
            setOffset({ x: 0, y: 0 });
          }}
        >
          <h2 id={titleId} className="assistant-panel-title">
            {t("title")}
          </h2>
          <button
            type="button"
            className="assistant-panel-close"
            onClick={onClose}
            aria-label={t("close")}
          >
            ×
          </button>
        </header>
        <div ref={listRef} className="assistant-panel-body">
          {lines.map((line, index) => (
            <ChatBubble key={index} line={line} onClose={onClose} />
          ))}
          {busy ? (
            <p className="assistant-bubble assistant-bubble-bot" aria-live="polite">
              {t("writing")}
            </p>
          ) : null}
        </div>
        <div className="assistant-chips" aria-label={t("chipsLabel")}>
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="assistant-chip"
              onClick={() => void ask(chip.question)}
            >
              {chip.question}
            </button>
          ))}
        </div>
        <form
          className="assistant-form"
          onSubmit={(event) => {
            event.preventDefault();
            void ask(draft);
          }}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => {
              const value = event.target.value;
              setDraft(value);
              if (
                value.length > 0 &&
                (liveRef.current === "answered" || liveRef.current === "error")
              ) {
                setAiLive("listening");
              }
            }}
            maxLength={320}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
          />
          <button type="submit" disabled={busy || draft.trim().length === 0}>
            {t("send")}
          </button>
        </form>
        <p className="assistant-panel-foot">
          {t("notice")}
        </p>
        <p className="assistant-panel-foot assistant-panel-foot-privacy">
          {t("foot")}{" "}
          <Link href="/privacy">{t("privacy")}</Link>
        </p>
      </section>
    </div>
  );
}

function QuoteCta({ onClose }: { onClose: () => void }) {
  const t = useTranslations("assistant");
  return (
    <Link href="/contatti" className="assistant-quote-btn" onClick={onClose}>
      {t("quote")}
    </Link>
  );
}

function ChatBubble({
  line,
  onClose,
}: {
  line: ChatLine;
  onClose: () => void;
}) {
  const t = useTranslations("assistant");
  const locale = useLocale();

  switch (line.kind) {
    case "intro":
      return (
        <div className="assistant-bubble assistant-bubble-bot">
          <p>{t("intro")}</p>
          <p className="assistant-privacy">
            <Link href="/privacy">{t("privacy")}</Link>
          </p>
        </div>
      );
    case "user":
      return <p className="assistant-bubble assistant-bubble-user">{line.text}</p>;
    case "ai":
      return (
        <div className="assistant-bubble assistant-bubble-bot">
          <p>{line.text}</p>
          <p className="assistant-source">{t("sourceAi")}</p>
          <div className="assistant-fallback-actions">
            <QuoteCta onClose={onClose} />
          </div>
        </div>
      );
    case "faq":
      return (
        <div className="assistant-bubble assistant-bubble-bot">
          <p className="assistant-faq-q">{line.entry.question}</p>
          <p>{line.entry.answer}</p>
          <p className="assistant-source">{t("sourceFaq")}</p>
          <div className="assistant-fallback-actions">
            <QuoteCta onClose={onClose} />
          </div>
        </div>
      );
    case "fallback":
      return (
        <div className="assistant-bubble assistant-bubble-bot">
          <p>{t("fallback")}</p>
          <div className="assistant-fallback-actions">
            <QuoteCta onClose={onClose} />
            <a
              href={getWhatsAppHref(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="assistant-fallback-btn"
            >
              <WhatsAppIcon decorative className="h-4 w-4 shrink-0" />
              {t("whatsapp")}
            </a>
          </div>
        </div>
      );
    case "too_long":
      return (
        <p className="assistant-bubble assistant-bubble-bot">{t("tooLong")}</p>
      );
    default: {
      const _exhaustive: never = line;
      return _exhaustive;
    }
  }
}
