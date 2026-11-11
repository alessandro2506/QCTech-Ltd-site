import { projects } from "@/lib/projects-data";

export const PORTFOLIO_IDS = [
  "quipalermo",
  "alvenco",
  "hotel-boutique",
  "noleggio-con-conducente",
  "bed-and-breakfast",
  "manutenzione-uk",
  "traslochi",
  "studio-legale-uk-demo",
  "ecommerce-demo",
  "consulenza-tributaria",
  "consulenza-del-lavoro",
  "educazione-cinofila",
  "ambulatorio-veterinario",
  "centro-cinofilo-demo",
] as const;

export type PortfolioId = (typeof PORTFOLIO_IDS)[number];

/** Home: our two properties plus four sector samples. */
export const HOME_PORTFOLIO_IDS: readonly PortfolioId[] = [
  "quipalermo",
  "alvenco",
  "hotel-boutique",
  "bed-and-breakfast",
  "ecommerce-demo",
  "manutenzione-uk",
];

const QUI_URL = projects.find((item) => item.id === "quipalermo")?.externalUrl;
const ALVENCO_URL = "https://alvenco.it";

export function portfolioSrc(id: PortfolioId): string {
  return `/portfolio/${id}.webp`;
}

export function portfolioHref(id: PortfolioId): string | undefined {
  switch (id) {
    case "quipalermo":
      return QUI_URL;
    case "alvenco":
      return ALVENCO_URL;
    case "hotel-boutique":
    case "noleggio-con-conducente":
    case "bed-and-breakfast":
    case "manutenzione-uk":
    case "traslochi":
    case "studio-legale-uk-demo":
    case "ecommerce-demo":
    case "consulenza-tributaria":
    case "consulenza-del-lavoro":
    case "educazione-cinofila":
    case "ambulatorio-veterinario":
    case "centro-cinofilo-demo":
      return undefined;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
