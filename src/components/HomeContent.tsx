"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";
import WorkingOn from "@/components/WorkingOn";

interface HomeContentProps {
  posts: Post[];
  tags: [string, number][];
  /** Author preview: drafts are in `posts` and get a badge. */
  preview?: boolean;
}

export default function HomeContent({
  posts,
  tags,
  preview = false,
}: HomeContentProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const hasFilter = selectedTags.size > 0;

  const filteredPosts = hasFilter
    ? posts.filter((post) =>
        post.frontmatter.tags.some((t) => selectedTags.has(t)),
      )
    : posts;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 pt-8 md:px-8">
        <span
          className="text-sm font-medium tracking-tight text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ryan York
        </span>
      </header>

      <nav
        className="flex justify-center gap-8 px-6 pt-8 md:px-8"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="border-b border-ink pb-1 text-xs uppercase tracking-widest text-ink">
          posts
        </span>
        {/* Was a client-side tab, which gave the bio no URL and left it out of
            the HTML until someone clicked. It is a page now. */}
        <Link
          href="/about"
          className="pb-1 text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink"
        >
          about
        </Link>
        {preview && (
          <>
            <Link
              href="/journal"
              className="pb-1 text-xs uppercase tracking-widest text-accent transition-colors hover:text-ink"
            >
              journal
            </Link>
            <Link
              href="/drafts"
              className="pb-1 text-xs uppercase tracking-widest text-accent transition-colors hover:text-ink"
            >
              drafts
            </Link>
          </>
        )}
      </nav>

      {/* The site's one <h1>. It carries the subject, not just the name —
              "Ryan York" alone told a search engine nothing about what any of
              this is, and the page had no <h1> at all before. */}
      <section className="px-6 pt-14 md:px-8 md:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-ink md:text-4xl"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Essays on AI, education, product, and politics
          </h1>
          <p
            className="mx-auto mt-4 max-w-xl text-base text-muted"
            style={{ lineHeight: 1.7 }}
          >
            I&rsquo;m Ryan York. I write about how technology reshapes work and
            learning &mdash; and who ends up sharing in what it creates.
          </p>
        </div>
      </section>

      {tags.length > 0 && (
        <section className="px-6 pt-12 md:px-8 md:pt-16">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {tags.map(([tag]) => {
                const isSelected = selectedTags.has(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`
                          h-24 w-24 rounded-full border-2 flex items-center justify-center
                          text-xs font-medium transition-all duration-200
                          hover:scale-105 cursor-pointer text-center px-2
                          ${
                            isSelected
                              ? "border-accent bg-accent text-white"
                              : "border-muted/30 bg-transparent text-muted hover:border-accent/50 hover:text-ink"
                          }
                        `}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-12 md:px-8">
        <div className="mx-auto max-w-2xl">
          <h2
            className="mb-8 text-xs uppercase tracking-widest text-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {hasFilter ? "Results" : "Recent"}
          </h2>

          {filteredPosts.length === 0 ? (
            <p className="text-muted text-sm">No posts match those topics.</p>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="group flex overflow-hidden rounded-xl border border-paper-warm transition-shadow hover:shadow-lg"
                >
                  {post.frontmatter.ogImage && (
                    <div className="relative w-40 shrink-0 overflow-hidden md:w-56">
                      <img
                        src={post.frontmatter.ogImage}
                        alt={post.frontmatter.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {post.slug === "progressive-agenda" && (
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{ background: "rgba(30, 58, 95, 0.3)" }}
                        />
                      )}
                    </div>
                  )}
                  <article className="flex flex-col justify-center p-5">
                    <div
                      className="mb-2 flex items-center gap-3 text-xs uppercase tracking-widest text-muted"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {post.status === "draft" && (
                        <span className="rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white">
                          Draft
                        </span>
                      )}
                      <time dateTime={post.frontmatter.date}>
                        {new Date(post.frontmatter.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            timeZone: "UTC",
                          },
                        )}
                      </time>
                      <span className="text-paper-warm">/</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <h3
                      className="mb-2 text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent md:text-2xl"
                      style={{
                        fontFamily: "var(--font-display)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      {post.frontmatter.title}
                    </h3>
                    <p
                      className="text-sm text-muted"
                      style={{ lineHeight: 1.6 }}
                    >
                      {post.frontmatter.description}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <WorkingOn />
    </div>
  );
}
