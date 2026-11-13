/**
 * QC Tech Blog Pipeline — Auto-generates a weekly blog post
 * using Claude API, then saves EN + original IT versions (not a translation).
 *
 * Topics rotate across:
 *   - QC Tech core services (web, app, SEO, e-commerce)
 *   - Client sectors (hotel, F&B, logistics, transport, tourism)
 *   - UK digital market insights
 *   - AI & digital transformation
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function stripCodeFence(text) {
  return text.replace(/^```(?:markdown)?\n?([\s\S]*?)```\s*$/m, "$1").trim();
}
const ROOT = path.resolve(__dirname, "..");
const BLOG_EN = path.join(ROOT, "content/blog/en");
const BLOG_IT = path.join(ROOT, "content/blog/it");
const COSTS_FILE = path.join(ROOT, "data/blog-costs.csv");

const MODEL = "claude-sonnet-4-6";
/** ~1,500 words ≈ 2,100 tokens + FAQ/CTA/frontmatter + margin */
const MAX_TOKENS = 4500;
const INPUT_USD_PER_MTOK = 3;
const OUTPUT_USD_PER_MTOK = 15;
const DEFAULT_MAX_COST_USD = 0.5;

const DRY_RUN =
  process.argv.includes("--dry-run") || process.env.BLOG_DRY_RUN === "1";
const MAX_COST_USD = Number.parseFloat(
  process.env.BLOG_MAX_COST_USD || String(DEFAULT_MAX_COST_USD),
);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOPIC_POOL = [
  "how to choose a web agency in the UK",
  "Next.js vs WordPress for business websites UK 2026",
  "how much does a mobile app cost UK 2026",
  "what is a headless CMS and why it matters for UK businesses",
  "React Native vs Flutter for mobile apps 2026",
  "how to improve website conversion rate UK small business",
  "technical SEO checklist for UK businesses 2026",
  "what is Core Web Vitals and how it affects Google ranking UK",
  "how to build an e-commerce website UK 2026",
  "AI chatbots for small business websites UK",
  "hotel website best practices UK 2026",
  "how to increase direct bookings for UK hotels",
  "digital marketing for B&B and guesthouses UK",
  "best booking engine software for small UK hotels",
  "local SEO for hotels and accommodation UK",
  "restaurant website design tips UK 2026",
  "how to set up online ordering for UK restaurants",
  "digital menu QR code best practices UK",
  "Google Business Profile for restaurants UK",
  "social media strategy for UK restaurants 2026",
  "digital transformation for UK logistics companies",
  "how logistics companies can use web portals to serve clients",
  "fleet management software UK small companies",
  "NCC taxi website best practices UK",
  "how private hire companies can get more bookings online UK",
  "digital marketing for UK tourism businesses 2026",
  "how to attract international tourists to UK experiences",
  "visit England tourism website SEO tips",
  "booking software for UK tour operators",
  "why UK small businesses need a website in 2026",
  "how to get your business found on Google UK",
  "website accessibility WCAG 2.2 guide for UK businesses",
  "GDPR compliance for UK business websites 2026",
  "how to measure ROI of a business website UK",
];

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function getUsedSlugs(dir) {
  if (!fs.existsSync(dir)) return new Set();
  return new Set(fs.readdirSync(dir).map((f) => f.replace(/\.md$/, "")));
}

function pickTopic(usedSlugs) {
  const unused = TOPIC_POOL.filter((t) => !usedSlugs.has(slugify(t)));
  if (unused.length === 0) {
    return TOPIC_POOL[Math.floor(Math.random() * TOPIC_POOL.length)];
  }
  return unused[Math.floor(Math.random() * unused.length)];
}

function parseFmField(raw, key) {
  const match = raw.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, "m"));
  return match ? match[1].trim() : "";
}

function upsertFrontmatter(raw, fields) {
  const extra = Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
  if (!raw.startsWith("---")) {
    return `---\n${extra}\n---\n\n${raw}`;
  }
  const close = raw.indexOf("\n---", 3);
  if (close === -1) return raw;
  let fm = raw.slice(4, close);
  for (const [key, value] of Object.entries(fields)) {
    const line = `${key}: ${JSON.stringify(value)}`;
    const re = new RegExp(`^${key}:\\s*.*$`, "m");
    fm = re.test(fm) ? fm.replace(re, line) : `${fm}\n${line}`;
  }
  return `---\n${fm}\n---${raw.slice(close + 4)}`;
}

function wordCount(markdown) {
  const body = markdown.replace(/^---[\s\S]*?---/, "").trim();
  return body.split(/\s+/).filter(Boolean).length;
}

function usageTokens(response) {
  const usage = response.usage ?? {};
  return {
    input: Number(usage.input_tokens ?? 0),
    output: Number(usage.output_tokens ?? 0),
  };
}

function estimateCostUsd(inputTokens, outputTokens) {
  return (
    (inputTokens * INPUT_USD_PER_MTOK + outputTokens * OUTPUT_USD_PER_MTOK) /
    1_000_000
  );
}

