/**
 * Posizioni aperte della sezione Careers / Lavora con noi.
 * Testi approvati: ClaudesBrain/CAREERS_SITO.md (20/11/2026). Non riscrivere.
 * Aggiornato il 27/11/2026: obiettivo di riferimento e premio annuale (art. 6A del contratto).
 * Una nuova posizione si aggiunge solo qui, senza toccare i componenti.
 */

export type CareerLocale = "it" | "en";

export const CAREER_AREAS = ["sales"] as const;
export const CAREER_ENGAGEMENTS = ["selfEmployed"] as const;
export const CAREER_PAY = ["commissionOnly"] as const;
export const CAREER_MODES = ["remote"] as const;
export const CAREER_COUNTRIES = ["IT", "GB"] as const;
export const CAREER_LANGUAGES = ["it", "en"] as const;

export type CareerArea = (typeof CAREER_AREAS)[number];
export type CareerEngagement = (typeof CAREER_ENGAGEMENTS)[number];
export type CareerPay = (typeof CAREER_PAY)[number];
export type CareerMode = (typeof CAREER_MODES)[number];
export type CareerCountry = (typeof CAREER_COUNTRIES)[number];
export type CareerLanguage = (typeof CAREER_LANGUAGES)[number];

export type CareerSection =
  | { kind: "text"; title: string; body: string[] }
  | { kind: "list"; title: string; items: string[] };

export type CareerContent = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  sections: CareerSection[];
  closing: string;
};

export type CareerJob = {
  id: string;
  area: CareerArea;
  engagement: CareerEngagement;
  pay: CareerPay;
  mode: CareerMode;
  countries: CareerCountry[];
  languages: CareerLanguage[];
  content: Record<CareerLocale, CareerContent>;
};

