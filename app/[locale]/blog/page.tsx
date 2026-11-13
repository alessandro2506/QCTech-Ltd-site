import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { buildAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const loc = locale as "it" | "en";

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates("/blog", loc),
    openGraph: { url: buildAlternates("/blog", loc).canonical as string },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 pt-28 sm:px-6 sm:pt-32">
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--light-primary)]">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--light-emphasis)]">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-[var(--light-text-muted)]">{t("subtitle")}</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-[var(--light-text-muted)]">{t("empty")}</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-[var(--light-border)] bg-white p-6 transition hover:border-[var(--light-primary)]/40"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--light-surface)] px-3 py-0.5 text-xs font-medium text-[var(--light-primary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/${locale}/blog/${post.slug}`}>
                <h2 className="text-xl font-bold text-[var(--light-text)] transition-colors group-hover:text-[var(--light-primary)]">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 leading-relaxed text-[var(--light-text-muted)]">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-[var(--light-text-muted)]">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
                <span>·</span>
                <span>{post.author || "QC Tech"}</span>
              </div>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--light-primary)] hover:underline"
              >
                {t("readMore")} →
              </Link>
            </article>
          ))}
        </div>
      )}
      <CtaBanner />
    </section>
  );
}
