"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export function ServiceCardsCursor({ children }: { children: React.ReactNode }) {
  const t = useTranslations("home.services");
  const wrapRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pill = pillRef.current;
    if (!wrap || !pill) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let nextX = 0;
    let nextY = 0;
    let onCard = false;

    const sync = () => {
      raf = 0;
      if (!fine.matches || reduce.matches || !onCard) {
        pill.classList.remove("is-on");
        return;
      }
      pill.classList.add("is-on");
      pill.style.transform = `translate(${nextX}px, ${nextY}px) translate(-50%, -50%)`;
    };

    const onMove = (event: PointerEvent) => {
      const row = (event.target as HTMLElement | null)?.closest(".svc-row");
      onCard = Boolean(row);
      nextX = event.clientX;
      nextY = event.clientY;
      if (raf !== 0) return;
      raf = window.requestAnimationFrame(sync);
    };

    const onLeave = () => {
      onCard = false;
      if (raf !== 0) window.cancelAnimationFrame(raf);
      raf = 0;
      pill.classList.remove("is-on");
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      if (raf !== 0) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="svc-cursor-wrap">
      {children}
      <div ref={pillRef} className="svc-cursor" aria-hidden>
        {t("cursor")}
      </div>
    </div>
  );
}
