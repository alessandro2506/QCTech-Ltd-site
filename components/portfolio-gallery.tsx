import Image from "next/image";
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

export function PortfolioGallery({ scope, labels }: Props) {
  const ids = scope === "home" ? HOME_PORTFOLIO_IDS : PORTFOLIO_IDS;

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <p className="mt-2 text-sm font-medium text-[var(--light-text)]">
                {label}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
