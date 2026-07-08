import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/projects-grid";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isIt = locale === "it";
  const path = isIt ? "/it/progetti" : "/en/projects";

  return {
    metadataBase: new URL("https://www.qc-tech.co.uk"),
    title: isIt ? "I Nostri Progetti | QC Tech" : "Our Projects | QC Tech",
    description: isIt
      ? "Portali civici, app mobile e piattaforme digitali sviluppate da QC Tech per comunità italiane e britanniche."
      : "Civic portals, mobile apps and digital platforms developed by QC Tech for Italian and British communities.",
    alternates: {
      canonical: `https://www.qc-tech.co.uk${path}`,
      languages: {
        it: "https://www.qc-tech.co.uk/it/progetti",
        en: "https://www.qc-tech.co.uk/en/projects",
        "x-default": "https://www.qc-tech.co.uk/en/projects",
      },
    },
  };
}

export default async function ProgettiPage({ params }: PageProps) {
  const { locale } = await params;
  const isIt = locale === "it";

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {isIt ? "Portfolio" : "Portfolio"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {isIt ? "I Nostri Progetti" : "Our Projects"}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          {isIt
            ? "Portali civici, app mobile e piattaforme digitali che portiamo in produzione per comunità italiane e britanniche."
            : "Civic portals, mobile apps and digital platforms we build for Italian and British communities."}
        </p>
        <div className="mt-12">
          <ProjectsGrid locale={locale} />
        </div>
      </div>
    </div>
  );
}