function appendCostRow({ date, slug, model, input, output, cost }) {
  fs.mkdirSync(path.dirname(COSTS_FILE), { recursive: true });
  if (!fs.existsSync(COSTS_FILE)) {
    fs.writeFileSync(
      COSTS_FILE,
      "date,slug,model,input_tokens,output_tokens,estimated_cost_usd\n",
      "utf-8",
    );
  }
  fs.appendFileSync(
    COSTS_FILE,
    `${date},${slug},${model},${input},${output},${cost.toFixed(4)}\n`,
    "utf-8",
  );
}

function listPostSummaries(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      return { slug, title: parseFmField(raw, "title") || slug };
    });
}

function pickRelated(dir, excludeSlug, count = 2) {
  const pool = listPostSummaries(dir).filter((p) => p.slug !== excludeSlug);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function serviceForTopic(topic, locale) {
  const t = topic.toLowerCase();
  const isEn = locale === "en";
  const base = isEn
    ? "https://www.qc-tech.co.uk/en/services"
    : "https://www.qc-tech.co.uk/it/servizi";
  if (/app|flutter|react native|mobile/.test(t)) {
    return {
      url: `${base}#servizio-app`,
      label: isEn ? "mobile app development" : "sviluppo di app mobile",
    };
  }
  if (/seo|google|core web vitals|ranking|local seo/.test(t)) {
    return {
      url: `${base}#servizio-seo`,
      label: isEn ? "SEO and visibility" : "SEO e visibilità",
    };
  }
  if (/e-commerce|ecommerce|ordering|booking engine/.test(t)) {
    return {
      url: base,
      label: isEn ? "e-commerce websites" : "siti e-commerce",
    };
  }
  return {
    url: `${base}#servizio-web`,
    label: isEn ? "website design" : "progettazione siti web",
  };
}

function relatedBlock(posts, locale) {
  const prefix = locale === "en" ? "en" : "it";
  return posts
    .map(
      (p) =>
        `- [${p.title}](https://www.qc-tech.co.uk/${prefix}/blog/${p.slug})`,
    )
    .join("\n");
}

function buildENPrompt(topic, service, related) {
  return `You are a senior content writer for Quantum Code Technologies Ltd (QC Tech), a UK-based digital studio specialising in web design, mobile apps, e-commerce and SEO. You are based in Bishop's Stortford, Hertfordshire, UK.

Write a comprehensive, SEO-optimised blog article in English about: "${topic}"

REQUIREMENTS:
- Length: 1,200–1,500 words (body only; stay inside this range)
- Tone: professional, direct, results-oriented — for UK business owners
- No fluff — every paragraph must add value
- Include real, verifiable UK market data, £ prices and concrete examples (2026)
- Mention QC Tech or Quantum Code Technologies Ltd at most 1–2 times, not promotional
- Structure (mandatory):
  1. Short intro (no H2)
  2. Exactly 4–6 H2 sections (##). Use ### only when needed.
  3. Concrete numbers, examples or a small table
  4. A ## FAQ section with 3–5 questions as ### headings, each followed by a concise answer
  5. A final ## Next steps section with:
     - a CTA linking to ${service.url} (label: ${service.label})
     - links to these two existing articles (use these exact URLs):
${relatedBlock(related, "en")}

OUTPUT FORMAT — return ONLY valid frontmatter + markdown, nothing else:

---
title: "[SEO-optimised title]"
date: "${todayISO()}"
author: "QC Tech"
authorRole: "Digital Studio — Bishop's Stortford, UK"
excerpt: "[2-sentence compelling summary, max 160 chars]"
tags: ["tag1", "tag2", "tag3", "tag4"]
readTime: "[N] min read"
---

[Article content here in markdown]`;
}

function buildITPrompt(topic, service, related) {
  return `Sei un redattore senior per Quantum Code Technologies Ltd (QC Tech), studio digitale con sede nel Regno Unito che lavora con PMI italiane.

Scrivi un articolo ORIGINALE in italiano sullo STESSO TEMA di: "${topic}".

REGOLE:
- NON tradurre un articolo UK. Adatta il tema al mercato italiano (PMI, IVA, Google.it, esempi italiani).
- Prezzi in euro (€), non in sterline.
- Lunghezza: 1.200–1.500 parole (solo corpo)
- Tono professionale, diretto, orientato ai risultati
- Dati e numeri concreti
- QC Tech al massimo 1–2 volte, non promozionale
- Struttura obbligatoria:
  1. Intro breve (senza H2)
  2. Esattamente 4–6 H2 (##)
  3. Esempi/numeri concreti o una tabella
  4. Sezione ## FAQ con 3–5 domande in ### e risposta sotto ciascuna
  5. Sezione finale ## Prossimi passi con CTA a ${service.url} (${service.label}) e questi due articoli esistenti (URL esatti):
${relatedBlock(related, "it")}

OUTPUT — SOLO frontmatter + markdown:

---
title: "[titolo SEO in italiano]"
slug: "[slug-italiano-con-trattini]"
date: "${todayISO()}"
author: "QC Tech"
authorRole: "Digital Studio — Bishop's Stortford, UK"
excerpt: "[riassunto in 2 frasi, max 160 caratteri]"
tags: ["tag1", "tag2", "tag3", "tag4"]
readTime: "[N] min"
---

[contenuto]`;
}

async function generateMarkdown(prompt) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [{ role: "user", content: prompt }],
  });
  const text = stripCodeFence(
    response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n"),
  );
  return { text, tokens: usageTokens(response) };
}

