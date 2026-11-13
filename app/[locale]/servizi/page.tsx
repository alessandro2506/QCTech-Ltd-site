import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { BedDouble, Building2, Code2, Search, ShoppingCart, Smartphone, Trophy, UtensilsCrossed, Wine } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { RelatedReading } from "@/components/related-reading";
import {
  SERVICE_CARD_THEMES,
  SERVICE_HASH,
  postsForServicesPage,
  postsForTheme,
} from "@/lib/related-posts";
import {
  ServiceSectorsTabs,
  type SectorTab,
} from "@/components/service-sectors-tabs";

const icons = [Code2, Smartphone, Search] as const;

type PastSector = { id: string; label: string; description: string };

const pastSectorIconMap: Record<string, React.ElementType> = {
  ristorazione: UtensilsCrossed,
  hotel: Building2,
  bb: BedDouble,
  sport: Trophy,
  finedining: Wine,
  fooddelivery: ShoppingCart,
};

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const loc = locale as "it" | "en";
  return {
    title: t("servicesTitle"),
    description: t("servicesDescription"),
    alternates: buildAlternates("/servizi", loc),
    openGraph: { url: buildAlternates("/servizi", loc).canonical as string },
  };
}

export default async function ServiziPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("servicesPage");
  const tBlog = await getTranslations("blog");
  const items = t.raw("items") as {
    title: string;
    points: string[];
  }[];
  const sectors = t.raw("sectors") as SectorTab[];
  const pastSectors = t.raw("pastSectors") as PastSector[];
  const pagePosts = postsForServicesPage(locale);

  return (
    <div className="pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--light-text-muted)]">{t("intro")}</p>

        <ServiceSectorsTabs
          eyebrow={t("sectorsEyebrow")}
          title={t("sectorsTitle")}
          intro={t("sectorsIntro")}
          tabs={sectors}
        />

        {/* Blocco B — Settori in cui abbiamo già operato */}
        <section className="mt-14" aria-labelledby="past-sectors-heading">
          <h2
            id="past-sectors-heading"
            className="text-xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-2xl"
          >
            {t("pastSectorsTitle")}
          </h2>
          <p className="mt-2 text-[var(--light-text-muted)]">{t("pastSectorsIntro")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {pastSectors.map((sector) => {
              const PastIcon = pastSectorIconMap[sector.id] ?? Building2;
              return (
                <div
                  key={sector.id}
                  className="rounded-2xl border border-[var(--light-border)] bg-white p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--light-surface)] text-[var(--light-primary)]">
                      <PastIcon className="h-5 w-5" aria-hidden />
                    </div>
                    <span className="text-sm font-semibold text-[var(--light-text)]">
                      {sector.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--light-text-muted)]">
                    {sector.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

          <div className="section-stack mt-14 grid sm:grid-cols-2">
          {items.map((s, i) => {
            const Icon = icons[i];
            const theme = SERVICE_CARD_THEMES[i];
            const cardPosts = theme ? postsForTheme(locale, theme, 3) : [];
            return (
              <article
                key={s.title}
                id={theme ? SERVICE_HASH[theme] : undefined}
                className="group scroll-mt-28 rounded-2xl border border-[var(--light-border)] bg-white p-8 transition hover:border-[var(--light-primary)]/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--light-surface)] text-[var(--light-primary)]">
                  <Icon className="h-7 w-7" aria-hidden />
                </div>
                <h2 className="mt-6 text-xl font-bold text-[var(--light-emphasis)]">
                  {s.title}
                </h2>
                <ul className="mt-4 space-y-3 text-[var(--light-text-muted)]">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm leading-relaxed">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--light-primary)]"
                        aria-hidden
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                {theme ? (
                  <RelatedReading
                    title={tBlog("furtherReading")}
                    posts={cardPosts}
                    locale={locale}
                    serviceTheme={theme}
                    compact
                  />
                ) : null}
              </article>
            );
          })}
        </div>

        <section
          id="richiedi-preventivo"
          className="mt-24 scroll-mt-28 rounded-2xl border border-[var(--light-border)] bg-[var(--light-surface)] p-8 sm:p-10"
          aria-labelledby="servizi-preventivo-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
            {t("quoteEyebrow")}
          </p>
          <h2
            id="servizi-preventivo-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-3xl"
          >
            {t("quoteTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--light-text-muted)]">{t("quoteBody")}</p>
          <div className="mx-auto mt-8 max-w-xl">
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </section>

        <RelatedReading
          title={tBlog("furtherReading")}
          posts={pagePosts}
          locale={locale}
        />
      </div>
    </div>
  );
}
