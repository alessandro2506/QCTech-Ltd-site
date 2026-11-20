import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CareersPortal } from "@/components/careers-portal";
import { buildAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers.meta" });
  const loc = locale as "it" | "en";

  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/careers", loc),
    openGraph: { url: buildAlternates("/careers", loc).canonical as string },
  };
}

export default async function CareersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers.list");

  return (
    <div className="page-top bg-[var(--light-bg)] pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--light-text-muted)]">
          {t("intro")}
        </p>
        <Suspense fallback={null}>
          <CareersPortal />
        </Suspense>
      </div>
    </div>
  );
}
