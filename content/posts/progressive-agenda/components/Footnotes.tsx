import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export function Footnotes({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        style={{
          marginTop: "4rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--pa-divider, #e5e7eb)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--pa-font-body)",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "var(--pa-muted, #9ca3af)",
            marginBottom: "1.5rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          References
        </h3>
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          {children}
        </ol>
      </div>
    </ScrollReveal>
  );
}

export function Footnote({
  id,
  children,
}: {
  id: number;
  children: ReactNode;
}) {
  return (
    <li
      id={`footnote-${id}`}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.82rem",
        lineHeight: 1.6,
        color: "var(--pa-muted, #6b7280)",
        paddingLeft: "1.75rem",
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          color: "var(--pa-accent, #1e3a5f)",
          fontWeight: 600,
          fontSize: "0.78rem",
        }}
      >
        {id}.
      </span>
      {children}{" "}
      <a
        href={`#ref-${id}`}
        style={{
          color: "var(--pa-accent, #1e3a5f)",
          textDecoration: "none",
          fontSize: "0.85em",
        }}
      >
        ↩
      </a>
    </li>
  );
}
