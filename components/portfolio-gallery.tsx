import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  HOME_PORTFOLIO_IDS,
  PORTFOLIO_IDS,
  isOwnPortfolio,
  portfolioSrc,
  type PortfolioId,
} from "@/lib/portfolio-sites";

type Props = {
  scope: "home" | "all";
  labels: Record<PortfolioId, string>;
};

/** Solo siti realizzati: i prodotti QC Tech stanno in una sezione a parte. */
export function PortfolioGallery({ scope, labels }: Props) {
  const ids = (scope === "home" ? HOME_PORTFOLIO_IDS : PORTFOLIO_IDS).filter(
    (id) => !isOwnPortfolio(id),
  );

  return (
    <ul className="section-stack grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {ids.map((id, index) => {
        const label = labels[id];

        return (
          <li key={id}>
            <Link
              href={{ pathname: "/progetti/[slug]", params: { slug: id } }}
              className="group block h-full rounded-2xl border border-[var(--light-border)] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--light-primary)] hover:shadow-md"
            >
              <p className="mb-3 rounded-lg border-l-4 border-[var(--light-primary)] bg-[color-mix(in_srgb,var(--light-primary)_8%,white)] px-3 py-2 text-[0.95rem] font-medium text-[var(--light-emphasis)]">
                {label}
              </p>
              <Image
                src={portfolioSrc(id)}
                alt={label}
                width={640}
                height={400}
                loading={index < 3 ? "eager" : "lazy"}
                className="h-auto w-full rounded-lg object-cover"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
