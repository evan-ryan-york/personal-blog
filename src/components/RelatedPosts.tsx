import Link from "next/link";
import type { Post } from "@/lib/posts";

/**
 * "Keep reading" — the other essays closest to this one.
 *
 * Presentational only, and deliberately free of any filesystem import: two of
 * the four post layouts are client components, so the ranked list is computed
 * in `src/app/posts/[slug]/page.tsx` and handed down as a prop.
 *
 * Colours come in as props because each post owns its own palette. Everything
 * defaults to `currentColor` so a layout that passes nothing still reads.
 */
export interface RelatedPostsTheme {
  /** Hairline above the block and between entries. */
  rule?: string;
  /** Kicker and description colour. */
  muted?: string;
  /** Post titles. */
  heading?: string;
  accent?: string;
  displayFont?: string;
  bodyFont?: string;
}

export default function RelatedPosts({
  posts,
  slug,
  theme = {},
  maxWidth = 720,
}: {
  posts: Post[];
  /** When given, offers this post's Markdown twin below the list. */
  slug?: string;
  theme?: RelatedPostsTheme;
  maxWidth?: number;
}) {
  if (posts.length === 0 && !slug) return null;

  const {
    rule = "currentColor",
    muted = "currentColor",
    heading = "currentColor",
    accent = "currentColor",
    displayFont = "var(--font-display)",
    bodyFont = "var(--font-body)",
  } = theme;

  return (
    <section
      style={{
        borderTop: `1px solid ${rule}`,
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ margin: "0 auto", maxWidth }}>
        <nav aria-label="Related posts" hidden={posts.length === 0}>
        <h2
          style={{
            fontFamily: bodyFont,
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: muted,
            marginBottom: "1.75rem",
            fontWeight: 500,
          }}
        >
          Keep reading
        </h2>

        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1.75rem",
          }}
        >
          {posts.map((related) => (
            <li key={related.slug}>
              <Link
                href={`/posts/${related.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3
                  style={{
                    fontFamily: displayFont,
                    fontSize: "1.3rem",
                    lineHeight: 1.25,
                    color: heading,
                    margin: "0 0 0.4rem",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {related.frontmatter.title}
                </h3>
                <p
                  style={{
                    fontFamily: bodyFont,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: muted,
                    margin: 0,
                    textWrap: "pretty",
                  }}
                >
                  {related.frontmatter.description}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "0.6rem",
                    fontFamily: bodyFont,
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: accent,
                  }}
                >
                  Read &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
        </nav>

        {/* The same essay as plain Markdown. Useful to a reader quoting it,
            and the thing an assistant should be reading instead of scraping
            the rendered page. */}
        {slug && (
          <p
            style={{
              marginTop: posts.length > 0 ? "2.5rem" : 0,
              fontFamily: bodyFont,
              fontSize: "0.75rem",
              letterSpacing: "0.06em",
              color: muted,
            }}
          >
            <a
              href={`/posts/${slug}.md`}
              style={{ color: "inherit", textDecorationThickness: "1px" }}
            >
              Read this post as Markdown
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
