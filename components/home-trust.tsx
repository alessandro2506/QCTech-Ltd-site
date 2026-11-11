import { getTranslations } from "next-intl/server";

export async function HomeTrust() {
  const t = await getTranslations("home.trust");
  const items = t.raw("items") as string[];

  return (
    <section
      aria-label={t("label")}
      className="border-y border-[var(--light-border)] bg-[var(--light-surface)] py-8 sm:py-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-3 sm:gap-y-2 sm:px-6">
        {items.map((item, index) => (
          <span key={item} className="flex items-center gap-3 text-sm text-[var(--light-text-muted)]">
            {index > 0 ? (
              <span
                className="hidden h-1 w-1 rounded-full bg-[var(--light-border)] sm:inline-block"
                aria-hidden
              />
            ) : null}
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
