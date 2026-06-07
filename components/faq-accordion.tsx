"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FAQItem[];
};

export function FaqAccordion({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-violet-500/15 bg-white/3 transition hover:border-violet-400/25"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIdx((curr) => (curr === idx ? null : idx))}
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-slate-200">
                {item.question}
              </span>
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-violet-500/30 text-lg font-medium text-violet-400"
                aria-hidden
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: "easeInOut" }}
                >
                  <p className="border-t border-violet-500/10 px-5 py-4 text-sm leading-relaxed text-slate-400">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
