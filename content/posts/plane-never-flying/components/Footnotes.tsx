import type { ReactNode } from "react";

export function Footnotes({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginTop: "4.5rem",
        paddingTop: "2.25rem",
        borderTop: "1px solid var(--pf-rule, #d2cab2)",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--pf-font-label)",
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "var(--pf-faint, #94a09e)",
          marginBottom: "1.75rem",
          letterSpacing: "0.22em",
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
          gap: "0.85rem",
        }}
      >
        {children}
      </ol>
    </div>
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
        fontFamily: "var(--pf-font-body, 'Spectral', Georgia, serif)",
        fontSize: "0.9rem",
        lineHeight: 1.6,
        color: "var(--pf-muted, #5d6e6d)",
        paddingLeft: "2rem",
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          fontFamily: "var(--pf-font-label)",
          color: "var(--pf-coral, #d4562d)",
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
          color: "var(--pf-coral, #d4562d)",
          textDecoration: "none",
          fontSize: "0.85em",
        }}
        aria-label="Back to text"
      >
        ↩
      </a>
    </li>
  );
}
