import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export function ThreeUp({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          margin: "2.5rem 0",
        }}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}

export function ColumnCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        padding: "1.5rem",
        background: "#ffffff",
        border: "1px solid var(--pa-divider, #e5e7eb)",
        borderRadius: 2,
        borderLeft: "3px solid var(--pa-accent, #1e3a5f)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--pa-font-display)",
          fontSize: "1.1rem",
          fontWeight: 400,
          color: "var(--pa-accent, #1e3a5f)",
          marginBottom: "0.75rem",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "var(--pa-font-body)",
          fontSize: "0.9rem",
          color: "var(--pa-ink, #374151)",
          lineHeight: 1.7,
        }}
      >
        {children}
      </div>
    </div>
  );
}
