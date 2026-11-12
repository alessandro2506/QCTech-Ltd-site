"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { QuantisFloat } from "@/components/quantis-float";
import { Link } from "@/i18n/routing";

type HeroChip = {
  id: string;
  label: string;
  support: string;
};

export function HeroHome() {
  const t = useTranslations("hero");
  const chips = t.raw("chips") as HeroChip[];
  const [activeId, setActiveId] = useState(chips[0]?.id ?? "");
  const active = chips.find((chip) => chip.id === activeId) ?? chips[0];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = sectionRef.current;
    if (!hero) return;

    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let mx = 0;
    let my = 0;
    let listening = false;
    let nextEvent: PointerEvent | null = null;

    const apply = () => {
      rafId = 0;
      const queued = nextEvent;
      nextEvent = null;
      if (queued) {
        const rect = hero.getBoundingClientRect();
        const width = rect.width || 1;
        const height = rect.height || 1;
        mx = ((queued.clientX - rect.left) / width) * 2 - 1;
        my = ((queued.clientY - rect.top) / height) * 2 - 1;
        mx = Math.max(-1, Math.min(1, mx));
        my = Math.max(-1, Math.min(1, my));
      }
      hero.style.setProperty("--mx", String(mx));
      hero.style.setProperty("--my", String(my));
    };

    const onMove = (event: PointerEvent) => {
      nextEvent = event;
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(apply);
    };

    const attach = () => {
      if (listening || !fineQuery.matches || motionQuery.matches) return;
      hero.addEventListener("pointermove", onMove, { passive: true });
      listening = true;
    };

    const detach = () => {
      if (!listening) return;
      hero.removeEventListener("pointermove", onMove);
      listening = false;
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      nextEvent = null;
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) attach();
      else detach();
    });
    observer.observe(hero);

    const onChange = () => {
      detach();
      if (hero.getClientRects().length > 0) attach();
    };
    fineQuery.addEventListener("change", onChange);
    motionQuery.addEventListener("change", onChange);

    return () => {
      observer.disconnect();
      fineQuery.removeEventListener("change", onChange);
      motionQuery.removeEventListener("change", onChange);
      detach();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-home">
      <div className="hero-aurora" aria-hidden>
        <span className="hero-aurora-blob hero-aurora-blob-a" />
        <span className="hero-aurora-blob hero-aurora-blob-b" />
        <span className="hero-aurora-blob hero-aurora-blob-c" />
        <span className="hero-aurora-dots" />
      </div>
      <div className="hero-home-grid">
        <div className="hero-home-copy">
          <p className="hero-home-badge">
            <span className="hero-home-badge-dot" aria-hidden />
            {t("availability")}
          </p>

          <h1 className="hero-home-title">
            {t("headlineLead")}{" "}
            <span className="hero-home-title-emphasis">{t("headlineEmphasis")}</span>
          </h1>

          {active ? <p className="hero-home-support">{active.support}</p> : null}

          <div
            className="hero-home-chips"
            role="group"
            aria-label={t("chipsLabel")}
          >
            {chips.map((chip) => {
              const selected = chip.id === active?.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveId(chip.id)}
                  className={`hero-home-chip${selected ? " is-active" : ""}`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div className="hero-home-cta">
            <Link href="/contatti" className="hero-home-cta-primary">
              {t("ctaPrimary")}
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <a href="#progetti" className="hero-home-cta-secondary">
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        <div className="hero-home-mark">
          <div className="hero-quantis-halo">
            <QuantisFloat placement="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
