"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { QCTechLogo } from "@/components/qctech-logo";
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
    <section className="relative bg-[var(--light-bg)] pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center sm:px-6">
        <div className="mb-6 sm:mb-8">
          <QCTechLogo variant="hero" />
        </div>

        <p className="mb-5 rounded-full border border-[var(--light-border)] bg-[var(--light-surface)] px-4 py-1.5 text-xs font-medium text-[var(--light-text-muted)]">
          {t("availability")}
        </p>

        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[var(--light-text)] sm:text-4xl md:text-5xl">
          {t("headline")}
        </h1>

        {active ? (
          <p className="mt-5 max-w-2xl text-lg text-[var(--light-text-muted)] sm:text-xl">
            {active.support}
          </p>
        ) : null}

        <div
          className="mt-6 flex flex-wrap justify-center gap-2"
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
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  selected
                    ? "border-[var(--light-primary)] bg-[var(--light-primary)] text-white"
                    : "border-[var(--light-border)] bg-white text-[var(--light-text)] hover:border-[var(--light-primary)]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/contatti"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--light-primary)] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            {t("ctaPrimary")}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
          <a
            href="#progetti"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--light-border)] bg-white px-7 py-3.5 text-base font-semibold text-[var(--light-text)] transition hover:border-[var(--light-primary)] hover:text-[var(--light-primary)]"
          >
            {t("ctaSecondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
