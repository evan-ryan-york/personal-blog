"use client";

import { useState } from "react";

// Same plate the other posts open with, in this one's navy-on-white system.
// The bullets come from the post's `tldr` frontmatter, which is also what
// feeds the structured data, the feed, and the Markdown twin.

const PILL: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "none",
  border: "1px solid var(--pa-divider, #e5e7eb)",
  borderRadius: "9999px",
  padding: "0.45rem 1.1rem",
  cursor: "pointer",
  fontFamily: "var(--pa-font-body)",
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--pa-muted, #6b7280)",
  transition: "all 0.2s ease",
};

function lit(e: React.SyntheticEvent<HTMLButtonElement>) {
  e.currentTarget.style.borderColor = "var(--pa-accent, #1e3a5f)";
  e.currentTarget.style.color = "var(--pa-accent, #1e3a5f)";
}

function dim(e: React.SyntheticEvent<HTMLButtonElement>) {
  e.currentTarget.style.borderColor = "var(--pa-divider, #e5e7eb)";
  e.currentTarget.style.color = "var(--pa-muted, #6b7280)";
}

export default function TldrSection({
  items,
  markdown,
}: {
  items: string[];
  markdown: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (items.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "2.5rem",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="pa-tldr-panel"
          style={PILL}
          onMouseEnter={lit}
          onMouseLeave={dim}
          onFocus={lit}
          onBlur={dim}
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
          onClick={() =>
            navigator.clipboard.writeText(markdown).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
          }
          style={PILL}
          onMouseEnter={lit}
          onMouseLeave={dim}
          onFocus={lit}
          onBlur={dim}
        >
          <span aria-live="polite">{copied ? "Copied" : "Copy post"}</span>
        </button>
      </div>

      {/* 0fr -> 1fr collapses without needing to know the content height. The
          text stays in the DOM either way, which is what keeps it readable to
          crawlers and to anything summarizing the page. */}
      <div
        id="pa-tldr-panel"
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
              margin: "1.25rem 0 0",
              padding: "1.5rem 1.5rem 1.5rem 2.75rem",
              border: "1px solid var(--pa-divider, #e5e7eb)",
              background: "var(--pa-callout-bg, #f8fafc)",
              display: "flex",
              flexDirection: "column",
              gap: "0.7rem",
              fontFamily: "var(--pa-font-body)",
              fontSize: "0.95rem",
              lineHeight: 1.65,
              color: "var(--pa-ink, #0f0f0f)",
            }}
          >
            {items.map((item) => {
              const split = item.indexOf(": ");
              const label = split > 0 ? item.slice(0, split + 1) : null;
              const body = split > 0 ? item.slice(split + 2) : item;
              return (
                <li key={item}>
                  {label && <strong style={{ fontWeight: 600 }}>{label} </strong>}
                  {body}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
