# SEO_UPGRADE.md — Piano di upgrade SEO e conversione per qc-tech.co.uk
> Versione: 1.0 — Aprile 2026
> Questo file contiene tutte le istruzioni per Cursor per eseguire l'upgrade SEO e di conversione del sito QC Tech.
> **LEGGERE PRIMA DI QUALSIASI MODIFICA**: Questo è Next.js 16 con App Router e next-intl 4.x. Le convenzioni sono diverse da Next.js 13/14. Leggi `AGENTS.md` prima di scrivere qualsiasi codice.

---

## 0. PREREQUISITI — ESEGUIRE PRIMA DI TUTTO

### 0.1 Branch di backup
```bash
git checkout -b backup/pre-seo-upgrade
git push origin backup/pre-seo-upgrade
git checkout main
```

### 0.2 Verifica stato corrente
```bash
npm run lint
npm run build
```
Il build deve passare senza errori prima di iniziare qualsiasi modifica.

---

## 1. STRUTTURA INTERVENTI

Gli interventi sono divisi in tre livelli di priorità. Eseguirli nell'ordine indicato senza saltare step.

| Priorità | Area | Impatto |
|---|---|---|
| 🔴 CRITICA | SEO tecnica (metadata, sitemap, robots, OG) | Google ranking + AI search |
| 🟡 ALTA | Copy e messaggi (it.json + en.json) | Conversione visitatori |
| 🟢 MEDIA | Schema.org structured data | AI search (ChatGPT, Gemini, Perplexity) |

---

## 2. 🔴 PRIORITÀ CRITICA — SEO TECNICA

### 2.1 Sitemap dinamica

Crea il file `app/sitemap.ts` nella root di `app/`:

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.qc-tech.co.uk'
  const locales = ['it', 'en']
  const pages = ['', '/servizi', '/vision', '/contatti']

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            it: `${baseUrl}/it${page}`,
            en: `${baseUrl}/en${page}`,
          },
        },
      })
    }
  }

  return entries
}
```

### 2.2 Robots.txt

Crea il file `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: 'https://www.qc-tech.co.uk/sitemap.xml',
    host: 'https://www.qc-tech.co.uk',
  }
}
```

### 2.3 Layout metadata globale

Nel file `app/[locale]/layout.tsx`, assicurati che la funzione `generateMetadata` (o il campo `metadata` statico) sia configurata correttamente per ogni locale. Usa questa struttura:

```typescript
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    metadataBase: new URL('https://www.qc-tech.co.uk'),
    title: {
      default: t('title'),
      template: `%s | Quantum Code Technologies Ltd`,
    },
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'Quantum Code Technologies Ltd', url: 'https://www.qc-tech.co.uk' }],
    creator: 'Quantum Code Technologies Ltd',
    publisher: 'Quantum Code Technologies Ltd',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'it' ? 'it_IT' : 'en_GB',
      alternateLocale: locale === 'it' ? 'en_GB' : 'it_IT',
      url: `https://www.qc-tech.co.uk/${locale}`,
      siteName: 'Quantum Code Technologies Ltd',
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Quantum Code Technologies Ltd — The UK–Italy Digital Studio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://www.qc-tech.co.uk/${locale}`,
      languages: {
        'it': 'https://www.qc-tech.co.uk/it',
        'en': 'https://www.qc-tech.co.uk/en',
        'x-default': 'https://www.qc-tech.co.uk/en',
      },
    },
  }
}
```

### 2.4 OG Image

Crea il file `app/opengraph-image.tsx` (oppure aggiungi `public/og-image.png` — 1200x630px).

Se usi il componente dinamico:

```typescript
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Quantum Code Technologies Ltd — The UK–Italy Digital Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1A3A5C 0%, #0d1f33 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div style={{ color: '#B8924A', fontSize: 28, marginBottom: 16, letterSpacing: 4 }}>
          ALVENCO LTD
        </div>
        <div style={{ color: '#ffffff', fontSize: 52, fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
          The UK–Italy Digital Studio
        </div>
        <div style={{ color: '#94a3b8', fontSize: 26, marginTop: 24, textAlign: 'center' }}>
          Websites · E-commerce · Mobile Apps
        </div>
        <div style={{ color: '#B8924A', fontSize: 20, marginTop: 40, borderTop: '1px solid #B8924A', paddingTop: 20, width: '100%', textAlign: 'center' }}>
          qc-tech.co.uk
        </div>
      </div>
    ),
    { ...size }
  )
}
```

### 2.5 next.config.ts — Aggiungi headers SEO

Aggiorna `next.config.ts`:

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig);
```

---

