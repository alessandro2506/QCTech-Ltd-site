import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroHome } from "@/components/hero-home";
import { HomeTrust } from "@/components/home-trust";
import { HomeServiceRows } from "@/components/home-service-rows";
import { HomeProjects } from "@/components/home-projects";
import { HomeMethod } from "@/components/home-method";
import { HomePlans } from "@/components/home-plans";
import { HomeFaq } from "@/components/home-faq";
import { HomeFinalCta } from "@/components/home-final-cta";
import { buildAlternates } from "@/lib/seo";

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
  return (
    <>
      <HeroHome />
      <HomeTrust />
      <HomeServiceRows />
      <HomeProjects />
      <HomeMethod />
      <HomePlans />
      <HomeFaq />
      <HomeFinalCta />
    </>
  );
}
