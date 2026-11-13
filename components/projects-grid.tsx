"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  projects,
  type ProjectItem,
  type ProjectStatusType,
} from "@/lib/projects-data";

const lightBadgeClass: Record<ProjectStatusType, string> = {
  live: "border-emerald-700/30 bg-emerald-50 text-emerald-800",
  development: "border-amber-800/25 bg-amber-50 text-amber-900",
  coming: "border-[var(--light-border)] bg-[var(--light-surface)] text-[var(--light-text-muted)]",
};

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
      className="flex flex-col rounded-2xl border border-[var(--light-border)] bg-white p-6"
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
      <h2 className="mt-4 text-xl font-bold text-[var(--light-text)]">
        {project.name}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--light-text-muted)]">
        {description}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${lightBadgeClass[project.statusType]}`}
        >
          {status}
        </span>
        {project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl bg-[var(--light-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {isIt ? "Visita il sito" : "Visit website"}
          </a>
        ) : (
          <span className="inline-flex rounded-full border border-[var(--light-border)] bg-[var(--light-surface)] px-3 py-1 text-xs font-semibold text-[var(--light-text-muted)]">
            {comingSoonLabel}
          </span>
        )}
      </div>
    </motion.article>
  );
}

export function ProjectsGrid({
  locale,
  excludeIds = [],
}: {
  locale: string;
  excludeIds?: string[];
}) {
  const items = projects.filter((project) => !excludeIds.includes(project.id));

  return (
    <div className="section-stack grid grid-cols-1 sm:grid-cols-2">
      {items.map((project, index) => (
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
