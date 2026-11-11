import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroHome } from "@/components/hero-home";
import { HomeTrust } from "@/components/home-trust";
import { HomeServiceRows } from "@/components/home-service-rows";
import { PricingCluster } from "@/components/pricing-cluster";
import type { PricingPlan } from "@/components/pricing-cluster";
import { Link } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

function asTuple(
  raw: unknown,
): [PricingPlan, PricingPlan, PricingPlan] {
  const a = raw as PricingPlan[];
  return [a[0], a[1], a[2]];
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const loc = locale as "it" | "en";
  const alternates = buildAlternates("/", loc);

  return {
    alternates,
    openGraph: { url: alternates.canonical as string },
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const tWeb = await getTranslations("pricingWeb");
  const tMob = await getTranslations("pricingMobile");
  const tEco = await getTranslations("pricingEcommerce");
  const tPres = await getTranslations("pricingPresence");

  return (
    <>
      <HeroHome />
      <HomeTrust />
      <HomeServiceRows />

      {/* Pricing section */}
      <section
        id="prezzi"
        className="relative mx-auto max-w-6xl scroll-mt-24 space-y-12 px-4 py-20 sm:scroll-mt-28 sm:px-6"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-violet-600/8 blur-[80px]" aria-hidden />

        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            {t("pricingIntroEyebrow")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("pricingIntroTitle")}
          </h2>
          <p className="mt-3 text-lg text-slate-400">{t("pricingIntroBody")}</p>
        </div>

        <PricingCluster
          eyebrow={tWeb("eyebrow")}
          title={tWeb("title")}
          description={tWeb("description")}
          plans={asTuple(tWeb.raw("plans"))}
          ctaLabel={tWeb("cta")}
          contactTopic="web"
        />

        <p className="text-xs text-slate-500">{tWeb("paymentNote")}</p>

        <PricingCluster
          eyebrow={tMob("eyebrow")}
          title={tMob("title")}
          description={tMob("description")}
          plans={asTuple(tMob.raw("plans"))}
          ctaLabel={tMob("cta")}
          contactTopic="mobile"
        />

        <PricingCluster
          eyebrow={tEco("eyebrow")}
          title={tEco("title")}
          description={tEco("description")}
          plans={asTuple(tEco.raw("plans"))}
          ctaLabel={tEco("cta")}
          contactTopic="ecommerce"
        />

        <PricingCluster
          eyebrow={tPres("eyebrow")}
          title={tPres("title")}
          description={tPres("description")}
          plans={asTuple(tPres.raw("plans"))}
          ctaLabel={tPres("cta")}
          contactTopic="presence"
        />

        {/* CTA band */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/10 p-8 text-center">
          <div className="pointer-events-none absolute inset-0 bg-quantum-grid opacity-30" aria-hidden />
          <p className="relative text-lg font-semibold text-slate-100">
            {t("ctaBandTitle")}
          </p>
          <p className="relative mt-2 text-slate-400">{t("ctaBandBody")}</p>
          <Link
            href="/contatti"
            className="relative mt-6 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
          >
            {t("ctaBandButton")}
          </Link>
        </div>
      </section>
    </>
  );
}
