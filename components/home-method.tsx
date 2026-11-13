import { getTranslations } from "next-intl/server";

type MethodStep = {
  title: string;
  body: string;
};

export async function HomeMethod() {
  const t = await getTranslations("home.method");
  const steps = t.raw("steps") as MethodStep[];

  return (
    <section className="bg-[var(--light-surface)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--light-text-muted)]">
          {t("intro")}
        </p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-[var(--light-border)] bg-white p-5"
            >
              <p className="text-xs font-semibold tracking-widest text-[var(--light-primary)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--light-text)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--light-text-muted)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
