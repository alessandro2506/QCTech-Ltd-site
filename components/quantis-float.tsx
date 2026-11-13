"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type QuantisNearState = "idle" | "near";
type QuantisPlacement = "dock" | "hero" | "pill";

export type QuantisAiState =
  | "idle"
  | "listening"
  | "thinking"
  | "answered"
  | "error"
  | "closed";

const AI_STATES: readonly QuantisAiState[] = [
  "idle",
  "listening",
  "thinking",
  "answered",
  "error",
  "closed",
];

function isAiState(value: unknown): value is QuantisAiState {
  return (
    typeof value === "string" &&
    (AI_STATES as readonly string[]).includes(value)
  );
}

export function emitQuantisAiState(state: QuantisAiState): void {
  window.dispatchEvent(
    new CustomEvent("quantis:state", { detail: { state } }),
  );
}

function isChatOpen(state: QuantisAiState): boolean {
  switch (state) {
    case "listening":
    case "thinking":
    case "answered":
    case "error":
      return true;
    case "idle":
    case "closed":
      return false;
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

function statusKey(state: QuantisAiState): "statusListening" | "statusThinking" | "statusAnswered" | "statusError" | "statusClosed" | null {
  switch (state) {
    case "idle":
      return null;
    case "listening":
      return "statusListening";
    case "thinking":
      return "statusThinking";
    case "answered":
      return "statusAnswered";
    case "error":
      return "statusError";
    case "closed":
      return "statusClosed";
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}

export function QuantisFloat({
  placement = "dock",
}: {
  placement?: QuantisPlacement;
}) {
  const t = useTranslations("common");
  const tAi = useTranslations("assistant");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const aiRef = useRef<QuantisAiState>("idle");
  const [aiState, setAiState] = useState<QuantisAiState>("idle");
  const [near, setNear] = useState(false);
  const [dockShifted, setDockShifted] = useState(false);

  const updateAiState = useCallback((next: QuantisAiState) => {
    aiRef.current = next;
    setAiState(next);
    if (next !== "idle") setNear(false);
  }, []);

  useEffect(() => {
    aiRef.current = aiState;
  }, [aiState]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const hoverQuery = window.matchMedia("(hover: hover)");
    let rafId = 0;
    let nextEvent: PointerEvent | null = null;
    let listening = false;

    const applyNear = (event: PointerEvent) => {
      if (aiRef.current !== "idle") return;
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      setNear(Math.hypot(dx, dy) <= 120);
    };

    const onPointerMove = (event: PointerEvent) => {
      nextEvent = event;
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const queued = nextEvent;
        nextEvent = null;
        if (queued) applyNear(queued);
      });
    };

    const attach = () => {
      if (listening || !hoverQuery.matches) return;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      listening = true;
    };

    const detach = () => {
      if (!listening) return;
      window.removeEventListener("pointermove", onPointerMove);
      listening = false;
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      nextEvent = null;
      setNear(false);
    };

    const syncListener = (visible: boolean) => {
      if (visible && !document.hidden && hoverQuery.matches) attach();
      else detach();
    };

    const observer = new IntersectionObserver((entries) => {
      syncListener(entries.some((entry) => entry.isIntersecting));
    });
    observer.observe(button);

    const onVisibility = () => {
      const visible = button.getClientRects().length > 0;
      syncListener(visible && !document.hidden);
    };

    const onAiState = (event: Event) => {
      const detail = (event as CustomEvent<{ state?: unknown }>).detail;
      if (isAiState(detail?.state)) updateAiState(detail.state);
    };

    document.addEventListener("visibilitychange", onVisibility);
    hoverQuery.addEventListener("change", onVisibility);
    window.addEventListener("quantis:state", onAiState);

    return () => {
      observer.disconnect();
      detach();
      document.removeEventListener("visibilitychange", onVisibility);
      hoverQuery.removeEventListener("change", onVisibility);
      window.removeEventListener("quantis:state", onAiState);
    };
  }, [updateAiState]);

  useEffect(() => {
    if (placement !== "dock") return;
    const rafRef = { current: 0 };
    const measure = () => {
      rafRef.current = 0;
      setDockShifted(window.scrollY > 8);
    };
    const onScroll = () => {
      if (rafRef.current !== 0) return;
      rafRef.current = window.requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== 0) window.cancelAnimationFrame(rafRef.current);
    };
  }, [placement]);

  const expanded = isChatOpen(aiState);
  const nearState: QuantisNearState =
    aiState === "idle" && near ? "near" : "idle";
  const status = statusKey(aiState);

  let markPx: number;
  let sizes: string;
  switch (placement) {
    case "hero":
      markPx = 512;
      sizes = "(min-width: 1280px) 300px, 240px";
      break;
    case "dock":
      markPx = 48;
      sizes = "48px";
      break;
    case "pill":
      markPx = 28;
      sizes = "28px";
      break;
    default: {
      const _exhaustive: never = placement;
      return _exhaustive;
    }
  }

  const markSrc =
    placement === "hero"
      ? "/quantis/quantis-mark-512.webp"
      : "/quantis/quantis-mark.webp";

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`quantis-float quantis-float--${placement}${
        placement === "dock" && dockShifted ? " is-shifted" : ""
      }`}
      data-state={nearState}
      data-ai-state={aiState}
      aria-label={
        status ? `${t("quantisOpen")} — ${tAi(status)}` : t("quantisOpen")
      }
      aria-expanded={expanded}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("quantis:open"));
      }}
    >
      <span className="quantis-float-core" aria-hidden>
        <span className="quantis-float-stars" />
        <span className="quantis-float-mark">
          <Image
            src={markSrc}
            alt=""
            width={markPx}
            height={markPx}
            sizes={sizes}
            draggable={false}
          />
        </span>
      </span>
      {placement === "pill" ? (
        <span className="quantis-float-label">{t("quantisFaqLabel")}</span>
      ) : null}
      {placement === "dock" ? (
        <span className="quantis-float-badge">{t("quantisFloatBadge")}</span>
      ) : null}
    </button>
  );
}
