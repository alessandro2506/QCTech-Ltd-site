/**
 * Alvenco demo — config non testuale (URL, contatti).
 * Le stringhe UI vivono in messages/{locale}.json.
 */
export const siteConfig = {
  name: "Alvenco Ltd",
  shortName: "Alvenco",
  url: "https://www.alvencoltd.co.uk",
  localeIt: "it_IT",
  localeEn: "en_GB",
  links: {
    email: "hello@alvenco.co.uk",
    phone: "+44 7754 812247",
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

/** Path senza prefisso locale (next-intl aggiunge /en se serve). */
export const navRoutes = [
  { href: "/" as const, key: "home" as const },
  { href: "/servizi" as const, key: "services" as const },
  { href: "/vision" as const, key: "vision" as const },
  { href: "/faq" as const, key: "faq" as const },
  { href: "/blog" as const, key: "blog" as const },
  { href: "/contatti" as const, key: "contacts" as const },
];
