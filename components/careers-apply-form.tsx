"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CAREER_COUNTRIES } from "@/lib/careers-data";

const INPUT =
  "mt-1.5 w-full rounded-xl border border-[var(--light-border)] bg-white px-4 py-3 text-[var(--light-text)] outline-none ring-[var(--light-primary)]/40 transition placeholder:text-[var(--light-text-muted)] focus:border-[var(--light-primary)] focus:ring-2 disabled:opacity-60";
const LABEL = "block text-sm font-medium text-[var(--light-text)]";
const HINT = "mt-1 text-xs text-[var(--light-text-muted)]";

const LANG_OPTIONS = ["it", "en", "both"] as const;
const EXP_OPTIONS = ["none", "lt3", "gte3"] as const;

type Fields = {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  languages: string;
  experience: string;
  network: string;
  link: string;
  website: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  languages: "",
  experience: "",
  network: "",
  link: "",
  website: "",
};

export function CareersApplyForm({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const t = useTranslations("careers");
  const locale = useLocale();
  const [f, setF] = useState<Fields>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const busy = status === "loading";

  function set<K extends keyof Fields>(k: K, v: string) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (
      !f.name.trim() ||
      !f.email.trim() ||
      !f.country ||
      !f.languages ||
      !f.experience ||
      !f.network.trim()
    ) {
      setError(t("form.errorRequired"));
      setStatus("error");
      return;
    }
    if (f.link.trim() && !/^https:\/\/\S+$/i.test(f.link.trim())) {
      setError(t("form.errorLink"));
      setStatus("error");
      return;
    }
    if (!consent) {
      setError(t("form.errorConsent"));
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/careers-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          name: f.name.trim(),
          email: f.email.trim(),
          phone: f.phone.trim(),
          country: f.country,
          city: f.city.trim(),
          languages: f.languages,
          experience: f.experience,
          network: f.network.trim(),
          link: f.link.trim(),
          website: f.website,
          locale,
          consent: true,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? t("form.errorGeneric"));
        setStatus("error");
        return;
      }
      setStatus("success");
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", {
          event_category: "careers",
          event_label: jobId,
        });
      }
      setF(EMPTY);
      setConsent(false);
    } catch {
      setError(t("form.errorNetwork"));
      setStatus("error");
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--light-emphasis)]">
        {t("form.title")} — {jobTitle}
      </h2>
      <p className="mt-2 text-sm text-[var(--light-text-muted)]">
        {t("form.subtitle")}
      </p>

      {status === "success" ? (
        <p
          className="mt-6 rounded-xl border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          {t("form.success")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {/* Honeypot: invisibile agli utenti, compilato solo dai bot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="careers-website">Website</label>
            <input
              id="careers-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={f.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="careers-name" className={LABEL}>
                {t("form.name")}
              </label>
              <input
                id="careers-name"
                type="text"
                required
                maxLength={200}
                autoComplete="name"
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                disabled={busy}
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="careers-email" className={LABEL}>
                {t("form.email")}
              </label>
              <input
                id="careers-email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={f.email}
                onChange={(e) => set("email", e.target.value)}
                disabled={busy}
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="careers-phone" className={LABEL}>
                {t("form.phone")}
              </label>
              <input
                id="careers-phone"
                type="tel"
                maxLength={40}
                autoComplete="tel"
                value={f.phone}
                onChange={(e) => set("phone", e.target.value)}
                disabled={busy}
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="careers-country" className={LABEL}>
                {t("form.country")}
              </label>
              <select
                id="careers-country"
                required
                value={f.country}
                onChange={(e) => set("country", e.target.value)}
                disabled={busy}
                className={INPUT}
              >
                <option value="">{t("form.countryPlaceholder")}</option>
                {CAREER_COUNTRIES.map((cc) => (
                  <option key={cc} value={cc}>
                    {t(`values.country.${cc}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="careers-city" className={LABEL}>
                {t("form.city")}
              </label>
              <input
                id="careers-city"
                type="text"
                maxLength={100}
                autoComplete="address-level2"
                value={f.city}
                onChange={(e) => set("city", e.target.value)}
                disabled={busy}
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="careers-languages" className={LABEL}>
                {t("form.languages")}
              </label>
              <select
                id="careers-languages"
                required
                value={f.languages}
                onChange={(e) => set("languages", e.target.value)}
                disabled={busy}
                className={INPUT}
              >
                <option value="">{t("form.languagesPlaceholder")}</option>
                {LANG_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {t(`form.languagesOptions.${v}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="careers-experience" className={LABEL}>
              {t("form.experience")}
            </label>
            <select
              id="careers-experience"
              required
              value={f.experience}
              onChange={(e) => set("experience", e.target.value)}
              disabled={busy}
              className={INPUT}
            >
              <option value="">{t("form.experiencePlaceholder")}</option>
              {EXP_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {t(`form.experienceOptions.${v}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="careers-network" className={LABEL}>
              {t("form.network")}
            </label>
            <textarea
              id="careers-network"
              required
              rows={5}
              maxLength={1000}
              value={f.network}
              onChange={(e) => set("network", e.target.value)}
              disabled={busy}
              className={INPUT}
            />
            <p className={HINT}>{t("form.networkHint")}</p>
          </div>

          <div>
            <label htmlFor="careers-link" className={LABEL}>
              {t("form.link")}
            </label>
            <input
              id="careers-link"
              type="url"
              maxLength={300}
              placeholder="https://"
              value={f.link}
              onChange={(e) => set("link", e.target.value)}
              disabled={busy}
              className={INPUT}
            />
            <p className={HINT}>{t("form.linkHint")}</p>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="careers-consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={busy}
              className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--light-border)] accent-[var(--light-primary)]"
            />
            <label
              htmlFor="careers-consent"
              className="text-sm leading-relaxed text-[var(--light-text)]"
            >
              {t("form.consentBefore")}
              <a
                href="#informativa"
                className="font-medium text-[var(--light-primary)] underline underline-offset-2"
              >
                {t("form.consentLink")}
              </a>
              {t("form.consentAfter")}
            </label>
          </div>

          {status === "error" && error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-[var(--light-primary)] px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? t("form.submitting") : t("form.submit")}
          </button>
        </form>
      )}
    </div>
  );
}
