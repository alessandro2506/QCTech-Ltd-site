"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { ContactTopic } from "@/lib/contact";

type PlanItem = {
  name: string;
  price: string;
  oldPrice?: string;
  promo?: boolean;
};

type PlanTab = {
  id: string;
  topic?: ContactTopic;
  label: string;
  fromPrice: string;
  note: string;
  items: PlanItem[];
};

export function HomePlans() {
  const t = useTranslations("home.plans");
  const tabs = t.raw("tabs") as PlanTab[];
  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? "web");
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (!active) return null;

  return (
    <section
      id="prezzi"
      className="section-y bg-[var(--light-bg)]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--light-text-muted)]">
          {t("intro")}
        </p>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label={t("title")}
        >
          {tabs.map((tab) => {
            const selected = tab.id === active.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(tab.id)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  selected
                    ? "bg-[var(--light-primary)] text-white"
                    : "border border-[var(--light-border)] bg-white text-[var(--light-text)] hover:border-[var(--light-primary)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          className="mt-6 rounded-2xl border border-[var(--light-border)] bg-[var(--light-surface)] p-6"
        >
          <p className="text-2xl font-bold text-[var(--light-primary)]">
            {active.fromPrice}
          </p>
          <p className="mt-2 text-sm text-[var(--light-text-muted)]">
            {active.note}
          </p>
          <ul className="mt-5 space-y-2">
            {active.items.map((item) =>
              item.promo ? (
                <li
                  key={item.name}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-100 via-yellow-50 to-white px-4 py-3 text-sm shadow-[0_0_18px_rgba(245,158,11,0.25)]"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[var(--light-text)]">
                      {item.name}
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {t("promoLabel")}
                    </span>
                  </span>
                  <span className="flex items-baseline gap-2">
                    {item.oldPrice ? (
                      <s className="text-[var(--light-text-muted)]">{item.oldPrice}</s>
                    ) : null}
                    <span className="text-base font-bold text-emerald-600">
                      {item.price}
                    </span>
                  </span>
                </li>
              ) : (
                <li
                  key={item.name}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--light-border)] py-2 text-sm last:border-0"
                >
                  <span className="font-medium text-[var(--light-text)]">
                    {item.name}
                  </span>
                  <span className="text-[var(--light-text-muted)]">{item.price}</span>
                </li>
              ),
            )}
          </ul>
          <Link
            href={{
              pathname: "/contatti",
              query: { topic: active.topic ?? active.id },
            }}
            className="mt-6 inline-flex rounded-xl bg-[var(--light-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
