import { readdirSync } from "node:fs";
import { join } from "node:path";

const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3035").replace(/\/$/, "");
const ROOT = join(import.meta.dirname, "..");

function postSlugs(locale) {
  const dir = join(ROOT, "content/blog", locale);
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

function seedPaths() {
  const paths = [
    "/it",
    "/en",
    "/it/servizi",
    "/en/services",
    "/it/blog",
    "/en/blog",
  ];
  for (const slug of postSlugs("it")) paths.push(`/it/blog/${slug}`);
  for (const slug of postSlugs("en")) paths.push(`/en/blog/${slug}`);
  return paths;
}

function toAbsolute(href, pageUrl) {
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:") ||
    href.startsWith("data:")
  ) {
    return null;
  }
  try {
    const url = new URL(href, pageUrl);
    if (url.origin !== new URL(BASE).origin) return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function extractHrefs(html) {
  const matches = html.matchAll(/href\s*=\s*(?:"([^"]+)"|'([^']+)')/gi);
  const hrefs = [];
  for (const match of matches) {
    hrefs.push(match[1] ?? match[2] ?? "");
  }
  return hrefs;
}

async function fetchFinal(url) {
  let current = url.split("#")[0];
  for (let i = 0; i < 6; i += 1) {
    const response = await fetch(current, { redirect: "manual" });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { url: current, status: response.status };
      current = new URL(location, current).href.split("#")[0];
      continue;
    }
    return {
      url: current,
      status: response.status,
      html: await response.text(),
    };
  }
  return { url: current, status: 0 };
}

const seeds = seedPaths().map((path) => `${BASE}${path}`);
const toCheck = new Set(seeds);
const failures = [];

for (const seed of seeds) {
  const result = await fetchFinal(seed);
  if (result.status !== 200) {
    failures.push(`${result.status} ${seed} → ${result.url}`);
    continue;
  }
  if (!result.html) continue;
  for (const href of extractHrefs(result.html)) {
    const abs = toAbsolute(href, result.url);
    if (abs) toCheck.add(abs);
  }
}

for (const url of toCheck) {
  if (seeds.includes(url)) continue;
  const result = await fetchFinal(url);
  if (result.status !== 200) {
    failures.push(`${result.status} ${url} → ${result.url}`);
  }
}

if (failures.length > 0) {
  console.error(`Internal link check failed (${failures.length}):`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `Internal link check OK: ${toCheck.size} URLs from ${seeds.length} pages → 200`,
);
