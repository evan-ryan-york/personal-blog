import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/posts";
import RelatedPosts from "@/components/RelatedPosts";
import { theaterFonts } from "@/lib/postFonts";
import { postToMarkdown } from "@/lib/postMarkdown";
import PostSummary from "../seven-bets/components/PostSummary";
import BackgroundMotion from "./components/BackgroundMotion";
import "./post.css";

// A companion essay to Seven Bets — the long form of Bet B. It borrows that
// post's structure (the `sb-` classes and components) but sets it as a night
// at the theater, after the hero painting: a dark house, warm off-white type,
// candle-amber accents, and slate blue from the stage curtains. Crimson Pro
// for headings and reading, Space Grotesk for labels. Every `sb-` rule reads
// these tokens, so redefining them here restyles only this post.
const WA_TOKENS = {
  "--sb-bg": "#10161B",
  "--sb-bg-deep": "#18212A",
  "--sb-gold": "#E2A35C",
  "--sb-gold-bright": "#EBB273",
  "--sb-heading": "#EFE9DF",
  "--sb-body": "#D3CCC1",
  "--sb-muted": "#B6AEA2",
  "--sb-dim": "#999185",
  "--sb-faint": "#999185",
  "--sb-fainter": "#6C665E",
  "--sb-rule": "#2A343D",
  "--sb-plate-divider": "#2A343D",
  "--wa-ink": "#EFE9DF",
  "--wa-paper": "#10161B",
  "--wa-card": "#141B22",
  "--wa-seg-workers": "#3F5A70",
  "--wa-seg-unsolved": "#222C35",
  "--wa-scrim": "7, 10, 13",
  "--wa-hero-accent": "#E2A35C",
  "--wa-hero-label": "#C9A27A",
  // Read by the shared PostImage figure.
  "--pf-rule": "#2A343D",
  "--pf-faint": "#999185",
  "--pf-font-label": "var(--font-space-grotesk), system-ui, sans-serif",
  "--sb-font-display": "var(--font-crimson-pro), Georgia, serif",
  "--sb-font-body": "var(--font-crimson-pro), Georgia, serif",
  "--sb-font-mono": "var(--font-space-grotesk), system-ui, sans-serif",
} as React.CSSProperties;

export default function WhenAiDoesOurWorkLayout({
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
    <article
      className={`sb-post wa-post ${theaterFonts}`}
      style={WA_TOKENS}
    >
      <BackgroundMotion />
      {/* Hero — full screen like every other post: the workshop painting
          covers the viewport under an umber varnish weighted to the left (to
          the top on phones), with the headline set like the cover of a
          technical memorandum. */}
      <header className="wa-hero">
        <Image
          alt="A High Renaissance oil painting seen from the wings of a theater: a painted storm and a great wooden wave rise on stage before a packed audience, while a stagehand turns the crank of the wave machine and others work the ropes, pulleys and candlelit rigging behind the curtains."
          className="wa-hero-img pointer-events-none"
          fill
          preload
          sizes="100vw"
          src="/posts/when-ai-does-our-work/stage.webp"
        />
        <div aria-hidden className="wa-hero-scrim" />

        <div className="wa-hero-bar">
          <Link href="/" className="wa-hero-name">
            Ryan York
          </Link>
        </div>

        <div className="wa-hero-text">
          <Link
            href="/posts/seven-bets#bet-b"
            className="wa-hero-series opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.15s" }}
          >
            Part of Seven Bets &middot; Bet B
          </Link>
          <h1
            className="wa-hero-title opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.35s" }}
          >
            What Happens to Us When AI Does <em>Our Work?</em>
          </h1>
          <p
            className="wa-hero-dek opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.55s" }}
          >
            {post.frontmatter.description}
          </p>
          <dl
            className="wa-hero-meta opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.7s" }}
          >
            <div>
              <dt>Filed</dt>
              <dd>
                <time dateTime={post.frontmatter.date}>
                  {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{post.readingTime}</dd>
            </div>
          </dl>
        </div>

        {/* Scroll cue */}
        <div
          aria-hidden
          className="wa-hero-cue opacity-0"
          style={{ animation: "fadeUp 0.8s ease forwards 1s" }}
        >
          <span>Read on</span>
          <span className="wa-hero-cue-line animate-pulse" />
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
