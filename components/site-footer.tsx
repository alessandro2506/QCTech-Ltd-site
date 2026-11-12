"use client";

import { useLocale, useTranslations } from "next-intl";
import { siteConfig, navRoutes } from "@/app.config";
import { Link } from "@/i18n/routing";

export function SiteFooter() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const tm = useTranslations("meta");

  return (
    <footer className="relative border-t border-[var(--light-border)] bg-[var(--light-surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-bold text-[var(--light-emphasis)]">
            {siteConfig.shortName}
          </p>
          <p className="mt-2 max-w-sm text-sm text-[var(--light-text-muted)]">
            {tm("defaultDescription")}
          </p>
        </div>
        <nav aria-label={tf("navLabel")}>
          <ul className="flex flex-col gap-2 sm:items-end">
            {navRoutes.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-[var(--light-text-muted)] transition-colors hover:text-[var(--light-primary)]"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-[var(--light-border)] px-4 py-6 text-[var(--light-text-muted)] sm:px-6">
        <div className="site-footer-legal">
          <p className="site-footer-facts">
            <span>{tf("legal")}</span>
            <span>{tf("companyNo")}</span>
            <span>{tf("registered")}</span>
            <span>{siteConfig.address.full}</span>
            <span>{tf("ico")}</span>
          </p>
          <p className="site-footer-legal-links">
            <Link
              href="/privacy"
              locale={locale}
              className="text-[var(--light-text-muted)] transition-colors hover:text-[var(--light-primary)]"
            >
              {t("privacy")}
            </Link>
            <span className="text-[var(--light-border)]">·</span>
            <Link
              href="/termini"
              locale={locale}
              className="text-[var(--light-text-muted)] transition-colors hover:text-[var(--light-primary)]"
            >
              {tf("terms")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