## 3. 🟡 PRIORITÀ ALTA — COPY E MESSAGGI

### Strategia copy

Il posizionamento centrale di QC Tech è il **differenziatore UK–Italia**: nessuna agenzia concorrente locale ha questa caratteristica. Tutto il copy deve ruotare attorno a questo.

**Tono**: professionale, diretto, orientato ai risultati. Mai generico. Mai elenchi di tecnologie. Sempre benefici concreti.

**CTA principale**: "Get a free audit" (EN) / "Audit gratuito del sito" (IT) — questa è la conversione primaria.

---

### 3.1 Aggiornamento `messages/en.json`

Aggiungi o aggiorna il namespace `Metadata` e aggiorna i testi esistenti come segue. NON modificare la struttura delle chiavi già esistenti — solo i valori. Aggiungere le chiavi mancanti.

#### Namespace `Metadata` (nuovo — da aggiungere):
```json
"Metadata": {
  "title": "Web Agency UK & Italy — Websites, Apps & E-commerce | Quantum Code Technologies Ltd",
  "description": "Quantum Code Technologies Ltd builds websites, e-commerce and mobile apps for businesses expanding between UK and Italy. Based in Bishop's Stortford, Hertfordshire. Free site audit.",
  "keywords": "web agency UK, web development Hertfordshire, app development UK, e-commerce UK Italy, web agency Bishop's Stortford, React Native app UK, Next.js development UK, Italian web agency UK"
}
```

#### Hero section — aggiornare i valori esistenti:
```json
"Hero": {
  "badge": "UK · Italy · Digital Studio",
  "title": "The UK–Italy Digital Studio",
  "subtitle": "We build websites, e-commerce and mobile apps for businesses expanding across borders — converting more visitors into paying clients.",
  "cta_primary": "Get a free site audit",
  "cta_secondary": "See our services"
}
```

#### Sezione problema (se non esiste, crearla):
```json
"Problem": {
  "headline": "Most sites attract visitors. Few convert them.",
  "body": "If your site isn't bringing you qualified enquiries, the problem isn't traffic — it's strategy. We audit, redesign and rebuild digital presences that actually work.",
  "stat1_value": "3–5%",
  "stat1_label": "Average conversion rate we target",
  "stat2_value": "48h",
  "stat2_label": "Time to receive your free audit",
  "stat3_value": "IT + UK",
  "stat3_label": "The only markets we serve — and we know them both"
}
```

#### Servizi — aggiornare benefit-first:
```json
"Services": {
  "web": {
    "title": "Websites that generate leads",
    "description": "From landing pages to full corporate sites. Built to rank on Google and convert visitors into enquiries. Performance-first, mobile-first, SEO-first."
  },
  "ecommerce": {
    "title": "E-commerce built to sell",
    "description": "Online stores optimised for conversion. UX, speed, and checkout flows designed to reduce abandonment and increase average order value."
  },
  "mobile": {
    "title": "Mobile apps with AI integration",
    "description": "Native iOS & Android apps. We build what differentiates you — from MVP to full product. Our portfolio includes a civic AI platform used by UK local authorities."
  },
  "expansion": {
    "title": "UK–Italy digital expansion",
    "description": "Operating in both markets means we handle both languages, both legal frameworks (UK GDPR & EU GDPR), and both customer cultures. No other local agency does this."
  }
}
```

#### Social proof / about:
```json
"About": {
  "headline": "We don't build sites. We build systems that bring you clients.",
  "body": "Quantum Code Technologies Ltd is a web and app studio based in Bishop's Stortford, Hertfordshire. Our team operates across UK and Italy — building digital products for businesses that want to grow in both markets.",
  "proof": "Our track record includes CivicAlert, a civic AI reporting platform deployed across UK local authorities — proof that we build things that scale.",
  "cta": "Book a free 15-minute call. No commitment."
}
```

#### FAQ (nuovo namespace — importante per AI search):
```json
"FAQ": {
  "title": "Frequently asked questions",
  "q1": "How much does a website cost?",
  "a1": "Our websites start from £600 for a landing page up to £15,000+ for a full corporate platform. Every project gets a personalised quote. We also serve Italian clients with pricing in EUR.",
  "q2": "Do you work with Italian companies?",
  "a2": "Yes. We operate across both UK and Italy. We handle IT and EN content, UK GDPR and EU GDPR compliance, and billing in both GBP and EUR.",
  "q3": "What is a free site audit?",
  "a3": "A 15-minute call where we review your current site and tell you exactly what's stopping it from converting. No strings attached. Book via the contact form.",
  "q4": "How long does a website project take?",
  "a4": "Landing pages: 1–2 weeks. Full websites: 4–8 weeks. E-commerce: 6–12 weeks. Mobile apps: 3–6 months depending on complexity.",
  "q5": "What technologies do you use?",
  "a5": "Next.js, React Native, Tailwind CSS, TypeScript, Supabase, and AI integrations (OpenAI, Google Vision). We choose the right tool for each project, not the trendy one."
}
```

