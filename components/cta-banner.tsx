"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function CtaBanner() {
  const t = useTranslations("ctaBanner");

  return (
    <section className="mt-24 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/8 p-8 text-center sm:p-12">
      <p className="text-xl font-semibold text-white sm:text-2xl">
        {t("text")}
      </p>
      <div className="mt-8">
        <Link
          href="/contatti"
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
