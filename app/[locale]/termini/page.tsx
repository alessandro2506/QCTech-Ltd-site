import type { Metadata } from "next";
import { Link } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isIt = locale === "it";
  const path = isIt ? "/it/termini" : "/en/terms";

  return {
    metadataBase: new URL("https://www.qc-tech.co.uk"),
    title: isIt ? "Termini e Condizioni | QC Tech" : "Terms & Conditions | QC Tech",
    description:
      locale === "it"
        ? "Termini e condizioni d'uso del sito qc-tech.co.uk — Quantum Code Technologies Ltd."
        : "Terms and conditions for qc-tech.co.uk — Quantum Code Technologies Ltd.",
    alternates: {
      canonical: `https://www.qc-tech.co.uk${path}`,
      languages: {
        it: "https://www.qc-tech.co.uk/it/termini",
        en: "https://www.qc-tech.co.uk/en/terms",
        "x-default": "https://www.qc-tech.co.uk/en/terms",
      },
    },
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-slate-400">{children}</div>
    </section>
  );
}

export default async function TerminiPage({ params }: PageProps) {
  const { locale } = await params;
  const isIt = locale === "it";

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {isIt ? "Termini e Condizioni" : "Terms & Conditions"}
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          {isIt ? "Ultimo aggiornamento: 8 luglio 2026" : "Last updated: 8 July 2026"}
        </p>

        {isIt ? (
          <>
            <Section title="1. Parti">
              <p>
                I presenti Termini e Condizioni regolano il rapporto tra Quantum
                Code Technologies Ltd (Company Number 17317573) e l&apos;utente
                che accede al sito qc-tech.co.uk.
              </p>
            </Section>

            <Section title="2. Oggetto">
              <p>
                Il presente sito qc-tech.co.uk è di proprietà di Quantum Code
                Technologies Ltd e fornisce informazioni sui servizi offerti
                dall&apos;azienda.
              </p>
            </Section>

            <Section title="3. Proprietà intellettuale">
              <p>
                Tutti i contenuti (testi, loghi, grafica, codice) sono di
                proprietà esclusiva di Quantum Code Technologies Ltd. È vietata
                la riproduzione senza autorizzazione scritta.
              </p>
            </Section>

            <Section title="4. Limitazione di responsabilità">
              <p>
                QC Tech non garantisce l&apos;assenza di interruzioni del
                servizio. Non è responsabile per danni indiretti derivanti
                dall&apos;uso del sito.
              </p>
            </Section>

            <Section title="5. Link esterni">
              <p>
                Il sito può contenere link a siti terzi. QC Tech non è
                responsabile del contenuto di siti esterni.
              </p>
            </Section>

            <Section title="6. Legge applicabile">
              <p>
                I presenti T&amp;C sono regolati dalla legge inglese (England and
                Wales). Foro competente esclusivo: tribunali di England and
                Wales.
              </p>
            </Section>

            <Section title="7. Modifiche">
              <p>
                QC Tech si riserva il diritto di modificare i presenti T&amp;C in
                qualsiasi momento. Le modifiche saranno pubblicate su questa
                pagina.
              </p>
            </Section>

            <Section title="8. Contatti">
              <p>
                Quantum Code Technologies Ltd —{" "}
                <a
                  href="mailto:hello@qc-tech.co.uk"
                  className="text-violet-400 hover:text-violet-300"
                >
                  hello@qc-tech.co.uk
                </a>
              </p>
            </Section>
          </>
        ) : (
          <>
            <Section title="1. Parties">
              <p>
                These Terms &amp; Conditions govern the relationship between
                Quantum Code Technologies Ltd (Company Number 17317573) and the
                user accessing qc-tech.co.uk.
              </p>
            </Section>

            <Section title="2. Purpose">
              <p>
                This website qc-tech.co.uk is owned by Quantum Code
                Technologies Ltd and provides information about the services
                offered by the company.
              </p>
            </Section>

            <Section title="3. Intellectual Property">
              <p>
                All content (text, logos, graphics, code) is the exclusive
                property of Quantum Code Technologies Ltd. Reproduction without
                written permission is prohibited.
              </p>
            </Section>

            <Section title="4. Limitation of Liability">
              <p>
                QC Tech does not guarantee uninterrupted service. It is not
                liable for indirect damages arising from use of the site.
              </p>
            </Section>

            <Section title="5. External Links">
              <p>
                The site may contain links to third-party websites. QC Tech is
                not responsible for the content of external sites.
              </p>
            </Section>

            <Section title="6. Governing Law">
              <p>
                These T&amp;C are governed by the laws of England and Wales.
                Exclusive jurisdiction: courts of England and Wales.
              </p>
            </Section>

            <Section title="7. Changes">
              <p>
                QC Tech reserves the right to modify these T&amp;C at any time.
                Changes will be published on this page.
              </p>
            </Section>

            <Section title="8. Contact">
              <p>
                Quantum Code Technologies Ltd —{" "}
                <a
                  href="mailto:hello@qc-tech.co.uk"
                  className="text-violet-400 hover:text-violet-300"
                >
                  hello@qc-tech.co.uk
                </a>
              </p>
            </Section>
          </>
        )}

        <p className="mt-10 text-sm text-slate-500">
          <Link href="/privacy" className="text-violet-400 hover:text-violet-300">
            Privacy Policy
          </Link>
        </p>
      </article>
    </div>
  );
}
