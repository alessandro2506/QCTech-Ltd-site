import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/app.config";
import { getPortfolioDetail } from "@/lib/portfolio-details";
import {
  isOwnPortfolio,
  isPortfolioId,
  PORTFOLIO_IDS,
  portfolioExternalUrl,
  portfolioSrc,
  type PortfolioId,
} from "@/lib/portfolio-sites";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return ["it", "en"].flatMap((locale) =>
    PORTFOLIO_IDS.map((slug) => ({ locale, slug })),
  );
}

function projectPath(locale: "it" | "en", slug: string): string {
  const segment = locale === "it" ? "progetti" : "projects";
  return `/${locale}/${segment}/${slug}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isPortfolioId(slug)) return {};
  const loc = locale as "it" | "en";
  const t = await getTranslations({ locale, namespace: "home.projects" });
  const title = t(`labels.${slug}`);
  const description = t("intro");
  const path = projectPath(loc, slug);

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}${path}`,
      languages: {
        it: `${siteConfig.url}${projectPath("it", slug)}`,
        en: `${siteConfig.url}${projectPath("en", slug)}`,
        "x-default": `${siteConfig.url}${projectPath("en", slug)}`,
      },
    },
    openGraph: { url: `${siteConfig.url}${path}` },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isPortfolioId(slug)) notFound();
  setRequestLocale(locale);

  const id = slug as PortfolioId;
  const t = await getTranslations("home.projects");
  const tNav = await getTranslations("nav");
  const label = t(`labels.${id}`);
  const detail = getPortfolioDetail(id, locale);
  const externalUrl = isOwnPortfolio(id) ? portfolioExternalUrl(id) : undefined;

  return (
    <div className="bg-[var(--light-bg)] pb-24 pt-28 sm:pt-32">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Image
          src={portfolioSrc(id)}
          alt={label}
          width={640}
          height={400}
          priority
          className="h-auto w-full rounded-2xl border border-[var(--light-border)] object-cover"
        />
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {label}
        </h1>
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--light-primary)]">
            {t("tagsLabel")}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {detail.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[var(--light-border)] bg-[var(--light-surface)] px-3 py-1 text-sm font-medium text-[var(--light-text)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--light-primary)]">
            {t("productLabel")}
          </h2>
          <p className="mt-2 text-[var(--light-text)]">{detail.product}</p>
        </section>
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--light-primary)]">
            {t("clientLabel")}
          </h2>
          <p className="mt-2 text-[var(--light-text)]">{detail.client}</p>
        </section>
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--light-primary)]">
            {t("descriptionLabel")}
          </h2>
          <p className="mt-2 text-[var(--light-text-muted)] leading-relaxed">
            {detail.description}
          </p>
        </section>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contatti"
            className="inline-flex h-11 items-center rounded-full bg-[var(--light-primary)] px-5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {tNav("quote")}
          </Link>
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-full border border-[var(--light-border)] bg-white px-5 text-sm font-semibold text-[var(--light-text)] transition hover:border-[var(--light-primary)]"
            >
              {t("visitSite")}
            </a>
          ) : null}
        </div>
        <p className="mt-8">
          <Link
            href="/progetti"
            className="text-sm font-semibold text-[var(--light-primary)] hover:underline"
          >
            {t("allLink")}
          </Link>
        </p>
      </article>
    </div>
  );
}
