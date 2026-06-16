import { siteConfig } from "@/app.config";

export function SchemaOrg({ locale }: { locale: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.qc-tech.co.uk/#organization",
        name: "Quantum Code Technologies Ltd",
        alternateName: "QC Tech",
        description:
          locale === "it"
            ? "Studio digitale specializzato in siti web, e-commerce e app mobile per aziende UK e italiane."
            : "Digital studio specialised in websites, e-commerce and mobile apps for UK and Italian businesses.",
        url: "https://www.qc-tech.co.uk",
        telephone: "+447754812247",
        email: "hello@qc-tech.co.uk",
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.streetAddress,
          addressLocality: siteConfig.address.addressLocality,
          addressRegion: siteConfig.address.addressRegion,
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.addressCountry,
        },
        areaServed: ["GB", "IT"],
        serviceType: [
          "Web Development",
          "Mobile App Development",
          "E-commerce Development",
          "SEO Services",
          "Digital Marketing",
        ],
        priceRange: "££",
        sameAs: ["https://github.com/alessandro2506"],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.qc-tech.co.uk/#website",
        url: "https://www.qc-tech.co.uk",
        name: "QC Tech",
        publisher: { "@id": "https://www.qc-tech.co.uk/#organization" },
        inLanguage: ["en-GB", "it-IT"],
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.qc-tech.co.uk/en?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity:
          locale === "it"
            ? [
                {
                  "@type": "Question",
                  name: "Quanto costa un sito web?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "I nostri siti partono da £900 per una landing page fino a £25.000+ per una piattaforma corporate completa.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Lavorate con aziende italiane?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sì. Operiamo sia in UK che in Italia, con gestione di contenuti IT e EN, conformità GDPR e fatturazione in GBP ed EUR.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Cos'è l'audit gratuito del sito?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Una chiamata di 15 minuti in cui analizziamo il tuo sito attuale e ti diciamo esattamente cosa impedisce le conversioni, senza impegno.",
                  },
                },
              ]
            : [
                {
                  "@type": "Question",
                  name: "How much does a website cost?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our websites start from £900 for a landing page up to £25,000+ for a full corporate platform. We also serve Italian clients with pricing in EUR.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you work with Italian companies?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. We operate across both UK and Italy, handling IT and EN content, GDPR compliance, and billing in both GBP and EUR.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is a free site audit?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A 15-minute call where we review your current site and tell you exactly what's stopping it from converting. No strings attached.",
                  },
                },
              ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
