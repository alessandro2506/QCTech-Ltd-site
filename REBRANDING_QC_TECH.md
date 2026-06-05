# REBRANDING — Alvenco Ltd → Quantum Code Technologies Ltd (QC Tech)
> Creato: 01 Giugno 2026 | Da eseguire in ordine sequenziale

---

## CONTESTO

| Campo | Vecchio | Nuovo |
|---|---|---|
| Nome azienda | Alvenco Ltd | Quantum Code Technologies Ltd |
| Nome breve | Alvenco | QC Tech |
| Dominio | alvencoltd.co.uk | qc-tech.co.uk |
| Email | hello@alvenco.co.uk | hello@qc-tech.co.uk |
| GitHub org | AlvencoLtd | QCTech-Ltd |
| Repo sito | AlvencoLtd-site | QCTech-Ltd-site |

---

## STEP 1 — app.config.ts

Aggiorna il file `app.config.ts` nella root:

```ts
export const siteConfig = {
  name: "Quantum Code Technologies Ltd",
  shortName: "QC Tech",
  url: "https://www.qc-tech.co.uk",
  localeIt: "it_IT",
  localeEn: "en_GB",
  links: {
    email: "hello@qc-tech.co.uk",
    phone: "+44 7754 812247",
    whatsapp: "https://wa.me/447754812247",
  },
  address: {
    streetAddress: "Flat 3, Jackson Wharf, Adderley Road",
    addressLocality: "Bishop's Stortford",
    addressRegion: "Hertfordshire",
    postalCode: "CM23 3AX",
    addressCountry: "GB",
    full: "Flat 3, Jackson Wharf, Adderley Road, Bishop's Stortford, CM23 3AX",
  },
} as const;
```

---

## STEP 2 — package.json

Cambia il campo `name`:
```json
"name": "qctech-ltd-site"
```

---

## STEP 3 — Loghi

Copia questi 4 file da `/Users/alessandrofiscella/Desktop/QC Tech Ltd/` nella cartella `public/`:

- `QuantumCodeTechnologies_Logo_v2.svg` → `public/logo-full.svg`
- `QuantumCodeTechnologies_Logo_v2.png` → `public/logo-full.png`
- `QuantumCodeTechnologies_Logo_v2_White.svg` → `public/logo-full-white.svg`
- `QuantumCodeTechnologies_Logo_v2_White.png` → `public/logo-full-white.png`

Regola utilizzo loghi:
- Sfondo **chiaro** (navbar, footer light, documenti): `logo-full.svg` / `logo-full.png`
- Sfondo **scuro** (hero dark, footer dark, splash): `logo-full-white.svg` / `logo-full-white.png`

Elimina i vecchi file logo:
- `public/logo-full.svg` (vecchio Alvenco) — sostituito sopra
- `public/logo-full.png` (vecchio Alvenco) — sostituito sopra
- `public/Simbolo-logo-Alvenco_Ltd.svg`
- `public/simbolo-alvenco_ltd.png`

Aggiorna TUTTI i componenti che importano o referenziano i loghi:
- Cerca in tutto il codebase: `logo-full`, `Simbolo-logo`, `simbolo-alvenco`, `alvenco_logo`
- Sostituisci con i nuovi path corretti

---

## STEP 4 — messages/en.json

Sostituisci TUTTI i riferimenti testuali ad Alvenco:

```json
"meta": {
  "defaultTitle": "QC Tech — Web, E-commerce & Mobile",
  "defaultDescription": "The digital studio based in the UK, built to work globally.",
  "servicesTitle": "Services | QC Tech",
  "servicesDescription": "Websites, mobile apps, cloud and SEO focused on ROI for UK and Italian clients.",
  "visionTitle": "Vision | QC Tech",
  "visionDescription": "Technical scalability, evolving architectures and product roadmap for QC Tech.",
  "contactsTitle": "Contact | QC Tech",
  "contactsDescription": "Request a quote or an intro call with Quantum Code Technologies Ltd."
},
"footer": {
  "navLabel": "Footer",
  "legal": "© 2026 Quantum Code Technologies Ltd."
}
```

Cerca e sostituisci in `en.json`:
- `"Alvenco Ltd"` → `"Quantum Code Technologies Ltd"`
- `"Alvenco"` → `"QC Tech"`
- `"alvencoltd.co.uk"` → `"qc-tech.co.uk"`
- `"hello@alvenco.co.uk"` → `"hello@qc-tech.co.uk"`

---

## STEP 5 — messages/it.json

Stessa operazione di STEP 4 sul file italiano:
- `"Alvenco Ltd"` → `"Quantum Code Technologies Ltd"`
- `"Alvenco"` → `"QC Tech"`
- `"alvencoltd.co.uk"` → `"qc-tech.co.uk"`
- `"hello@alvenco.co.uk"` → `"hello@qc-tech.co.uk"`

---

