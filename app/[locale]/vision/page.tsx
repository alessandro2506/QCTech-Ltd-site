import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
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
  const loc = locale as "it" | "en";
  return {
    title: t("visionTitle"),
    description: t("visionDescription"),
    alternates: buildAlternates("/vision", loc),
    openGraph: { url: buildAlternates("/vision", loc).canonical as string },
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
          {t("hero.label")}
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-[var(--light-text-muted)]">
          {t("hero.subtitle")}
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <section className="rounded-2xl border border-[var(--light-border)] bg-white p-8">
            <h2 className="text-xl font-bold text-[var(--light-emphasis)]">{t("story.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--light-text-muted)]">
              {t("story.body")}
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--light-border)] bg-white p-8">
            <h2 className="text-xl font-bold text-[var(--light-emphasis)]">{t("team.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--light-text-muted)]">
              {t("team.body")}
            </p>
          </section>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-3xl">
            {t("values.title")}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {values.map((p) => {
              const Icon = iconMap[p.icon];
              return (
                <div
                  key={p.title}
                  className="relative overflow-hidden rounded-2xl border border-[var(--light-border)] bg-white p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--light-surface)] text-[var(--light-primary)]">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-[var(--light-emphasis)]">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--light-text-muted)]">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-[var(--light-border)] bg-[var(--light-surface)] p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-3xl">
            {t("cta.title")}
          </h2>
          <Link
            href="/contatti"
            className="mt-5 inline-flex rounded-full bg-[var(--light-primary)] px-8 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {t("cta.button")}
          </Link>
        </section>
      </div>
    </div>
  );
}
