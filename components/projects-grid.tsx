"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import {
  projects,
  statusBadgeClass,
  type ProjectItem,
} from "@/lib/projects-data";

function ProjectCard({
  project,
  locale,
  index,
}: {
  project: ProjectItem;
  locale: string;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const isIt = locale === "it";
  const description = isIt ? project.descriptionIt : project.descriptionEn;
  const status = isIt ? project.statusIt : project.statusEn;
  const comingSoonLabel = isIt ? "Coming Soon" : "Coming Soon";

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass-card flex flex-col rounded-2xl border border-violet-500/15 p-6"
    >
      <div className="flex h-14 items-center">
        <Image
          src={project.logo}
          alt={project.name}
          width={project.logoWidth ?? 160}
          height={project.logoHeight ?? 48}
          className="h-12 w-auto max-w-[180px] object-contain object-left"
        />
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">{project.name}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
        {description}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass[project.statusType]}`}
        >
          {status}
        </span>
        {project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:brightness-110"
          >
            {isIt ? "Visita il sito" : "Visit website"}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        ) : (
          <span className="inline-flex rounded-full border border-slate-500/25 bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-400">
            {comingSoonLabel}
          </span>
        )}
      </div>
    </motion.article>
  );
}

export function ProjectsGrid({ locale }: { locale: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          locale={locale}
          index={index}
        />
      ))}
    </div>
  );
}