#### CTA finale:
```json
"FinalCTA": {
  "headline": "Ready to turn your site into a client machine?",
  "subheadline": "Book a free 15-minute audit call. We'll tell you exactly what's holding your site back — no commitment, no sales pitch.",
  "button": "Book your free audit →",
  "note": "We respond within 24 hours."
}
```

---

### 3.2 Aggiornamento `messages/it.json`

Stesso schema del file EN, tradotto professionalmente in italiano. NON usare traduzione automatica letterale — adattare al mercato italiano.

#### Namespace `Metadata`:
```json
"Metadata": {
  "title": "Agenzia Web UK e Italia — Siti, App ed E-commerce | Quantum Code Technologies Ltd",
  "description": "Quantum Code Technologies Ltd realizza siti web, e-commerce e app mobile per aziende che operano tra UK e Italia. Sede a Bishop's Stortford, Hertfordshire. Audit gratuito del sito.",
  "keywords": "agenzia web UK, sviluppo web Hertfordshire, sviluppo app mobile UK, e-commerce UK Italia, agenzia web italiana UK, React Native UK, Next.js UK, agenzia digitale italiani in UK"
}
```

#### Hero:
```json
"Hero": {
  "badge": "UK · Italia · Studio Digitale",
  "title": "Lo studio digitale tra UK e Italia",
  "subtitle": "Realizziamo siti web, e-commerce e app mobile per aziende che vogliono crescere su entrambi i mercati — trasformando i visitatori in clienti.",
  "cta_primary": "Richiedi un audit gratuito",
  "cta_secondary": "Scopri i servizi"
}
```

#### Problema:
```json
"Problem": {
  "headline": "La maggior parte dei siti attira visite. Pochi le convertono.",
  "body": "Se il tuo sito non ti porta richieste qualificate, il problema non è il traffico — è la strategia. Analizziamo, riprogettamo e ricostruiamo presenze digitali che funzionano davvero.",
  "stat1_value": "3–5%",
  "stat1_label": "Tasso di conversione che puntiamo a raggiungere",
  "stat2_value": "48h",
  "stat2_label": "Tempo per ricevere il tuo audit gratuito",
  "stat3_value": "IT + UK",
  "stat3_label": "Gli unici due mercati che serviamo — e che conosciamo in profondità"
}
```

#### Servizi:
```json
"Services": {
  "web": {
    "title": "Siti web che generano contatti",
    "description": "Dalla landing page al sito corporate completo. Costruiti per posizionarsi su Google e convertire i visitatori in richieste. Performance, mobile e SEO al primo posto."
  },
  "ecommerce": {
    "title": "E-commerce ottimizzato per vendere",
    "description": "Negozi online progettati per la conversione. UX, velocità e flussi di acquisto pensati per ridurre l'abbandono e aumentare il valore medio del carrello."
  },
  "mobile": {
    "title": "App mobile con integrazione AI",
    "description": "App native iOS e Android. Dal MVP al prodotto completo. Il nostro portfolio include una piattaforma AI civica utilizzata da enti locali del Regno Unito."
  },
  "expansion": {
    "title": "Espansione digitale UK–Italia",
    "description": "Operiamo in entrambi i mercati: gestiamo due lingue, due quadri normativi (UK GDPR e GDPR UE) e due culture commerciali. Nessuna altra agenzia locale lo fa."
  }
}
```

#### About:
```json
"About": {
  "headline": "Non costruiamo siti. Costruiamo sistemi che portano clienti.",
  "body": "Quantum Code Technologies Ltd è uno studio web e app con sede a Bishop's Stortford, Hertfordshire. Il nostro team opera tra UK e Italia, costruendo prodotti digitali per aziende che vogliono crescere in entrambi i mercati.",
  "proof": "Il nostro portfolio include CivicAlert, una piattaforma AI civica distribuita presso enti locali del Regno Unito — la prova che costruiamo cose che scalano.",
  "cta": "Prenota una chiamata gratuita di 15 minuti. Senza impegno."
}
```

