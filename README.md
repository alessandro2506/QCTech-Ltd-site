# QC Tech — qc-tech.co.uk

Sito marketing multi-lingua (IT/EN) sviluppato con Next.js App Router per presentare servizi, piani e raccogliere richieste tramite form contatti con invio email.

## Stack

- Next.js 16 (App Router)
- React 19
- `next-intl` per localizzazione IT/EN
- Tailwind CSS 4
- Nodemailer (SMTP Aruba) per invio email da API route e auto-reply al cliente
- Framer Motion per animazioni UI

## Pagine principali

- Home: `app/[locale]/page.tsx`
- Servizi: `app/[locale]/servizi/page.tsx`
- Vision: `app/[locale]/vision/page.tsx`
- Contatti: `app/[locale]/contatti/page.tsx`
- FAQ: `app/[locale]/faq/page.tsx`

## Localizzazione

- Dizionari: `messages/it.json`, `messages/en.json`
- Routing locale: `app/[locale]/...`
- Traduzioni pricing e form allineate in entrambe le lingue

## Form contatti

Componente: `components/contact-form.tsx`  
API: `app/api/contact/route.ts`

Funzionalita principali:

- Argomento obbligatorio, piano opzionale
- Selezione piano condizionale per topic `web`, `mobile`, `ecommerce`
- Blocco messaggio piano precompilato (nome + subtitle + prezzo) quando viene scelto un piano
- Banner riepilogo mostrato solo dopo selezione reale di un argomento
- URL sincronizzata con selezioni correnti (`topic`, `plan`) per coerenza stato
- Supporto prefill da query string in pagina contatti
- Fix reset form: rimossa `key` dinamica in `contatti/page.tsx` — nome/email non si perdono al cambio topic
- Link WhatsApp con deep link `wa.me` e messaggio precompilato IT/EN (`lib/get-whatsapp-href.ts`)
- Icona WhatsApp SVG inline sostituisce icona telefono
- Orari di apertura nella pagina contatti (Lun–Gio 09:00–17:30, Ven 09:00–14:30, Sab–Dom chiusi)

## Variabili ambiente

Copia `.env.example` in `.env.local` e valorizza:

```bash
SMTP_USER=
SMTP_PASS=
SMTP_NOREPLY_USER=
SMTP_NOREPLY_PASS=
CONTACT_TO_EMAIL=
DEEPL_AUTH_KEY=
```

Note:

- `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL` servono per la mail interna al team; `SMTP_NOREPLY_USER`, `SMTP_NOREPLY_PASS` per l’auto-reply al cliente (SMTP Aruba `smtps.aruba.it:465`). Non committare mai le password.
- In Vercel i nomi devono combaciare esattamente con quelli sopra. Rimuovi le vecchie variabili Resend se presenti.
- `DEEPL_AUTH_KEY` serve solo per lo script locale di traduzione.

## Script utili

```bash
npm run dev
npm run lint
npm run build
npm run i18n:deepl
```

## Asset brand

- Logo componente: `components/alvenco-logo.tsx` (esporta `QCTechLogo`)
- Logo full SVG (sfondo chiaro): `public/logo-full.svg`
- Logo full SVG (sfondo scuro): `public/logo-full-white.svg`
- Favicon attuale: `app/favicon.ico`
- Favicon precedente conservato: `app/favicon-old.ico`

## Changelog sintetico (ultimi update)

- Pagina FAQ dedicata con 15 domande/risposte in IT/EN, accordion Framer Motion, Schema.org FAQPage
- Pagina Vision/About riscritta con contenuto reale: story, team, valori, CTA
- Orari di apertura UK (37.5h/sett) nella pagina contatti
- WhatsApp deep link con messaggio precompilato professionale IT/EN
- Icona WhatsApp SVG inline con colore ufficiale #25D366
- Fix reset form contatti al cambio topic (rimossa key dinamica)
- Migrazione da Resend a Nodemailer SMTP Aruba (smtps.aruba.it:465)
- Auto-reply cliente da no-reply@qc-tech.co.uk: 48h, messaggio incluso, IT/EN
- Contatti aggiornati: hello@qc-tech.co.uk, +44 7754 812247
- Posizionamento brand aggiornato: studio UK-based, worldwide reach
- Google Search Console verificata con record TXT su Aruba
- WhatsApp Business configurato con messaggi automatici e risposte rapide
- i18n completa IT/EN con `next-intl` e switch lingua
- Home aggiornata con nuovo intro pricing localizzato
- Form contatti evoluto: piano opzionale, selezione condizionale, blocco piano nel messaggio
- Query string contatti sincronizzata con topic/piano correnti
- Banner contatti visibile solo dopo selezione reale dell'argomento
- Pagina servizi: rimosso prefill sezione nel form
- Invio email via Nodemailer (SMTP Aruba): mail interna + auto-reply al cliente
- Frase informativa form semplificata (nessun nome provider nel copy utente)
- CTA hero verso sezione prezzi (`#prezzi`) e miglioramenti UX scroll
- Settori servizi aggiunti (Hotel, Ristorazione, Logistica, Professionisti)
- Favicon aggiornato con simbolo QC Tech, con backup del precedente
- Logo sito migrato a SVG full + favicon rigenerata da simbolo SVG
- Logo aumentato su desktop mantenendo scala mobile invariata

## Deploy

Deploy consigliato su Vercel.

Prima del deploy:

1. Configura le environment variables richieste
2. Esegui `npm run lint`
3. Esegui `npm run build`

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
| Global | web agency UK worldwide, digital studio UK Italy, MVP development UK |
| AI Search | web agency UK Italy, digital studio UK-based worldwide, how much does a website cost UK |

### Performance targets (Lighthouse)
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- Score > 90 su tutte le categorie

## Posizionamento brand

**Differenziatore principale**: Studio digitale con sede UK e team distribuito tra Inghilterra e Italia — lavoriamo con clienti worldwide.

**Target cliente**:
- Aziende worldwide che cercano un partner digitale senior
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
