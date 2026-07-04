"use client";

import { useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  Check,
  FileWarning,
  Languages,
} from "lucide-react";

const PROBLEM_ICONS = [Languages, FileWarning, AlertTriangle] as const;

function ScrollSection({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function CopilotLtdPage() {
  const t = useTranslations("copilotLtd");
  const locale = useLocale();
  const problemCards = t.raw("problem.cards") as {
    title: string;
    description: string;
  }[];
  const steps = t.raw("solution.steps") as string[];
  const statusOptions = t.raw("form.statusOptions") as {
    value: string;
    label: string;
  }[];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !status) {
      setErrorMessage(t("form.errorRequired"));
      setFormStatus("error");
      return;
    }

    setFormStatus("loading");

    try {
      const res = await fetch("/api/copilot-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          status,
          locale,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setErrorMessage(data.error ?? t("form.errorGeneric"));
        setFormStatus("error");
        return;
      }

      setFormStatus("success");
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", {
          event_category: "copilot_ltd",
          event_label: "early_access_form",
        });
      }
      setName("");
      setEmail("");
      setStatus("");
    } catch {
      setErrorMessage(t("form.errorNetwork"));
      setFormStatus("error");
    }
  }

  return (
    <div className="relative overflow-hidden pb-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[#0a0a0f]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 top-0 -z-10 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/3 -z-10 h-80 w-80 rounded-full bg-cyan-400/15 blur-[80px]"
        aria-hidden
      />

      {/* Hero */}
      <section className="relative px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-xs font-semibold uppercase tracking-widest text-cyan-400"
          >
            {t("hero.eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="mt-5 text-lg text-slate-400 sm:text-xl"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="mt-8"
          >
            <a
              href="#copilot-form"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
            >
              {t("hero.cta")}
              <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <ScrollSection className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {problemCards.map((card, i) => {
            const Icon = PROBLEM_ICONS[i];
            return (
              <div key={card.title} className="glass-card rounded-2xl p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </ScrollSection>

      {/* Solution */}
      <ScrollSection className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t("solution.title")}
            </h2>
            <p className="mt-3 text-slate-400">{t("solution.intro")}</p>
          </div>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-violet-500/15 bg-white/3 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-slate-300">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </ScrollSection>

      {/* Proof */}
      <ScrollSection className="mx-auto mt-20 max-w-3xl px-4 sm:px-6">
        <div className="rounded-2xl border border-cyan-400/35 bg-gradient-to-br from-violet-600/10 to-cyan-500/5 p-8 shadow-lg shadow-cyan-500/10">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-cyan-400" aria-hidden />
            <h2 className="text-xl font-bold text-white">{t("proof.title")}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {t("proof.body")}
          </p>
        </div>
      </ScrollSection>

      {/* Pricing */}
      <ScrollSection className="mx-auto mt-20 max-w-2xl px-4 sm:px-6">
        <div className="glass-card rounded-2xl p-8 text-center">
          <span className="inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-300">
            {t("pricing.badge")}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-white">
            {t("pricing.title")}
          </h2>
          <p className="mt-3 text-slate-400">{t("pricing.body")}</p>
        </div>
      </ScrollSection>

      {/* Form */}
      <ScrollSection
        id="copilot-form"
        className="mx-auto mt-20 max-w-xl scroll-mt-28 px-4 sm:px-6 sm:scroll-mt-32"
      >
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white">{t("form.title")}</h2>
          <p className="mt-2 text-sm text-slate-400">{t("form.subtitle")}</p>

          {formStatus === "success" ? (
            <p
              className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
              role="status"
            >
              {t("form.success")}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="copilot-name"
                  className="block text-sm font-medium text-slate-300"
                >
                  {t("form.name")}
                </label>
                <input
                  id="copilot-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={formStatus === "loading"}
                  className="mt-1.5 w-full rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 disabled:opacity-60"
                />
              </div>
              <div>
                <label
                  htmlFor="copilot-email"
                  className="block text-sm font-medium text-slate-300"
                >
                  {t("form.email")}
                </label>
                <input
                  id="copilot-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formStatus === "loading"}
                  className="mt-1.5 w-full rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 disabled:opacity-60"
                />
              </div>
              <div>
                <label
                  htmlFor="copilot-status"
                  className="block text-sm font-medium text-slate-300"
                >
                  {t("form.statusLabel")}
                </label>
                <select
                  id="copilot-status"
                  name="status"
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={formStatus === "loading"}
                  className="mt-1.5 w-full rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 transition focus:border-violet-400 focus:ring-2 disabled:opacity-60"
                >
                  <option value="">{t("form.statusPlaceholder")}</option>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {formStatus === "error" && errorMessage ? (
                <p className="text-sm text-red-400" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:brightness-110 disabled:opacity-60"
              >
                {formStatus === "loading"
                  ? t("form.submitting")
                  : t("form.submit")}
              </button>
            </form>
          )}
        </div>
      </ScrollSection>
    </div>
  );
}
