"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";

const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function ScrollToTop() {
  const t = useTranslations("common");
  const rafRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const measure = () => {
      rafRef.current = 0;
      const root = document.documentElement;
      const y = window.scrollY;
      const scrollable = root.scrollHeight - window.innerHeight;
      const next = scrollable <= 0 ? 0 : Math.min(1, y / scrollable);
      setVisible(y > 8);
      setProgress(next);
      setAtEnd(next >= 0.99);
    };

    const onScroll = () => {
      if (rafRef.current !== 0) return;
      rafRef.current = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== 0) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const goTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className={`scroll-to-top${visible ? " is-visible" : ""}${atEnd ? " is-end" : ""}`}
      aria-label={t("scrollToTop")}
      tabIndex={visible ? 0 : -1}
      onClick={goTop}
    >
      <svg className="scroll-to-top-ring" viewBox="0 0 48 48" aria-hidden>
        <circle
          className="scroll-to-top-track"
          cx="24"
          cy="24"
          r={RING_RADIUS}
        />
        <circle
          className="scroll-to-top-progress"
          cx="24"
          cy="24"
          r={RING_RADIUS}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <ArrowUp className="scroll-to-top-icon" strokeWidth={2.25} aria-hidden />
    </button>
  );
}
