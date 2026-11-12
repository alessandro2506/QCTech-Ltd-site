"use client";

import { useState } from "react";
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

  return (
    <section className="hero-home">
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
