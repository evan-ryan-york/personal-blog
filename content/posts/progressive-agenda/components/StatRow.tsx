import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export function StatRow({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          margin: "2.5rem 0",
        }}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}

export function Stat({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <div
      style={{
        padding: "1.5rem 1.25rem",
        background: "var(--pa-callout-bg, #f8fafc)",
        border: "1px solid var(--pa-divider, #e5e7eb)",
        borderRadius: 2,
        borderTop: "3px solid var(--pa-secondary, #b91c1c)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--pa-font-display)",
          fontSize: "2rem",
          fontWeight: 400,
          color: "var(--pa-accent, #1e3a5f)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: "0.25rem",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--pa-font-body)",
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "var(--pa-ink, #0f0f0f)",
          marginBottom: "0.35rem",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--pa-font-body)",
          fontSize: "0.78rem",
          color: "var(--pa-muted, #6b7280)",
          lineHeight: 1.5,
        }}
      >
        {detail}
      </div>
    </div>
  );
}
