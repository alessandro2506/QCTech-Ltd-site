"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FAQItem[];
  variant?: "light";
};

export function FaqAccordion({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const shell = {
    item: "overflow-hidden rounded-2xl border border-[var(--light-border)] bg-white",
    question: "text-base font-semibold text-[var(--light-text)]",
    icon: "inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--light-border)] text-lg font-medium text-[var(--light-primary)]",
    answer:
      "border-t border-[var(--light-border)] px-5 py-4 text-sm leading-relaxed text-[var(--light-text-muted)]",
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={item.question} className={shell.item}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIdx((curr) => (curr === idx ? null : idx))}
              aria-expanded={isOpen}
            >
              <span className={shell.question}>{item.question}</span>
              <span className={shell.icon} aria-hidden>
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
                  <p className={shell.answer}>{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
