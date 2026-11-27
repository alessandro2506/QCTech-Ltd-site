import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/app.config";
import { CareersApplyForm } from "@/components/careers-apply-form";
import { Link, redirect } from "@/i18n/routing";
import {
  CAREER_JOBS,
  findJobBySlug,
  type CareerLocale,
} from "@/lib/careers-data";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return (["it", "en"] as const).flatMap((locale) =>
    CAREER_JOBS.map((job) => ({ locale, slug: job.content[locale].slug })),
  );
}

function jobPath(locale: CareerLocale, slug: string): string {
  const segment = locale === "it" ? "lavora-con-noi" : "careers";
  return `/${locale}/${segment}/${slug}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const found = findJobBySlug(slug);
  if (!found || found.locale !== locale) return {};
  const loc = locale as CareerLocale;
  const t = await getTranslations({ locale, namespace: "careers.meta" });
  const c = found.job.content[loc];
  const itPath = jobPath("it", found.job.content.it.slug);
  const enPath = jobPath("en", found.job.content.en.slug);

  return {
    title: `${c.title} | ${t("jobDescriptionSuffix")}`,
    description: c.subtitle,
    alternates: {
      canonical: `${siteConfig.url}${jobPath(loc, c.slug)}`,
      languages: {
        it: `${siteConfig.url}${itPath}`,
        en: `${siteConfig.url}${enPath}`,
        "x-default": `${siteConfig.url}${enPath}`,
      },
    },
    openGraph: { url: `${siteConfig.url}${jobPath(loc, c.slug)}` },
  };
}

export default async function CareerJobPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const found = findJobBySlug(slug);
  if (!found) notFound();
  const loc = locale as CareerLocale;

  if (found.locale !== loc) {
    redirect({
      href: {
        pathname: "/careers/[slug]",
        params: { slug: found.job.content[loc].slug },
      },
      locale: loc,
    });
  }

  setRequestLocale(locale);
  const t = await getTranslations("careers");
  const { job } = found;
  const c = job.content[loc];

  const details: [string, string][] = [
    [t("job.detailArea"), t(`values.area.${job.area}`)],
    [t("job.detailEngagement"), t(`values.engagement.${job.engagement}`)],
    [t("job.detailPay"), t(`values.pay.${job.pay}`)],
    [t("job.detailMode"), t(`values.mode.${job.mode}`)],
    [
      t("job.detailCountries"),
      job.countries.map((cc) => t(`values.country.${cc}`)).join(", "),
    ],
    [
      t("job.detailLanguages"),
      job.languages.map((l) => t(`values.language.${l}`)).join(", "),
    ],
  ];

  return (
    <div className="page-top bg-[var(--light-bg)] pb-24">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/careers"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--light-primary)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("job.back")}
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
          {t(`values.area.${job.area}`)}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {c.title}
        </h1>
        <p className="mt-3 text-[var(--light-text-muted)]">{c.subtitle}</p>

        <a
          href="#candidatura"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-[var(--light-primary)] px-6 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {t("job.applyCta")}
        </a>

        <section
          aria-label={t("job.details")}
          className="mt-10 rounded-2xl border border-[var(--light-border)] bg-white p-5 sm:p-6"
        >
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--light-text-muted)]">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-[var(--light-text)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-10 space-y-10">
          {c.sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--light-primary)]">
                {s.title}
              </h2>
              {s.kind === "text" ? (
                s.body.map((p) => (
                  <p
                    key={p.slice(0, 32)}
                    className="mt-3 leading-relaxed text-[var(--light-text)]"
                  >
                    {p}
                  </p>
                ))
              ) : (
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-[var(--light-text)]">
                  {s.items.map((it) => (
                    <li key={it.slice(0, 32)}>{it}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm italic text-[var(--light-text-muted)]">
          {c.closing}
        </p>

        <section
          id="candidatura"
          className="mt-12 scroll-mt-28 rounded-2xl border border-[var(--light-border)] bg-white p-5 sm:p-8"
        >
          <CareersApplyForm jobId={job.id} jobTitle={c.title} />
        </section>

        <section
          id="informativa"
          className="mt-8 scroll-mt-28 text-sm leading-relaxed text-[var(--light-text-muted)]"
        >
          <h2 className="font-semibold text-[var(--light-text)]">
            {t("form.privacyTitle")}
          </h2>
          <p className="mt-2">{t("form.privacyBody")}</p>
          <p className="mt-2">
            <Link
              href="/privacy"
              className="font-semibold text-[var(--light-primary)] hover:underline"
            >
              {t("form.privacyPolicyLink")}
            </Link>
          </p>
        </section>
      </article>
    </div>
  );
}
