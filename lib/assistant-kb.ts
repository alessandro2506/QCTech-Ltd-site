import enMessages from "@/messages/en.json";
import itMessages from "@/messages/it.json";

export const FAQ_IDS = [
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8",
  "a9",
  "a10",
  "a11",
  "a12",
  "a13",
  "a14",
  "a15",
  "p-restyle",
  "p-ecommerce",
  "p-mobile",
  "p-webapp",
  "p-seo",
  "p-presence",
] as const;

export type FaqId = (typeof FAQ_IDS)[number];

export type KbEntry = {
  id: FaqId;
  question: string;
  answer: string;
  keywords: string[];
};

const PRICE_IT: Record<
  Extract<FaqId, `p-${string}`>,
  { question: string; answer: string; keywords: string[] }
> = {
  "p-restyle": {
    question: "Quanto costa un restyle del sito?",
    answer:
      "Il restyle di un sito web parte da 1.700 €. Ogni progetto riceve un preventivo personalizzato.",
    keywords: ["restyle", "ridisegno", "rifacimento", "redesign", "restyling"],
  },
  "p-ecommerce": {
    question: "Quanto costa un e-commerce?",
    answer:
      "I negozi online partono da 3.800 € per la linea Base e da 7.700 € per Advanced. Il preventivo è sempre su misura.",
    keywords: ["e-commerce", "ecommerce", "negozio", "shop", "checkout", "catalogo"],
  },
  "p-mobile": {
    question: "Quanto costa un'app mobile?",
    answer:
      "Le app mobile partono da 7.700 € per un MVP e da 14.000 € per la linea Standard. Tempi e ambito si definiscono in preventivo.",
    keywords: ["app", "mobile", "ios", "android", "mvp"],
  },
  "p-webapp": {
    question: "Quanto costa una web app o un portale?",
    answer:
      "Web app e portali partono da un MVP su preventivo. Il valore in euro si definisce dopo aver capito ambito e integrazioni.",
    keywords: ["web app", "webapp", "portale", "dashboard", "saas"],
  },
  "p-seo": {
    question: "Quanto costa la visibilità su Google e AI?",
    answer:
      "La SEO Base parte da 600 € al mese. AEO e GEO sono solo add-on abbinati alla SEO, senza garanzia di comparsa nelle risposte AI.",
    keywords: ["seo", "google", "aeo", "geo", "posizionamento", "visibilità"],
  },
  "p-presence": {
    question: "Quanto costano presenza digitale e manutenzione?",
    answer:
      "Presenza digitale: pacchetto Starter da 90 € al mese, Digital Presence da 120 € al mese. La manutenzione del sito è un piano diverso e parte da 110 € al mese.",
    keywords: [
      "presenza",
      "google business",
      "manutenzione",
      "mensile",
      "abbonamento",
    ],
  },
};

const PRICE_EN: typeof PRICE_IT = {
  "p-restyle": {
    question: "How much does a website restyle cost?",
    answer:
      "Website restyles start from £1,400. Every project gets a personalised quote.",
    keywords: ["restyle", "redesign", "rebuild", "refresh"],
  },
  "p-ecommerce": {
    question: "How much does an e-commerce site cost?",
    answer:
      "Online shops start from £3,200 for Base and from £6,500 for Advanced. Quotes are always tailored.",
    keywords: ["e-commerce", "ecommerce", "shop", "store", "checkout", "catalogue"],
  },
  "p-mobile": {
    question: "How much does a mobile app cost?",
    answer:
      "Mobile apps start from £6,500 for an MVP and from £12,000 for Standard. Scope and timing are set in the quote.",
    keywords: ["app", "mobile", "ios", "android", "mvp"],
  },
  "p-webapp": {
    question: "How much does a web app or portal cost?",
    answer:
      "Web apps and portals start from an MVP quoted after we understand scope and integrations. List prices in pounds start from £8,000.",
    keywords: ["web app", "webapp", "portal", "dashboard", "saas"],
  },
  "p-seo": {
    question: "How much does Google and AI visibility cost?",
    answer:
      "SEO Base starts from £500 per month. AEO and GEO are add-ons only with SEO, with no guarantee of appearing in AI answers.",
    keywords: ["seo", "google", "aeo", "geo", "ranking", "visibility"],
  },
  "p-presence": {
    question: "How much do digital presence and maintenance cost?",
    answer:
      "Digital presence: Starter from £75 per month, Digital Presence from £100 per month. Website maintenance is a different plan and starts from £90 per month.",
    keywords: [
      "presence",
      "google business",
      "maintenance",
      "monthly",
      "retainer",
    ],
  },
};

