/**
 * Pagine locali e di settore per il mercato UK (restyle/uk-positioning).
 * Direzione: ClaudesBrain/DIREZIONE_SITO_QCTECH_UK.md. Prezzi: listino v3.3.
 * Regole testi: solo fatti veri, nessun risultato o recensione inventati,
 * nessun trattino lungo.
 */

export type LandingLocale = "it" | "en";
export type LandingKind = "area" | "sector";

export type LandingCase = {
  portfolioId: "manutenzione-uk" | "studio-legale-uk-demo";
  title: string;
  body: string;
};

export type LandingContent = {
  linkLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  forWhoTitle: string;
  forWho: string[];
  offerTitle: string;
  offer: { name: string; price: string; note: string }[];
  stepsTitle: string;
  steps: string[];
  cases?: LandingCase[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaBody: string;
};

export type LandingPage = {
  slug: string;
  kind: LandingKind;
  content: Record<LandingLocale, LandingContent>;
};

const STEPS_EN = [
  "Discovery call: who your customers are, who you compete with, what they ask you most.",
  "Written proposal and quote. The price we agree is the price you pay; extra requests are quoted separately before any work.",
  "Structure and copy written by us, from your real facts, for the searches your customers make.",
  "Design and build on a private preview link, checked on phone and desktop.",
  "Launch: domain in your name, Google Search Console and Google Business Profile set up.",
];

const STEPS_IT = [
  "Discovery call: chi sono i tuoi clienti, chi sono i tuoi concorrenti, cosa ti chiedono più spesso.",
  "Proposta e preventivo scritti. Il prezzo concordato è quello che paghi; le richieste extra si quotano a parte prima di iniziarle.",
  "Struttura e testi scritti da noi, dai tuoi fatti reali, per le ricerche che fanno i tuoi clienti.",
  "Design e sviluppo su un link di anteprima privato, controllato su telefono e computer.",
  "Messa online: dominio intestato a te, Google Search Console e Google Business Profile configurati.",
];

const OFFER_EN = [
  { name: "Business website (3 to 5 pages)", price: "from £1,200", note: "Welcome offer for our first 50 clients: £480 with the Basic maintenance plan." },
  { name: "Website redesign", price: "from £1,200", note: "Welcome offer: £360 with the Basic maintenance plan." },
  { name: "E-commerce", price: "from £3,200", note: "Catalogue, payments and checkout." },
];

const OFFER_IT = [
  { name: "Sito vetrina (da 3 a 5 pagine)", price: "da £1.200", note: "Promo Welcome per i primi 50 clienti: £480 con il piano di manutenzione Basic." },
  { name: "Restyle del sito", price: "da £1.200", note: "Promo Welcome: £360 con il piano di manutenzione Basic." },
  { name: "E-commerce", price: "da £3.200", note: "Catalogo, pagamenti e checkout." },
];

const OFFICE_FAQ_EN = {
  q: "Do you have an office I can visit?",
  a: "We are a UK company registered in Bishop's Stortford, without a walk-in studio. We work by video call, phone and email, and every step is shared with you on a preview link.",
};
const OFFICE_FAQ_IT = {
  q: "Avete un ufficio dove posso venire?",
  a: "Siamo una società britannica registrata a Bishop's Stortford, senza uno studio aperto al pubblico. Lavoriamo con videochiamate, telefono ed email, e ogni passaggio lo vedi su un link di anteprima.",
};
const PRICE_FAQ_EN = {
  q: "Can the price change during the project?",
  a: "No. The quote we agree in writing is what you pay. If you ask for something outside it, we quote that separately and you decide before we start it.",
};
const PRICE_FAQ_IT = {
  q: "Il prezzo può cambiare durante il lavoro?",
  a: "No. Il preventivo concordato per iscritto è quello che paghi. Se chiedi qualcosa in più, lo quotiamo a parte e decidi tu prima che iniziamo.",
};

const CASE_LAW_EN: LandingCase = {
  portfolioId: "studio-legale-uk-demo",
  title: "A UK law firm: website and client portal",
  body: "English website with practice areas (immigration, family, employment, litigation, wills, probate, conveyancing, commercial property), people and contact pages, plus a client portal. Built to explain the work clearly and lead to a first enquiry, without showing case files or names.",
};
const CASE_LAW_IT: LandingCase = {
  portfolioId: "studio-legale-uk-demo",
  title: "Uno studio legale nel Regno Unito: sito e portale clienti",
  body: "Sito in inglese con aree di pratica (immigrazione, famiglia, lavoro, contenzioso, testamenti, successioni, conveyancing, immobiliare commerciale), persone e contatti, più un portale clienti. Pensato per spiegare il lavoro con chiarezza e portare a un primo contatto, senza mostrare fascicoli o nomi.",
};
const CASE_TRADE_EN: LandingCase = {
  portfolioId: "manutenzione-uk",
  title: "A UK property maintenance business",
  body: "Local website with services (repairs, plumbing, electrical work, painting, garden care, flooring, furniture assembly), coverage areas, gallery, FAQ and a clear prompt to call or write for an estimate.",
};
const CASE_TRADE_IT: LandingCase = {
  portfolioId: "manutenzione-uk",
  title: "Un'impresa di manutenzione immobili nel Regno Unito",
  body: "Sito locale con servizi (riparazioni, idraulica, impianti elettrici, imbiancatura, giardino, pavimenti, montaggio arredi), zone coperte, galleria, FAQ e un invito chiaro a chiamare o scrivere per un preventivo.",
};

function area(
  slug: string,
  en: { place: string; region: string },
  it: { place: string; region: string },
): LandingPage {
  return {
    slug,
    kind: "area",
    content: {
      en: {
        linkLabel: `Web design ${en.place}`,
        metaTitle: `Web Design ${en.place} | Websites & Redesigns | QC Tech`,
        metaDescription: `Websites and redesigns for studios, trades and restaurants in ${en.place}. Quote agreed in writing before we start. Reply within 48 hours.`,
        eyebrow: `${en.place}, ${en.region}`,
        title: `Websites and redesigns for businesses in ${en.place}.`,
        intro: `We build new websites and redesign existing ones for studios, professionals, trades and restaurants in ${en.place}. UK company registered in Bishop's Stortford. Reply within 48 hours.`,
        forWhoTitle: "Who we work with",
        forWho: [
          "Studios and professionals: solicitors, accountants, consultants, clinics.",
          "Trades: builders, plumbers, electricians, property maintenance.",
          "Restaurants and cafés: website and digital menu.",
          "Shops and companies that need e-commerce or a web app.",
        ],
        offerTitle: "Prices",
        offer: OFFER_EN,
        stepsTitle: "How we work",
        steps: STEPS_EN,
        faqTitle: "Questions",
        faq: [
          OFFICE_FAQ_EN,
          PRICE_FAQ_EN,
          {
            q: `Will my website show up when people in ${en.place} search?`,
            a: `We write and build each page for the searches your customers make in ${en.place} and set up Google Search Console and your Google Business Profile. Rankings also depend on reviews and on other sites mentioning you, which takes months; we do not promise positions.`,
          },
        ],
        ctaTitle: "Tell us about your business",
        ctaBody: "Send a short description and we reply within 48 hours with the next steps.",
      },
      it: {
        linkLabel: `Siti web ${it.place}`,
        metaTitle: `Siti web ${it.place} | Siti e restyle | QC Tech`,
        metaDescription: `Siti e restyle per studi, artigiani e ristoranti a ${it.place}. Preventivo concordato per iscritto prima di iniziare. Risposta entro 48 ore.`,
        eyebrow: `${it.place}, ${it.region}`,
        title: `Siti e restyle per attività a ${it.place}.`,
        intro: `Realizziamo siti nuovi e rifacciamo quelli esistenti per studi, professionisti, artigiani e ristoranti a ${it.place}. Società britannica registrata a Bishop's Stortford. Risposta entro 48 ore.`,
        forWhoTitle: "Con chi lavoriamo",
        forWho: [
          "Studi e professionisti: avvocati, commercialisti, consulenti, cliniche.",
          "Artigiani: imprese edili, idraulici, elettricisti, manutenzione immobili.",
          "Ristoranti e caffè: sito e menù digitale.",
          "Negozi e aziende che hanno bisogno di e-commerce o di una web app.",
        ],
        offerTitle: "Prezzi",
        offer: OFFER_IT,
        stepsTitle: "Come lavoriamo",
        steps: STEPS_IT,
        faqTitle: "Domande",
        faq: [
          OFFICE_FAQ_IT,
          PRICE_FAQ_IT,
          {
            q: `Il mio sito comparirà quando cercano a ${it.place}?`,
            a: `Scriviamo e costruiamo ogni pagina per le ricerche che fanno i tuoi clienti a ${it.place} e configuriamo Google Search Console e il tuo Google Business Profile. Il posizionamento dipende anche dalle recensioni e da quanto altri siti ti citano, e richiede mesi; non promettiamo posizioni.`,
          },
        ],
        ctaTitle: "Raccontaci la tua attività",
        ctaBody: "Mandaci una breve descrizione: rispondiamo entro 48 ore con i passi successivi.",
      },
    },
  };
}

export const LANDING_PAGES: LandingPage[] = [
  area(
    "bishops-stortford",
    { place: "Bishop's Stortford", region: "Hertfordshire" },
    { place: "Bishop's Stortford", region: "Hertfordshire" },
  ),
  area(
    "cambridge",
    { place: "Cambridge", region: "Cambridgeshire" },
    { place: "Cambridge", region: "Cambridgeshire" },
  ),
  area("london", { place: "London", region: "United Kingdom" }, { place: "Londra", region: "Regno Unito" }),
  {
    slug: "studios-and-professionals",
    kind: "sector",
    content: {
      en: {
        linkLabel: "Studios and trades",
        metaTitle: "Websites for Solicitors, Accountants & Trades | QC Tech",
        metaDescription: "Websites and redesigns for UK studios, professionals and trades. Clear services, a simple way to get in touch, and a quote agreed in writing.",
        eyebrow: "Studios, professionals and trades",
        title: "Websites for studios, professionals and trades.",
        intro: "Your clients want to know three things fast: what you do, whether you cover their case or area, and how to reach you. We build the site around those answers.",
        forWhoTitle: "Who it is for",
        forWho: [
          "Solicitors and law firms, accountants, consultants, clinics.",
          "Builders, plumbers, electricians, property maintenance.",
          "Practices that need a client area or a booking flow.",
        ],
        offerTitle: "Prices",
        offer: OFFER_EN,
        stepsTitle: "How we work",
        steps: STEPS_EN,
        cases: [CASE_LAW_EN, CASE_TRADE_EN],
        faqTitle: "Questions",
        faq: [
          PRICE_FAQ_EN,
          {
            q: "Can you add a client area or document upload?",
            a: "Yes. We build client portals and web apps; they are quoted separately after a call, because the price depends on what the area needs to do.",
          },
          OFFICE_FAQ_EN,
        ],
        ctaTitle: "Tell us about your practice",
        ctaBody: "Send a short description and we reply within 48 hours with the next steps.",
      },
      it: {
        linkLabel: "Studi e artigiani",
        metaTitle: "Siti per studi legali, commercialisti e artigiani | QC Tech",
        metaDescription: "Siti e restyle per studi, professionisti e artigiani nel Regno Unito. Servizi chiari, un modo semplice per contattarti e un preventivo concordato per iscritto.",
        eyebrow: "Studi, professionisti e artigiani",
        title: "Siti per studi, professionisti e artigiani.",
        intro: "I tuoi clienti vogliono sapere tre cose, subito: cosa fai, se segui il loro caso o la loro zona, e come contattarti. Costruiamo il sito attorno a queste risposte.",
        forWhoTitle: "Per chi è",
        forWho: [
          "Studi legali, commercialisti, consulenti, cliniche.",
          "Imprese edili, idraulici, elettricisti, manutenzione immobili.",
          "Studi che hanno bisogno di un'area clienti o di prenotazioni online.",
        ],
        offerTitle: "Prezzi",
        offer: OFFER_IT,
        stepsTitle: "Come lavoriamo",
        steps: STEPS_IT,
        cases: [CASE_LAW_IT, CASE_TRADE_IT],
        faqTitle: "Domande",
        faq: [
          PRICE_FAQ_IT,
          {
            q: "Potete aggiungere un'area clienti o il caricamento documenti?",
            a: "Sì. Realizziamo portali clienti e web app; si quotano a parte dopo una call, perché il prezzo dipende da cosa deve fare l'area.",
          },
          OFFICE_FAQ_IT,
        ],
        ctaTitle: "Raccontaci il tuo studio",
        ctaBody: "Mandaci una breve descrizione: rispondiamo entro 48 ore con i passi successivi.",
      },
    },
  },
  {
    slug: "restaurants",
    kind: "sector",
    content: {
      en: {
        linkLabel: "Restaurants",
        metaTitle: "Restaurant Websites & Digital Menus | QC Tech",
        metaDescription: "Websites and digital QR menus for UK restaurants and cafés. Menu set-up £149, then £29 a month with up to 2 updates. Quote agreed in writing.",
        eyebrow: "Restaurants and cafés",
        title: "Websites and digital menus for restaurants.",
        intro: "People look up a restaurant to check the menu, the opening hours and how to book. We put those first, and keep the menu up to date for you.",
        forWhoTitle: "What you can have",
        forWho: [
          "A website with menu, opening hours, location and booking or call buttons.",
          "A digital QR menu in your colours, in English and Italian if you need it.",
          "The digital menu on its own, if you already have a website.",
        ],
        offerTitle: "Prices",
        offer: [
          { name: "Digital menu", price: "£29 a month", note: "Set-up £149, or £75 if we build your website. Up to 2 updates a month. Minimum 6 months." },
          OFFER_EN[0],
          OFFER_EN[1],
        ],
        stepsTitle: "How we work",
        steps: STEPS_EN,
        faqTitle: "Questions",
        faq: [
          {
            q: "Who updates the menu?",
            a: "We do: send us the changes and we publish them, up to 2 updates a month in the plan.",
          },
          PRICE_FAQ_EN,
          OFFICE_FAQ_EN,
        ],
        ctaTitle: "Tell us about your restaurant",
        ctaBody: "Send a short description and we reply within 48 hours with the next steps.",
      },
      it: {
        linkLabel: "Ristoranti",
        metaTitle: "Siti e menù digitali per ristoranti | QC Tech",
        metaDescription: "Siti e menù digitali con QR per ristoranti e caffè nel Regno Unito. Allestimento del menù £149, poi £29 al mese con fino a 2 aggiornamenti. Preventivo concordato per iscritto.",
        eyebrow: "Ristoranti e caffè",
        title: "Siti e menù digitali per ristoranti.",
        intro: "Chi cerca un ristorante vuole vedere il menù, gli orari e come prenotare. Mettiamo queste cose al primo posto e teniamo il menù aggiornato per te.",
        forWhoTitle: "Cosa puoi avere",
        forWho: [
          "Un sito con menù, orari, posizione e pulsanti per prenotare o chiamare.",
          "Un menù digitale con QR nei tuoi colori, in inglese e in italiano se serve.",
          "Il solo menù digitale, se hai già un sito.",
        ],
        offerTitle: "Prezzi",
        offer: [
          { name: "Menù digitale", price: "£29 al mese", note: "Allestimento £149, oppure £75 se realizziamo noi il tuo sito. Fino a 2 aggiornamenti al mese. Durata minima 6 mesi." },
          OFFER_IT[0],
          OFFER_IT[1],
        ],
        stepsTitle: "Come lavoriamo",
        steps: STEPS_IT,
        faqTitle: "Domande",
        faq: [
          {
            q: "Chi aggiorna il menù?",
            a: "Noi: ci mandi le modifiche e le pubblichiamo, fino a 2 aggiornamenti al mese inclusi nel piano.",
          },
          PRICE_FAQ_IT,
          OFFICE_FAQ_IT,
        ],
        ctaTitle: "Raccontaci il tuo ristorante",
        ctaBody: "Mandaci una breve descrizione: rispondiamo entro 48 ore con i passi successivi.",
      },
    },
  },
  {
    slug: "shops-and-companies",
    kind: "sector",
    content: {
      en: {
        linkLabel: "Shops and companies",
        metaTitle: "E-commerce & Business Websites | QC Tech",
        metaDescription: "E-commerce, company websites and web apps for UK shops and businesses. Catalogue, payments and checkout. Quote agreed in writing before we start.",
        eyebrow: "Shops and companies",
        title: "E-commerce and websites for shops and companies.",
        intro: "An online shop has one job: help people find the product and pay without friction. A company site has another: explain what you do and who to contact. We build for the job.",
        forWhoTitle: "What we build",
        forWho: [
          "Online shops with catalogue, variants, tax and shipping, payments and checkout.",
          "Company websites with services, team and contact routes.",
          "Web apps and portals for internal or customer processes.",
        ],
        offerTitle: "Prices",
        offer: [OFFER_EN[2], OFFER_EN[0], OFFER_EN[1]],
        stepsTitle: "How we work",
        steps: STEPS_EN,
        faqTitle: "Questions",
        faq: [
          PRICE_FAQ_EN,
          {
            q: "Can you connect the shop to our stock or other systems?",
            a: "Yes, integrations with stock, ERP and marketplaces are quoted after a call, once we know the systems involved.",
          },
          OFFICE_FAQ_EN,
        ],
        ctaTitle: "Tell us about your business",
        ctaBody: "Send a short description and we reply within 48 hours with the next steps.",
      },
      it: {
        linkLabel: "Negozi e aziende",
        metaTitle: "E-commerce e siti aziendali | QC Tech",
        metaDescription: "E-commerce, siti aziendali e web app per negozi e aziende nel Regno Unito. Catalogo, pagamenti e checkout. Preventivo concordato per iscritto prima di iniziare.",
        eyebrow: "Negozi e aziende",
        title: "E-commerce e siti per negozi e aziende.",
        intro: "Un negozio online ha un compito: far trovare il prodotto e far pagare senza intoppi. Un sito aziendale ne ha un altro: spiegare cosa fai e chi contattare. Costruiamo per quel compito.",
        forWhoTitle: "Cosa realizziamo",
        forWho: [
          "Negozi online con catalogo, varianti, tasse e spedizioni, pagamenti e checkout.",
          "Siti aziendali con servizi, team e contatti.",
          "Web app e portali per processi interni o per i clienti.",
        ],
        offerTitle: "Prezzi",
        offer: [OFFER_IT[2], OFFER_IT[0], OFFER_IT[1]],
        stepsTitle: "Come lavoriamo",
        steps: STEPS_IT,
        faqTitle: "Domande",
        faq: [
          PRICE_FAQ_IT,
          {
            q: "Potete collegare il negozio al magazzino o ad altri sistemi?",
            a: "Sì, le integrazioni con magazzino, ERP e marketplace si quotano dopo una call, quando conosciamo i sistemi coinvolti.",
          },
          OFFICE_FAQ_IT,
        ],
        ctaTitle: "Raccontaci la tua attività",
        ctaBody: "Mandaci una breve descrizione: rispondiamo entro 48 ore con i passi successivi.",
      },
    },
  },
];

export function findLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}
