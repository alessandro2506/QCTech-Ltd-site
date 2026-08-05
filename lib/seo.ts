import type { Metadata } from "next";
import { siteConfig } from "@/app.config";
import { routing } from "@/i18n/routing";

export type LocalizedPathname = keyof typeof routing.pathnames;

function pathSegment(pathname: LocalizedPathname, locale: "it" | "en"): string {
  const entry = routing.pathnames[pathname];
  const segment = typeof entry === "string" ? entry : entry[locale];
  return segment === "/" ? "" : segment;
}

export function getLocalizedPath(
  pathname: LocalizedPathname,
  locale: "it" | "en",
): string {
  return `/${locale}${pathSegment(pathname, locale)}`;
}

export function buildAlternates(
  pathname: LocalizedPathname,
  locale: "it" | "en",
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: `${siteConfig.url}${getLocalizedPath(pathname, locale)}`,
    languages: {
      it: `${siteConfig.url}${getLocalizedPath(pathname, "it")}`,
      en: `${siteConfig.url}${getLocalizedPath(pathname, "en")}`,
      "x-default": `${siteConfig.url}${getLocalizedPath(pathname, "en")}`,
    },
  };
}
