import { getTranslations } from "next-intl/server";
import { FaqAccordion } from "@/components/faq-accordion";
import { Link } from "@/i18n/routing";

export async function HomeFaq() {
  const tHome = await getTranslations("home.faq");
  const tFaq = await getTranslations("FAQ");
  const items = [1, 2, 3, 4, 5, 6].map((i) => ({
    question: tFaq(`q${i}` as "q1"),
    answer: tFaq(`a${i}` as "a1"),
  }));

  return (
    <section className="section-y bg-[var(--light-surface)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {tHome("title")}
        </h2>
        <div className="mt-8">
          <FaqAccordion items={items} variant="light" />
        </div>
        <p className="mt-8 text-sm">
          <Link
            href="/faq"
            className="font-semibold text-[var(--light-primary)] hover:underline"
          >
            {tHome("allLink")}
          </Link>
        </p>
      </div>
    </section>
  );
}
