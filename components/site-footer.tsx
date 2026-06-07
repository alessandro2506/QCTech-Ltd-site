"use client";

import { useTranslations } from "next-intl";
import { siteConfig, navRoutes } from "@/app.config";
import { Link } from "@/i18n/routing";

export function SiteFooter() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const tm = useTranslations("meta");

  return (
    <footer className="relative border-t border-violet-500/15 bg-[#06040e]">
      {/* Top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" aria-hidden />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="gradient-quantum text-lg font-bold">{siteConfig.shortName}</p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {tm("defaultDescription")}
          </p>
        </div>
        <nav aria-label={tf("navLabel")}>
          <ul className="flex flex-col gap-2 sm:items-end">
            {navRoutes.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-violet-400"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-violet-500/10 px-4 py-6 text-center text-xs text-slate-600 sm:px-6">
        <p>{tf("legal")}</p>
        <p className="mt-1">{siteConfig.address.full}</p>
      </div>
    </footer>
  );
}
