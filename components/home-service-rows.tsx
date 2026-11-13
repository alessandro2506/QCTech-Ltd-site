import type { CSSProperties } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ServiceCardsCursor } from "@/components/service-cards-cursor";
import { servicePreview } from "@/lib/service-previews";

type ServiceRow = {
  id: string;
  title: string;
  description: string;
  fromPrice: string;
  previewAlt: string;
  tags: string[];
};

const TINTS = ["#1E6FDB", "#562AC5", "#0EA5A8"] as const;

export async function HomeServiceRows() {
  const t = await getTranslations("home.services");
  const rows = t.raw("rows") as ServiceRow[];

  return (
    <section id="servizi" className="section-y bg-[var(--light-bg)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--light-text-muted)]">
          {t("intro")}
        </p>
        <ServiceCardsCursor>
          <ul className="svc-list">
            {rows.map((row, index) => {
              const preview = servicePreview(row.id);
              const tint = TINTS[index % TINTS.length];
              return (
                <li key={row.id}>
                  <Link
                    href="/servizi"
                    className="svc-row"
                    style={{ "--svc-tint": tint } as CSSProperties}
                  >
                    <div className="svc-body">
                      <h3>{row.title}</h3>
                      <p>{row.description}</p>
                      <ul className="svc-tags">
                        {row.tags.map((tag) => (
                          <li key={tag}>
                            <i aria-hidden />
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="svc-shot" aria-hidden>
                      <Image
                        src={preview.src}
                        alt=""
                        width={600}
                        height={320}
                        loading="lazy"
                      />
                    </div>
                    <span className="svc-action">
                      {row.fromPrice}
                      <span aria-hidden>→</span>
                    </span>
                    <span className="sr-only">{row.previewAlt}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </ServiceCardsCursor>
      </div>
    </section>
  );
}
