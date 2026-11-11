import Image from "next/image";
import {
  HOME_PORTFOLIO_IDS,
  PORTFOLIO_IDS,
  portfolioHref,
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
        const href = portfolioHref(id);
        const image = (
          <Image
            src={portfolioSrc(id)}
            alt={label}
            width={640}
            height={400}
            loading={index < 3 ? "eager" : "lazy"}
            className="h-auto w-full rounded-lg object-cover"
          />
        );

        return (
          <li key={id}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {image}
                <p className="mt-2 text-sm font-medium text-[var(--light-text)]">
                  {label}
                </p>
              </a>
            ) : (
              <figure>
                {image}
                <figcaption className="mt-2 text-sm font-medium text-[var(--light-text)]">
                  {label}
                </figcaption>
              </figure>
            )}
          </li>
        );
      })}
    </ul>
  );
}
