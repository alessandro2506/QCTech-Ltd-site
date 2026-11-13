import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  authorRole: string;
  tags: string[];
  readTime: string;
  translationKey: string;
  faqs: BlogFaq[];
  content: string;
};

export function extractFaqs(content: string): BlogFaq[] {
  const faqHeading = content.search(/^##\s+(FAQ|Domande frequenti)\s*$/im);
  if (faqHeading === -1) return [];
  const rest = content.slice(faqHeading);
  const nextH2 = rest.search(/\n##\s+(?!FAQ|Domande frequenti)/i);
  const block = nextH2 === -1 ? rest : rest.slice(0, nextH2);
  const parts = block.split(/^###\s+/m).slice(1);
  const faqs: BlogFaq[] = [];
  for (const part of parts) {
    const newline = part.indexOf("\n");
    const question = (newline === -1 ? part : part.slice(0, newline)).trim();
    const answer = (newline === -1 ? "" : part.slice(newline + 1))
      .trim()
      .replace(/\s+/g, " ");
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}

export function findAlternateSlug(
  slug: string,
  fromLocale: string,
  toLocale: string,
): string | null {
  const current = getPostBySlug(slug, fromLocale);
  if (!current) return getPostBySlug(slug, toLocale)?.slug ?? null;
  const key = current.translationKey;
  const match = getAllPosts(toLocale).find((post) => post.translationKey === key);
  if (match) return match.slug;
  return getPostBySlug(slug, toLocale)?.slug ?? getPostBySlug(key, toLocale)?.slug ?? null;
}

export function getBlogHreflang(
  slug: string,
  locale: string,
): { it: string; en: string } {
  const itSlug =
    locale === "it" ? slug : (findAlternateSlug(slug, locale, "it") ?? slug);
  const enSlug =
    locale === "en" ? slug : (findAlternateSlug(slug, locale, "en") ?? slug);
  return {
    it: `https://www.qc-tech.co.uk/it/blog/${itSlug}`,
    en: `https://www.qc-tech.co.uk/en/blog/${enSlug}`,
  };
}

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function getPostSlugs(locale: string): string[] {
  const dir = path.join(BLOG_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string, locale: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, locale, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fmFaqs = Array.isArray(data.faqs)
    ? (data.faqs as { question?: string; q?: string; answer?: string; a?: string }[])
        .map((item) => ({
          question: String(item.question ?? item.q ?? "").trim(),
          answer: String(item.answer ?? item.a ?? "").trim(),
        }))
        .filter((item) => item.question && item.answer)
    : [];
  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    author: data.author ?? "QC Tech",
    authorRole: data.authorRole ?? "",
    tags: data.tags ?? [],
    readTime: data.readTime ?? "5 min read",
    translationKey: String(data.translationKey ?? slug),
    faqs: fmFaqs.length > 0 ? fmFaqs : extractFaqs(content),
    content,
  };
}

export function getAllPosts(locale: string): BlogPost[] {
  const slugs = getPostSlugs(locale);
  return slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter(Boolean)
    .sort((a, b) => (a!.date < b!.date ? 1 : -1)) as BlogPost[];
}
