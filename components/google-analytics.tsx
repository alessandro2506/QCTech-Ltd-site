"use client";

import { useEffect } from "react";
import { getCookieConsent, loadGoogleAnalytics } from "@/lib/cookie-consent";

export function GoogleAnalytics() {
  useEffect(() => {
    if (getCookieConsent() === "all") {
      loadGoogleAnalytics();
    }
  }, []);

  return null;
}
