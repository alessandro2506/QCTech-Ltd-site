import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { siteConfig } from "@/app.config";
import { Link } from "@/i18n/routing";
import {
  LANDING_PAGES,
  findLandingPage,
  type LandingLocale,
} from "@/lib/landing-pages";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return (["it", "en"] as const).flatMap((locale) =>
    LANDING_PAGES.map((p) => ({ locale, slug: p.slug })),
  );
}

function pagePath(locale: LandingLocale, slug: string): string {
  return `/${locale}/${locale === "it" ? "siti-web" : "web-design"}/${slug}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = findLandingPage(slug);
  if (!page) return {};
  const loc = locale as LandingLocale;
  const c = page.content[loc];
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDescription,
    alternates: {
      canonical: `${siteConfig.url}${pagePath(loc, slug)}`,
      languages: {
        en: `${siteConfig.url}${pagePath("en", slug)}`,
        it: `${siteConfig.url}${pagePath("it", slug)}`,
        "x-default": `${siteConfig.url}${pagePath("en", slug)}`,
      },
    },
    openGraph: { url: `${siteConfig.url}${pagePath(loc, slug)}` },
  };
}

const LABEL =
  "text-sm font-semibold uppercase tracking-widest text-[var(--light-primary)]";

export default async function LandingPageRoute({ params }: PageProps) {
  const { locale, slug } = await params;
  const page = findLandingPage(slug);
  if (!page) notFound();
  setRequestLocale(locale);
  const loc = locale as LandingLocale;
  const c = page.content[loc];
  const cta = loc === "it" ? "Richiedi un preventivo" : "Request a quote";
  const seeProject = loc === "it" ? "Vedi il progetto" : "See the project";

  return (
    <div className="page-top bg-[var(--light-bg)] pb-24">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className={LABEL}>{c.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {c.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--light-text-muted)]">
          {c.intro}
        </p>
        <Link
          href="/contatti"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--light-primary)] px-6 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>

        <section className="mt-12">
          <h2 className={LABEL}>{c.forWhoTitle}</h2>
          <ul className="mt-4 space-y-3">
            {c.forWho.map((item) => (
              <li key={item} className="flex gap-3 text-[var(--light-text)]">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--light-primary)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className={LABEL}>{c.offerTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {c.offer.map((o) => (
              <li
                key={o.name}
                className="rounded-2xl border border-[var(--light-border)] bg-white p-5"
              >
                <p className="text-sm font-semibold text-[var(--light-text)]">{o.name}</p>
                <p className="mt-1 text-xl font-bold text-[var(--light-emphasis)]">{o.price}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--light-text-muted)]">{o.note}</p>
              </li>
            ))}
          </ul>
        </section>

        {c.cases?.length ? (
          <section className="mt-12">
            <h2 className={LABEL}>{loc === "it" ? "Lavori nel Regno Unito" : "Work in the UK"}</h2>
            <ul className="mt-4 space-y-4">
              {c.cases.map((cs) => (
                <li
                  key={cs.portfolioId}
                  className="rounded-2xl border border-[var(--light-border)] bg-white p-5"
                >
                  <p className="font-semibold text-[var(--light-emphasis)]">{cs.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--light-text-muted)]">{cs.body}</p>
                  <Link
                    href={{ pathname: "/progetti/[slug]", params: { slug: cs.portfolioId } }}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--light-primary)] hover:underline"
                  >
                    {seeProject}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12">
          <h2 className={LABEL}>{c.stepsTitle}</h2>
          <ol className="mt-4 space-y-3">
            {c.steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-[var(--light-text)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--light-primary)] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className={LABEL}>{c.faqTitle}</h2>
          <dl className="mt-4 space-y-5">
            {c.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-[var(--light-emphasis)]">{f.q}</dt>
                <dd className="mt-1 leading-relaxed text-[var(--light-text-muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14 rounded-2xl border border-[var(--light-border)] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[var(--light-emphasis)]">{c.ctaTitle}</h2>
          <p className="mt-2 text-[var(--light-text-muted)]">{c.ctaBody}</p>
          <Link
            href="/contatti"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--light-primary)] px-6 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: c.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </article>
    </div>
  );
}
