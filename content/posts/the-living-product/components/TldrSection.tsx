"use client";

import { useState } from "react";

export default function TldrSection() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div
      style={{
        background: "var(--lp-paper, #f6f3ee)",
        width: "100%",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 720, padding: "0 2rem" }}>
        <div style={{ paddingTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
          {/* Toggle button */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: `1px solid var(--lp-divider, #d9d3ca)`,
              borderRadius: "9999px",
              padding: "0.45rem 1.1rem",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              letterSpacing: "0.06em",
              color: "var(--lp-muted, #8a8278)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "var(--lp-accent, #c45d3e)";
              e.currentTarget.style.color = "var(--lp-accent, #c45d3e)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "var(--lp-divider, #d9d3ca)";
              e.currentTarget.style.color = "var(--lp-muted, #8a8278)";
            }}
          >
            TL;DR
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Copy blog button */}
          <button
            onClick={() => {
              const prose = document.querySelector(".living-product-prose");
              if (prose) {
                navigator.clipboard.writeText(prose.textContent || "").then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "1px solid var(--lp-divider, #d9d3ca)",
              borderRadius: "9999px",
              padding: "0.45rem 1.1rem",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              letterSpacing: "0.06em",
              color: "var(--lp-muted, #8a8278)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--lp-accent, #c45d3e)";
              e.currentTarget.style.color = "var(--lp-accent, #c45d3e)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--lp-divider, #d9d3ca)";
              e.currentTarget.style.color = "var(--lp-muted, #8a8278)";
            }}
          >
            {copied ? "Copied!" : "Copy blog"}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              {copied ? (
                <path
                  d="M2.5 6.5L5 9L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <>
                  <rect x="4" y="1.5" width="6.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" />
                  <path d="M8 9.5v.5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1h.5" stroke="currentColor" strokeWidth="1.1" fill="none" />
                </>
              )}
            </svg>
          </button>
          </div>

          {/* Collapsible content */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: open ? "1fr" : "0fr",
              transition: "grid-template-rows 0.35s ease",
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  marginTop: "1.25rem",
                  padding: "1.5rem",
                  background: "color-mix(in srgb, var(--lp-deep, #2c2520) 4%, transparent)",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--lp-divider, #d9d3ca)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    color: "var(--lp-body, #4a4540)",
                    margin: "0 0 1rem 0",
                    fontWeight: 300,
                  }}
                >
                  What if software could improve itself without waiting for someone to tell it what to do next?
                </p>
                <ul
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.75,
                    color: "var(--lp-body, #4a4540)",
                    fontWeight: 300,
                    margin: 0,
                    paddingLeft: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  <li>
                    <strong style={{ fontWeight: 500 }}>The problem:</strong> Today,
                    AI can write code&mdash;but a human still has to decide what to
                    build. The &ldquo;factory&rdquo; is automated, but the
                    &ldquo;brain&rdquo; isn&rsquo;t.
                  </li>
                  <li>
                    <strong style={{ fontWeight: 500 }}>The idea:</strong> Connect
                    two systems in a loop. One listens to users, sales calls, surveys,
                    and market trends to figure out <em>what</em> to build. The other
                    designs, tests, and ships it automatically.
                  </li>
                  <li>
                    <strong style={{ fontWeight: 500 }}>The result:</strong> A product
                    that behaves like a living thing&mdash;sensing its environment,
                    adapting, and getting smarter every cycle.
                  </li>
                  <li>
                    <strong style={{ fontWeight: 500 }}>The human role:</strong> People
                    stop managing the assembly line and start acting like
                    gardeners&mdash;setting direction, making bold bets, and shaping
                    the conditions for growth.
                  </li>
                </ul>

                {/* Collapse arrow */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Collapse TL;DR"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.25rem",
                      color: "var(--lp-muted, #8a8278)",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--lp-accent, #c45d3e)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--lp-muted, #8a8278)";
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M4 11L9 6L14 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
