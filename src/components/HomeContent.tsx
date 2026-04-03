"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

type Tab = "posts" | "about";

interface HomeContentProps {
  posts: Post[];
  tags: [string, number][];
}

export default function HomeContent({ posts, tags }: HomeContentProps) {
  const [tab, setTab] = useState<Tab>("posts");
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
        post.frontmatter.tags.some((t) => selectedTags.has(t))
      )
    : posts.slice(0, 1);

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
        {(["posts", "about"] as const).map((t) => (
          <span
            key={t}
            onClick={() => setTab(t)}
            className={`
              text-xs uppercase tracking-widest cursor-pointer transition-colors
              ${tab === t ? "text-ink border-b border-ink pb-1" : "text-muted hover:text-ink pb-1"}
            `}
          >
            {t}
          </span>
        ))}
      </nav>

      {tab === "posts" && (
        <>
          {tags.length > 0 && (
            <section className="px-6 pt-12 md:px-8 md:pt-20">
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
                {hasFilter ? "Results" : "Most Recent"}
              </h2>

              {filteredPosts.length === 0 ? (
                <p className="text-muted text-sm">
                  No posts match those topics.
                </p>
              ) : (
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="group flex overflow-hidden rounded-xl border border-paper-warm transition-shadow hover:shadow-lg"
                    >
                      {post.frontmatter.ogImage && (
                        <div className="w-40 shrink-0 overflow-hidden md:w-56">
                          <img
                            src={post.frontmatter.ogImage}
                            alt={post.frontmatter.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <article className="flex flex-col justify-center p-5">
                        <div
                          className="mb-2 flex items-center gap-3 text-xs uppercase tracking-widest text-muted"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          <time dateTime={post.frontmatter.date}>
                            {new Date(
                              post.frontmatter.date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
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
        </>
      )}

      {tab === "about" && (
        <section className="px-6 py-10 md:px-8 md:py-16">
          <div
            className="mx-auto max-w-3xl space-y-6 text-base text-ink/80"
            style={{ lineHeight: 1.8 }}
          >
            <p>
              My earliest memory is my mom throwing away the 6 VCRs I&rsquo;d
              smuggled from friends&rsquo; houses and my own attic. I had fully
              disassembled them and was trying to reconfigure the parts into a
              game console. I was 5.
            </p>
            <p>
              Same instinct, bigger VCRs. I built my first recording studio at
              15. I talked a bankrupt landlord into giving me a building and
              turned it into a rock and roll camp for kids. I created math
              software that put every teacher who used it into the top 5% of
              their district. I built a CS curriculum that went from 400 to
              50,000 students across 13 states in a year and a half. I
              co-founded a charter school where kindergartners used real hammers
              and saws&nbsp;&mdash; then walked away from it when the people in
              charge stopped protecting kids.
            </p>
            <p>
              Now I&rsquo;m CPTO of Willow Education, and launching Clearwater
              in Accra, Ghana&nbsp;&mdash; where 3.6 million people don&rsquo;t
              have reliable water. In the cracks between those stones lives
              politics, gardening, music, and fumbling my way through
              parenthood.
            </p>
            <p>
              This site is where I capture the ideas that won&rsquo;t leave me
              alone.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
