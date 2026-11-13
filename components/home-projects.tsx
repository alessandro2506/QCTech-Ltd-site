import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import type { PortfolioId } from "@/lib/portfolio-sites";
import { PORTFOLIO_IDS } from "@/lib/portfolio-sites";

export async function HomeProjects() {
  const t = await getTranslations("home.projects");
  const labels = Object.fromEntries(
    PORTFOLIO_IDS.map((id) => [id, t(`labels.${id}`)]),
  ) as Record<PortfolioId, string>;

  return (
    <section
      id="progetti"
      className="scroll-mt-24 bg-[var(--light-bg)] py-16 sm:scroll-mt-28 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--light-text-muted)]">
          {t("intro")}
        </p>
        <div className="mt-10">
          <PortfolioGallery scope="home" labels={labels} />
        </div>
        <p className="mt-8">
          <Link
            href="/progetti"
            className="font-semibold text-[var(--light-primary)] hover:underline"
          >
            {t("allLink")}
          </Link>
        </p>
      </div>
    </section>
  );
}
