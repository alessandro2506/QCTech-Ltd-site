import { chromium } from "playwright";

const ORIGIN = process.env.MEASURE_ORIGIN ?? "https://www.qc-tech.co.uk";
const BUST = process.env.MEASURE_BUST ? `?cb=${process.env.MEASURE_BUST}` : "";
const WIDTHS = [390, 768, 1440];
const HEIGHT = 900;

const PAGES = [
  { id: "home", it: "/it", en: "/en", home: true },
  { id: "progetti", it: "/it/progetti", en: "/en/projects" },
  { id: "progetto", it: "/it/progetti/quipalermo", en: "/en/projects/quipalermo" },
  { id: "blog", it: "/it/blog", en: "/en/blog" },
  {
    id: "articolo",
    it: "/it/blog/nextjs-vs-wordpress-for-business-websites-uk-2026",
    en: "/en/blog/nextjs-vs-wordpress-for-business-websites-uk-2026",
  },
  { id: "faq", it: "/it/faq", en: "/en/faq" },
  { id: "vision", it: "/it/vision", en: "/en/about" },
  { id: "servizi", it: "/it/servizi", en: "/en/services" },
  { id: "contatti", it: "/it/contatti", en: "/en/contacts" },
  { id: "privacy", it: "/it/privacy", en: "/en/privacy" },
  { id: "termini", it: "/it/termini", en: "/en/terms" },
  { id: "copilot", it: "/it/copilot-ltd", en: "/en/copilot-ltd" },
];

const ANCHORS = [
  { path: "/it", hash: "come-lavoriamo" },
  { path: "/it/privacy", hash: "assistente-ai" },
  { path: "/en/privacy", hash: "assistente-ai" },
  { path: "/it/servizi", hash: "servizio-web" },
  { path: "/it/servizi", hash: "servizio-app" },
  { path: "/it/servizi", hash: "servizio-seo" },
];

async function measurePage(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForSelector("main", { timeout: 15000 });
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const pill = document.querySelector(".site-header-pill");
    const mobile = document.querySelector(".site-header-mobile");
    const vis = [pill, mobile].filter((el) => {
      if (!el) return false;
      const s = getComputedStyle(el);
      return s.display !== "none" && s.visibility !== "hidden";
    });
    const headerBottom = vis.length
      ? Math.max(...vis.map((el) => el.getBoundingClientRect().bottom))
      : 0;
    const badge = document.querySelector(".hero-home-badge");
    if (badge) {
      const r = badge.getBoundingClientRect();
      return {
        kind: "badge",
        top: Math.round(r.top * 10) / 10,
        headerBottom: Math.round(headerBottom * 10) / 10,
        underHeader: r.top + 0.5 < headerBottom,
        text: (badge.textContent || "").trim().slice(0, 40),
      };
    }
    const main = document.querySelector("main");
    if (!main) return { kind: "none", top: null, headerBottom, underHeader: false, text: "" };
    const nodes = [...main.querySelectorAll("h1, h2, p, a, li, span")];
    for (const node of nodes) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const text = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (text.length < 2) continue;
      const r = node.getBoundingClientRect();
      if (r.height < 8 || r.width < 8) continue;
      return {
        kind: node.tagName.toLowerCase(),
        top: Math.round(r.top * 10) / 10,
        headerBottom: Math.round(headerBottom * 10) / 10,
        underHeader: r.top + 0.5 < headerBottom,
        text: text.slice(0, 40),
      };
    }
    return { kind: "none", top: null, headerBottom, underHeader: false, text: "" };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const rows = [];
  const homeByWidth = {};
  const failures = [];

  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: HEIGHT },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    for (const locale of ["it", "en"]) {
      for (const spec of PAGES) {
        const path = spec[locale];
        const url = `${ORIGIN}${path}${BUST}`;
        try {
          const result = await measurePage(page, url);
          rows.push({
            width,
            locale,
            id: spec.id,
            path,
            ...result,
          });
          if (spec.home) homeByWidth[`${width}:${locale}`] = result.top;
        } catch (error) {
          failures.push(`${width} ${path} ${error.message}`);
        }
      }
    }
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const anchors = [];
  for (const item of ANCHORS) {
    await page.goto(`${ORIGIN}${item.path}${BUST}#${item.hash}`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector("main", { timeout: 15000 });
    await page.waitForTimeout(400);
    anchors.push(
      await page.evaluate((anchorId) => {
        const pill = document.querySelector(".site-header-pill");
        const mobile = document.querySelector(".site-header-mobile");
        const vis = [pill, mobile].filter((el) => {
          if (!el) return false;
          const s = getComputedStyle(el);
          return s.display !== "none" && s.visibility !== "hidden";
        });
        const headerBottom = vis.length
          ? Math.max(...vis.map((el) => el.getBoundingClientRect().bottom))
          : 0;
        const el = document.getElementById(anchorId);
        if (!el) return { found: false, id: anchorId };
        const r = el.getBoundingClientRect();
        return {
          found: true,
          id: anchorId,
          top: Math.round(r.top * 10) / 10,
          headerBottom: Math.round(headerBottom * 10) / 10,
          underHeader: r.top + 0.5 < headerBottom,
        };
      }, item.hash),
    );
  }
  const heroFit = [];
  for (const locale of ["it", "en"]) {
    await page.setViewportSize({ width: 1440, height: HEIGHT });
    await page.goto(`${ORIGIN}/${locale}${BUST}`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(".hero-home", { timeout: 15000 });
    await page.waitForTimeout(300);
    heroFit.push(
      await page.evaluate(() => {
        const vh = window.innerHeight;
        const cta = document.querySelector(".hero-home-cta");
        const mark = document.querySelector(".hero-quantis-halo");
        const ctaBox = cta?.getBoundingClientRect();
        const markBox = mark?.getBoundingClientRect();
        return {
          locale: document.documentElement.lang,
          ctaInView: Boolean(
            ctaBox && ctaBox.top >= 0 && ctaBox.bottom <= vh + 1,
          ),
          markInView: Boolean(
            markBox && markBox.top >= 0 && markBox.bottom <= vh + 1 && markBox.width > 0,
          ),
          markCut: Boolean(markBox && (markBox.left < -1 || markBox.right > window.innerWidth + 1)),
        };
      }),
    );
  }
  await context.close();
  await browser.close();

  console.log("PAGE_TOP_ROWS");
  console.log(
    [
      "width",
      "locale",
      "page",
      "top",
      "home",
      "delta",
      "ok±4",
      "underHeader",
    ].join("\t"),
  );
  for (const row of rows) {
    const home = homeByWidth[`${row.width}:${row.locale}`];
    const delta =
      row.top == null || home == null ? "" : Math.round((row.top - home) * 10) / 10;
    const ok =
      row.id === "home"
        ? "home"
        : delta === ""
          ? "n/a"
          : Math.abs(Number(delta)) <= 4
            ? "yes"
            : "NO";
    console.log(
      [
        row.width,
        row.locale,
        row.id,
        row.top,
        home,
        delta,
        ok,
        row.underHeader,
      ].join("\t"),
    );
  }
  console.log("ANCHORS");
  for (const a of anchors) {
    console.log(JSON.stringify(a));
  }
  console.log("HERO_FIT_1440");
  for (const row of heroFit) {
    console.log(JSON.stringify(row));
  }
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