#### FAQ:
```json
"FAQ": {
  "title": "Domande frequenti",
  "q1": "Quanto costa un sito web?",
  "a1": "I nostri siti partono da £600 per una landing page fino a £15.000+ per una piattaforma corporate completa. Ogni progetto riceve un preventivo personalizzato. Serviamo anche clienti italiani con prezzi in EUR.",
  "q2": "Lavorate con aziende italiane?",
  "a2": "Sì. Operiamo sia in UK che in Italia. Gestiamo contenuti in IT e EN, conformità UK GDPR e GDPR UE, e fatturazione in GBP ed EUR.",
  "q3": "Cos'è l'audit gratuito del sito?",
  "a3": "Una chiamata di 15 minuti in cui analizziamo il tuo sito attuale e ti diciamo esattamente cosa impedisce le conversioni. Senza impegno. Prenota tramite il modulo contatti.",
  "q4": "Quanto tempo richiede un progetto web?",
  "a4": "Landing page: 1–2 settimane. Siti completi: 4–8 settimane. E-commerce: 6–12 settimane. App mobile: 3–6 mesi in base alla complessità.",
  "q5": "Quali tecnologie utilizzate?",
  "a5": "Next.js, React Native, Tailwind CSS, TypeScript, Supabase e integrazioni AI (OpenAI, Google Vision). Scegliamo lo strumento giusto per ogni progetto, non quello di tendenza."
}
```

#### CTA finale:
```json
"FinalCTA": {
  "headline": "Pronto a trasformare il tuo sito in un generatore di clienti?",
  "subheadline": "Prenota un audit gratuito di 15 minuti. Ti diremo esattamente cosa blocca le conversioni del tuo sito — senza impegno, senza vendite aggressive.",
  "button": "Prenota il tuo audit gratuito →",
  "note": "Rispondiamo entro 24 ore."
}
```

---

## 4. 🟢 PRIORITÀ MEDIA — SCHEMA.ORG STRUCTURED DATA

### 4.1 Componente Schema (nuovo file)

Crea `components/schema-org.tsx`:

```typescript
export function SchemaOrg({ locale }: { locale: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.qc-tech.co.uk/#organization',
        name: 'Quantum Code Technologies Ltd',
        alternateName: 'QC Tech',
        description: locale === 'it'
          ? 'Studio digitale specializzato in siti web, e-commerce e app mobile per aziende UK e italiane.'
          : 'Digital studio specialised in websites, e-commerce and mobile apps for UK and Italian businesses.',
        url: 'https://www.qc-tech.co.uk',
        telephone: '+447895907800',
        email: 'hello@qc-tech.co.uk',
        address: {
          '@type': 'PostalAddress',
          addressLocality: "Bishop's Stortford",
          addressRegion: 'Hertfordshire',
          addressCountry: 'GB',
        },
        areaServed: ['GB', 'IT'],
        serviceType: [
          'Web Development',
          'Mobile App Development',
          'E-commerce Development',
          'SEO Services',
          'Digital Marketing',
        ],
        priceRange: '££',
        sameAs: [
          'https://github.com/alessandro2506',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.qc-tech.co.uk/#website',
        url: 'https://www.qc-tech.co.uk',
        name: 'Quantum Code Technologies Ltd',
        publisher: { '@id': 'https://www.qc-tech.co.uk/#organization' },
        inLanguage: ['en-GB', 'it-IT'],
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.qc-tech.co.uk/en?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: locale === 'it'
          ? [
              { '@type': 'Question', name: 'Quanto costa un sito web?', acceptedAnswer: { '@type': 'Answer', text: 'I nostri siti partono da £600 per una landing page fino a £15.000+ per una piattaforma corporate completa.' } },
              { '@type': 'Question', name: 'Lavorate con aziende italiane?', acceptedAnswer: { '@type': 'Answer', text: 'Sì. Operiamo sia in UK che in Italia, con gestione di contenuti IT e EN, conformità GDPR e fatturazione in GBP ed EUR.' } },
              { '@type': 'Question', name: "Cos'è l'audit gratuito del sito?", acceptedAnswer: { '@type': 'Answer', text: 'Una chiamata di 15 minuti in cui analizziamo il tuo sito attuale e ti diciamo esattamente cosa impedisce le conversioni, senza impegno.' } },
            ]
          : [
              { '@type': 'Question', name: 'How much does a website cost?', acceptedAnswer: { '@type': 'Answer', text: 'Our websites start from £600 for a landing page up to £15,000+ for a full corporate platform. We also serve Italian clients with pricing in EUR.' } },
              { '@type': 'Question', name: 'Do you work with Italian companies?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We operate across both UK and Italy, handling IT and EN content, GDPR compliance, and billing in both GBP and EUR.' } },
              { '@type': 'Question', name: 'What is a free site audit?', acceptedAnswer: { '@type': 'Answer', text: 'A 15-minute call where we review your current site and tell you exactly what\'s stopping it from converting. No strings attached.' } },
            ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### 4.2 Aggiunta Schema al layout

Nel file `app/[locale]/layout.tsx`, aggiungi il componente `<SchemaOrg locale={locale} />` all'interno del `<head>` o come primo elemento del `<body>`.

---

## 5. AGGIORNAMENTO README.md

Aggiorna il `README.md` esistente aggiungendo queste sezioni (senza rimuovere il contenuto già presente — solo aggiunte e aggiornamenti):

### Aggiungere in fondo al README:

```markdown
## SEO & Performance

