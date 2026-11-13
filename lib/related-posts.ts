import { getPostBySlug, getAllPosts, type BlogPost } from "@/lib/blog";

export const SERVICE_THEMES = [
  "web",
  "mobile",
  "ecommerce",
  "seo",
  "hospitality",
  "logistics",
] as const;

export type ServiceTheme = (typeof SERVICE_THEMES)[number];

/** Static theme → slugs. Same slugs in it/en; missing files are skipped at read time. */
export const THEME_POST_SLUGS: Record<ServiceTheme, readonly string[]> = {
  web: [
    "how-much-does-a-website-cost-uk-2026",
    "nextjs-vs-wordpress-for-business-websites-uk-2026",
    "how-to-improve-website-conversion-rate-uk-small-business",
    "why-uk-small-businesses-need-a-website-in-2026",
    "what-is-a-headless-cms-and-why-it-matters-for-uk-businesses",
    "website-accessibility-wcag-22-guide-for-uk-businesses",
    "how-to-choose-a-web-agency-in-the-uk",
    "gdpr-compliance-for-uk-business-websites-2026",
    "how-to-measure-roi-of-a-business-website-uk",
  ],
  mobile: [
    "how-much-does-a-mobile-app-cost-uk-2026",
    "react-native-vs-flutter-for-mobile-apps-2026",
    "ai-chatbots-for-small-business-websites-uk",
  ],
  ecommerce: [
    "how-to-build-an-e-commerce-website-uk-2026",
    "booking-software-for-uk-tour-operators",
    "best-booking-engine-software-for-small-uk-hotels",
  ],
  seo: [
    "how-to-get-your-business-found-on-google-uk",
    "technical-seo-checklist-for-uk-businesses-2026",
    "what-is-core-web-vitals-and-how-it-affects-google-ranking-uk",
    "visit-england-tourism-website-seo-tips",
  ],
  hospitality: [
    "hotel-website-best-practices-uk-2026",
    "how-to-increase-direct-bookings-for-uk-hotels",
    "restaurant-website-design-tips-uk-2026",
    "social-media-strategy-for-uk-restaurants-2026",
    "digital-menu-qr-code-best-practices-uk",
    "digital-marketing-for-bb-and-guesthouses-uk",
    "digital-marketing-for-uk-tourism-businesses-2026",
    "how-to-attract-international-tourists-to-uk-experiences",
  ],
  logistics: [
    "digital-transformation-for-uk-logistics-companies",
    "fleet-management-software-uk-small-companies",
    "how-logistics-companies-can-use-web-portals-to-serve-clients",
    "how-private-hire-companies-can-get-more-bookings-online-uk",
  ],
};

/** Servizi index: one flagship article per core offer. */
export const SERVICES_PAGE_SLUGS = [
  "how-much-does-a-website-cost-uk-2026",
  "how-much-does-a-mobile-app-cost-uk-2026",
  "how-to-get-your-business-found-on-google-uk",
] as const;

export const SERVICE_CARD_THEMES = ["web", "mobile", "seo"] as const;

export const SERVICE_HASH: Record<ServiceTheme, string> = {
  web: "servizio-web",
  mobile: "servizio-app",
  ecommerce: "servizio-web",
  seo: "servizio-seo",
  hospitality: "servizio-web",
  logistics: "servizio-web",
};

const SLUG_THEME = new Map<string, ServiceTheme>();
for (const theme of SERVICE_THEMES) {
  for (const slug of THEME_POST_SLUGS[theme]) {
    if (!SLUG_THEME.has(slug)) SLUG_THEME.set(slug, theme);
  }
}

export function themeForSlug(slug: string): ServiceTheme | null {
  return SLUG_THEME.get(slug) ?? null;
}

function existingPosts(locale: string, slugs: readonly string[]): BlogPost[] {
  return slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is BlogPost => post !== null);
}

export function postsForTheme(
  locale: string,
  theme: ServiceTheme,
  limit = 3,
): BlogPost[] {
  return existingPosts(locale, THEME_POST_SLUGS[theme]).slice(0, limit);
}

export function postsForServicesPage(locale: string): BlogPost[] {
  return existingPosts(locale, SERVICES_PAGE_SLUGS);
}

export function relatedPostsForSlug(
  locale: string,
  slug: string,
  limit = 3,
): BlogPost[] {
  const current = getPostBySlug(slug, locale);
  if (!current) return [];

  const seen = new Set<string>([slug]);
  const picked: BlogPost[] = [];

  const push = (post: BlogPost | null) => {
    if (!post || seen.has(post.slug) || picked.length >= limit) return;
    seen.add(post.slug);
    picked.push(post);
  };

  const theme = themeForSlug(slug);
  if (theme) {
    for (const post of existingPosts(locale, THEME_POST_SLUGS[theme])) {
      push(post);
    }
  }

  if (picked.length < limit && current.tags.length > 0) {
    const tagSet = new Set(current.tags);
    for (const post of getAllPosts(locale)) {
      if (post.tags.some((tag) => tagSet.has(tag))) push(post);
    }
  }

  if (picked.length < limit) {
    for (const post of getAllPosts(locale)) push(post);
  }

  return picked;
}
