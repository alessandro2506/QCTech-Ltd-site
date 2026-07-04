import type { MetadataRoute } from "next";

const blogSlugs = [
  "digital-marketing-for-bb-and-guesthouses-uk",
  "how-logistics-companies-can-use-web-portals-to-serve-clients",
  "how-much-does-a-website-cost-uk-2026",
  "how-to-attract-international-tourists-to-uk-experiences",
  "react-native-vs-flutter-for-mobile-apps-2026",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.qc-tech.co.uk";

  const itPages = [
    { path: "/it", priority: 1.0, freq: "weekly" },
    { path: "/it/servizi", priority: 0.8, freq: "monthly" },
    { path: "/it/vision", priority: 0.8, freq: "monthly" },
    { path: "/it/faq", priority: 0.7, freq: "monthly" },
    { path: "/it/blog", priority: 0.9, freq: "weekly" },
    { path: "/it/contatti", priority: 0.8, freq: "monthly" },
    { path: "/it/copilot-ltd", priority: 0.7, freq: "monthly" },
  ];

  const enPages = [
    { path: "/en", priority: 1.0, freq: "weekly" },
    { path: "/en/services", priority: 0.8, freq: "monthly" },
    { path: "/en/about", priority: 0.8, freq: "monthly" },
    { path: "/en/faq", priority: 0.7, freq: "monthly" },
    { path: "/en/blog", priority: 0.9, freq: "weekly" },
    { path: "/en/contacts", priority: 0.8, freq: "monthly" },
    { path: "/en/copilot-ltd", priority: 0.7, freq: "monthly" },
  ];

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
            : normalizedPath;
    const enPath =
      normalizedPath === "/servizi"
        ? "/services"
        : normalizedPath === "/vision"
          ? "/about"
          : normalizedPath === "/contatti"
            ? "/contacts"
            : normalizedPath;

    entries.push({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.freq as "weekly" | "monthly",
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

  for (const slug of blogSlugs) {
    for (const locale of ["it", "en"] as const) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            it: `${baseUrl}/it/blog/${slug}`,
            en: `${baseUrl}/en/blog/${slug}`,
            "x-default": `${baseUrl}/en/blog/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
