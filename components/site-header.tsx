"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navRoutes } from "@/app.config";
import { QCTechLogo } from "@/components/qctech-logo";
import { Link, usePathname } from "@/i18n/routing";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const isHome = pathname === "/";
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
            ? "border-b border-violet-500/15 bg-[#08050f]/90 shadow-[0_1px_20px_rgba(108,99,255,0.08)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="relative mx-auto flex min-h-14 max-w-6xl items-center justify-end gap-2 px-4 py-1.5 sm:min-h-[3.75rem] sm:px-6">
          {showBar ? (
            <div className="absolute left-3 top-1/2 max-w-[min(100%,calc(100%-8rem))] -translate-y-1/2 sm:left-5">
              <QCTechLogo variant="header" linkToHome />
            </div>
          ) : null}

          <div className="hidden items-center gap-1 rounded-xl border border-violet-500/25 bg-white/5 px-1 py-0.5 text-xs font-semibold backdrop-blur-sm sm:flex">
            <Link
              href={pathname}
              locale="it"
              className={`rounded-lg px-2 py-1 transition-colors ${locale === "it" ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-white/10 hover:text-slate-200"}`}
              aria-current={locale === "it" ? "true" : undefined}
            >
              {t("langIt")}
            </Link>
            <Link
              href={pathname}
              locale="en"
              className={`rounded-lg px-2 py-1 transition-colors ${locale === "en" ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-white/10 hover:text-slate-200"}`}
              aria-current={locale === "en" ? "true" : undefined}
            >
              {t("langEn")}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
              showBar
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
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
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
              className="fixed right-0 top-0 z-[70] flex h-full w-[min(100vw-3rem,20rem)] flex-col border-l border-violet-500/20 bg-[#0d0720] shadow-2xl shadow-violet-900/30"
            >
              <div className="flex items-center justify-between border-b border-violet-500/15 px-4 py-4">
                <span className="text-sm font-semibold text-slate-200">
                  {t("menu")}
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  aria-label={t("close")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex gap-2 border-b border-violet-500/15 px-4 py-3">
                <Link
                  href={pathname}
                  locale="it"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-colors ${locale === "it" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
                >
                  {t("langIt")}
                </Link>
                <Link
                  href={pathname}
                  locale="en"
                  onClick={() => setDrawerOpen(false)}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-colors ${locale === "en" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
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
                            ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/10 text-violet-300"
                            : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
                        }`}
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-violet-500/15 p-4">
                <Link
                  href="/contatti"
                  onClick={() => setDrawerOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
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
