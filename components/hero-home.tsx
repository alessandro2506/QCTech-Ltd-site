"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ShieldCheck } from "lucide-react";
import { QCTechLogo } from "@/components/qctech-logo";
import { Link } from "@/i18n/routing";

export function HeroHome() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden pb-16 pt-[4.5rem] sm:pb-20 sm:pt-[4.75rem]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex justify-center">
            <QCTechLogo variant="hero" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
        >
          {t("headlineBefore")}{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {t("headlineAccent")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="mt-5 max-w-2xl text-lg text-slate-600 sm:text-xl"
        >
          {t("sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:items-center"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-105"
            >
              {t("ctaPrimary")}
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              href="/servizi"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-800 shadow-sm transition hover:border-cyan-400/50 hover:bg-slate-50"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
          <a
            href="#prezzi"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/35 bg-white px-7 py-3 text-base font-semibold text-cyan-800 shadow-sm ring-1 ring-cyan-500/15 transition hover:border-cyan-500/55 hover:bg-cyan-50/80"
          >
            {t("ctaPlans")}
            <ArrowDown className="h-4 w-4 text-cyan-600" aria-hidden />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mt-10 flex items-center gap-2 text-sm text-slate-500"
        >
          <ShieldCheck className="h-5 w-5 text-cyan-600" aria-hidden />
          <span>{t("trust")}</span>
        </motion.div>
      </div>
    </section>
  );
}
