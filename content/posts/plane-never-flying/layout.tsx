"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/posts";
import TldrSection from "./components/TldrSection";
import GridBackground from "./components/GridBackground";

function FontLoader() {
  return (
    <link
      href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  );
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-50"
      style={{ width: "100%", height: 2, background: "transparent" }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "var(--pf-teal, #1c7077)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

export default function PlaneNeverFlyingLayout({
  post,
  children,
}: {
  post: Post;
  children: React.ReactNode;
}) {
  return (
    <article className="pf-post">
      <FontLoader />
      <ReadingProgress />
      <GridBackground />

      {/* Hero — the airship plate, left-weighted scrim so the title reads
          while the fleet stays visible */}
      <header
        className="relative flex min-h-screen flex-col justify-center overflow-hidden"
        style={{
          background: "var(--pf-teal-deep, #0c3137)",
          color: "var(--pf-on-surface, #f2ecdd)",
          padding: "7vh 6vw 10vh",
        }}
      >
        {/* Hero image — the airship plate */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url(/posts/plane-never-flying/hero.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Left-weighted teal scrim */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(99deg, rgba(9,37,42,0.92) 0%, rgba(9,37,42,0.66) 38%, rgba(9,37,42,0.20) 72%, rgba(9,37,42,0.10) 100%)," +
              "linear-gradient(0deg, rgba(9,37,42,0.55) 0%, rgba(9,37,42,0.05) 24%, rgba(9,37,42,0) 45%)," +
              "linear-gradient(180deg, rgba(9,37,42,0.45) 0%, rgba(9,37,42,0) 18%)",
          }}
        />
        {/* Faint registration grid, like the original blueprint paper */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.5,
            backgroundImage:
              "linear-gradient(rgba(242,236,221,0.05) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(242,236,221,0.05) 1px, transparent 1px)",
            backgroundSize: "150px 150px, 150px 150px",
          }}
        />

        <Link
          href="/"
          className="absolute left-6 top-6 z-20 transition-opacity hover:opacity-70 md:left-10 md:top-8"
          style={{
            fontFamily: "var(--pf-font-label)",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--pf-on-surface, #f2ecdd)",
          }}
        >
          Ryan York
        </Link>

        <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1120 }}>
          <div
            className="opacity-0"
            style={{
              fontFamily: "var(--pf-font-label)",
              fontSize: "clamp(0.69rem, 1vw, 0.8rem)",
              fontWeight: 500,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--pf-on-surface-muted, #c3d0cc)",
              marginBottom: "1.6rem",
              animation: "fadeUp 0.8s ease forwards 0.15s",
            }}
          >
            An essay on the future of education
          </div>

          <h1
            className="opacity-0"
            style={{
              fontFamily: "var(--pf-font-display), Georgia, serif",
              fontSize: "clamp(2.7rem, 7.4vw, 6.2rem)",
              lineHeight: 1.0,
              fontWeight: 600,
              letterSpacing: "-0.012em",
              color: "var(--pf-on-surface, #f2ecdd)",
              marginBottom: "1.7rem",
              maxWidth: "15ch",
              textWrap: "balance",
              textShadow: "0 2px 40px rgba(7,30,34,0.5)",
              animation: "fadeUp 0.8s ease forwards 0.35s",
            }}
          >
            This Plane Was{" "}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: "inherit",
                color: "var(--pf-coral, #d4562d)",
              }}
            >
              Never
            </em>{" "}
            Going to{" "}
            <span style={{ color: "var(--pf-coral, #d4562d)" }}>Fly</span>
          </h1>

          <p
            className="opacity-0"
            style={{
              fontFamily: "var(--pf-font-display), Georgia, serif",
              fontSize: "clamp(1.1rem, 1.7vw, 1.5rem)",
              lineHeight: 1.5,
              color: "var(--pf-on-surface-muted, #c3d0cc)",
              maxWidth: "38ch",
              fontWeight: 400,
              animation: "fadeUp 0.8s ease forwards 0.55s",
            }}
          >
            {post.frontmatter.description}
          </p>

          <div
            className="opacity-0"
            style={{
              fontFamily: "var(--pf-font-label)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--pf-on-surface-muted, #c3d0cc)",
              marginTop: "2.2rem",
              animation: "fadeUp 0.8s ease forwards 0.7s",
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
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0"
          style={{
            fontFamily: "var(--pf-font-label)",
            fontSize: "0.66rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--pf-on-surface-muted, #c3d0cc)",
            animation: "fadeUp 0.8s ease forwards 1s",
          }}
        >
          <span>Read on</span>
          <div
            className="animate-pulse"
            style={{
              width: 1,
              height: 34,
              background:
                "linear-gradient(to bottom, var(--pf-on-surface-muted, #c3d0cc), transparent)",
            }}
          />
        </div>
      </header>

      {/* TL;DR */}
      <TldrSection />

      {/* Content */}
      <div style={{ background: "transparent", width: "100%" }}>
        <div
          className="plane-prose mx-auto"
          style={{ maxWidth: 720, padding: "5rem 2rem 6rem" }}
        >
          {children}
        </div>
      </div>

      {/* Back link */}
      <div
        className="px-6 py-8 md:px-10"
        style={{
          borderTop: "1px solid var(--pf-rule, #d2cab2)",
          background: "transparent",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-60"
            style={{
              fontFamily: "var(--pf-font-label)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "var(--pf-muted, #6b6b6b)",
            }}
          >
            &larr; Back home
          </Link>
        </div>
      </div>
    </article>
  );
}
