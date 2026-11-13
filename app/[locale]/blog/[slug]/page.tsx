import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { RelatedReading } from "@/components/related-reading";
import { relatedPostsForSlug, themeForSlug } from "@/lib/related-posts";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const locales = ["en", "it"];
  const results: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const posts = getAllPosts(locale);
    for (const p of posts) {
      results.push({ locale, slug: p.slug });
    }
  }
  return results;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
    alternates: {
      canonical: `https://www.qc-tech.co.uk/${locale}/blog/${slug}`,
      languages: {
        it: `https://www.qc-tech.co.uk/it/blog/${slug}`,
        en: `https://www.qc-tech.co.uk/en/blog/${slug}`,
        "x-default": `https://www.qc-tech.co.uk/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();
  const tBlog = await getTranslations("blog");

  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Quantum Code Technologies Ltd",
      url: "https://www.qc-tech.co.uk",
    },
    url: `https://www.qc-tech.co.uk/${locale}/blog/${slug}`,
    inLanguage: locale === "it" ? "it-IT" : "en-GB",
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 pt-28 sm:px-6 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Back */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-[var(--light-text-muted)] transition-colors hover:text-[var(--light-primary)]"
      >
        ← Blog
      </Link>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[var(--light-surface)] px-3 py-0.5 text-xs font-medium text-[var(--light-primary)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[var(--light-emphasis)] sm:text-4xl">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-[var(--light-border)] pb-6 text-sm text-[var(--light-text-muted)]">
        <span>{post.author || "QC Tech"}</span>
        {post.authorRole && (
          <>
            <span>·</span>
            <span>{post.authorRole}</span>
          </>
        )}
        <span>·</span>
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>

      {/* Content */}
      <div className="mt-8 space-y-5 leading-relaxed text-[var(--light-text)]">
        {paragraphs.map((block, i) => {
          if (block.startsWith("# ")) {
            return (
              <h2 key={i} className="mt-10 mb-2 text-2xl font-bold text-[var(--light-emphasis)]">
                {block.replace(/^# /, "")}
              </h2>
            );
          }
          if (block.startsWith("## ")) {
            return (
              <h3 key={i} className="mt-8 mb-2 text-xl font-bold text-[var(--light-emphasis)]">
                {block.replace(/^## /, "")}
              </h3>
            );
          }
          if (block.startsWith("### ")) {
            return (
              <h4 key={i} className="mt-6 mb-1 text-lg font-semibold text-[var(--light-text)]">
                {block.replace(/^### /, "")}
              </h4>
            );
          }
          if (block === "---") {
            return <hr key={i} className="my-8 border-[var(--light-border)]" />;
          }
          if (block.split("\n").every((l) => l.startsWith("- "))) {
            return (
              <ul key={i} className="list-inside list-disc space-y-1 text-[var(--light-text-muted)]">
                {block.split("\n").map((line, j) => (
                  <li key={j}>{line.replace(/^- /, "")}</li>
                ))}
              </ul>
            );
          }
          if (block.startsWith("|")) {
            const rows = block
              .split("\n")
              .filter((r) => r.trim() && !r.match(/^\|[-| ]+\|$/));
            const cells = (row: string) =>
              row
                .split("|")
                .map((c) => c.trim())
                .filter(Boolean);
            const [head, ...body] = rows;
            return (
              <div key={i} className="my-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[var(--light-surface)]">
                      {cells(head).map((c, j) => (
                        <th
                          key={j}
                          className="border border-[var(--light-border)] px-4 py-2 text-left font-semibold text-[var(--light-text)]"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {body.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-transparent" : "bg-[var(--light-surface)]"}>
                        {cells(row).map((c, k) => (
                          <td
                            key={k}
                            className="border border-[var(--light-border)] px-4 py-2 text-[var(--light-text-muted)]"
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          if (block.startsWith("> ")) {
            return (
              <blockquote
                key={i}
                className="rounded-r-lg border-l-4 border-[var(--light-primary)] bg-[var(--light-surface)] px-4 py-3 italic text-[var(--light-text-muted)]"
              >
                {block.replace(/^> /gm, "")}
              </blockquote>
            );
          }
          const html = block
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/`(.+?)`/g, '<code class="rounded bg-[var(--light-surface)] px-1 text-sm text-[var(--light-primary)]">$1</code>');
          return (
            <p
              key={i}
              className="text-base text-[var(--light-text)]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        })}
      </div>

      {/* CTA bottom */}
      <div className="mt-16 rounded-2xl border border-[var(--light-border)] bg-[var(--light-surface)] p-8 text-center">
        <p className="text-lg font-semibold text-[var(--light-emphasis)]">
          {locale === "it" ? "Hai bisogno di supporto per la tua presenza digitale?" : "Need help with your digital presence?"}
        </p>
        <p className="mt-2 text-[var(--light-text-muted)]">
          {locale === "it" ? "Audit gratuito del sito — rispondiamo entro un giorno lavorativo." : "Free site audit — we reply within one business day."}
        </p>
        <Link
          href="/contatti"
          className="mt-6 inline-flex rounded-full bg-[var(--light-primary)] px-8 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {locale === "it" ? "Richiedi un audit gratuito →" : "Get a free audit →"}
        </Link>
      </div>

      <RelatedReading
        title={tBlog("relatedPosts")}
        posts={relatedPostsForSlug(locale, slug)}
        locale={locale}
        serviceLabel={tBlog("relatedService")}
        serviceTheme={themeForSlug(slug)}
      />
    </article>
  );
}
