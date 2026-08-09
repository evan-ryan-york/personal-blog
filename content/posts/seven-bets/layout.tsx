import Link from "next/link";
import type { Post } from "@/lib/posts";

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
  "--sb-font-display": "'Cormorant Garamond', Georgia, serif",
  "--sb-font-body": "'EB Garamond', Georgia, serif",
  "--sb-font-mono": "'Space Mono', ui-monospace, monospace",
} as React.CSSProperties;

export default function SevenBetsLayout({
  post,
  children,
}: {
  post: Post;
  children: React.ReactNode;
}) {
  return (
    <article className="sb-post" style={SB_TOKENS}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url(/posts/seven-bets/hero.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
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
          <div
            className="sb-eyebrow opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.2s" }}
          >
            Seven predictions &middot; written down
          </div>
          <h1
            className="sb-hero-title opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.35s" }}
          >
            Seven <em>Bets</em>
          </h1>
          <p
            className="sb-hero-dek opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.5s" }}
          >
            {post.frontmatter.description}
          </p>
          <div
            className="sb-hero-meta opacity-0"
            style={{ animation: "fadeUp 0.8s ease forwards 0.65s" }}
          >
            {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}{" "}
            &middot; {post.readingTime}
          </div>
        </div>
      </header>

      {/* Body — 820px column, with full-bleed plates escaping it */}
      <div className="sb-body-wrap">
        <div className="sb-prose">{children}</div>
      </div>

      <div className="sb-footer">
        <Link href="/" className="sb-back">
          &larr; Back home
        </Link>
      </div>
    </article>
  );
}
