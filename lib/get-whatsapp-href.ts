const WHATSAPP_E164 = "447754812247";

/**
 * Link wa.me con messaggio precompilato in base alla lingua dell’interfaccia.
 */
export function getWhatsAppHref(locale: string): string {
  const whatsappMessage =
    locale === "en"
      ? "Good day, I visited qc-tech.co.uk and I would like to discuss a potential project with your team."
      : "Buongiorno, ho visitato qc-tech.co.uk e desidero richiedere informazioni riguardo a un potenziale progetto.";

  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(whatsappMessage)}`;
}
