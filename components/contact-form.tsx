"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CONTACT_TOPICS,
  type ContactTopic,
  isContactTopic,
} from "@/lib/contact";
import {
  formatPlanMessageBlock,
  type PlanForMessage,
} from "@/lib/format-plan-message";

type Props = {
  defaultTopic?: string;
  defaultPlan?: string;
  /** Id piano da query (?plan=) risolto lato server per evitare hydration mismatch. */
  initialPlanId?: string;
  defaultSection?: string;
};

function topicNeedsPlan(topic: ContactTopic | ""): boolean {
  return topic === "web" || topic === "mobile" || topic === "ecommerce" || topic === "presence";
}

export function ContactForm({
  defaultTopic = "",
  defaultPlan = "",
  initialPlanId = "",
  defaultSection = "",
}: Props) {
  const t = useTranslations("contactForm");
  const tWeb = useTranslations("pricingWeb");
  const tMob = useTranslations("pricingMobile");
  const tEco = useTranslations("pricingEcommerce");
  const tPres = useTranslations("pricingPresence");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [topic, setTopic] = useState<ContactTopic | "">(() =>
    isContactTopic(defaultTopic) ? defaultTopic : "",
  );
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messageExtra, setMessageExtra] = useState("");
  const [messageOther, setMessageOther] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const pricingPlans = useMemo((): PlanForMessage[] => {
    if (topic === "web")
      return (tWeb.raw("plans") as PlanForMessage[]) ?? [];
    if (topic === "mobile")
      return (tMob.raw("plans") as PlanForMessage[]) ?? [];
    if (topic === "ecommerce")
      return (tEco.raw("plans") as PlanForMessage[]) ?? [];
    if (topic === "presence")
      return (tPres.raw("plans") as PlanForMessage[]) ?? [];
    return [];
  }, [topic, tWeb, tMob, tEco, tPres]);

  const selectedPlan = useMemo(
    () => pricingPlans.find((p) => p.id === selectedPlanId),
    [pricingPlans, selectedPlanId],
  );

  const planBlock = useMemo(
    () => (selectedPlan ? formatPlanMessageBlock(selectedPlan) : ""),
    [selectedPlan],
  );

  const composedMessage = useMemo(() => {
    if (topicNeedsPlan(topic)) {
      const extra = messageExtra.trim();
      if (!planBlock) return extra;
      return extra ? `${planBlock}\n\n${extra}` : planBlock;
    }
    return messageOther;
  }, [topic, planBlock, messageExtra, messageOther]);

  const topicOptions = useMemo(
    () => [
      { value: "" as const, label: t("topicPlaceholder") },
      ...CONTACT_TOPICS.map((value) => ({
        value,
        label: t(
          value === "web"
            ? "topicWeb"
            : value === "mobile"
              ? "topicMobile"
              : value === "ecommerce"
                ? "topicEcommerce"
                : value === "presence"
                  ? "topicPresence"
                  : "topicOther",
        ),
      })),
    ],
    [t],
  );

  const planLabel = useMemo(() => defaultPlan.trim(), [defaultPlan]);
  const sectionLabel = useMemo(() => defaultSection.trim(), [defaultSection]);
  const visiblePlanLabel = selectedPlan?.name ?? planLabel;
  const hasSelectedTopic = topic !== "" && isContactTopic(topic);
  const currentTopicLabel = useMemo(() => {
    if (topic === "web") return t("topicWeb");
    if (topic === "mobile") return t("topicMobile");
    if (topic === "ecommerce") return t("topicEcommerce");
    if (topic === "other") return t("topicOther");
    return "";
  }, [topic, t]);

  const showPlanSelect = topicNeedsPlan(topic) && pricingPlans.length > 0;

  function syncContactQuery(params: {
    topic?: string;
    plan?: string;
    section?: string;
  }) {
    const next = new URLSearchParams(searchParams.toString());
    if (params.topic) next.set("topic", params.topic);
    else next.delete("topic");
    if (params.plan) next.set("plan", params.plan);
    else next.delete("plan");
    if (params.section) next.set("section", params.section);
    else next.delete("section");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic || !isContactTopic(topic)) {
      setErrorMessage(t("errorTopic"));
      setStatus("error");
      return;
    }
    if (!topicNeedsPlan(topic) && !messageOther.trim()) {
      setErrorMessage(t("errorMessageEmpty"));
      setStatus("error");
      return;
    }

    const msg = composedMessage.trim();
    if (!msg) {
      setErrorMessage(t("errorMessageEmpty"));
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          topic,
          message: msg,
          plan: selectedPlan?.name ?? planLabel,
          section: sectionLabel,
          locale,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setErrorMessage(data.error ?? t("errorGeneric"));
        setStatus("error");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessageExtra("");
      setMessageOther("");
      setSelectedPlanId("");
      setTopic(isContactTopic(defaultTopic) ? defaultTopic : "");
    } catch {
      setErrorMessage(t("errorNetwork"));
      setStatus("error");
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
      onSubmit={onSubmit}
    >
      {hasSelectedTopic ? (
        <div
          className="rounded-xl border border-cyan-500/25 bg-cyan-500/8 px-4 py-3 text-sm text-slate-300"
          role="status"
        >
          <span className="font-semibold text-slate-100">{t("quoteBanner")}</span>{" "}
          {t("topicWord")} <strong>{currentTopicLabel}</strong>
          {visiblePlanLabel ? (
            <>
              {" · "}
              {t("planWord")} <strong>{visiblePlanLabel}</strong>
            </>
          ) : null}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-300"
        >
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "loading"}
          className="mt-1.5 w-full rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-slate-100 shadow-sm outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 disabled:opacity-60"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-300"
        >
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="mt-1.5 w-full rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-slate-100 shadow-sm outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 disabled:opacity-60"
        />
      </div>
      <div>
        <label
          htmlFor="topic"
          className="block text-sm font-medium text-slate-300"
        >
          {t("topic")}
        </label>
        <select
          id="topic"
          name="topic"
          required
          value={topic}
          onChange={(e) => {
            const v = e.target.value;
            const nextTopic = v === "" ? "" : isContactTopic(v) ? v : "";
            setTopic(nextTopic);
            setSelectedPlanId("");
            setStatus("idle");
            setErrorMessage("");
            syncContactQuery({ topic: nextTopic || undefined });
          }}
          disabled={status === "loading"}
          className="mt-1.5 w-full rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-slate-100 shadow-sm outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 disabled:opacity-60"
        >
          {topicOptions.map((opt) => (
            <option key={opt.value || "empty"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {showPlanSelect ? (
        <div>
          <label
            htmlFor="contact-plan"
            className="block text-sm font-medium text-slate-300"
          >
            {t("selectPlan")}
          </label>
          <select
            id="contact-plan"
            name="plan"
            value={selectedPlanId}
            onChange={(e) => {
              const nextPlanId = e.target.value;
              const nextPlanName =
                pricingPlans.find((p) => p.id === nextPlanId)?.name ?? "";
              setSelectedPlanId(nextPlanId);
              setStatus("idle");
              setErrorMessage("");
              syncContactQuery({
                topic: topic || undefined,
                plan: nextPlanName || undefined,
              });
            }}
            disabled={status === "loading"}
            className="mt-1.5 w-full rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-slate-100 shadow-sm outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 disabled:opacity-60"
          >
            <option value="">{t("selectPlanPlaceholder")}</option>
            {pricingPlans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {topicNeedsPlan(topic) ? (
        <div>
          <span className="block text-sm font-medium text-slate-300">
            {t("message")}
          </span>
          <div className="mt-1.5 overflow-hidden rounded-xl border border-violet-500/20 bg-white/5 ring-violet-500/40 focus-within:ring-2">
            {planBlock ? (
              <div className="border-b border-violet-500/15 bg-violet-500/5 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                  {t("messagePlanIncluded")}
                </p>
                <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm font-semibold leading-relaxed text-slate-200">
                  {planBlock}
                </pre>
              </div>
            ) : null}
            <label htmlFor="message-extra" className="sr-only">
              {t("messageDetailsLabel")}
            </label>
            <textarea
              id="message-extra"
              name="messageExtra"
              rows={4}
              value={messageExtra}
              onChange={(e) => setMessageExtra(e.target.value)}
              disabled={status === "loading"}
              placeholder={t("messagePlaceholder")}
              className="w-full resize-y border-0 bg-transparent px-4 py-3 text-sm text-slate-200 outline-none ring-0 placeholder:text-slate-600 focus:ring-0 disabled:opacity-60"
            />
          </div>
        </div>
      ) : (
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-slate-300"
          >
            {t("message")}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={messageOther}
            onChange={(e) => setMessageOther(e.target.value)}
            disabled={status === "loading"}
            className="mt-1.5 w-full resize-y rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-slate-100 shadow-sm outline-none ring-violet-500/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 disabled:opacity-60"
            placeholder={t("messagePlaceholder")}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "loading" ? t("submitting") : t("submit")}
      </button>

      {status === "success" ? (
        <p className="text-sm font-medium text-cyan-400" role="status">
          {t("success")}
        </p>
      ) : null}
      {status === "error" && errorMessage ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </motion.form>
  );
}