export const CAREER_JOBS: CareerJob[] = [
  {
    id: "introducer",
    area: "sales",
    engagement: "selfEmployed",
    pay: "commissionOnly",
    mode: "remote",
    countries: ["IT", "GB"],
    languages: ["it", "en"],
    content: {
      it: {
        slug: "procacciatore-di-clienti",
        title: "Procacciatore di clienti",
        subtitle:
          "Collaborazione autonoma a provvigione · Full remote · Italia o Regno Unito",
        summary:
          "Cerchiamo professionisti con una rete di contatti tra imprenditori, studi e attività che possano aver bisogno di un sito, di un'applicazione o di un'automazione. Il ruolo è segnalarci potenziali clienti e accompagnarli fino alla firma del contratto. Preventivi, contratti e realizzazione sono a carico di QC Tech.",
        sections: [
          {
            kind: "text",
            title: "Chi siamo",
            body: [
              "Quantum Code Technologies Ltd (QC Tech) è uno studio digitale con sede nel Regno Unito. Realizziamo siti web, applicazioni web e mobile e automazioni con intelligenza artificiale per piccole e medie imprese nel Regno Unito e in Europa. Costruiamo ogni prodotto partendo da quello che serve al cliente, e lo seguiamo finché ne è soddisfatto.",
            ],
          },
          {
            kind: "text",
            title: "L'opportunità",
            body: [
              "Cerchiamo professionisti con una rete di contatti tra imprenditori, studi e attività che possano aver bisogno di un sito, di un'applicazione o di un'automazione. Il ruolo è segnalarci potenziali clienti e accompagnarli fino alla firma del contratto. Preventivi, contratti e realizzazione sono a carico di QC Tech.",
            ],
          },
          {
            kind: "list",
            title: "Cosa farà",
            items: [
              "Individuare potenziali clienti e registrarli presso QC Tech prima di presentarli: la registrazione viene confermata per iscritto entro 5 giorni lavorativi.",
              "Condurre il primo colloquio conoscitivo con il cliente (attività, obiettivi, tempi, budget, chi decide) e inviarci il riepilogo.",
              "Presentare al cliente il preventivo preparato da QC Tech e seguirlo fino alla firma.",
              "Organizzare il proprio lavoro in autonomia: nessuna zona assegnata, nessuna esclusiva, nessun obbligo di segnalazione, nessun orario.",
              "Obiettivo di riferimento: £1.000 al mese di valore di sviluppo dei contratti firmati, come indicazione e non come obbligo.",
            ],
          },
          {
            kind: "list",
            title: "Cosa cerchiamo",
            items: [
              "Una rete di contatti reale tra piccole e medie imprese o professionisti: è il requisito principale.",
              "Esperienza commerciale, preferibile ma non indispensabile.",
              "Capacità di lavorare in autonomia e di portare contatti qualificati, non semplici nominativi.",
              "Ottima conoscenza dell'italiano o dell'inglese.",
              "Residenza in Italia o nel Regno Unito.",
            ],
          },
          {
            kind: "list",
            title: "Cosa offriamo",
            items: [
              "Provvigione dal 10% al 30% del valore di sviluppo di ogni contratto firmato, a scaglioni in base al valore del contratto.",
              "Pagamento entro 30 giorni dall'incasso del primo acconto del cliente: in euro per chi risiede in Italia, in sterline per chi risiede nel Regno Unito.",
              "Nessun tetto ai compensi.",
              "Premio annuale del 5% sul valore di sviluppo dei contratti firmati, al collaboratore che ne ha chiusi di più nell'anno (ad esempio, £100.000 danno £5.000).",
              "Collaborazione non esclusiva, compatibile con altre attività.",
              "Formazione iniziale e materiali di supporto: corso, manuale e strumento di stima dei prezzi.",
              "Lavoro interamente da remoto.",
            ],
          },
          {
            kind: "text",
            title: "Inquadramento",
            body: [
              "Si tratta di una collaborazione autonoma e occasionale, regolata da un contratto di procacciamento occasionale: non è un rapporto di lavoro dipendente. Il compenso è solo a provvigione e va dichiarato dal collaboratore secondo la propria posizione fiscale; la partita IVA non è richiesta per avviare la collaborazione. Per chi risiede nel Regno Unito il rapporto è da self-employed, con imposte e National Insurance a proprio carico.",
            ],
          },
          {
            kind: "text",
            title: "Crescita",
            body: [
              "Chi otterrà buoni risultati potrà vedersi proporre nel tempo forme di collaborazione più strutturate e, se si apriranno posizioni, essere valutato per un'assunzione. È una possibilità legata ai risultati e alle esigenze dell'azienda, non un impegno.",
            ],
          },
          {
            kind: "text",
            title: "Come candidarsi",
            body: [
              "Compili il modulo indicando i settori in cui opera e il tipo di clienti che potrebbe presentarci. Se il profilo è in linea, la contatteremo per un colloquio.",
            ],
          },
        ],
        closing:
          "L'annuncio è rivolto a candidati di entrambi i sessi (D.Lgs. 198/2006).",
      },
      en: {
        slug: "client-introducer",
        title: "Client Introducer",
        subtitle:
          "Self-employed, commission only · Fully remote · Italy or United Kingdom",
        summary:
          "We are looking for well-connected professionals with a network of business owners, firms and organisations that may need a website, an application or an automation. Your role is to introduce potential clients to us and follow them through to a signed contract. QC Tech handles quotes, contracts and delivery.",
        sections: [
          {
            kind: "text",
            title: "About us",
            body: [
              "Quantum Code Technologies Ltd (QC Tech) is a digital studio based in the United Kingdom. We build websites, web and mobile applications and AI automation for small and medium-sized businesses in the UK and Europe. We build every product around what the client needs, and we stay with them until they are satisfied.",
            ],
          },
          {
            kind: "text",
            title: "The opportunity",
            body: [
              "We are looking for well-connected professionals with a network of business owners, firms and organisations that may need a website, an application or an automation. Your role is to introduce potential clients to us and follow them through to a signed contract. QC Tech handles quotes, contracts and delivery.",
            ],
          },
          {
            kind: "list",
            title: "What you will do",
            items: [
              "Identify potential clients and register them with QC Tech before introducing them: we confirm the registration in writing within 5 working days.",
              "Hold the first discovery conversation with the client (business, goals, timing, budget, who decides) and send us a summary.",
              "Present the quote prepared by QC Tech to the client and follow them through to signature.",
              "Organise your own work: no assigned territory, no exclusivity, no obligation to refer, no set hours.",
              "Reference target: £1,000 a month in development value of signed contracts, as a guide rather than an obligation.",
            ],
          },
          {
            kind: "list",
            title: "Who you are",
            items: [
              "You have a genuine network of small and medium-sized businesses or professionals. This is the key requirement.",
              "A track record in sales is an advantage, but not essential.",
              "You work independently and bring qualified leads, not just names.",
              "You are fluent in English or Italian.",
              "You live in the United Kingdom or Italy.",
            ],
          },
          {
            kind: "list",
            title: "What we offer",
            items: [
              "Commission from 10% to 30% of the development value of each signed contract, tiered by contract value.",
              "Payment within 30 days of the client's first deposit: in pounds sterling if you live in the UK, in euros if you live in Italy.",
              "No cap on earnings.",
              "Annual bonus of 5% of the development value of signed contracts for the introducer who closes the most in the year (for example, £100,000 gives a £5,000 bonus).",
              "A non-exclusive arrangement you can take on alongside your current work.",
              "Initial training and support materials: course, handbook and pricing estimate tool.",
              "Fully remote work.",
            ],
          },
          {
            kind: "text",
            title: "Engagement",
            body: [
              "This is a self-employed opportunity under an introducer agreement. It is not employment. Pay is commission only. If you live in the UK, you are responsible for your own tax and National Insurance and need to be registered with HMRC as self-employed. If you live in Italy, you declare the commission according to your own tax position; a VAT number is not required to start.",
            ],
          },
          {
            kind: "text",
            title: "Growth",
            body: [
              "Introducers who achieve good results may be offered more structured arrangements over time and, if positions open, be considered for employment. This is a possibility depending on results and business needs, not a commitment.",
            ],
          },
          {
            kind: "text",
            title: "How to apply",
            body: [
              "Fill in the form with the sectors you cover and the kind of clients you could introduce to us. If your profile is a good fit, we will contact you to arrange a conversation.",
            ],
          },
        ],
        closing: "We welcome applications from everyone, regardless of background.",
      },
    },
  },
];

export function findJobBySlug(
  slug: string,
): { job: CareerJob; locale: CareerLocale } | null {
  for (const job of CAREER_JOBS) {
    for (const loc of ["it", "en"] as const) {
      if (job.content[loc].slug === slug) return { job, locale: loc };
    }
  }
  return null;
}

export function findJobById(id: string): CareerJob | null {
  return CAREER_JOBS.find((j) => j.id === id) ?? null;
}
