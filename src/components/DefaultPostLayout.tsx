import Link from "next/link";
import type { Post } from "@/lib/posts";
import CommentSection from "@/components/CommentSection";
import RelatedPosts from "@/components/RelatedPosts";

export default function DefaultPostLayout({
  post,
  related = [],
  children,
}: {
  post: Post;
  related?: Post[];
  children: React.ReactNode;
}) {
  return (
    <article className="px-6 py-12 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm font-medium tracking-tight text-muted transition-colors hover:text-accent"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ryan York
        </Link>
        <header className="animate-fade-up mb-12">
          <div
            className="mb-4 flex items-center gap-3 text-xs uppercase tracking-widest text-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
            <span className="text-paper-warm">/</span>
            <span>{post.readingTime}</span>
          </div>
          <h1
            className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {post.frontmatter.title}
          </h1>
          <p className="mb-6 text-lg text-muted" style={{ lineHeight: 1.7 }}>
            {post.frontmatter.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="rounded-full border border-paper-warm px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="animate-fade-up delay-2 prose-blog">{children}</div>

        <RelatedPosts
          posts={related}
          slug={post.slug}
          theme={{
            rule: "var(--color-paper-warm, #e7e1d7)",
            muted: "var(--color-muted, #6b7280)",
            heading: "var(--color-ink, #1a1a1a)",
            accent: "var(--color-accent, #c44d2b)",
          }}
        />

        <CommentSection slug={post.slug} />

        <footer className="animate-fade-up delay-4 mt-16 border-t border-paper-warm pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            &larr; Back home
          </Link>
        </footer>
      </div>
    </article>
  );
}
