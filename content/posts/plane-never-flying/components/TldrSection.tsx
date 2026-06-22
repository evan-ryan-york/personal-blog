"use client";

import { useState } from "react";

const PILL_BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "none",
  border: "1px solid var(--pf-divider, #d8d8d8)",
  borderRadius: "9999px",
  padding: "0.45rem 1.1rem",
  cursor: "pointer",
  fontFamily: "var(--pf-font-label)",
  fontSize: "0.74rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--pf-muted, #6b6b6b)",
  transition: "all 0.2s ease",
};

export default function TldrSection() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const hoverOn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--pf-ink, #0a0a0a)";
    e.currentTarget.style.color = "var(--pf-ink, #0a0a0a)";
  };
  const hoverOff = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--pf-divider, #d8d8d8)";
    e.currentTarget.style.color = "var(--pf-muted, #6b6b6b)";
  };

  return (
    <div style={{ background: "transparent", width: "100%" }}>
      <div className="mx-auto" style={{ maxWidth: 720, padding: "0 2rem" }}>
        <div
          style={{
            paddingTop: "3.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              style={PILL_BASE}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
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

            <button
              onClick={() => {
                const prose = document.querySelector(".plane-prose");
                if (prose) {
                  navigator.clipboard
                    .writeText(prose.textContent || "")
                    .then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                }
              }}
              style={PILL_BASE}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              {copied ? "Copied!" : "Copy blog"}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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

          <div
            style={{
              display: "grid",
              gridTemplateRows: open ? "1fr" : "0fr",
              transition: "grid-template-rows 0.35s ease",
              width: "100%",
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1.75rem",
                  border: "1px solid var(--pf-ink, #0a0a0a)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--pf-font-body)",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "var(--pf-ink, #1a1a1a)",
                    margin: "0 0 1.25rem 0",
                  }}
                >
                  American education isn&rsquo;t a system to be tuned &mdash; it&rsquo;s
                  a failed design. The factory-shaped school was built a century ago
                  to turn a flood of immigrant children into a punctual workforce as
                  cheaply as possible, and it has never matched what we&rsquo;ve known
                  for just as long about how children actually learn.
                </p>
                <ul
                  style={{
                    fontFamily: "var(--pf-font-body)",
                    fontSize: "0.97rem",
                    lineHeight: 1.7,
                    color: "var(--pf-ink, #1a1a1a)",
                    margin: 0,
                    paddingLeft: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.7rem",
                  }}
                >
                  <li>
                    <strong style={{ fontWeight: 600 }}>The diagnosis: </strong>
                    One adult holding thirty children at one pace through one sequence
                    in one box &mdash; while that box is also asked to be clinic,
                    cafeteria, and counselor. A century of learning science says it
                    can&rsquo;t work, and flat scores since 1970 prove it.
                  </li>
                  <li>
                    <strong style={{ fontWeight: 600 }}>Why it persists: </strong>
                    Not conviction but resignation. Everyone inside believes the power
                    to change it lives one rung up the ladder &mdash; until the ladder
                    runs out and you find it was leaning against nothing.
                  </li>
                  <li>
                    <strong style={{ fontWeight: 600 }}>The redesign: </strong>
                    Reclaim the money and the time. Children learn embedded in real
                    work, outdoors, inside relationships, aimed at agency &mdash; with
                    AI quietly handling the mechanics so the human hours go back to
                    childhood, and giving every child the patient one-to-one tutoring
                    that was always the privilege of the wealthy.
                  </li>
                  <li>
                    <strong style={{ fontWeight: 600 }}>The stakes: </strong>
                    The same technology could perfect indoctrination instead. The good
                    version is not the default. It has to be built on purpose, by
                    builders and educators who want liberation, not engagement.
                  </li>
                </ul>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1.25rem",
                  }}
                >
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Collapse TL;DR"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.25rem",
                      color: "var(--pf-muted, #6b6b6b)",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--pf-ink, #0a0a0a)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--pf-muted, #6b6b6b)";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
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
