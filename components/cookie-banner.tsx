"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  setCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

const copy = {
  it: {
    title: "Preferenze Cookie",
    body: "Utilizziamo cookie tecnici (necessari) e cookie analitici (Google Analytics 4, opzionali). Puoi accettare tutti i cookie o solo quelli necessari.",
    acceptAll: "Accetta tutti",
    essentialOnly: "Solo necessari",
    privacy: "Privacy Policy",
  },
  en: {
    title: "Cookie Preferences",
    body: "We use technical cookies (required) and analytics cookies (Google Analytics 4, optional). You can accept all cookies or only the necessary ones.",
    acceptAll: "Accept all",
    essentialOnly: "Essential only",
    privacy: "Privacy Policy",
  },
} as const;

export function CookieBanner() {
  const locale = useLocale();
  const t = copy[locale === "it" ? "it" : "en"];
  const [panelOpen, setPanelOpen] = useState(false);

  function handleChoice(value: CookieConsent) {
    setCookieConsent(value);
    setPanelOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setPanelOpen((open) => !open)}
        className="fixed bottom-5 right-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-[#22C55E]/40 bg-[#08050f]/85 text-xl shadow-[0_0_20px_rgba(34,197,94,0.35)] backdrop-blur-sm transition hover:border-[#22C55E]/70 hover:shadow-[0_0_28px_rgba(34,197,94,0.5)]"
        aria-label={t.title}
        aria-expanded={panelOpen}
      >
        <span aria-hidden>🍪</span>
      </button>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-panel-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 right-5 z-[80] w-[min(calc(100vw-2.5rem),22rem)] rounded-2xl border border-violet-500/20 bg-[#0d0720]/95 p-5 shadow-2xl shadow-violet-900/30 backdrop-blur-md"
          >
            <h2
              id="cookie-panel-title"
              className="text-base font-semibold text-slate-100"
            >
              {t.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {t.body}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleChoice("all")}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                {t.acceptAll}
              </button>
              <button
                type="button"
                onClick={() => handleChoice("essential")}
                className="rounded-xl border border-violet-500/25 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
              >
                {t.essentialOnly}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              <Link
                href="/privacy"
                className="text-violet-400 hover:text-violet-300"
                onClick={() => setPanelOpen(false)}
              >
                {t.privacy}
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
