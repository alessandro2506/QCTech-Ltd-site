"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Search } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  CAREER_AREAS,
  CAREER_COUNTRIES,
  CAREER_ENGAGEMENTS,
  CAREER_JOBS,
  CAREER_MODES,
  type CareerJob,
  type CareerLocale,
} from "@/lib/careers-data";

type FilterKey = "area" | "engagement" | "mode" | "country";

const FILTER_KEYS: FilterKey[] = ["area", "engagement", "mode", "country"];

const FILTER_OPTIONS: Record<FilterKey, readonly string[]> = {
  area: CAREER_AREAS,
  engagement: CAREER_ENGAGEMENTS,
  mode: CAREER_MODES,
  country: CAREER_COUNTRIES,
};

const FILTER_LABEL_KEYS: Record<FilterKey, string> = {
  area: "filterArea",
  engagement: "filterEngagement",
  mode: "filterMode",
  country: "filterCountry",
};

function jobMatches(
  job: CareerJob,
  locale: CareerLocale,
  q: string,
  filters: Record<FilterKey, string>,
): boolean {
  if (filters.area && job.area !== filters.area) return false;
  if (filters.engagement && job.engagement !== filters.engagement) return false;
  if (filters.mode && job.mode !== filters.mode) return false;
  if (
    filters.country &&
    !(job.countries as readonly string[]).includes(filters.country)
  )
    return false;
  if (q) {
    const c = job.content[locale];
    const haystack = [
      c.title,
      c.subtitle,
      c.summary,
      ...c.sections.flatMap((s) => (s.kind === "list" ? s.items : s.body)),
    ]
      .join(" ")
      .toLowerCase();
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.every((w) => haystack.includes(w))) return false;
  }
  return true;
}

export function CareersPortal() {
  const t = useTranslations("careers");
  const locale = useLocale() as CareerLocale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = (searchParams.get("q") ?? "").slice(0, 80);
  const filters = Object.fromEntries(
    FILTER_KEYS.map((k) => {
      const v = searchParams.get(k) ?? "";
      return [k, FILTER_OPTIONS[k].includes(v) ? v : ""];
    }),
  ) as Record<FilterKey, string>;

  const results = useMemo(
    () => CAREER_JOBS.filter((job) => jobMatches(job, locale, q, filters)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, q, filters.area, filters.engagement, filters.mode, filters.country],
  );

  function update(next: Partial<Record<FilterKey | "q", string>>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    const query = Object.fromEntries(params.entries());
    router.replace(
      { pathname: pathname as "/careers", query },
      { scroll: false },
    );
  }

  function reset() {
    router.replace({ pathname: pathname as "/careers" }, { scroll: false });
  }

  const hasFilters = !!q || FILTER_KEYS.some((k) => filters[k]);

  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-[var(--light-border)] bg-white p-4 sm:p-6">
        <label htmlFor="careers-q" className="sr-only">
          {t("list.searchLabel")}
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--light-text-muted)]"
            aria-hidden
          />
          <input
            id="careers-q"
            type="search"
            defaultValue={q}
            maxLength={80}
            placeholder={t("list.searchPlaceholder")}
            onChange={(e) => update({ q: e.target.value.trim() })}
            className="w-full rounded-xl border border-[var(--light-border)] bg-white py-3 pl-11 pr-4 text-[var(--light-text)] outline-none ring-[var(--light-primary)]/40 transition placeholder:text-[var(--light-text-muted)] focus:border-[var(--light-primary)] focus:ring-2"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FILTER_KEYS.map((key) => (
            <div key={key}>
              <label
                htmlFor={`careers-${key}`}
                className="block text-xs font-semibold uppercase tracking-widest text-[var(--light-text-muted)]"
              >
                {t(`list.${FILTER_LABEL_KEYS[key]}`)}
              </label>
              <select
                id={`careers-${key}`}
                value={filters[key]}
                onChange={(e) => update({ [key]: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[var(--light-border)] bg-white px-3 py-2.5 text-sm text-[var(--light-text)] outline-none ring-[var(--light-primary)]/40 transition focus:border-[var(--light-primary)] focus:ring-2"
              >
                <option value="">{t("list.all")}</option>
                {FILTER_OPTIONS[key].map((v) => (
                  <option key={v} value={v}>
                    {t(`values.${key}.${v}`)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--light-text-muted)]" aria-live="polite">
          {t("list.results", { count: results.length })}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={reset}
            className="text-sm font-semibold text-[var(--light-primary)] hover:underline"
          >
            {t("list.reset")}
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[var(--light-border)] bg-white p-8 text-center">
          <p className="text-lg font-bold text-[var(--light-emphasis)]">
            {t("list.emptyTitle")}
          </p>
          <p className="mt-2 text-sm text-[var(--light-text-muted)]">
            {t("list.emptyBody")}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex h-11 items-center rounded-full bg-[var(--light-primary)] px-5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {t("list.reset")}
          </button>
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {results.map((job) => {
            const c = job.content[locale];
            const tags = [
              t(`values.mode.${job.mode}`),
              t(`values.engagement.${job.engagement}`),
              t(`values.pay.${job.pay}`),
              job.countries.map((cc) => t(`values.country.${cc}`)).join(" · "),
            ];
            return (
              <li key={job.id}>
                <Link
                  href={{ pathname: "/careers/[slug]", params: { slug: c.slug } }}
                  className="group block rounded-2xl border border-[var(--light-border)] bg-white p-5 transition hover:border-[var(--light-primary)] sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
                    {t(`values.area.${job.area}`)}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-[var(--light-emphasis)]">
                    {c.title}
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-[var(--light-border)] bg-[var(--light-surface)] px-3 py-1 text-xs font-medium text-[var(--light-text)]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--light-text-muted)]">
                    {c.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--light-primary)]">
                    {t("list.viewJob")}
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
