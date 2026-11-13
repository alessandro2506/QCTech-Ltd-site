import { getLocale, getTranslations } from "next-intl/server";
import NextLink from "next/link";
import { Link } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";

export async function HomeBlog() {
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const posts = getAllPosts(locale).slice(0, 3);

  return (
    <section className="section-y bg-[var(--light-bg)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
          {t("title")}
        </h2>
        {posts.length > 0 ? (
          <ul className="mt-8 space-y-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <NextLink
                  href={`/${locale}/blog/${post.slug}`}
                  className="font-medium text-[var(--light-primary)] hover:underline"
                >
                  {post.title}
                </NextLink>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-8">
          <Link
            href="/blog"
            className="font-semibold text-[var(--light-primary)] hover:underline"
          >
            {t("allArticles")}
          </Link>
        </p>
      </div>
    </section>
  );
}
