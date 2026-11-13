import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  HOME_PORTFOLIO_IDS,
  PORTFOLIO_IDS,
  portfolioSrc,
  type PortfolioId,
} from "@/lib/portfolio-sites";

type Props = {
  scope: "home" | "all";
  labels: Record<PortfolioId, string>;
};

export async function PortfolioGallery({ scope, labels }: Props) {
  const t = await getTranslations("home.projects");
  const ids = scope === "home" ? HOME_PORTFOLIO_IDS : PORTFOLIO_IDS;

  return (
    <ul className="section-stack grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {ids.map((id, index) => {
        const label = labels[id];

        return (
          <li key={id}>
            <Link
              href={{ pathname: "/progetti/[slug]", params: { slug: id } }}
              className="block"
            >
              <Image
                src={portfolioSrc(id)}
                alt={label}
                width={640}
                height={400}
                loading={index < 3 ? "eager" : "lazy"}
                className="h-auto w-full rounded-lg object-cover"
              />
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--light-text)]">
                <span>{label}</span>
                {id === "quipalermo" ? (
                  <span className="inline-flex rounded-full border border-[var(--light-border)] bg-[var(--light-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
                    {t("ownProductBadge")}
                  </span>
                ) : null}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
