import { getAllPosts } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-slate-600">{t("subtitle")}</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500">{t("empty")}</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-cyan-50 px-3 py-0.5 text-xs font-medium text-cyan-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/${locale}/blog/${post.slug}`}>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-slate-600 leading-relaxed">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
                <span>·</span>
                <span>{post.author || "QC Tech"}</span>
              </div>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                {t("readMore")} →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
