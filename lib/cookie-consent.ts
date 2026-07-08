const GA4_ID = "G-EK5XQ10BZP";

let gaLoaded = false;

export function loadGoogleAnalytics() {
  if (typeof window === "undefined" || gaLoaded) return;
  gaLoaded = true;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA4_ID);
}

export type CookieConsent = "all" | "essential";

export const COOKIE_CONSENT_KEY = "cookie_consent";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === "all" || value === "essential") return value;
  return null;
}

export function setCookieConsent(value: CookieConsent) {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  if (value === "all") loadGoogleAnalytics();
}
