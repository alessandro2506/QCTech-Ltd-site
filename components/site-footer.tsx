"use client";

import { useTranslations } from "next-intl";
import { siteConfig, navRoutes } from "@/app.config";
import { Link } from "@/i18n/routing";

export function SiteFooter() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const tm = useTranslations("meta");

  return (
    <footer className="border-t border-slate-200 bg-slate-50/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-lg font-bold text-slate-900">{siteConfig.shortName}</p>
          <p className="mt-2 max-w-sm text-sm text-slate-600">
            {tm("defaultDescription")}
          </p>
        </div>
        <nav aria-label={tf("navLabel")}>
          <ul className="flex flex-col gap-2 sm:items-end">
            {navRoutes.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-200/80 px-4 py-6 text-center text-xs text-slate-500 sm:px-6">
        <p>{tf("legal")}</p>
        <p className="mt-1">{siteConfig.address.full}</p>
      </div>
    </footer>
  );
}
