import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CopilotLtdPage } from "@/components/copilot-ltd-page";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "copilotLtd" });
  const path = `/${locale}/copilot-ltd`;

  return {
    metadataBase: new URL("https://www.qc-tech.co.uk"),
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: `https://www.qc-tech.co.uk${path}`,
      languages: {
        it: "https://www.qc-tech.co.uk/it/copilot-ltd",
        en: "https://www.qc-tech.co.uk/en/copilot-ltd",
        "x-default": "https://www.qc-tech.co.uk/en/copilot-ltd",
      },
    },
  };
}

export default function CopilotLtdRoutePage() {
  return <CopilotLtdPage />;
}
