import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Cloud, Code2, Search, Smartphone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import {
  ServiceSectorsTabs,
  type SectorTab,
} from "@/components/service-sectors-tabs";

const icons = [Code2, Smartphone, Cloud, Search] as const;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL("https://www.qc-tech.co.uk"),
    title: t("servicesTitle"),
    description: t("servicesDescription"),
  };
}

export default async function ServiziPage() {
  const t = await getTranslations("servicesPage");
  const items = t.raw("items") as {
    title: string;
    points: string[];
  }[];
  const sectors = t.raw("sectors") as SectorTab[];

  return (
    <div className="pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">{t("intro")}</p>

        <ServiceSectorsTabs
          eyebrow={t("sectorsEyebrow")}
          title={t("sectorsTitle")}
          intro={t("sectorsIntro")}
          tabs={sectors}
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {items.map((s, i) => {
            const Icon = icons[i];
            return (
              <article
                key={s.title}
                className="glass-card group rounded-2xl p-8 transition hover:border-violet-400/30"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20">
                  <Icon className="h-7 w-7" aria-hidden />
                </div>
                <h2 className="mt-6 text-xl font-bold text-white">
                  {s.title}
                </h2>
                <ul className="mt-4 space-y-3 text-slate-400">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm leading-relaxed">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500"
                        aria-hidden
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <section
          id="richiedi-preventivo"
          className="mt-24 scroll-mt-28 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/8 via-transparent to-cyan-500/5 p-8 sm:p-10"
          aria-labelledby="servizi-preventivo-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            {t("quoteEyebrow")}
          </p>
          <h2
            id="servizi-preventivo-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {t("quoteTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-slate-400">{t("quoteBody")}</p>
          <div className="mx-auto mt-8 max-w-xl">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
