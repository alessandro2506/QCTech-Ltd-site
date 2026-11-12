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

export function formatAssistantKnowledgeBase(locale: string): string {
  return getAssistantKb(locale)
    .map((entry) => `[${entry.id}]\nQ: ${entry.question}\nA: ${entry.answer}`)
    .join("\n\n");
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

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "che",
  "ci",
  "come",
  "con",
  "cosa",
  "da",
  "dai",
  "dal",
  "dalla",
  "de",
  "dei",
  "del",
  "della",
  "delle",
  "di",
  "do",
  "does",
  "e",
  "fa",
  "fare",
  "for",
  "from",
  "gli",
  "how",
  "i",
  "il",
  "in",
  "is",
  "it",
  "la",
  "le",
  "lo",
  "ma",
  "o",
  "of",
  "on",
  "or",
  "ore",
  "per",
  "quale",
  "quali",
  "quanto",
  "se",
  "si",
  "sono",
  "su",
  "the",
  "to",
  "un",
  "una",
  "uno",
  "vuole",
  "what",
  "when",
  "where",
  "with",
  "you",
]);

const GENERIC_WORDS = new Set([
  "articoli",
  "costa",
  "costo",
  "cost",
  "euro",
  "fare",
  "much",
  "prezzo",
  "price",
  "progetto",
  "project",
  "sito",
  "site",
  "tempo",
  "tempi",
  "time",
  "take",
  "web",
  "website",
]);

const STRONG_PHRASES = [
  "e-commerce",
  "ecommerce",
  "manutenzione",
  "maintenance",
  "audit",
  "preventivo",
  "quote",
  "tecnologie",
  "tecnologia",
  "technologies",
  "technology",
  "seo",
  "app",
  "mobile",
  "restyle",
  "redesign",
  "mvp",
  "gdpr",
  "privacy",
  "chatbot",
  "landing",
  "vetrina",
  "corporate",
  "portale",
  "portal",
  "dashboard",
  "webapp",
  "web app",
  "agenzia",
  "agency",
  "quanto tempo",
  "how long",
  "settimane",
  "weeks",
  "timeline",
  "durata",
  "duration",
  "italiane",
  "italian",
  "italia",
  "startup",
  "intelligenza",
  "openai",
  "react",
  "typescript",
  "fatturazione",
  "billing",
  "cookie",
  "conformita",
  "compliance",
  "qc tech",
  "posizionamento",
  "redirect",
  "aeo",
  "geo",
  "ios",
  "android",
  "negozio",
  "checkout",
  "catalogo",
  "catalogue",
  "saas",
  "iniziare",
  "get started",
  "primo passo",
  "first step",
  "primo giorno",
  "day one",
  "applicazione web",
  "web application",
  "ridisegnare",
  "after launch",
  "dopo il lancio",
] as const;

const COST_SIGNALS = [
  "quanto costa",
  "how much",
  "costo",
  "costa",
  "prezzo",
  "price",
  "cost",
] as const;

const DURATION_SIGNALS = [
  "quanto tempo",
  "how long",
  "tempi",
  "durata",
  "duration",
  "timeline",
  "settimane",
  "weeks",
  "mesi",
  "months",
  "ci vuole",
] as const;

const COST_OBJECTS: { phrase: string; id: FaqId }[] = [
  { phrase: "e-commerce", id: "p-ecommerce" },
  { phrase: "ecommerce", id: "p-ecommerce" },
  { phrase: "negozio", id: "p-ecommerce" },
  { phrase: "shop", id: "p-ecommerce" },
  { phrase: "store", id: "p-ecommerce" },
  { phrase: "restyle", id: "p-restyle" },
  { phrase: "redesign", id: "p-restyle" },
  { phrase: "web app", id: "p-webapp" },
  { phrase: "webapp", id: "p-webapp" },
  { phrase: "portale", id: "p-webapp" },
  { phrase: "portal", id: "p-webapp" },
  { phrase: "app", id: "p-mobile" },
  { phrase: "mobile", id: "p-mobile" },
  { phrase: "seo", id: "p-seo" },
  { phrase: "presenza", id: "p-presence" },
  { phrase: "presence", id: "p-presence" },
  { phrase: "manutenzione", id: "p-presence" },
  { phrase: "maintenance", id: "p-presence" },
  { phrase: "landing", id: "a1" },
  { phrase: "vetrina", id: "a1" },
  { phrase: "corporate", id: "a1" },
  { phrase: "sito", id: "a1" },
  { phrase: "website", id: "a1" },
  { phrase: "web", id: "a1" },
];

const DURATION_OBJECTS = [
  "sito",
  "website",
  "web",
  "progetto",
  "project",
  "app",
  "landing",
  "ecommerce",
  "e-commerce",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9€£\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasPhrase(hay: string, phrase: string): boolean {
  const p = normalize(phrase);
  if (p.length === 0) return false;
  if (p.includes(" ") || p.includes("-")) return hay.includes(p);
  return new RegExp(`(?:^|\\s)${escapeRegExp(p)}(?:$|\\s)`).test(hay);
}

function significantTokens(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter(
      (token) =>
        token.length >= 3 &&
        !STOP_WORDS.has(token) &&
        !GENERIC_WORDS.has(token),
    );
}

function faqCorpus(entry: KbEntry): string {
  return normalize([entry.question, ...entry.keywords].join(" "));
}

function overlapCount(queryTokens: string[], corpus: string): number {
  let count = 0;
  const seen = new Set<string>();
  for (const token of queryTokens) {
    if (seen.has(token)) continue;
    seen.add(token);
    if (hasPhrase(corpus, token)) count += 1;
  }
  return count;
}

function strongHits(hay: string, corpus: string): number {
  let count = 0;
  for (const phrase of STRONG_PHRASES) {
    if (hasPhrase(hay, phrase) && hasPhrase(corpus, phrase)) count += 1;
  }
  return count;
}

function costObjectId(hay: string): FaqId | null {
  if (!COST_SIGNALS.some((signal) => hasPhrase(hay, signal))) return null;
  for (const item of COST_OBJECTS) {
    if (hasPhrase(hay, item.phrase)) return item.id;
  }
  return null;
}

function hasDurationIntent(hay: string): boolean {
  return (
    DURATION_SIGNALS.some((signal) => hasPhrase(hay, signal)) &&
    DURATION_OBJECTS.some((object) => hasPhrase(hay, object))
  );
}

export function matchFaqByKeywords(
  locale: string,
  message: string,
): KbEntry | null {
  const hay = normalize(message);
  if (hay.length < 2) return null;

  const queryTokens = significantTokens(hay);
  const costId = costObjectId(hay);
  const durationIntent = hasDurationIntent(hay);

  let best: { entry: KbEntry; score: number } | null = null;
  for (const entry of getAssistantKb(locale)) {
    const corpus = faqCorpus(entry);
    const exactQuestion = hay.includes(normalize(entry.question));
    const strong = strongHits(hay, corpus);
    const overlap = overlapCount(queryTokens, corpus);
    const durationHit = durationIntent && entry.id === "a4";
    const costHit = costId === entry.id;

    const qualified =
      exactQuestion || strong >= 1 || overlap >= 2 || durationHit || costHit;
    if (!qualified) continue;

    let score = strong * 8 + overlap * 3;
    if (exactQuestion) score += 20;
    if (durationHit) score += 12;
    if (costHit) score += 12;
    if (!best || score > best.score) best = { entry, score };
  }

  return best?.entry ?? null;
}

export const CHIP_FAQ_IDS: FaqId[] = ["a1", "a4", "a11", "a2", "a6"];
