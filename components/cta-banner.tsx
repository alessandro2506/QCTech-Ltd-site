"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function CtaBanner() {
  const t = useTranslations("ctaBanner");

  return (
    <section className="mt-24 rounded-2xl border border-[var(--light-border)] bg-[var(--light-surface)] p-8 text-center sm:p-12">
      <p className="text-xl font-semibold text-[var(--light-emphasis)] sm:text-2xl">
        {t("text")}
      </p>
      <div className="mt-8">
        <Link
          href="/contatti"
          className="inline-flex items-center rounded-full bg-[var(--light-primary)] px-8 py-4 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
