/**
 * QC Tech Blog Pipeline — Auto-generates a weekly blog post
 * using Claude API with web search, then saves EN + IT versions.
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
const ROOT = path.resolve(__dirname, "..");
const BLOG_EN = path.join(ROOT, "content/blog/en");
const BLOG_IT = path.join(ROOT, "content/blog/it");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── TOPIC POOL ────────────────────────────────────────────────────────────────
const TOPIC_POOL = [
  // Core Alvenco services
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
  // Hotel & hospitality
  "hotel website best practices UK 2026",
  "how to increase direct bookings for UK hotels",
  "digital marketing for B&B and guesthouses UK",
  "best booking engine software for small UK hotels",
  "local SEO for hotels and accommodation UK",
  // Food & beverage
  "restaurant website design tips UK 2026",
  "how to set up online ordering for UK restaurants",
  "digital menu QR code best practices UK",
  "Google Business Profile for restaurants UK",
  "social media strategy for UK restaurants 2026",
  // Logistics & transport
  "digital transformation for UK logistics companies",
  "how logistics companies can use web portals to serve clients",
  "fleet management software UK small companies",
  "NCC taxi website best practices UK",
  "how private hire companies can get more bookings online UK",
  // Tourism
  "digital marketing for UK tourism businesses 2026",
  "how to attract international tourists to UK experiences",
  "visit England tourism website SEO tips",
  "booking software for UK tour operators",
  // General digital business
  "why UK small businesses need a website in 2026",
  "how to get your business found on Google UK",
  "website accessibility WCAG 2.2 guide for UK businesses",
  "GDPR compliance for UK business websites 2026",
  "how to measure ROI of a business website UK",
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function slugify(text) {
  return text
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
  return new Set(
    fs.readdirSync(dir).map((f) => f.replace(/\.md$/, ""))
  );
}

function pickTopic(usedSlugs) {
  const unused = TOPIC_POOL.filter((t) => !usedSlugs.has(slugify(t)));
  if (unused.length === 0) {
    // All topics used — pick random from full pool
    return TOPIC_POOL[Math.floor(Math.random() * TOPIC_POOL.length)];
  }
  return unused[Math.floor(Math.random() * unused.length)];
}

// ── PROMPT BUILDERS ───────────────────────────────────────────────────────────
function buildENPrompt(topic) {
  return `You are a senior content writer for Quantum Code Technologies Ltd (QC Tech), a UK-based digital studio specialising in web design, mobile apps, e-commerce and SEO. You are based in Bishop's Stortford, Hertfordshire, UK.

Write a comprehensive, SEO-optimised blog article in English about: "${topic}"

REQUIREMENTS:
- Length: 1,500–2,000 words
- Tone: professional, direct, results-oriented — written for UK business owners and decision-makers
- No fluff, no filler — every paragraph must add value
- Include real, verifiable UK market data and pricing where relevant (2026)
- Naturally mention QC Tech or Quantum Code Technologies Ltd where relevant (1–2 times maximum, not promotional)
- Structure: use H2 (##) and H3 (###) headings, bullet lists, and at least one data table
- End with a practical "Next Steps" or "Final Thought" section

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

function buildITPrompt(enContent, topic) {
  return `You are a professional translator and content localiser for Quantum Code Technologies Ltd (QC Tech), a UK-based digital studio that serves Italian-speaking clients.

Translate and localise the following English blog article into Italian. 

RULES:
- Translate naturally — do NOT translate word-for-word
- Adapt UK-specific references for Italian readers where needed (e.g. "UK small businesses" → "aziende italiane e UK")
- Keep all markdown formatting (##, ###, -, |tables|, **bold**)
- Keep the frontmatter structure but translate: title, excerpt, tags
- Keep author, authorRole, date, readTime unchanged
- The result must read as if originally written in Italian by a native speaker

OUTPUT FORMAT — return ONLY valid frontmatter + markdown, nothing else.

ORIGINAL ENGLISH ARTICLE:
${enContent}`;
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 QC Tech Blog Pipeline starting...");

  // Ensure output directories exist
  fs.mkdirSync(BLOG_EN, { recursive: true });
  fs.mkdirSync(BLOG_IT, { recursive: true });

  // Pick topic
  const usedSlugs = getUsedSlugs(BLOG_EN);
  const topic = pickTopic(usedSlugs);
  const slug = slugify(topic);
  console.log(`📝 Topic: "${topic}"`);
  console.log(`🔗 Slug: ${slug}`);

  // Generate EN article
  console.log("✍️  Generating EN article...");
  const enResponse = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: buildENPrompt(topic) }],
  });

  const enContent = enResponse.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  // Save EN
  const enPath = path.join(BLOG_EN, `${slug}.md`);
  fs.writeFileSync(enPath, enContent, "utf-8");
  console.log(`✅ EN article saved: ${enPath}`);

  // Generate IT translation
  console.log("🇮🇹 Translating to Italian...");
  const itResponse = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: buildITPrompt(enContent, topic) }],
  });

  const itContent = itResponse.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  // Save IT
  const itPath = path.join(BLOG_IT, `${slug}.md`);
  fs.writeFileSync(itPath, itContent, "utf-8");
  console.log(`✅ IT article saved: ${itPath}`);

  console.log("🎉 Pipeline completed successfully!");
  console.log(`   EN: ${enPath}`);
  console.log(`   IT: ${itPath}`);
}

main().catch((err) => {
  console.error("❌ Pipeline failed:", err);
  process.exit(1);
});
