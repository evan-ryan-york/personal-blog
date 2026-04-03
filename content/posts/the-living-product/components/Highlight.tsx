import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        style={{
          margin: "2.5rem 0",
          padding: "1.5rem 0 1.5rem 1.5rem",
          borderLeft: "3px solid var(--lp-secondary, var(--lp-accent, #b44d2a))",
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "1.25rem",
          lineHeight: 1.6,
          color: "var(--lp-deep, #1e1812)",
          fontWeight: 400,
          fontStyle: "italic",
        }}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}
