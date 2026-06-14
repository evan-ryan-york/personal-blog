import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export function Blueprint({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        style={{
          margin: "3rem 0",
          border: "1px solid var(--pf-teal, #1c7077)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 1.5rem",
            borderBottom: "1px solid var(--pf-teal, #1c7077)",
            fontFamily: "var(--pf-font-label)",
            fontSize: "0.68rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "var(--pf-ink, #0a0a0a)",
          }}
        >
          <span>The Blueprint</span>
          <span style={{ color: "var(--pf-muted, #6b6b6b)" }}>
            One design, eight specs
          </span>
        </div>
        <div>{children}</div>
      </div>
    </ScrollReveal>
  );
}

export function BlueprintItem({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="pf-blueprint-item"
      style={{
        display: "flex",
        gap: "1.25rem",
        padding: "1.4rem 1.5rem",
        borderTop: "1px solid var(--pf-divider, #e2e2e2)",
      }}
    >
      <div
        aria-hidden
        style={{
          fontFamily: "var(--pf-font-label)",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--pf-faint, #9a9a9a)",
          lineHeight: 1.7,
          flexShrink: 0,
          width: "1.75rem",
        }}
      >
        {number}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--pf-font-display), Georgia, serif",
            fontSize: "1.18rem",
            fontWeight: 500,
            lineHeight: 1.4,
            color: "var(--pf-ink, #0a0a0a)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        {children ? (
          <div
            style={{
              fontFamily: "var(--pf-font-body)",
              fontSize: "1rem",
              lineHeight: 1.65,
              color: "var(--pf-muted, #555)",
              marginTop: "0.4rem",
            }}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
