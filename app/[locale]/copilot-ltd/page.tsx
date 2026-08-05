import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CopilotLtdPage } from "@/components/copilot-ltd-page";
import { buildAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "copilotLtd" });
  const loc = locale as "it" | "en";

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: buildAlternates("/copilot-ltd", loc),
    openGraph: { url: buildAlternates("/copilot-ltd", loc).canonical as string },
  };
}

export default function CopilotLtdRoutePage() {
  return <CopilotLtdPage />;
}
