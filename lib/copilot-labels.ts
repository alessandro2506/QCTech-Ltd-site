import en from "@/messages/en.json";
import it from "@/messages/it.json";

const byLocale = {
  it: it.apiCopilot,
  en: en.apiCopilot,
} as const;

export function apiCopilotStrings(locale: string) {
  return byLocale[locale === "en" ? "en" : "it"];
}

export function apiErrors(locale: string) {
  return (locale === "en" ? en : it).apiErrors;
}
