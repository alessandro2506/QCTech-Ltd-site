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
    logo: "/nostri-progetti/Loghi/QuiPalermo/qui-symbol-color.svg",
    logoWidth: 48,
    logoHeight: 60,
    descriptionIt:
      "Portale civico digitale per Palermo — directory di oltre 3.500 attività locali, mappa interattiva, sistema eventi con tre livelli di pubblicazione, news aggregate via AI e strumenti B2B per le imprese del territorio.",
    descriptionEn:
      "Digital civic portal for Palermo — directory of over 3,500 local businesses, interactive map, three-tier events system, AI-aggregated news and B2B tools for local enterprises.",
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
      "App mobile per la partecipazione civica urbana — segnalazioni georeferenziate, monitoraggio dello stato degli interventi e comunicazione diretta con i servizi pubblici locali. In sviluppo per il mercato italiano.",
    descriptionEn:
      "Mobile app for urban civic participation — geolocated issue reporting, intervention status tracking and direct communication with local public services. In development for the Italian market.",
    statusIt: "In sviluppo",
    statusEn: "In development",
    statusType: "development",
  },
  {
    id: "civicalert",
    name: "CivicAlert",
    logo: "/nostri-progetti/Loghi/CivicAlert/civicalert_logo_v2.svg",
    descriptionIt:
      "App civica per il mercato UK — segnalazioni di problemi urbani, alert locali in tempo reale e collegamento diretto con gli enti pubblici territoriali. Sviluppata per il mercato inglese, scalabile su qualsiasi città.",
    descriptionEn:
      "Civic app for the UK market — urban issue reporting, real-time local alerts and direct connection with public authorities. Built for the British market, scalable to any city.",
    statusIt: "In sviluppo",
    statusEn: "In development",
    statusType: "development",
  },
  {
    id: "herebishopsstortford",
    name: "HereBishopsStortford",
    logo: "/nostri-progetti/Loghi/HereBishopsStortford/here-bishopsstortford-dark.svg",
    descriptionIt:
      "Portale civico digitale per Bishop's Stortford — directory attività locali, mappa interattiva, eventi e news per la comunità. Primo progetto della serie Here[City] per il mercato britannico.",
    descriptionEn:
      "Digital civic portal for Bishop's Stortford — local business directory, interactive map, events and community news. First project in the Here[City] series for the British market.",
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
