import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Lingua per chi arriva senza prefisso (/it o /en) nell'URL.
 * Regola: visitatore in Italia → italiano; fuori dall'Italia → inglese.
 * Il Paese arriva da Vercel (x-vercel-ip-country). Se manca (sviluppo
 * locale), vale solo la lingua PRINCIPALE del browser, non quelle secondarie.
 * Il cookie NEXT_LOCALE non viene usato qui: next-intl lo imposta da solo
 * a ogni visita di una pagina /it, quindi non indica una scelta dell'utente.
 */
function detectLocale(request: NextRequest): "it" | "en" {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country) return country === "IT" ? "it" : "en";

  const primary = (request.headers.get("accept-language") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  return primary === "it" || primary.startsWith("it-") ? "it" : "en";
}

function hasLocalePrefix(pathname: string): boolean {
  return routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!hasLocalePrefix(pathname)) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(url, 302);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
