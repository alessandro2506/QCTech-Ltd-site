"use client";

import { useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import type { ContactTopic } from "@/lib/contact";

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  subtitle?: string;
  bullets: string[];
  highlight?: boolean;
};

type PricingClusterProps = {
  eyebrow?: string;
  title: string;
  description: string;
  plans: [PricingPlan, PricingPlan, PricingPlan];
  ctaLabel: string;
  /** Query `topic` sulla pagina Contatti (allineata al form / API contatti). */
  contactTopic: ContactTopic;
};

export function PricingCluster({
  eyebrow,
  title,
  description,
  plans,
  ctaLabel,
  contactTopic,
}: PricingClusterProps) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-12% 0px" });

  const contactHref = useMemo(() => {
    const section = (eyebrow ?? title).trim();
    return {
      pathname: "/contatti" as const,
      query: {
        topic: contactTopic,
        plan: plans[active].name,
        section,
      },
    };
  }, [contactTopic, plans, active, eyebrow, title]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl p-6 sm:p-8"
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-slate-400">{description}</p>

      <div
        className="mt-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label={`Piani ${title}`}
      >
        {plans.map((plan, i) => (
          <button
            key={plan.id}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              active === i
                ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/25"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
          >
            {plan.name}
          </button>
        ))}
      </div>

      <div className="relative mt-6 min-h-[200px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={plans[active].id}
            role="tabpanel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-xl border p-6 ${
              plans[active].highlight
                ? "border-cyan-400/35 bg-gradient-to-br from-violet-600/10 to-cyan-500/5 shadow-lg shadow-cyan-500/10"
                : "border-violet-500/15 bg-white/3"
            }`}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-lg font-bold text-slate-100">
                {plans[active].name}
              </p>
              <p className="text-2xl font-bold tracking-tight text-cyan-400">
                {plans[active].price}
              </p>
            </div>
            {plans[active].subtitle ? (
              <p className="mt-1 text-sm text-slate-400">
                {plans[active].subtitle}
              </p>
            ) : null}
            <ul className="mt-4 space-y-2">
              {plans[active].bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500"
                    aria-hidden
                  />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6">
        <Link
          href={contactHref}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:brightness-110 sm:w-auto"
        >
          {ctaLabel}
        </Link>
      </div>
    </motion.section>
  );
}
