import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as "it" | "en";

  return {
    title: locale === "it" ? "Informativa sulla Privacy" : "Privacy Policy",
    description:
      locale === "it"
        ? "Informativa sulla privacy di QC Tech — Quantum Code Technologies Ltd."
        : "QC Tech privacy policy — Quantum Code Technologies Ltd.",
    alternates: buildAlternates("/privacy", loc),
    openGraph: { url: buildAlternates("/privacy", loc).canonical as string },
  };
}

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section className="mt-8 scroll-mt-28" id={id}>
      <h2 className="text-lg font-semibold text-[var(--light-text)]">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--light-text-muted)]">
        {children}
      </div>
    </section>
  );
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const isIt = locale === "it";

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {isIt ? "Informativa sulla Privacy" : "Privacy Policy"}
        </h1>
        <p className="mt-3 text-sm text-[var(--light-text-muted)]">
          {isIt ? "Ultimo aggiornamento: 13 novembre 2026" : "Last updated: 13 November 2026"}
        </p>

        {isIt ? (
          <>
            <p className="mt-6 text-sm leading-relaxed text-[var(--light-text-muted)]">
              <strong className="text-[var(--light-text)]">Titolare del trattamento:</strong>{" "}
              Quantum Code Technologies Ltd, Company Number 17317573, Flat 3,
              Jackson Wharf, Adderley Road, Bishop&apos;s Stortford, CM23 3AX,
              England. Email:{" "}
              <a
                href="mailto:hello@qc-tech.co.uk"
                className="text-[var(--light-primary)] hover:underline"
              >
                hello@qc-tech.co.uk
              </a>
              . Legge applicabile: UK GDPR e, per gli utenti dell&apos;UE,
              Regolamento (UE) 2016/679 (GDPR).
            </p>

            <Section title="1. Titolare del Trattamento">
              <p>
                Quantum Code Technologies Ltd, Company Number 17317573, con sede
                in Flat 3, Jackson Wharf, Adderley Road, Bishop&apos;s
                Stortford, CM23 3AX, England. Contatti: hello@qc-tech.co.uk.
              </p>
            </Section>

            <Section title="2. Dati raccolti">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-[var(--light-text)]">Modulo contatti:</strong>{" "}
                  nome, email, messaggio, argomento selezionato
                </li>
                <li>
                  <strong className="text-[var(--light-text)]">Modulo Copilot Ltd:</strong>{" "}
                  nome, email, stato della richiesta
                </li>
                <li>
                  <strong className="text-[var(--light-text)]">Google Analytics 4:</strong>{" "}
                  dati di navigazione anonimi (pagine visitate, durata sessione,
                  paese, dispositivo)
                </li>
                <li>
                  <strong className="text-[var(--light-text)]">Cookie tecnici:</strong>{" "}
                  necessari al funzionamento del sito (Next.js, Vercel)
                </li>
              </ul>
            </Section>

            <Section title="3. Base giuridica">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Dati dei form: consenso esplicito dell&apos;utente (Art.
                  6(1)(a) UK GDPR)
                </li>
                <li>
                  Google Analytics: consenso esplicito tramite cookie banner
                </li>
                <li>
                  Cookie tecnici: interesse legittimo (Art. 6(1)(f) UK GDPR)
                </li>
              </ul>
            </Section>

            <Section title="4. Finalità del trattamento">
              <p>
                Rispondere alle richieste di contatto, inviare comunicazioni
                pre-lancio per Copilot Ltd (solo se esplicitamente richiesto),
                migliorare il sito tramite analytics anonime.
              </p>
            </Section>

            <Section title="5. Conservazione dei dati">
              <p>
                Dati dei form conservati per 24 mesi; dati GA4 per 26 mesi
                (impostazione Google standard).
              </p>
            </Section>

            <Section title="6. Condivisione dei dati">
              <p>
                Nessuna vendita a terzi. Dati condivisi solo con: Google LLC
                (Analytics), Vercel Inc. (hosting), provider SMTP Aruba S.p.A.
                (invio email), OpenRouter, Inc. (assistente AI). Tutti i
                provider adottano misure adeguate ai sensi del UK GDPR.
              </p>
            </Section>

            <Section title="7. Diritti dell'utente">
              <p>
                Accesso, rettifica, cancellazione (&quot;diritto
                all&apos;oblio&quot;), portabilità, opposizione al trattamento.
                Richieste a: hello@qc-tech.co.uk.
              </p>
            </Section>

            <Section title="8. Reclami">
              <p>
                Diritto di presentare reclamo all&apos;Information
                Commissioner&apos;s Office (ICO) —{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--light-primary)] hover:underline"
                >
                  ico.org.uk
                </a>
                .
              </p>
            </Section>

            <Section title="9. Modifiche">
              <p>
                Eventuali modifiche saranno pubblicate su questa pagina con data
                di aggiornamento.
              </p>
            </Section>

            <Section id="assistente-ai" title="Assistente AI Q.U.A.N.T.I.S">
              <p>
                Il sito offre un assistente AI facoltativo. Quando lo usi, il
                testo che scrivi (massimo 300 caratteri per messaggio) e gli
                ultimi messaggi della conversazione sono inviati a OpenRouter,
                Inc. (Stati Uniti) e al fornitore del modello di intelligenza
                artificiale selezionato, al solo scopo di generare la risposta.
                Quantum Code Technologies Ltd non salva né registra i messaggi
                della chat; la conversazione resta nel tuo browser e si cancella
                chiudendo la pagina. I fornitori dei modelli gratuiti possono
                conservare e utilizzare i testi ricevuti secondo le proprie
                condizioni: per questo ti chiediamo di non inserire dati
                personali (nome, email, telefono, dati di salute o finanziari).
                Per richieste che contengono dati personali usa il modulo
                contatti. Base giuridica: legittimo interesse a rispondere alle
                domande dei visitatori (art. 6(1)(f) UK GDPR / GDPR UE). Il
                trasferimento fuori dal Regno Unito e dallo Spazio economico
                europeo avviene alle condizioni contrattuali del fornitore.
                L&apos;assistente è dichiarato come AI e le sue risposte non
                costituiscono offerta: fanno fede solo preventivi e contratti.
              </p>
            </Section>
          </>
        ) : (
          <>
            <p className="mt-6 text-sm leading-relaxed text-[var(--light-text-muted)]">
              <strong className="text-[var(--light-text)]">Data controller:</strong> Quantum
              Code Technologies Ltd, Company Number 17317573, Flat 3, Jackson
              Wharf, Adderley Road, Bishop&apos;s Stortford, CM23 3AX, England.
              Email:{" "}
              <a
                href="mailto:hello@qc-tech.co.uk"
                className="text-[var(--light-primary)] hover:underline"
              >
                hello@qc-tech.co.uk
              </a>
              . Applicable law: UK GDPR and, for EU users, Regulation (EU)
              2016/679 (GDPR).
            </p>

            <Section title="1. Data Controller">
              <p>
                Quantum Code Technologies Ltd, Company Number 17317573,
                registered at Flat 3, Jackson Wharf, Adderley Road,
                Bishop&apos;s Stortford, CM23 3AX, England. Contact:
                hello@qc-tech.co.uk.
              </p>
            </Section>

            <Section title="2. Data We Collect">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-[var(--light-text)]">Contact form:</strong>{" "}
                  name, email, message, selected topic
                </li>
                <li>
                  <strong className="text-[var(--light-text)]">Copilot Ltd form:</strong>{" "}
                  name, email, request status
                </li>
                <li>
                  <strong className="text-[var(--light-text)]">Google Analytics 4:</strong>{" "}
                  anonymous browsing data (pages visited, session duration,
                  country, device)
                </li>
                <li>
                  <strong className="text-[var(--light-text)]">Technical cookies:</strong>{" "}
                  required for site operation (Next.js, Vercel)
                </li>
              </ul>
            </Section>

            <Section title="3. Legal Basis">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Form data: explicit user consent (Art. 6(1)(a) UK GDPR)
                </li>
                <li>
                  Google Analytics: explicit consent via cookie banner
                </li>
                <li>
                  Technical cookies: legitimate interest (Art. 6(1)(f) UK GDPR)
                </li>
              </ul>
            </Section>

            <Section title="4. Purpose of Processing">
              <p>
                To respond to contact requests, send pre-launch communications
                for Copilot Ltd (only when explicitly requested), and improve
                the site through anonymous analytics.
              </p>
            </Section>

            <Section title="5. Data Retention">
              <p>
                Form data retained for 24 months; GA4 data for 26 months
                (Google standard setting).
              </p>
            </Section>

            <Section title="6. Data Sharing">
              <p>
                No sale to third parties. Data shared only with: Google LLC
                (Analytics), Vercel Inc. (hosting), Aruba S.p.A. SMTP provider
                (email delivery), OpenRouter, Inc. (AI assistant). All providers
                implement appropriate UK GDPR safeguards.
              </p>
            </Section>

            <Section title="7. Your Rights">
              <p>
                Access, rectification, erasure (&quot;right to be
                forgotten&quot;), portability, objection to processing. Requests
                to: hello@qc-tech.co.uk.
              </p>
            </Section>

            <Section title="8. Complaints">
              <p>
                You have the right to lodge a complaint with the Information
                Commissioner&apos;s Office (ICO) —{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--light-primary)] hover:underline"
                >
                  ico.org.uk
                </a>
                .
              </p>
            </Section>

            <Section title="9. Changes">
              <p>
                Any changes will be published on this page with an updated date.
              </p>
            </Section>

            <Section id="assistente-ai" title="Q.U.A.N.T.I.S AI assistant">
              <p>
                The site offers an optional AI assistant. When you use it, the
                text you write (maximum 300 characters per message) and the
                latest messages in the conversation are sent to OpenRouter, Inc.
                (United States) and to the selected artificial intelligence
                model provider, solely to generate the reply. Quantum Code
                Technologies Ltd does not save or log chat messages; the
                conversation stays in your browser and is cleared when you close
                the page. Providers of free models may retain and use the texts
                they receive under their own terms: for this reason we ask you
                not to enter personal data (name, email, phone, health or
                financial data). For requests that contain personal data, use
                the contact form. Legal basis: legitimate interest in answering
                visitors&apos; questions (art. 6(1)(f) UK GDPR / EU GDPR).
                Transfers outside the United Kingdom and the European Economic
                Area take place under the provider&apos;s contractual terms. The
                assistant is declared as AI and its answers do not constitute an
                offer: only quotes and contracts are binding.
              </p>
            </Section>
          </>
        )}

        <p className="mt-10 text-sm text-[var(--light-text-muted)]">
          <Link href="/termini" className="text-[var(--light-primary)] hover:underline">
            {isIt ? "Termini e Condizioni" : "Terms & Conditions"}
          </Link>
        </p>
      </article>
    </div>
  );
}
