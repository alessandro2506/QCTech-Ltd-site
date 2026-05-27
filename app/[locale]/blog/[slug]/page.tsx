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
      canonical: `https://www.alvencoltd.co.uk/${locale}/blog/${slug}`,
      languages: {
        it: `https://www.alvencoltd.co.uk/it/blog/${slug}`,
        en: `https://www.alvencoltd.co.uk/en/blog/${slug}`,
        "x-default": `https://www.alvencoltd.co.uk/en/blog/${slug}`,
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
      name: "Alvenco Ltd",
      url: "https://www.alvencoltd.co.uk",
    },
    url: `https://www.alvencoltd.co.uk/${locale}/blog/${slug}`,
    inLanguage: locale === "it" ? "it-IT" : "en-GB",
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Back */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
      >
        ← Blog
      </Link>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-cyan-50 px-3 py-0.5 text-xs font-medium text-cyan-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl leading-tight">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400 border-b border-slate-100 pb-6">
        <span>{post.author}</span>
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

      {/* Content — render markdown headings, lists, tables as prose */}
      <div className="mt-8 space-y-5 text-slate-700 leading-relaxed">
        {paragraphs.map((block, i) => {
          // H1
          if (block.startsWith("# ")) {
            return (
              <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-2">
                {block.replace(/^# /, "")}
              </h2>
            );
          }
          // H2
          if (block.startsWith("## ")) {
            return (
              <h3 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-2">
                {block.replace(/^## /, "")}
              </h3>
            );
          }
          // H3
          if (block.startsWith("### ")) {
            return (
              <h4 key={i} className="text-lg font-semibold text-slate-900 mt-6 mb-1">
                {block.replace(/^### /, "")}
              </h4>
            );
          }
          // Horizontal rule
          if (block === "---") {
            return <hr key={i} className="border-slate-200 my-8" />;
          }
          // Bullet list
          if (block.split("\n").every((l) => l.startsWith("- "))) {
            return (
              <ul key={i} className="list-disc list-inside space-y-1 text-slate-600">
                {block.split("\n").map((line, j) => (
                  <li key={j}>{line.replace(/^- /, "")}</li>
                ))}
              </ul>
            );
          }
          // Markdown table (starts with |)
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
              <div key={i} className="overflow-x-auto my-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      {cells(head).map((c, j) => (
                        <th
                          key={j}
                          className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-700"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {body.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        {cells(row).map((c, k) => (
                          <td
                            key={k}
                            className="border border-slate-200 px-4 py-2 text-slate-600"
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
          // Blockquote / tip box
          if (block.startsWith("> ")) {
            return (
              <blockquote
                key={i}
                className="border-l-4 border-cyan-400 bg-cyan-50/60 px-4 py-3 text-slate-600 italic rounded-r-lg"
              >
                {block.replace(/^> /gm, "")}
              </blockquote>
            );
          }
          // Default paragraph — handle inline **bold** and `code`
          const html = block
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/`(.+?)`/g, '<code class="bg-slate-100 px-1 rounded text-sm">$1</code>')
            .replace(/🚩 /g, "🚩 ");
          return (
            <p
              key={i}
              className="text-base text-slate-700"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        })}
      </div>

      {/* CTA bottom */}
      <div className="mt-16 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600/5 via-white to-cyan-500/10 p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">
          {locale === "it" ? "Hai bisogno di supporto per la tua presenza digitale?" : "Need help with your digital presence?"}
        </p>
        <p className="mt-2 text-slate-600">
          {locale === "it" ? "Audit gratuito del sito — rispondiamo entro un giorno lavorativo." : "Free site audit — we reply within one business day."}
        </p>
        <Link
          href="/contatti"
          className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-105"
        >
          {locale === "it" ? "Richiedi un audit gratuito →" : "Get a free audit →"}
        </Link>
      </div>
    </article>
  );
}
