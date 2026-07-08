export type ProjectStatusType = "live" | "development" | "coming";

export type ProjectItem = {
  id: string;
  name: string;
  logo: string;
  logoWidth?: number;
  logoHeight?: number;
  descriptionIt: string;
  descriptionEn: string;
  statusIt: string;
  statusEn: string;
  statusType: ProjectStatusType;
  externalUrl?: string;
};

export const projects: ProjectItem[] = [
  {
    id: "quipalermo",
    name: "QuiPalermo",
    logo: "/nostri-progetti/Loghi/QuiPalermo/qui-palermo-dark.svg",
    descriptionIt:
      "Portale civico iperlocale per Palermo — eventi, mappa interattiva, directory attività e news in tempo reale. Il primo progetto della serie Qui[Città].",
    descriptionEn:
      "Hyperlocal civic portal for Palermo — events, interactive map, business directory and real-time news. First project in the Qui[City] series.",
    statusIt: "Live",
    statusEn: "Live",
    statusType: "live",
    externalUrl: "https://www.quipalermo.it",
  },
  {
    id: "cittachiara",
    name: "Città Chiara",
    logo: "/nostri-progetti/Loghi/CittaChiara/icon.png",
    logoWidth: 48,
    logoHeight: 48,
    descriptionIt:
      "App mobile civica per segnalare problemi urbani, consultare servizi pubblici e partecipare alla vita della propria città. In sviluppo.",
    descriptionEn:
      "Civic mobile app to report urban issues, access public services and engage with local communities. In development.",
    statusIt: "In sviluppo",
    statusEn: "In development",
    statusType: "development",
  },
  {
    id: "civicalert",
    name: "CivicAlert",
    logo: "/nostri-progetti/Loghi/CivicAlert/civicalert_logo_v2.svg",
    descriptionIt:
      "App civica per il mercato UK — segnalazioni, alert locali e connessione con enti pubblici. Sviluppata per Bishop's Stortford e scalabile su tutte le città inglesi.",
    descriptionEn:
      "Civic app for the UK market — issue reporting, local alerts and connection with public authorities. Built for Bishop's Stortford and scalable to any UK city.",
    statusIt: "In sviluppo",
    statusEn: "In development",
    statusType: "development",
  },
  {
    id: "herebishopsstortford",
    name: "HereBishopsStortford",
    logo: "/nostri-progetti/Loghi/HereBishopsStortford/here-bishopsstortford-dark.svg",
    descriptionIt:
      "Portale civico iperlocale per Bishop's Stortford — lo speculare UK di QuiPalermo. Il primo progetto della serie Here[City].",
    descriptionEn:
      "Hyperlocal civic portal for Bishop's Stortford — the UK counterpart of QuiPalermo. First project in the Here[City] series.",
    statusIt: "In arrivo",
    statusEn: "Coming Soon",
    statusType: "coming",
  },
];

export const statusBadgeClass: Record<ProjectStatusType, string> = {
  live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  development: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  coming: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};
