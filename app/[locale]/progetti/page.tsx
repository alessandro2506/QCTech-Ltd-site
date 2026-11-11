import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProjectsGrid } from "@/components/projects-grid";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { PORTFOLIO_IDS, type PortfolioId } from "@/lib/portfolio-sites";
import { buildAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isIt = locale === "it";
  const loc = locale as "it" | "en";

  return {
    title: isIt ? "I Nostri Progetti" : "Our Projects",
    description: isIt
      ? "Portali civici, app mobile e piattaforme digitali sviluppate da QC Tech per comunità italiane e britanniche."
      : "Civic portals, mobile apps and digital platforms developed by QC Tech for Italian and British communities.",
    alternates: buildAlternates("/progetti", loc),
    openGraph: { url: buildAlternates("/progetti", loc).canonical as string },
  };
}

export default async function ProgettiPage({ params }: PageProps) {
  const { locale } = await params;
  const isIt = locale === "it";
  const t = await getTranslations("home.projects");
  const labels = Object.fromEntries(
    PORTFOLIO_IDS.map((id) => [id, t(`labels.${id}`)]),
  ) as Record<PortfolioId, string>;

  return (
    <div className="bg-[var(--light-bg)] pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
          {isIt ? "Portfolio" : "Portfolio"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--light-text)] sm:text-4xl">
          {isIt ? "I Nostri Progetti" : "Our Projects"}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--light-text-muted)]">
          {isIt
            ? "Portali civici, app mobile e piattaforme digitali che portiamo in produzione per comunità italiane e britanniche."
            : "Civic portals, mobile apps and digital platforms we build for Italian and British communities."}
        </p>
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--light-emphasis)]">
            {t("realizedTitle")}
          </h2>
          <div className="mt-6">
            <PortfolioGallery scope="all" labels={labels} />
          </div>
        </section>
        <div className="mt-16">
          <ProjectsGrid locale={locale} />
        </div>
      </div>
    </div>
  );
}
