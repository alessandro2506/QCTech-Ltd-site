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
        className="fixed bottom-5 left-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-[var(--light-border)] bg-white text-xl shadow-md transition hover:border-[var(--light-primary)]"
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
            className="fixed bottom-20 left-5 z-[80] w-[min(calc(100vw-2.5rem),22rem)] rounded-2xl border border-[var(--light-border)] bg-white p-5 shadow-2xl shadow-slate-900/10"
          >
            <h2
              id="cookie-panel-title"
              className="text-base font-semibold text-[var(--light-text)]"
            >
              {t.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--light-text-muted)]">
              {t.body}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleChoice("all")}
                className="rounded-full bg-[var(--light-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                {t.acceptAll}
              </button>
              <button
                type="button"
                onClick={() => handleChoice("essential")}
                className="rounded-full border border-[var(--light-border)] bg-[var(--light-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--light-text)] transition hover:bg-[var(--light-border)]"
              >
                {t.essentialOnly}
              </button>
            </div>
            <p className="mt-3 text-xs text-[var(--light-text-muted)]">
              <Link
                href="/privacy"
                className="text-[var(--light-primary)] hover:underline"
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
