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

      {/* Hero */}
      <section className="relative px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]"
          >
            {t("hero.eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl md:text-5xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="mt-5 text-lg text-[var(--light-text-muted)] sm:text-xl"
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
              className="inline-flex items-center gap-2 rounded-full bg-[var(--light-primary)] px-8 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
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
              <div key={card.title} className="rounded-2xl border border-[var(--light-border)] bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--light-surface)] text-[var(--light-primary)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="mt-4 text-lg font-bold text-[var(--light-emphasis)]">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--light-text-muted)]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </ScrollSection>

      {/* Solution */}
      <ScrollSection className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-3xl">
            {t("solution.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--light-text-muted)]">
            {t("solution.intro")}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <div
              key={step}
              className="flex gap-4 rounded-xl border border-[var(--light-border)] bg-white p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--light-primary)] text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed text-[var(--light-text)]">
                {step}
              </p>
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* Proof */}
      <ScrollSection className="mx-auto mt-20 max-w-3xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[var(--light-border)] bg-white p-8">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-[var(--light-primary)]" aria-hidden />
            <h2 className="text-xl font-bold text-[var(--light-emphasis)]">{t("proof.title")}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--light-text)] sm:text-base">
            {t("proof.body")}
          </p>
        </div>
      </ScrollSection>

      {/* Pricing */}
      <ScrollSection className="mx-auto mt-20 max-w-2xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[var(--light-border)] bg-white p-8 text-center">
          <span className="inline-flex rounded-full border border-[var(--light-border)] bg-[var(--light-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
            {t("pricing.badge")}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-[var(--light-emphasis)]">
            {t("pricing.title")}
          </h2>
          <p className="mt-3 text-[var(--light-text-muted)]">{t("pricing.body")}</p>
        </div>
      </ScrollSection>

      {/* Form */}
      <ScrollSection
        id="copilot-form"
        className="mx-auto mt-20 max-w-xl scroll-mt-28 px-4 sm:px-6 sm:scroll-mt-32"
      >
        <div className="rounded-2xl border border-[var(--light-border)] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[var(--light-emphasis)]">{t("form.title")}</h2>
          <p className="mt-2 text-sm text-[var(--light-text-muted)]">{t("form.subtitle")}</p>

          {formStatus === "success" ? (
            <p
              className="mt-6 rounded-xl border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              role="status"
            >
              {t("form.success")}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="copilot-name"
                  className="block text-sm font-medium text-[var(--light-text)]"
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
                  className="mt-1.5 w-full rounded-xl border border-[var(--light-border)] bg-white px-4 py-3 text-[var(--light-text)] outline-none ring-[var(--light-primary)]/40 transition placeholder:text-[var(--light-text-muted)] focus:border-[var(--light-primary)] focus:ring-2 disabled:opacity-60"
                />
              </div>
              <div>
                <label
                  htmlFor="copilot-email"
                  className="block text-sm font-medium text-[var(--light-text)]"
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
                  className="mt-1.5 w-full rounded-xl border border-[var(--light-border)] bg-white px-4 py-3 text-[var(--light-text)] outline-none ring-[var(--light-primary)]/40 transition placeholder:text-[var(--light-text-muted)] focus:border-[var(--light-primary)] focus:ring-2 disabled:opacity-60"
                />
              </div>
              <div>
                <label
                  htmlFor="copilot-status"
                  className="block text-sm font-medium text-[var(--light-text)]"
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
                  className="mt-1.5 w-full rounded-xl border border-[var(--light-border)] bg-white px-4 py-3 text-[var(--light-text)] outline-none ring-[var(--light-primary)]/40 transition focus:border-[var(--light-primary)] focus:ring-2 disabled:opacity-60"
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
                className="w-full rounded-full bg-[var(--light-primary)] px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
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
