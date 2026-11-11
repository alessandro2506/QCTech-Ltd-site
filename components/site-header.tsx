"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navRoutes } from "@/app.config";
import { QCTechLogo } from "@/components/qctech-logo";
import { Link, usePathname } from "@/i18n/routing";
import { isLightPath } from "@/lib/is-light-path";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const isHome = pathname === "/";
  const light = isLightPath(pathname);
  const [scrollPastHero, setScrollPastHero] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const showBar = !isHome || scrollPastHero;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrollPastHero(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          showBar
            ? light
              ? "border-b border-[var(--light-border)] bg-white/90 shadow-[0_1px_12px_rgba(15,23,42,0.06)] backdrop-blur-md"
              : "border-b border-violet-500/15 bg-[#08050f]/90 shadow-[0_1px_20px_rgba(108,99,255,0.08)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex min-h-14 max-w-6xl items-center px-0 py-1.5 sm:min-h-[3.75rem] sm:px-0">
          {/* Logo — flush a sinistra con padding minimo controllato */}
          <div className="flex-shrink-0 mr-auto pl-2 sm:pl-4">
            {showBar ? (
              <QCTechLogo variant="header" onLight={light} linkToHome />
            ) : null}
          </div>

          {/* Destra: switch lingua + hamburger sempre affiancati */}
          <div className="flex items-center gap-2 pr-4 sm:pr-6">
            <div
              className={`hidden items-center gap-1 rounded-xl border px-1 py-0.5 text-xs font-semibold backdrop-blur-sm sm:flex ${
                light
                  ? "border-[var(--light-border)] bg-[var(--light-surface)]"
                  : "border-violet-500/25 bg-white/5"
              }`}
            >
              <Link
                href={pathname}
                locale="it"
                className={`rounded-lg px-2 py-1 transition-colors ${
                  locale === "it"
                    ? light
                      ? "bg-[var(--light-primary)] text-white"
                      : "bg-violet-600 text-white"
                    : light
                      ? "text-[var(--light-text-muted)] hover:bg-white hover:text-[var(--light-text)]"
                      : "text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
                aria-current={locale === "it" ? "true" : undefined}
              >
                {t("langIt")}
              </Link>
              <Link
                href={pathname}
                locale="en"
                className={`rounded-lg px-2 py-1 transition-colors ${
                  locale === "en"
                    ? light
                      ? "bg-[var(--light-primary)] text-white"
                      : "bg-violet-600 text-white"
                    : light
                      ? "text-[var(--light-text-muted)] hover:bg-white hover:text-[var(--light-text)]"
                      : "text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
                aria-current={locale === "en" ? "true" : undefined}
              >
                {t("langEn")}
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                light
                  ? showBar
                    ? "text-[var(--light-text)] hover:bg-[var(--light-surface)]"
                    : "bg-white/80 text-[var(--light-text)] shadow-md ring-1 ring-[var(--light-border)] hover:bg-white"
                  : showBar
                    ? "text-slate-200 hover:bg-white/10"
                    : "bg-white/5 text-slate-200 shadow-md ring-1 ring-violet-500/25 backdrop-blur-sm hover:bg-white/10"
              }`}
              aria-expanded={drawerOpen}
              aria-controls="site-drawer"
              aria-label={t("openMenu")}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
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
              className={`fixed inset-0 z-[60] backdrop-blur-sm ${light ? "bg-slate-900/25" : "bg-slate-900/40"}`}
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
              className={`fixed right-0 top-0 z-[70] flex h-full w-[min(100vw-3rem,20rem)] flex-col border-l shadow-2xl ${
                light
                  ? "border-[var(--light-border)] bg-white shadow-slate-900/10"
                  : "border-violet-500/20 bg-[#0d0720] shadow-violet-900/30"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b px-4 py-4 ${
                  light ? "border-[var(--light-border)]" : "border-violet-500/15"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${light ? "text-[var(--light-text)]" : "text-slate-200"}`}
                >
                  {t("menu")}
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    light
                      ? "text-[var(--light-text-muted)] hover:bg-[var(--light-surface)] hover:text-[var(--light-text)]"
                      : "text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  }`}
                  aria-label={t("close")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                className={`flex gap-2 border-b px-4 py-3 ${
                  light ? "border-[var(--light-border)]" : "border-violet-500/15"
                }`}
              >
                <Link
                  href={pathname}
                  locale="it"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-colors ${
                    locale === "it"
                      ? light
                        ? "bg-[var(--light-primary)] text-white"
                        : "bg-violet-600 text-white"
                      : light
                        ? "bg-[var(--light-surface)] text-[var(--light-text-muted)] hover:bg-[var(--light-border)]"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {t("langIt")}
                </Link>
                <Link
                  href={pathname}
                  locale="en"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-colors ${
                    locale === "en"
                      ? light
                        ? "bg-[var(--light-primary)] text-white"
                        : "bg-violet-600 text-white"
                      : light
                        ? "bg-[var(--light-surface)] text-[var(--light-text-muted)] hover:bg-[var(--light-border)]"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {t("langEn")}
                </Link>
              </div>

              <ul className="flex flex-1 flex-col gap-1 p-4">
                {navRoutes.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                          active
                            ? light
                              ? "bg-[var(--light-surface)] text-[var(--light-emphasis)]"
                              : "bg-gradient-to-r from-violet-600/20 to-cyan-500/10 text-violet-300"
                            : light
                              ? "text-[var(--light-text)] hover:bg-[var(--light-surface)]"
                              : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
                        }`}
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div
                className={`border-t p-4 ${light ? "border-[var(--light-border)]" : "border-violet-500/15"}`}
              >
                <Link
                  href="/contatti"
                  onClick={() => setDrawerOpen(false)}
                  className={
                    light
                      ? "flex w-full items-center justify-center rounded-xl bg-[var(--light-primary)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                      : "flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
                  }
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
