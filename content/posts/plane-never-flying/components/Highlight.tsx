import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        style={{
          margin: "clamp(3rem, 6vh, 4.5rem) 0",
          padding: "0.1rem 0 0.1rem 1.85rem",
          borderLeft: "3px solid var(--pf-ink, #1d2d2f)",
          fontFamily: "var(--pf-font-display), Georgia, serif",
          fontSize: "clamp(1.5rem, 3.2vw, 2.3rem)",
          fontStyle: "italic",
          lineHeight: 1.28,
          color: "var(--pf-ink, #1d2d2f)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}
