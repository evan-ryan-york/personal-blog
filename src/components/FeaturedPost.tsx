import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="animate-fade-up">
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
        <h2
          className="mb-4 text-4xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent md:text-5xl lg:text-6xl"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {post.frontmatter.title}
        </h2>
        <p
          className="mb-6 max-w-2xl text-lg text-muted"
          style={{ lineHeight: 1.7 }}
        >
          {post.frontmatter.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-paper-warm px-3 py-1 text-xs text-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
