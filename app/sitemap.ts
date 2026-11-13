import type { MetadataRoute } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { PORTFOLIO_IDS } from "@/lib/portfolio-sites";

const baseUrl = "https://www.qc-tech.co.uk";

/** Last real content update for core pages (not regenerated on every deploy). */
const CORE_LASTMOD = new Date("2026-08-05T00:00:00.000Z");

function parsePostDate(date: string): Date {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? CORE_LASTMOD : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const itPages = [
    { path: "/it", priority: 1.0, freq: "weekly" as const },
    { path: "/it/servizi", priority: 0.8, freq: "monthly" as const },
    { path: "/it/vision", priority: 0.8, freq: "monthly" as const },
    { path: "/it/faq", priority: 0.7, freq: "monthly" as const },
    { path: "/it/blog", priority: 0.9, freq: "weekly" as const },
    { path: "/it/contatti", priority: 0.8, freq: "monthly" as const },
    { path: "/it/copilot-ltd", priority: 0.7, freq: "monthly" as const },
    { path: "/it/progetti", priority: 0.8, freq: "monthly" as const },
    { path: "/it/privacy", priority: 0.5, freq: "yearly" as const },
    { path: "/it/termini", priority: 0.5, freq: "yearly" as const },
  ];

  const enPages = [
    { path: "/en", priority: 1.0, freq: "weekly" as const },
    { path: "/en/services", priority: 0.8, freq: "monthly" as const },
    { path: "/en/about", priority: 0.8, freq: "monthly" as const },
    { path: "/en/faq", priority: 0.7, freq: "monthly" as const },
    { path: "/en/blog", priority: 0.9, freq: "weekly" as const },
    { path: "/en/contacts", priority: 0.8, freq: "monthly" as const },
    { path: "/en/copilot-ltd", priority: 0.7, freq: "monthly" as const },
    { path: "/en/projects", priority: 0.8, freq: "monthly" as const },
    { path: "/en/privacy", priority: 0.5, freq: "yearly" as const },
    { path: "/en/terms", priority: 0.5, freq: "yearly" as const },
  ];

  const itPosts = getAllPosts("it");
  const enPosts = getAllPosts("en");
  const itSlugs = itPosts.map((post) => post.slug);
  const enSlugs = enPosts.map((post) => post.slug);
  const allSlugs = [...new Set([...itSlugs, ...enSlugs])];

  const latestPostDate = allSlugs.reduce((latest, slug) => {
    const itDate = getPostBySlug(slug, "it")?.date;
    const enDate = getPostBySlug(slug, "en")?.date;
    const candidates = [itDate, enDate]
      .filter(Boolean)
      .map((d) => parsePostDate(d as string));
    const max = candidates.reduce(
      (acc, d) => (d > acc ? d : acc),
      latest,
    );
    return max;
  }, CORE_LASTMOD);

  const entries: MetadataRoute.Sitemap = [];

  for (const page of [...itPages, ...enPages]) {
    const barePath = page.path.replace(/^\/(it|en)/, "");
    const normalizedPath = barePath === "" ? "/" : barePath;
    const itPath =
      normalizedPath === "/services"
        ? "/servizi"
        : normalizedPath === "/about"
          ? "/vision"
          : normalizedPath === "/contacts"
            ? "/contatti"
            : normalizedPath === "/projects"
              ? "/progetti"
              : normalizedPath === "/terms"
                ? "/termini"
                : normalizedPath;
    const enPath =
      normalizedPath === "/servizi"
        ? "/services"
        : normalizedPath === "/vision"
          ? "/about"
          : normalizedPath === "/contatti"
            ? "/contacts"
            : normalizedPath === "/progetti"
              ? "/projects"
              : normalizedPath === "/termini"
                ? "/terms"
                : normalizedPath;

    const isBlogIndex = normalizedPath === "/blog";

    entries.push({
      url: `${baseUrl}${page.path}`,
      lastModified: isBlogIndex ? latestPostDate : CORE_LASTMOD,
      changeFrequency: page.freq,
      priority: page.priority,
      alternates: {
        languages: {
          it: `${baseUrl}/it${itPath === "/" ? "" : itPath}`,
          en: `${baseUrl}/en${enPath === "/" ? "" : enPath}`,
          "x-default": `${baseUrl}/en${enPath === "/" ? "" : enPath}`,
        },
      },
    });
  }

  const postsByKey = new Map<string, { it?: (typeof itPosts)[number]; en?: (typeof enPosts)[number] }>();
  for (const post of itPosts) {
    const current = postsByKey.get(post.translationKey) ?? {};
    current.it = post;
    postsByKey.set(post.translationKey, current);
  }
  for (const post of enPosts) {
    const current = postsByKey.get(post.translationKey) ?? {};
    current.en = post;
    postsByKey.set(post.translationKey, current);
  }

  for (const pair of postsByKey.values()) {
    const itUrl = pair.it
      ? `${baseUrl}/it/blog/${pair.it.slug}`
      : undefined;
    const enUrl = pair.en
      ? `${baseUrl}/en/blog/${pair.en.slug}`
      : undefined;
    const languages = {
      ...(itUrl ? { it: itUrl } : {}),
      ...(enUrl ? { en: enUrl, "x-default": enUrl } : itUrl ? { "x-default": itUrl } : {}),
    };

    if (pair.it && itUrl) {
      entries.push({
        url: itUrl,
        lastModified: parsePostDate(pair.it.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages },
      });
    }
    if (pair.en && enUrl) {
      entries.push({
        url: enUrl,
        lastModified: parsePostDate(pair.en.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  for (const slug of PORTFOLIO_IDS) {
    entries.push({
      url: `${baseUrl}/it/progetti/${slug}`,
      lastModified: CORE_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          it: `${baseUrl}/it/progetti/${slug}`,
          en: `${baseUrl}/en/projects/${slug}`,
          "x-default": `${baseUrl}/en/projects/${slug}`,
        },
      },
    });
    entries.push({
      url: `${baseUrl}/en/projects/${slug}`,
      lastModified: CORE_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          it: `${baseUrl}/it/progetti/${slug}`,
          en: `${baseUrl}/en/projects/${slug}`,
          "x-default": `${baseUrl}/en/projects/${slug}`,
        },
      },
    });
  }

  return entries;
}
