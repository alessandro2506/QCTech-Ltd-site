import { getTranslations } from "next-intl/server";
import { BarChart3, Globe2, Smartphone } from "lucide-react";
import { HeroHome } from "@/components/hero-home";
import { PricingCluster } from "@/components/pricing-cluster";
import type { PricingPlan } from "@/components/pricing-cluster";
import { Link } from "@/i18n/routing";

const icons = [Globe2, Smartphone, BarChart3] as const;

function asTuple(
  raw: unknown,
): [PricingPlan, PricingPlan, PricingPlan] {
  const a = raw as PricingPlan[];
  return [a[0], a[1], a[2]];
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const tWeb = await getTranslations("pricingWeb");
  const tMob = await getTranslations("pricingMobile");
  const tEco = await getTranslations("pricingEcommerce");

  const valueCards = t.raw("valueCards") as { title: string; body: string }[];

  return (
    <>
      <HeroHome />

      {/* Value cards — dark glass */}
      <section className="relative border-y border-violet-500/10 py-12">
        <div className="section-glow-top absolute inset-x-0 top-0 h-px" />
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {valueCards.map((item, i) => {
            const Icon = icons[i];
            return (
              <div
                key={item.title}
                className="glass-card flex gap-4 rounded-2xl p-5 transition-colors hover:border-violet-400/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/20">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-100">{item.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