## STEP 6 — app/layout.tsx e app/[locale]/layout.tsx

Aggiorna:
- `metadataBase`: `new URL("https://www.qc-tech.co.uk")`
- Qualsiasi riferimento a `alvencoltd.co.uk`
- Qualsiasi riferimento a `Alvenco` nel testo

---

## STEP 7 — app/sitemap.ts

Sostituisci:
- `baseUrl` o qualsiasi URL hardcoded `alvencoltd.co.uk` → `qc-tech.co.uk`

---

## STEP 8 — app/robots.ts

Sostituisci:
- `sitemap: "https://www.alvencoltd.co.uk/sitemap.xml"` → `"https://www.qc-tech.co.uk/sitemap.xml"`
- `host: "https://www.alvencoltd.co.uk"` → `"https://www.qc-tech.co.uk"`

---

## STEP 9 — Structured Data / Schema.org

Cerca in tutto il codebase riferimenti a:
- `"Alvenco Ltd"` nei JSON-LD → sostituisci con `"Quantum Code Technologies Ltd"`
- `"alvencoltd.co.uk"` → `"qc-tech.co.uk"`
- `"hello@alvenco.co.uk"` → `"hello@qc-tech.co.uk"`

File probabili: `app/[locale]/layout.tsx`, `components/`

---

## STEP 10 — .env.local ed .env.example

Aggiorna variabili che contengono riferimenti ad Alvenco o al vecchio dominio:
- `NEXT_PUBLIC_SITE_URL=https://www.qc-tech.co.uk`
- Qualsiasi altra variabile con `alvenco` nel nome o valore

---

## STEP 11 — Blog automation (GitHub Actions)

Apri `.github/workflows/` e trova il file di automazione blog.
Sostituisci:
- Qualsiasi URL `alvencoltd.co.uk` → `qc-tech.co.uk`
- Qualsiasi riferimento a `Alvenco Ltd` → `Quantum Code Technologies Ltd`
- Qualsiasi riferimento a `Alvenco` → `QC Tech`

---

## STEP 12 — Contenuti blog (content/blog/)

Nei file `.md` degli articoli, aggiorna il frontmatter se contiene:
- `author: "Alvenco Ltd"` → `"QC Tech"`
- Qualsiasi riferimento al vecchio brand nel corpo degli articoli

---

## STEP 13 — Verifica finale

Dopo tutte le modifiche:
1. Esegui: `grep -r "Alvenco" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" . | grep -v node_modules | grep -v .git | grep -v .next`
2. Verifica che il risultato sia VUOTO (zero occorrenze di "Alvenco")
3. Esegui: `npx tsc --noEmit` → deve dare 0 errori
4. Esegui: `npm run build` → deve completare senza errori

---

## STEP 14 — Git e GitHub

Dopo build verde:

```bash
# Aggiorna remote origin (repo personale rinominato)
git remote set-url origin https://github.com/alessandro2506/QCTech-Ltd-site.git

# Aggiorna remote alvenco (org rinominata QCTech-Ltd)
git remote set-url alvenco https://github.com/QCTech-Ltd/QCTech-Ltd-site.git

# Push
git add -A
git commit -m "rebranding: Alvenco Ltd → Quantum Code Technologies Ltd (QC Tech)"
git pull --rebase origin main
git push origin main && git push alvenco main
```

> ⚠️ NOTA: Prima di fare il push, verifica che i repo esistano con il nuovo nome su GitHub.
> - Rinomina `alessandro2506/AlvencoLtd-site` → `QCTech-Ltd-site` da GitHub Settings
> - Verifica che `QCTech-Ltd/AlvencoLtd-site` sia già rinominato in `QCTech-Ltd-site`

---

## STEP 15 — Vercel

Dopo il push, su Vercel:
1. Vai su progetto `alvencoltd-site` → Settings → General → rinomina in `qctech-ltd-site`
2. Vai su Domains → aggiungi `qc-tech.co.uk` e `www.qc-tech.co.uk`
3. Rimuovi (o mantieni per redirect) `alvencoltd.co.uk`
4. Verifica che il deploy sia andato a buon fine sul nuovo dominio

---

## CHECKLIST FINALE

- [ ] app.config.ts aggiornato
- [ ] package.json aggiornato
- [ ] Loghi sostituiti in public/
- [ ] messages/en.json aggiornato
- [ ] messages/it.json aggiornato
- [ ] layout.tsx aggiornato
- [ ] sitemap.ts aggiornato
- [ ] robots.ts aggiornato
- [ ] Schema.org aggiornato
- [ ] .env aggiornato
- [ ] GitHub Actions blog aggiornato
- [ ] Contenuti blog aggiornati
- [ ] grep "Alvenco" → zero risultati
- [ ] npx tsc --noEmit → 0 errori
- [ ] npm run build → verde
- [ ] Git remote aggiornati
- [ ] Push origin + alvenco
- [ ] Vercel dominio configurato
