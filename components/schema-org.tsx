import { siteConfig } from "@/app.config";

export function SchemaOrg({ locale }: { locale: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": "https://www.qc-tech.co.uk/#organization",
        name: "QC Tech",
        legalName: "Quantum Code Technologies Ltd",
        alternateName: ["Quantum Code Technologies", "QC Tech Ltd"],
        description:
          "Quantum Code Technologies Ltd (QC Tech) is a UK-registered digital studio offering web development, mobile apps, e-commerce and AI integration services to businesses in the UK and Italy.",
        url: "https://www.qc-tech.co.uk",
        logo: "https://www.qc-tech.co.uk/logo-full.svg",
        email: "hello@qc-tech.co.uk",
        telephone: "+447754812247",
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.streetAddress,
          addressLocality: siteConfig.address.addressLocality,
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.addressCountry,
        },
        identifier: {
          "@type": "PropertyValue",
          name: "Companies House Number",
          value: "17317573",
        },
        sameAs: [
          "https://find-and-update.company-information.service.gov.uk/company/17317573",
        ],
        areaServed: ["GB", "IT"],
        serviceType: [
          "Web Development",
          "Mobile App Development",
          "E-commerce Development",
          "SEO Services",
          "Digital Marketing",
        ],
        priceRange: "££",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.qc-tech.co.uk/#website",
        url: "https://www.qc-tech.co.uk",
        name: "QC Tech",
        publisher: { "@id": "https://www.qc-tech.co.uk/#organization" },
        inLanguage: ["en-GB", "it-IT"],
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
                    text: "I nostri siti partono da 1.100 € per una landing page, da 1.700 € per un sito vetrina, da 9.500 € per un sito corporate. Ogni progetto riceve un preventivo personalizzato.",
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
                    text: "L'audit gratuito è un'analisi del tuo sito attuale, richiesta solo dal modulo contatti. Ti rispondiamo per iscritto entro 48 ore su cosa impedisce le conversioni, senza impegno.",
                  },
                },
              ]
            : [
                {
                  "@type": "Question",
                  name: "How much does a website cost?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our websites start from £900 for a landing page, from £1,400 for a business website, from £8,000 for a corporate platform. Every project gets a personalised quote.",
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
                    text: "The free website audit is a review of your current site, requested only through the contact form. We reply in writing within 48 hours on what is stopping conversions, with no obligation.",
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
