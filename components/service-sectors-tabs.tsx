"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Briefcase,
  Building2,
  Check,
  Compass,
  Package,
  Stethoscope,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

const icons = {
  hotel: Building2,
  ristorazione: UtensilsCrossed,
  logistica: Truck,
  traslochi: Package,
  consulenza: Briefcase,
  turismo: Compass,
  veterinario: Stethoscope,
} as const;

export type SectorTab = {
  id: keyof typeof icons;
  label: string;
  title: string;
  description: string;
  bullets: string[];
};

type Props = {
  tabs: SectorTab[];
  eyebrow: string;
  title: string;
  intro: string;
};

export function ServiceSectorsTabs({
  tabs,
  eyebrow,
  title,
  intro,
}: Props) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-8% 0px" });
  const current = tabs[active];
  const Icon = icons[current.id];

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card mt-14 rounded-2xl p-6 sm:mt-16 sm:p-8"
      aria-labelledby="sectors-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
        {eyebrow}
      </p>
      <h2
        id="sectors-heading"
        className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-slate-400">{intro}</p>

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label={title}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={`sector-panel-${tab.id}`}
            id={`sector-tab-${tab.id}`}
            onClick={() => setActive(i)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              active === i
                ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/25"
                : "border border-violet-500/20 bg-white/5 text-slate-400 hover:border-violet-400/30 hover:bg-white/10 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative mt-6 min-h-[220px] sm:min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            id={`sector-panel-${current.id}`}
            role="tabpanel"
            aria-labelledby={`sector-tab-${current.id}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-violet-500/15 bg-white/3 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/15">
                <Icon className="h-7 w-7" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-white">
                  {current.title}
                </h3>
                <p className="mt-2 text-slate-400">{current.description}</p>
                <ul className="mt-5 space-y-2.5">
                  {current.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm text-slate-300"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500"
                        aria-hidden
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
