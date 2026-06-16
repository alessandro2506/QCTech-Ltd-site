import { getTranslations } from "next-intl/server";
import { isContactTopic, type ContactTopic } from "@/lib/contact";

const TOPIC_PRICING_NS: Record<Exclude<ContactTopic, "other">, string> = {
  web: "pricingWeb",
  mobile: "pricingMobile",
  ecommerce: "pricingEcommerce",
  presence: "pricingPresence",
};

/**
 * Risolve l'id piano (es. web-a) da nome visualizzato in query (?plan=Plan+A)
 * per idratare il select contatti senza useEffect lato client.
 */
export async function resolveContactInitialPlanId(
  locale: string,
  topic: string | undefined,
  planQuery: string | undefined,
): Promise<string> {
  const rawTopic = topic?.trim().toLowerCase() ?? "";
  if (!rawTopic || !isContactTopic(rawTopic) || rawTopic === "other") {
    return "";
  }
  const nameRaw = planQuery?.trim() ?? "";
  if (!nameRaw) return "";

  const planName = (() => {
    try {
      return decodeURIComponent(nameRaw.replace(/\+/g, " "));
    } catch {
      return nameRaw.replace(/\+/g, " ");
    }
  })();

  const ns = TOPIC_PRICING_NS[rawTopic];
  const tr = await getTranslations({ locale, namespace: ns });
  const plans =
    (tr.raw("plans") as { id: string; name: string }[] | undefined) ?? [];
  return plans.find((p) => p.name === planName)?.id ?? "";
}
