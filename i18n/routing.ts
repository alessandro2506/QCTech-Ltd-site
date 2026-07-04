import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["it", "en"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/servizi": { it: "/servizi", en: "/services" },
    "/vision": { it: "/vision", en: "/about" },
    "/faq": "/faq",
    "/blog": "/blog",
    "/contatti": { it: "/contatti", en: "/contacts" },
    "/copilot-ltd": "/copilot-ltd",
  },
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
