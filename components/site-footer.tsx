"use client";

import { useLocale, useTranslations } from "next-intl";
import { siteConfig, navRoutes } from "@/app.config";
import { Link, usePathname } from "@/i18n/routing";
import { isLightPath } from "@/lib/is-light-path";

export function SiteFooter() {
  const locale = useLocale();
  const pathname = usePathname();
  const light = isLightPath(pathname);
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const tm = useTranslations("meta");

  return (
    <footer
      className={`relative border-t ${
        light
          ? "border-[var(--light-border)] bg-[var(--light-surface)]"
          : "border-violet-500/15 bg-[#06040e]"
      }`}
    >
      {!light ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" aria-hidden />
      ) : null}

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p
            className={
              light
                ? "text-lg font-bold text-[var(--light-emphasis)]"
                : "gradient-quantum text-lg font-bold"
            }
          >
            {siteConfig.shortName}
          </p>
          <p
            className={`mt-2 max-w-sm text-sm ${light ? "text-[var(--light-text-muted)]" : "text-slate-500"}`}
          >
            {tm("defaultDescription")}
          </p>
        </div>
        <nav aria-label={tf("navLabel")}>
          <ul className="flex flex-col gap-2 sm:items-end">
            {navRoutes.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    light
                      ? "text-sm font-medium text-[var(--light-text-muted)] transition-colors hover:text-[var(--light-primary)]"
                      : "text-sm font-medium text-slate-500 transition-colors hover:text-violet-400"
                  }
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div
        className={`border-t px-4 py-6 text-center text-xs sm:px-6 ${
          light
            ? "border-[var(--light-border)] text-[var(--light-text-muted)]"
            : "border-violet-500/10 text-slate-600"
        }`}
      >
        <p>{tf("legal")}</p>
        <p className="mt-1">{siteConfig.address.full}</p>
        <p className="mt-1">Company Number 17317573</p>
        <p className="mt-2">
          <Link
            href="/privacy"
            locale={locale}
            className={
              light
                ? "text-[var(--light-text-muted)] transition-colors hover:text-[var(--light-primary)]"
                : "text-slate-600 transition-colors hover:text-violet-400"
            }
          >
            {t("privacy")}
          </Link>
          <span className={`mx-1.5 ${light ? "text-[var(--light-border)]" : "text-slate-700"}`}>
            ·
          </span>
          <Link
            href="/termini"
            locale={locale}
            className={
              light
                ? "text-[var(--light-text-muted)] transition-colors hover:text-[var(--light-primary)]"
                : "text-slate-600 transition-colors hover:text-violet-400"
            }
          >
            {locale === "it" ? "Termini e Condizioni" : "Terms & Conditions"}
          </Link>
        </p>
      </div>
    </footer>
  );
}
