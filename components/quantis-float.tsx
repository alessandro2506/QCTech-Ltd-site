"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type QuantisState = "idle" | "near" | "open" | "thinking";
type QuantisPlacement = "dock" | "hero" | "pill";

function isHeldState(state: QuantisState): boolean {
  switch (state) {
    case "open":
    case "thinking":
      return true;
    case "idle":
    case "near":
      return false;
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const stateRef = useRef<QuantisState>("idle");
  const [state, setState] = useState<QuantisState>("idle");
  const [dockShifted, setDockShifted] = useState(false);

  const updateState = useCallback((next: QuantisState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const hoverQuery = window.matchMedia("(hover: hover)");
    let rafId = 0;
    let nextEvent: PointerEvent | null = null;
    let listening = false;

    const applyNear = (event: PointerEvent) => {
      if (isHeldState(stateRef.current)) return;
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const near = Math.hypot(dx, dy) <= 120;
      updateState(near ? "near" : "idle");
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
      if (!isHeldState(stateRef.current)) updateState("idle");
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

    document.addEventListener("visibilitychange", onVisibility);
    hoverQuery.addEventListener("change", onVisibility);

    const onThinking = () => updateState("thinking");
    const onIdle = () => updateState("idle");
    const onOpenUi = () => updateState("open");
    window.addEventListener("quantis:thinking", onThinking);
    window.addEventListener("quantis:idle", onIdle);
    window.addEventListener("quantis:open-ui", onOpenUi);

    return () => {
      observer.disconnect();
      detach();
      document.removeEventListener("visibilitychange", onVisibility);
      hoverQuery.removeEventListener("change", onVisibility);
      window.removeEventListener("quantis:thinking", onThinking);
      window.removeEventListener("quantis:idle", onIdle);
      window.removeEventListener("quantis:open-ui", onOpenUi);
    };
  }, [updateState]);

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

  const expanded = state === "open" || state === "thinking";

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
      data-state={state}
      aria-label={t("quantisOpen")}
      aria-expanded={expanded}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("quantis:open"));
        updateState(state === "open" ? "idle" : "open");
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
        <span className="quantis-float-badge">FAQ</span>
      ) : null}
    </button>
  );
}
