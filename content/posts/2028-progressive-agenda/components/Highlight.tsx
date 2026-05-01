import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        style={{
          margin: "3rem -2rem",
          padding: "2rem 2rem 2rem 2.5rem",
          borderLeft: "4px solid var(--pa-secondary, #b91c1c)",
          background: "var(--pa-highlight-bg, #fafafa)",
          fontFamily: '"Lora", Georgia, serif',
          fontSize: "1.25rem",
          lineHeight: 1.6,
          color: "var(--pa-ink, #0f0f0f)",
          fontWeight: 500,
          fontStyle: "normal",
          letterSpacing: "-0.005em",
        }}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}
