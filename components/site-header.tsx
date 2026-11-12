"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navRoutes } from "@/app.config";
import { QCTechLogo } from "@/components/qctech-logo";
import { QuantisFloat } from "@/components/quantis-float";
import { Link, usePathname } from "@/i18n/routing";

function languageSwitchHref(
  pathname: ReturnType<typeof usePathname>,
  slug: string | string[] | undefined,
) {
  if (pathname === "/progetti/[slug]") {
    return {
      pathname: "/progetti/[slug]" as const,
      params: { slug: typeof slug === "string" ? slug : "" },
    };
  }
  return pathname as Exclude<typeof pathname, "/progetti/[slug]">;
}

export function SiteHeader() {
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const switchHref = languageSwitchHref(pathname, params.slug);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header>
        <div className="site-header-pill site-header-pill--light">
          <QCTechLogo variant="header" onLight linkToHome />
          <nav className="site-header-nav" aria-label={t("navLabel")}>
            {navRoutes.map((item) => {
              const active =
                pathname === item.href ||
                (item.href === "/progetti" && pathname === "/progetti/[slug]");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="text-[var(--light-text)]"
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <QuantisFloat placement="pill" />
            <div className="flex items-center gap-1 rounded-full border border-[var(--light-border)] bg-white/70 px-1 py-0.5 text-xs font-semibold">
              <Link
                href={switchHref}
                locale="it"
                className={`rounded-full px-2 py-1 transition-colors ${
                  locale === "it"
                    ? "bg-[var(--light-primary)] text-white"
                    : "text-[var(--light-text-muted)] hover:text-[var(--light-text)]"
                }`}
                aria-current={locale === "it" ? "true" : undefined}
              >
                {t("langIt")}
              </Link>
              <Link
                href={switchHref}
                locale="en"
                className={`rounded-full px-2 py-1 transition-colors ${
                  locale === "en"
                    ? "bg-[var(--light-primary)] text-white"
                    : "text-[var(--light-text-muted)] hover:text-[var(--light-text)]"
                }`}
                aria-current={locale === "en" ? "true" : undefined}
              >
                {t("langEn")}
              </Link>
            </div>
            <Link
              href="/contatti"
              className="inline-flex h-10 items-center rounded-full bg-[var(--light-primary)] px-5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {t("quote")}
            </Link>
          </div>
        </div>

        <div className="site-header-mobile site-header-mobile--light">
          <div className="flex min-w-0 items-center overflow-hidden">
            <QCTechLogo variant="header" onLight linkToHome />
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-11 w-11 items-center justify-center justify-self-end rounded-xl text-[var(--light-text)] transition-colors hover:bg-black/5"
            aria-expanded={drawerOpen}
            aria-controls="site-drawer"
            aria-label={t("openMenu")}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-slate-900/25 backdrop-blur-sm"
              aria-label={t("closeMenu")}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.nav
              id="site-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={t("navLabel")}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[min(100vw-3rem,20rem)] flex-col border-l border-[var(--light-border)] bg-white shadow-2xl shadow-slate-900/10"
            >
              <div className="flex items-center justify-between border-b border-[var(--light-border)] px-4 py-4">
                <span className="text-sm font-semibold text-[var(--light-text)]">
                  {t("menu")}
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--light-text-muted)] hover:bg-[var(--light-surface)] hover:text-[var(--light-text)]"
                  aria-label={t("close")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex gap-2 border-b border-[var(--light-border)] px-4 py-3">
                <Link
                  href={switchHref}
                  locale="it"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-colors ${
                    locale === "it"
                      ? "bg-[var(--light-primary)] text-white"
                      : "bg-[var(--light-surface)] text-[var(--light-text-muted)] hover:bg-[var(--light-border)]"
                  }`}
                >
                  {t("langIt")}
                </Link>
                <Link
                  href={switchHref}
                  locale="en"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-colors ${
                    locale === "en"
                      ? "bg-[var(--light-primary)] text-white"
                      : "bg-[var(--light-surface)] text-[var(--light-text-muted)] hover:bg-[var(--light-border)]"
                  }`}
                >
                  {t("langEn")}
                </Link>
              </div>

              <ul className="flex flex-1 flex-col gap-1 p-4">
                {navRoutes.map((item) => {
                  const active =
                pathname === item.href ||
                (item.href === "/progetti" && pathname === "/progetti/[slug]");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                          active
                            ? "bg-[var(--light-surface)] text-[var(--light-emphasis)]"
                            : "text-[var(--light-text)] hover:bg-[var(--light-surface)]"
                        }`}
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-[var(--light-border)] p-4">
                <Link
                  href="/contatti"
                  onClick={() => setDrawerOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-[var(--light-primary)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                >
                  {t("quote")}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