function uniqueItSlug(desired, used) {
  let slug = desired || "articolo";
  if (!used.has(slug)) return slug;
  let i = 2;
  while (used.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}

async function main() {
  console.log("QC Tech Blog Pipeline starting...");
  if (DRY_RUN) console.log("Mode: dry-run (no files published)");
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY");
    process.exit(1);
  }
  if (!Number.isFinite(MAX_COST_USD) || MAX_COST_USD <= 0) {
    console.error("Invalid BLOG_MAX_COST_USD");
    process.exit(1);
  }

  fs.mkdirSync(BLOG_EN, { recursive: true });
  fs.mkdirSync(BLOG_IT, { recursive: true });

  const usedEn = getUsedSlugs(BLOG_EN);
  const usedIt = getUsedSlugs(BLOG_IT);
  const topic = pickTopic(usedEn);
  const enSlug = slugify(topic);
  const translationKey = enSlug;
  const relatedEn = pickRelated(BLOG_EN, enSlug, 2);
  const relatedIt = pickRelated(BLOG_IT, enSlug, 2);
  const serviceEn = serviceForTopic(topic, "en");
  const serviceIt = serviceForTopic(topic, "it");

  console.log(`Topic: "${topic}"`);
  console.log(`EN slug (planned): ${enSlug}`);
  console.log(`translationKey: ${translationKey}`);
  console.log(`Model: ${MODEL}  max_tokens: ${MAX_TOKENS}`);

  console.log("Generating EN article...");
  const en = await generateMarkdown(
    buildENPrompt(topic, serviceEn, relatedEn),
  );
  let enContent = upsertFrontmatter(en.text, { translationKey });

  console.log("Generating original IT article (not a translation)...");
  const it = await generateMarkdown(
    buildITPrompt(topic, serviceIt, relatedIt),
  );
  const itTitle = parseFmField(it.text, "title");
  const requestedItSlug = slugify(
    parseFmField(it.text, "slug") || itTitle || `${enSlug}-it`,
  );
  const itSlug = uniqueItSlug(requestedItSlug, usedIt);
  let itContent = upsertFrontmatter(it.text, {
    translationKey,
    slug: itSlug,
  });

  const inputTokens = en.tokens.input + it.tokens.input;
  const outputTokens = en.tokens.output + it.tokens.output;
  const cost = estimateCostUsd(inputTokens, outputTokens);
  const enWords = wordCount(enContent);
  const itWords = wordCount(itContent);

  console.log("--- run stats ---");
  console.log(`EN words: ${enWords}`);
  console.log(`IT words: ${itWords}`);
  console.log(`EN tokens in/out: ${en.tokens.input}/${en.tokens.output}`);
  console.log(`IT tokens in/out: ${it.tokens.input}/${it.tokens.output}`);
  console.log(`Total tokens in/out: ${inputTokens}/${outputTokens}`);
  console.log(`Estimated cost USD: ${cost.toFixed(4)}`);
  console.log(`Cost cap USD: ${MAX_COST_USD.toFixed(2)}`);

  if (!DRY_RUN) {
    appendCostRow({
      date: todayISO(),
      slug: translationKey,
      model: MODEL,
      input: inputTokens,
      output: outputTokens,
      cost,
    });
    console.log(`Cost log: ${COSTS_FILE}`);
  }

  if (cost > MAX_COST_USD) {
    console.error(
      `Cost ${cost.toFixed(4)} USD exceeds BLOG_MAX_COST_USD=${MAX_COST_USD}. Not publishing.`,
    );
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log("Dry-run complete: markdown not written, csv not updated.");
    console.log(`Would write EN: ${path.join(BLOG_EN, `${enSlug}.md`)}`);
    console.log(`Would write IT: ${path.join(BLOG_IT, `${itSlug}.md`)}`);
    return;
  }

  const enPath = path.join(BLOG_EN, `${enSlug}.md`);
  const itPath = path.join(BLOG_IT, `${itSlug}.md`);
  fs.writeFileSync(enPath, enContent, "utf-8");
  fs.writeFileSync(itPath, itContent, "utf-8");
  console.log(`EN saved: ${enPath}`);
  console.log(`IT saved: ${itPath}`);
  console.log("Pipeline completed successfully.");
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
