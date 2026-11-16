import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function CopilotLtdPromo() {
  const t = await getTranslations("copilotPromo");

  return (
    <section
      className="rounded-2xl border border-[var(--light-border)] bg-white p-6 sm:p-8"
      aria-labelledby="copilot-promo-heading"
    >
      <h2
        id="copilot-promo-heading"
        className="text-xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-2xl"
      >
        {t("title")}
      </h2>
      <p className="mt-2 max-w-2xl text-[var(--light-text-muted)]">{t("body")}</p>
      <Link
        href={{ pathname: "/copilot-ltd", hash: "lista" }}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--light-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
      >
        {t("cta")}
      </Link>
    </section>
  );
}
