import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { servicePreview } from "@/lib/service-previews";

type ServiceRow = {
  id: string;
  title: string;
  description: string;
  fromPrice: string;
  previewAlt: string;
};

export async function HomeServiceRows() {
  const t = await getTranslations("home.services");
  const rows = t.raw("rows") as ServiceRow[];

  return (
    <section className="bg-[var(--light-bg)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--light-text-muted)]">
          {t("intro")}
        </p>
        <ul className="mt-10 divide-y divide-[var(--light-border)] border-y border-[var(--light-border)]">
          {rows.map((row) => {
            const preview = servicePreview(row.id);
            const image = (
              <Image
                src={preview.src}
                alt=""
                width={640}
                height={400}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            );

            return (
              <li key={row.id}>
                <Link
                  href="/servizi"
                  className="home-service-row block rounded-none py-6 no-underline outline-offset-4 sm:py-7"
                >
                  <div className="home-service-copy max-w-xl">
                    <p className="text-lg font-semibold text-[var(--light-text)]">
                      {row.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--light-text-muted)]">
                      {row.description}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[var(--light-primary)]">
                      {row.fromPrice}
                    </p>
                  </div>
                  <div className="home-service-preview" aria-hidden>
                    {preview.framed ? (
                      <div className="home-service-preview-frame">
                        <span className="home-service-preview-bar" />
                        <span className="home-service-preview-screen">
                          {image}
                        </span>
                      </div>
                    ) : (
                      <div className="home-service-preview-photo">{image}</div>
                    )}
                  </div>
                  <span className="sr-only">{row.previewAlt}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
