import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FaqAccordion } from "@/components/faq-accordion";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await params;
  return {
    metadataBase: new URL("https://www.qc-tech.co.uk"),
    title: "FAQ | QC Tech",
  };
}

export default async function FAQPage() {
  const t = await getTranslations("FAQ");

  const items = Array.from({ length: 15 }, (_, idx) => idx + 1).map((i) => ({
    question: t(`q${i}` as "q1"),
    answer: t(`a${i}` as "a1"),
  }));

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          FAQ
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t("title")}
        </h1>

        <div className="mt-10">
          <FaqAccordion items={items} />
        </div>

        <div className="mt-12 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/8 via-transparent to-cyan-500/5 p-6 text-center">
          <p className="text-lg font-semibold text-white sm:text-xl">
            {t("ctaTitle")}
          </p>
          <p className="mt-3 text-sm text-slate-400">
            {t("ctaBody")}
          </p>
          <Link
            href="/contatti"
            className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </div>
  );
}
