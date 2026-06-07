"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ShieldCheck } from "lucide-react";
import { QCTechLogo } from "@/components/qctech-logo";
import { MatrixRain } from "@/components/matrix-rain";
import { Link } from "@/i18n/routing";

export function HeroHome() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden pb-20 pt-[4.5rem] sm:pb-28 sm:pt-[4.75rem]">
      {/* Matrix rain full-hero background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <MatrixRain className="absolute inset-0 opacity-[0.22]" />
      </div>

      {/* Quantum ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cyan-400/15 blur-[80px]" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[60px]" />
      </div>

      {/* Quantum grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-quantum-grid opacity-60" aria-hidden />

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

        {/* Quantum badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300"
        >
          <span className="quantum-pulse h-1.5 w-1.5 rounded-full bg-cyan-400 inline-block" />
          Quantum Code Technologies
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
        >
          {t("headlineBefore")}{" "}
          <span className="gradient-quantum text-glow-violet">
            {t("headlineAccent")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="mt-5 max-w-2xl text-lg text-slate-400 sm:text-xl"
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:brightness-110 glow-violet"
            >
              {t("ctaPrimary")}
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              href="/servizi"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-white/5 px-7 py-3.5 text-base font-semibold text-slate-200 backdrop-blur-sm transition hover:border-violet-400/50 hover:bg-white/10"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
          <a
            href="#prezzi"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/5 px-7 py-3 text-base font-semibold text-cyan-300 backdrop-blur-sm transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
          >
            {t("ctaPlans")}
            <ArrowDown className="h-4 w-4 text-cyan-400" aria-hidden />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mt-10 flex items-center gap-2 text-sm text-slate-500"
        >
          <ShieldCheck className="h-5 w-5 text-cyan-500" aria-hidden />
          <span>{t("trust")}</span>
        </motion.div>
      </div>
    </section>
  );
}
