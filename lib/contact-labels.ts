import type { ContactTopic } from "@/lib/contact";
import en from "@/messages/en.json";
import it from "@/messages/it.json";

const byLocale = {
  it: it.contactForm,
  en: en.contactForm,
} as const;

export function contactTopicLabel(
  locale: string,
  topic: ContactTopic,
): string {
  const f = byLocale[locale === "en" ? "en" : "it"];
  switch (topic) {
    case "web":
      return f.topicWeb;
    case "mobile":
      return f.topicMobile;
    case "ecommerce":
      return f.topicEcommerce;
    case "presence":
      return f.topicPresence;
    case "other":
      return f.topicOther;
  }
}

export function apiErrors(locale: string) {
  return (locale === "en" ? en : it).apiErrors;
}

export function apiContactStrings(locale: string) {
  return (locale === "en" ? en : it).apiContact;
}