const FAQ_KEYWORDS_IT: Record<Exclude<FaqId, `p-${string}`>, string[]> = {
  a1: ["costo", "prezzo", "quanto", "costa", "sito", "landing", "vetrina", "corporate", "euro"],
  a2: ["italiane", "italia", "uk", "inghilterra", "gdpr", "fatturazione", "lingue"],
  a3: ["audit", "gratuito", "chiamata", "15", "conversioni"],
  a4: ["tempo", "tempi", "settimane", "mesi", "durata", "quanto tempo"],
  a5: ["tecnolog", "tecnologie", "stack", "next", "react", "typescript", "strumenti"],
  a6: ["iniziare", "come faccio", "primo passo", "preventivo", "contatto"],
  a7: ["aprire", "azienda", "primo giorno", "startup", "landing", "aprire un"],
  a8: ["differenza", "applicazione web", "web app", "sito web"],
  a9: ["agenzia", "scegliere", "scelgo", "giusta"],
  a10: ["ridisegnare", "seo", "google", "posizionamento", "redirect"],
  a11: ["manutenzione", "dopo", "lancio", "110", "mensile"],
  a12: ["ai", "intelligenza", "chatbot", "openai"],
  a13: ["mvp", "app", "idea", "minimo"],
  a14: ["privacy", "gdpr", "dati", "cookie", "conformità"],
  a15: ["distingue", "diversa", "perché voi", "qc tech"],
};

const FAQ_KEYWORDS_EN: typeof FAQ_KEYWORDS_IT = {
  a1: ["cost", "price", "how much", "website", "landing", "brochure", "corporate"],
  a2: ["italian", "italy", "uk", "gdpr", "billing", "languages"],
  a3: ["audit", "free", "call", "15", "conversions"],
  a4: ["how long", "timeline", "weeks", "months", "duration"],
  a5: ["technolog", "technologies", "stack", "next", "react", "typescript", "tools"],
  a6: ["get started", "start", "first step", "quote", "contact"],
  a7: ["start a business", "day one", "startup", "landing"],
  a8: ["difference", "web application", "web app", "website"],
  a9: ["agency", "choose", "right"],
  a10: ["redesign", "seo", "google", "ranking", "redirect"],
  a11: ["maintenance", "after launch", "90", "monthly"],
  a12: ["ai", "chatbot", "openai", "intelligence"],
  a13: ["mvp", "app", "idea", "minimum"],
  a14: ["privacy", "gdpr", "data", "cookie", "compliance"],
  a15: ["different", "makes you", "qc tech", "why you"],
};

function isFaqPageId(
  id: FaqId,
): id is Exclude<FaqId, `p-${string}`> {
  return !id.startsWith("p-");
}

export function isFaqId(value: string): value is FaqId {
  return (FAQ_IDS as readonly string[]).includes(value);
}

export function getAssistantKb(locale: string): KbEntry[] {
  const isIt = locale !== "en";
  const faq = (isIt ? itMessages : enMessages).FAQ;
  const prices = isIt ? PRICE_IT : PRICE_EN;
  const keywords = isIt ? FAQ_KEYWORDS_IT : FAQ_KEYWORDS_EN;

  const pageFaqs: KbEntry[] = FAQ_IDS.filter(isFaqPageId).map((id) => {
    const n = id.slice(1);
    const questionKey = `q${n}` as keyof typeof faq;
    const answerKey = `a${n}` as keyof typeof faq;
    return {
      id,
      question: String(faq[questionKey]),
      answer: String(faq[answerKey]),
      keywords: keywords[id],
    };
  });

  const priceFaqs: KbEntry[] = [
    "p-restyle",
    "p-ecommerce",
    "p-mobile",
    "p-webapp",
    "p-seo",
    "p-presence",
  ].map((id) => {
    const key = id as Extract<FaqId, `p-${string}`>;
    return { id: key, ...prices[key] };
  });

  return [...pageFaqs, ...priceFaqs];
}

const GENERIC_KEYWORDS = new Set([
  "costo",
  "prezzo",
  "quanto",
  "costa",
  "sito",
  "euro",
  "cost",
  "price",
  "how much",
  "website",
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9€£\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordWeight(kw: string): number {
  if (GENERIC_KEYWORDS.has(kw)) return 1;
  if (kw.includes(" ")) return 5;
  if (kw.length >= 6) return 4;
  return 3;
}

export function matchFaqByKeywords(
  locale: string,
  message: string,
): KbEntry | null {
  const hay = normalize(message);
  if (hay.length < 2) return null;

  let best: { entry: KbEntry; score: number } | null = null;
  for (const entry of getAssistantKb(locale)) {
    let score = 0;
    for (const raw of entry.keywords) {
      const kw = normalize(raw);
      if (kw.length === 0) continue;
      if (hay.includes(kw)) score += keywordWeight(kw);
    }
    if (hay.includes(normalize(entry.question))) score += 10;
    if (!best || score > best.score) best = { entry, score };
  }

  if (!best || best.score < 3) return null;
  return best.entry;
}

export const CHIP_FAQ_IDS: FaqId[] = ["a1", "a4", "a11", "a2", "a6"];
