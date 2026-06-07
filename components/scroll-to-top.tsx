"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

function scrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const el = document.documentElement;
  const scrollable = el.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return window.scrollY / scrollable;
}

function subscribe(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener("scroll", handler, { passive: true });
  window.addEventListener("resize", handler, { passive: true });
  return () => {
    window.removeEventListener("scroll", handler);
    window.removeEventListener("resize", handler);
  };
}

function getScrollTopVisible(): boolean {
  return scrollProgress() >= 0.5;
}

export function ScrollToTop() {
  const t = useTranslations("common");
  const visible = useSyncExternalStore(
    subscribe,
    getScrollTopVisible,
    () => false,
  );

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="scroll-top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed bottom-6 right-4 z-40 sm:bottom-8 sm:right-6"
        >
          <button
            type="button"
            onClick={goTop}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/30 bg-[#0d0720]/90 text-violet-400 shadow-lg shadow-violet-900/20 backdrop-blur-sm transition hover:border-violet-400/50 hover:text-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            aria-label={t("scrollToTop")}
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
