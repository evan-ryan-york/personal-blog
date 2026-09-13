import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/posts";
import RelatedPosts from "@/components/RelatedPosts";
import { sevenBetsFonts } from "@/lib/postFonts";
import { postToMarkdown } from "@/lib/postMarkdown";
import PostSummary from "./components/PostSummary";

// Design tokens for this post — an engraved-plate palette: near-black ground,
// brass accent, warm paper-white type. Declared here as the single source.
const SB_TOKENS = {
  "--sb-bg": "#0E1117",
  "--sb-bg-deep": "#080A0E",
  "--sb-gold": "#C9A45C",
  "--sb-gold-bright": "#E3C382",
  "--sb-heading": "#F2ECE0",
  "--sb-body": "#D6D0C4",
  "--sb-muted": "#AFB6C2",
  "--sb-dim": "#9AA1B0",
  "--sb-faint": "#6D7484",
  "--sb-fainter": "#5B6274",
  "--sb-rule": "#262C38",
  "--sb-font-display": "var(--font-cormorant), Georgia, serif",
  "--sb-font-body": "var(--font-eb-garamond), Georgia, serif",
  "--sb-font-mono": "var(--font-space-mono), ui-monospace, monospace",
} as React.CSSProperties;

export default function SevenBetsLayout({
  post,
  related,
  children,
}: {
  post: Post;
  related: Post[];
  children: React.ReactNode;
}) {
  const tldr = post.frontmatter.tldr ?? [];

  return (
    <article className={`sb-post ${sevenBetsFonts}`} style={SB_TOKENS}>

      {/* Hero — engraved celestial plate */}
      <header className="sb-hero">
        {/* Scanline ground */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg,#0D1119 0 16px,#0A0D14 16px 32px)",
          }}
        />
        {/* Hero art — seven lit portals, one per bet */}
        <Image
          aria-hidden
          alt=""
          className="pointer-events-none"
          fill
          preload
          sizes="100vw"
          src="/posts/seven-bets/hero.webp"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        {/* Brass glow, kept soft so the art carries the frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(201,164,92,.12), transparent 58%)",
          }}
        />
        {/* Scrim — darkens the sky the title sits in, lets the arches burn
            through the middle, then closes down into the body ground */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,10,14,.62) 0%, rgba(8,10,14,.5) 38%, rgba(8,10,14,.06) 62%, rgba(8,10,14,.3) 88%, rgba(8,10,14,.82) 100%)",
          }}
        />

        <Link href="/" className="sb-hero-name">
          Ryan York
        </Link>

        <div className="sb-hero-block">
          <h1
            className="sb-hero-title opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.2s" }}
          >
            Seven <em>Bets</em>
          </h1>
          <p
            className="sb-hero-dek opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.35s" }}
          >
            {post.frontmatter.description}
          </p>
          <div
            className="sb-hero-meta opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.5s" }}
          >
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>{" "}
            &middot; {post.readingTime}
          </div>
        </div>
      </header>

      {/* Body — 820px column, with full-bleed plates escaping it */}
      <div className="sb-body-wrap">
        <div className="sb-prose">
          {tldr.length > 0 ? (
            <PostSummary items={tldr} markdown={postToMarkdown(post)} />
          ) : null}
          {children}
        </div>
      </div>

      {/* Every post used to end in a back link and nothing else. */}
      <RelatedPosts
        posts={related}
        slug={post.slug}
        theme={{
          rule: "var(--sb-rule)",
          muted: "var(--sb-muted)",
          heading: "var(--sb-heading)",
          accent: "var(--sb-gold)",
          displayFont: "var(--sb-font-display)",
          bodyFont: "var(--sb-font-mono)",
        }}
        maxWidth={820}
      />

      <div className="sb-footer">
        <Link href="/" className="sb-back">
          &larr; Back home
        </Link>
      </div>
    </article>
  );
}
