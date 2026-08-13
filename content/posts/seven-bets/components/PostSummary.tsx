"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// The plate that opens the post: two pills — the argument in a few lines, and
// a way to take the whole thing with you. Same shape as The Living Product's
// TL;DR, redrawn in this post's brass-on-near-black system.

const PILL: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "none",
  border: "1px solid var(--sb-rule)",
  borderRadius: "9999px",
  padding: "0.5rem 1.125rem",
  cursor: "pointer",
  fontFamily: "var(--sb-font-mono)",
  fontSize: "0.6875rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--sb-dim)",
  transition: "color 0.2s ease, border-color 0.2s ease",
};

function lit(el: HTMLElement) {
  el.style.borderColor = "var(--sb-gold)";
  el.style.color = "var(--sb-gold)";
}

function dim(el: HTMLElement) {
  el.style.borderColor = "var(--sb-rule)";
  el.style.color = "var(--sb-dim)";
}

export default function PostSummary({
  items,
  markdown,
}: {
  items: string[];
  markdown: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard refused (insecure context, denied permission) — stay idle */
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "clamp(2.5rem, 6vw, 3.5rem)",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="sb-tldr-panel"
          style={PILL}
          onMouseEnter={(e) => lit(e.currentTarget)}
          onMouseLeave={(e) => dim(e.currentTarget)}
          onFocus={(e) => lit(e.currentTarget)}
          onBlur={(e) => dim(e.currentTarget)}
        >
          TL;DR
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
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

        <button
          type="button"
          onClick={handleCopy}
          style={PILL}
          onMouseEnter={(e) => lit(e.currentTarget)}
          onMouseLeave={(e) => dim(e.currentTarget)}
          onFocus={(e) => lit(e.currentTarget)}
          onBlur={(e) => dim(e.currentTarget)}
        >
          <span aria-live="polite">{copied ? "Copied" : "Copy post"}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
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
                <rect
                  x="4"
                  y="1.5"
                  width="6.5"
                  height="7.5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  fill="none"
                />
                <path
                  d="M8 9.5v.5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1h.5"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  fill="none"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* 0fr -> 1fr animates a collapse without knowing the content height */}
      <div
        id="sb-tldr-panel"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.35s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <ul
            style={{
              listStyle: "none",
              margin: "1.25rem 0 0",
              padding: "clamp(1.375rem, 3vw, 1.75rem)",
              border: "1px solid var(--sb-rule)",
              background: "rgba(201, 164, 92, 0.035)",
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
              fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)",
              lineHeight: 1.65,
              color: "var(--sb-muted)",
            }}
          >
            {items.map((item) => (
              <li
                key={item}
                style={{ display: "flex", gap: "0.8125rem", alignItems: "flex-start" }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 9,
                    height: 1,
                    marginTop: "0.8em",
                    background: "var(--sb-gold)",
                  }}
                />
                <span style={{ textWrap: "pretty" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
