import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function LivingProductLayout({
  post,
  children,
}: {
  post: Post;
  children: React.ReactNode;
}) {
  return (
    <article>
      {/* Hero */}
      <section
        className="relative flex min-h-screen flex-col justify-center overflow-hidden"
        style={{
          background: "var(--lp-deep, #2c2520)",
          color: "var(--lp-dark-heading, #f6f3ee)",
          padding: "4rem 2rem",
        }}
      >
        {/* Background illustration */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url(/posts/the-living-product/og.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
            mixBlendMode: "luminosity",
          }}
        />
        {/* Name link */}
        <Link
          href="/"
          className="absolute left-6 top-6 z-20 text-sm font-medium tracking-tight transition-colors hover:opacity-80 md:left-8 md:top-8"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--lp-dark-muted, #a09890)",
          }}
        >
          Ryan York
        </Link>
        {/* Radial gradient orb */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "-40%",
            right: "-20%",
            width: "80vw",
            height: "80vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--lp-accent, #c45d3e) 15%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 mx-auto" style={{ maxWidth: 820 }}>
          <div
            className="mb-8 opacity-0"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--lp-accent, #c45d3e)",
              fontWeight: 500,
              animation: "fadeUp 0.8s ease forwards 0.2s",
            }}
          >
            A thesis on autonomous product development
          </div>
          <h1
            className="mb-7 opacity-0"
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
              lineHeight: 1.1,
              fontWeight: 400,
              color: "var(--lp-dark-heading, #f6f3ee)",
              animation: "fadeUp 0.8s ease forwards 0.4s",
            }}
          >
            The <em style={{ fontStyle: "italic", color: "var(--lp-accent, #c45d3e)" }}>Living</em>{" "}
            Product
          </h1>
          <p
            className="opacity-0"
            style={{
              fontSize: "1.15rem",
              lineHeight: 1.8,
              color: "var(--lp-dark-body, #c9c2b8)",
              maxWidth: 600,
              fontWeight: 300,
              animation: "fadeUp 0.8s ease forwards 0.6s",
            }}
          >
            {post.frontmatter.description}
          </p>
        </div>
        {/* Scroll cue */}
        <div
          className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
          style={{
            bottom: "2.5rem",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--lp-dark-muted, #8a8278)",
            animation: "fadeUp 0.8s ease forwards 1s",
          }}
        >
          <span>Read on</span>
          <div
            className="animate-pulse"
            style={{
              width: 1,
              height: 40,
              background:
                "linear-gradient(to bottom, var(--lp-dark-muted, #8a8278), transparent)",
            }}
          />
        </div>
      </section>

      {/* Content */}
      <div style={{ background: "var(--lp-paper, #f6f3ee)", width: "100%" }}>
        <div
          className="living-product-prose mx-auto"
          style={{
            maxWidth: 720,
            padding: "6rem 2rem",
          }}
        >
          {children}
        </div>
      </div>

      {/* Closing */}
      <section
        className="text-center"
        style={{
          background: "var(--lp-deep, #2c2520)",
          padding: "5rem 2rem",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 600 }}>
          <h2
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              color: "var(--lp-dark-heading, #f6f3ee)",
            }}
          >
            The product{" "}
            <em style={{ fontStyle: "italic", color: "var(--lp-accent, #c45d3e)" }}>
              that evolves
            </em>
          </h2>
          <p
            style={{
              color: "var(--lp-dark-body, #c9c2b8)",
              fontWeight: 300,
              fontSize: "1.05rem",
              lineHeight: 1.85,
              marginBottom: "1.5rem",
            }}
          >
            We shape the conditions for growth. The product senses its
            environment, decides how to adapt, builds new capabilities, tests
            them against reality, and encodes what it learns. Every cycle it
            gets fitter — more attuned to what users need, more effective at
            building solutions they'll love, more accurate at predicting what
            will work.
          </p>
          <p
            style={{
              color: "var(--lp-dark-muted, #a09890)",
              fontWeight: 300,
              fontSize: "1.05rem",
              lineHeight: 1.85,
            }}
          >
            The question isn't whether this is possible. The pieces exist. The
            question is who builds it first — and what kind of advantage a
            living product creates over one that's merely built.
          </p>
        </div>
      </section>

      {/* Back link */}
      <div
        className="border-t px-6 py-8 md:px-8"
        style={{
          borderColor: "var(--lp-divider, #d9d3ca)",
          background: "var(--lp-paper, #f6f3ee)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--lp-muted, #8a8278)",
            }}
          >
            &larr; Back home
          </Link>
        </div>
      </div>
    </article>
  );
}
