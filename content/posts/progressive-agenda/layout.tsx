"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/posts";
import ScrollArt from "./components/ScrollArt";

// Design tokens for this post. Applied statically here as the single source of
// default fonts + palette (previously set at runtime by the Design Explorer).
const PA_DESIGN_TOKENS = {
  "--pa-font-display": "'Instrument Serif', Georgia, serif",
  "--pa-font-body": "'Inter', system-ui, sans-serif",
  "--pa-ink": "#0f0f0f",
  "--pa-accent": "#1e3a5f",
  "--pa-secondary": "#b91c1c",
  "--pa-muted": "#6b7280",
  "--pa-divider": "#e5e7eb",
  "--pa-callout-bg": "#f8fafc",
  "--pa-highlight-bg": "#fafafa",
} as React.CSSProperties;

function FontLoader() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Karla:ital,wght@0,200..800;1,200..800&family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-50"
      style={{ width: "100%", height: 3, background: "transparent" }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "var(--pa-secondary, #b91c1c)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

export default function ProgressiveAgendaLayout({
  post,
  children,
}: {
  post: Post;
  children: React.ReactNode;
}) {
  return (
    <article className="pa-post" style={PA_DESIGN_TOKENS}>
      <FontLoader />
      <ReadingProgress />

      {/* Hero — dark, immersive, with soft radial gradients */}
      <header
        style={{
          background: "#000",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          padding: "6rem 2rem 4rem",
          overflow: "hidden",
        }}
      >
        {/* Hero background image — full color */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url(/posts/progressive-agenda/hero.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Blue tint overlay — soft brand color over the image */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "rgba(30, 58, 95, 0.7)",
          }}
        />

        {/* Radial gradient — top-left warm glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-25%",
            left: "-15%",
            width: "75vw",
            height: "75vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 60%)",
          }}
        />
        {/* Radial gradient — bottom-right secondary glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            bottom: "-30%",
            right: "-10%",
            width: "65vw",
            height: "65vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--pa-secondary, #b91c1c) 12%, transparent) 0%, transparent 55%)",
          }}
        />
        {/* Radial gradient — center-right soft highlight */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "20%",
            right: "5%",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 50%)",
          }}
        />
        {/* Subtle top-edge light sweep */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 35%)",
          }}
        />

        {/* Name link */}
        <Link
          href="/"
          className="absolute left-6 top-6 z-20 transition-colors hover:opacity-80 md:left-10 md:top-8"
          style={{
            fontFamily: "var(--pa-font-body)",
            fontSize: "0.8rem",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#ffffff",
          }}
        >
          Ryan York
        </Link>

        <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1000 }}>
          {/* Kicker */}
          <div
            className="opacity-0"
            style={{
              fontFamily: "var(--pa-font-body)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#ffffff",
              marginBottom: "2rem",
              animation: "fadeUp 0.8s ease forwards 0.1s",
            }}
          >
            A Framework for the Progressive Platform
          </div>

          {/* Thin rule */}
          <div
            className="opacity-0"
            style={{
              width: 64,
              height: 1,
              background: "rgba(255,255,255,0.2)",
              marginBottom: "2.5rem",
              animation: "fadeUp 0.8s ease forwards 0.2s",
            }}
          />

          {/* Title */}
          <h1
            className="opacity-0"
            style={{
              fontFamily: "var(--pa-font-display)",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              lineHeight: 1.0,
              fontWeight: 400,
              color: "#ffffff",
              marginBottom: "2rem",
              letterSpacing: "-0.02em",
              animation: "fadeUp 0.8s ease forwards 0.3s",
            }}
          >
            The Empty Quadrant:
            <br />
            <span
              style={{
                color: "#ffffff",
                fontWeight: 400,
              }}
            >
              A Progressive Case for
            </span>{" "}
            <span
              style={{
                color: "color-mix(in srgb, var(--pa-secondary, #b91c1c), white 40%)",
              }}
            >
              AI Abundance
            </span>
          </h1>

          {/* Description */}
          <p
            className="opacity-0"
            style={{
              fontFamily: "var(--pa-font-body)",
              fontSize: "1.15rem",
              lineHeight: 1.75,
              color: "#ffffff",
              maxWidth: 620,
              fontWeight: 400,
              animation: "fadeUp 0.8s ease forwards 0.5s",
            }}
          >
            {post.frontmatter.description}
          </p>

          {/* Meta line */}
          <div
            className="opacity-0"
            style={{
              fontFamily: "var(--pa-font-body)",
              fontSize: "0.78rem",
              color: "#ffffff",
              marginTop: "2.5rem",
              letterSpacing: "0.04em",
              animation: "fadeUp 0.8s ease forwards 0.65s",
            }}
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

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
          style={{
            animation: "fadeUp 0.8s ease forwards 1s",
          }}
        >
          <div
            className="animate-pulse"
            style={{
              width: 1,
              height: 48,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
            }}
          />
        </div>
      </header>

      {/* Content — two-column: prose left, scroll art right */}
      <div style={{ background: "#ffffff", width: "100%" }}>
        <div
          className="mx-auto"
          style={{
            maxWidth: 1280,
            padding: "0 2rem 6rem",
            display: "flex",
            gap: "3rem",
            justifyContent: "center",
          }}
        >
          {/* Prose column */}
          <div
            className="progressive-agenda-prose"
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: 720,
              paddingTop: "3rem",
            }}
          >
            {children}
          </div>

          {/* Scroll art column — hidden on mobile */}
          <div
            className="pa-scroll-art-col"
            style={{
              width: 340,
              flexShrink: 0,
            }}
          >
            <ScrollArt />
          </div>
        </div>
      </div>

      {/* Back link */}
      <div
        className="px-6 py-8 md:px-10"
        style={{
          borderTop: "1px solid var(--pa-divider, #e5e7eb)",
          background: "#ffffff",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 820 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-colors hover:opacity-60"
            style={{
              fontFamily: "var(--pa-font-body)",
              fontSize: "0.82rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "var(--pa-muted, #6b7280)",
            }}
          >
            &larr; Back home
          </Link>
        </div>
      </div>
    </article>
  );
}
