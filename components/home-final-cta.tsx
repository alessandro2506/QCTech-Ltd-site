import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getWhatsAppHref } from "@/lib/get-whatsapp-href";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export async function HomeFinalCta() {
  const locale = await getLocale();
  const t = await getTranslations("home.finalCta");
  const whatsappHref = getWhatsAppHref(locale);

  return (
    <section className="section-y bg-[var(--light-cta-dark)]">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 text-base text-slate-300">{t("body")}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contatti"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--light-primary)] px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {t("quote")}
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" decorative />
            {t("whatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
