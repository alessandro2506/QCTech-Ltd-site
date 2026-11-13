import { getCookieConsent } from "@/lib/cookie-consent";

export function trackAssistantEvent(
  name:
    | "assistant_open"
    | "assistant_answer"
    | "assistant_draft_created"
    | "contact_submit_with_draft",
  params?: Record<string, string | boolean | number>,
): void {
  if (typeof window === "undefined") return;
  if (getCookieConsent() !== "all") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