### File SEO aggiunti
- `app/sitemap.ts` — sitemap dinamica IT/EN con hreflang
- `app/robots.ts` — robots.txt con riferimento sitemap
- `app/opengraph-image.tsx` — OG image dinamica 1200x630
- `components/schema-org.tsx` — Schema.org structured data (LocalBusiness + FAQPage + WebSite)

### Metadata strategy
- Ogni pagina ha `generateMetadata` con title/description localizzati
- Hreflang configurato per IT/EN con x-default su EN
- Open Graph e Twitter Card su tutte le pagine
- Canonical URL su ogni pagina

### Keyword targets
| Mercato | Keyword primarie |
|---|---|
| UK | web agency Hertfordshire, app development UK, web developer Bishop's Stortford |
| IT | agenzia web UK italiani, sviluppo sito web UK, app mobile UK Italia |
| AI Search | digital studio UK Italy, web agency bilingual UK |

### Performance targets (Lighthouse)
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- Score > 90 su tutte le categorie

## Posizionamento brand

**Differenziatore principale**: Unico studio digitale che opera nativamente su mercato UK e mercato italiano.

**Target cliente**:
- Aziende italiane che vogliono espandersi in UK
- Aziende UK che vogliono raggiungere il mercato italiano
- PMI locali Hertfordshire senza sito o con sito obsoleto

**CTA principale**: "Free site audit" (EN) / "Audit gratuito del sito" (IT)

## Changelog SEO (Aprile 2026)
- Aggiunta sitemap dinamica con hreflang IT/EN
- Aggiunto robots.ts
- Aggiunto Schema.org (LocalBusiness + FAQPage + WebSite)
- Aggiornati metadata con keyword strategy duale UK/IT
- Aggiunto OG image dinamico
- Aggiornato copy hero e servizi con posizionamento UK–Italia
- Aggiunto namespace FAQ nei messaggi IT/EN per AI search optimization
- Aggiunta sezione FinalCTA con audit gratuito come lead magnet
- Aggiunti security headers in next.config.ts
```

---

## 6. VERIFICA FINALE

Dopo aver implementato tutto, eseguire nell'ordine:

```bash
npm run lint
npm run build
```

Il build deve completarsi senza errori. Verificare in particolare:

1. `http://localhost:3000/sitemap.xml` — deve mostrare tutte le URL con hreflang
2. `http://localhost:3000/robots.txt` — deve puntare alla sitemap
3. View Source di homepage IT e EN — verificare presence di `<script type="application/ld+json">`
4. Open Graph: usare https://opengraph.xyz per verificare OG image e metadata

Solo dopo aver verificato tutto in locale:

```bash
git add -A
git commit -m "feat(seo): sitemap, robots, schema.org, OG image, metadata strategy, copy UK-Italy positioning"
git push origin main
```

Vercel farà il deploy automaticamente.

---

## 7. COSA NON TOCCARE

- Struttura routing `app/[locale]/...` — non modificare
- File `middleware.ts` — non modificare
- File `i18n/routing.ts` e `i18n/request.ts` — non modificare
- Form contatti `components/contact-form.tsx` e `app/api/contact/route.ts` — non modificare
- Animazioni Framer Motion esistenti — non rimuovere
- Struttura chiavi JSON nei messaggi — solo aggiungere o modificare valori
- Logo e asset brand in `public/` — non modificare

---

## 8. NOTE PER CURSOR

- Questo è **Next.js 16** — leggi `AGENTS.md` prima di qualsiasi intervento
- `next-intl` versione 4.x — la sintassi di `getTranslations` e `useTranslations` può differire da versioni precedenti
- Tailwind CSS 4 — non usare sintassi v3 (es. `bg-opacity-50` è deprecata, usa `bg-black/50`)
- Tutti i testi visibili all'utente devono passare per i file `messages/` — mai testo hardcoded nei componenti
- Verificare sempre che le nuove chiavi JSON siano presenti in ENTRAMBI i file `it.json` e `en.json`
