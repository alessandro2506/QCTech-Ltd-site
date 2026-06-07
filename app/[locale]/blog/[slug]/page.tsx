import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

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
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-violet-400"
      >
        ← Blog
      </Link>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-violet-500/15 px-3 py-0.5 text-xs font-medium text-violet-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-b border-violet-500/10 pb-6 text-sm text-slate-500">
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
      <div className="mt-8 space-y-5 leading-relaxed text-slate-300">
        {paragraphs.map((block, i) => {
          if (block.startsWith("# ")) {
            return (
              <h2 key={i} className="mt-10 mb-2 text-2xl font-bold text-white">
                {block.replace(/^# /, "")}
              </h2>
            );
          }
          if (block.startsWith("## ")) {
            return (
              <h3 key={i} className="mt-8 mb-2 text-xl font-bold text-white">
                {block.replace(/^## /, "")}
              </h3>
            );
          }
          if (block.startsWith("### ")) {
            return (
              <h4 key={i} className="mt-6 mb-1 text-lg font-semibold text-slate-100">
                {block.replace(/^### /, "")}
              </h4>
            );
          }
          if (block === "---") {
            return <hr key={i} className="my-8 border-violet-500/15" />;
          }
          if (block.split("\n").every((l) => l.startsWith("- "))) {
            return (
              <ul key={i} className="list-inside list-disc space-y-1 text-slate-400">
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
                    <tr className="bg-violet-500/10">
                      {cells(head).map((c, j) => (
                        <th
                          key={j}
                          className="border border-violet-500/15 px-4 py-2 text-left font-semibold text-slate-200"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {body.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-transparent" : "bg-white/3"}>
                        {cells(row).map((c, k) => (
                          <td
                            key={k}
                            className="border border-violet-500/10 px-4 py-2 text-slate-400"
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
                className="rounded-r-lg border-l-4 border-cyan-500/50 bg-cyan-500/8 px-4 py-3 italic text-slate-400"
              >
                {block.replace(/^> /gm, "")}
              </blockquote>
            );
          }
          const html = block
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1 rounded text-sm text-cyan-300">$1</code>');
          return (
            <p
              key={i}
              className="text-base text-slate-300"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        })}
      </div>

      {/* CTA bottom */}
      <div className="mt-16 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/8 p-8 text-center">
        <p className="text-lg font-semibold text-white">
          {locale === "it" ? "Hai bisogno di supporto per la tua presenza digitale?" : "Need help with your digital presence?"}
        </p>
        <p className="mt-2 text-slate-400">
          {locale === "it" ? "Audit gratuito del sito — rispondiamo entro un giorno lavorativo." : "Free site audit — we reply within one business day."}
        </p>
        <Link
          href="/contatti"
          className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110"
        >
          {locale === "it" ? "Richiedi un audit gratuito →" : "Get a free audit →"}
        </Link>
      </div>
    </article>
  );
}
