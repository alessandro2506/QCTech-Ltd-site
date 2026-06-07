import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Cpu, Layers, Rocket, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";

const iconMap = {
  layers: Layers,
  cpu: Cpu,
  rocket: Rocket,
  sparkles: Sparkles,
} as const;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL("https://www.qc-tech.co.uk"),
    title: t("visionTitle"),
    description: t("visionDescription"),
  };
}

export default async function VisionPage() {
  const t = await getTranslations("Vision");
  const values: Array<{
    icon: keyof typeof iconMap;
    title: string;
    body: string;
  }> = [
    { icon: "layers", title: t("values.v1_title"), body: t("values.v1_body") },
    { icon: "cpu", title: t("values.v2_title"), body: t("values.v2_body") },
    { icon: "rocket", title: t("values.v3_title"), body: t("values.v3_body") },
    {
      icon: "sparkles",
      title: t("values.v4_title"),
      body: t("values.v4_body"),
    },
  ];

  return (
    <div className="relative pb-24 pt-28 sm:pt-32">
      {/* Quantum grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-quantum-grid opacity-50"
        aria-hidden
      />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-0 top-20 -z-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[100px]" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-80 w-80 rounded-full bg-cyan-500/8 blur-[80px]" aria-hidden />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {t("hero.label")}
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-400">
          {t("hero.subtitle")}
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <section className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white">{t("story.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {t("story.body")}
            </p>
          </section>

          <section className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white">{t("team.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {t("team.body")}
            </p>
          </section>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t("values.title")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {values.map((p) => {
              const Icon = iconMap[p.icon];
              return (
                <div
                  key={p.title}
                  className="glass-card relative overflow-hidden rounded-2xl p-8 transition hover:border-violet-400/30"
                >
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rotate-45 border border-violet-400/10 bg-gradient-to-br from-violet-600/5 to-cyan-500/5"
                    aria-hidden
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-white">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/8 p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t("cta.title")}
          </h2>
          <Link
            href="/contatti"
            className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
          >
            {t("cta.button")}
          </Link>
        </section>
      </div>
    </div>
  );
}
