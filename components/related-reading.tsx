import NextLink from "next/link";
import { Link } from "@/i18n/routing";
import type { BlogPost } from "@/lib/blog";
import type { ServiceTheme } from "@/lib/related-posts";
import { SERVICE_HASH } from "@/lib/related-posts";

type Props = {
  title: string;
  posts: BlogPost[];
  locale: string;
  serviceLabel?: string;
  serviceTheme?: ServiceTheme | null;
  compact?: boolean;
};

export function RelatedReading({
  title,
  posts,
  locale,
  serviceLabel,
  serviceTheme,
  compact = false,
}: Props) {
  if (posts.length === 0 && !serviceLabel) return null;

  const hash = serviceTheme ? SERVICE_HASH[serviceTheme] : undefined;
  const headingId = compact
    ? `related-reading-${serviceTheme ?? "page"}`
    : "related-reading-heading";

  return (
    <section
      className={
        compact
          ? "mt-6"
          : "mt-16 border-t border-[var(--light-border)] pt-10"
      }
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className={
          compact
            ? "text-sm font-semibold text-[var(--light-text)]"
            : "text-xl font-bold tracking-tight text-[var(--light-emphasis)] sm:text-2xl"
        }
      >
        {title}
      </h2>
      {posts.length > 0 ? (
        <ul className="mt-6 space-y-3">
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
      {serviceLabel ? (
        <p className="mt-6">
          <Link
            href={
              hash
                ? { pathname: "/servizi", hash }
                : { pathname: "/servizi" }
            }
            className="font-semibold text-[var(--light-primary)] hover:underline"
          >
            {serviceLabel}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
