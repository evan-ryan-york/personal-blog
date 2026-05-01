import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Callout({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        className="relative overflow-hidden"
        style={{
          background: "var(--pa-callout-bg, #f8fafc)",
          border: "1px solid var(--pa-divider, #e5e7eb)",
          padding: "2.5rem 2.5rem 2.5rem 3rem",
          borderRadius: 2,
          margin: "2.5rem 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 4,
            height: "100%",
            background: "var(--pa-accent, #1e3a5f)",
          }}
        />
        <div className="pa-callout-content">{children}</div>
      </div>
    </ScrollReveal>
  );
}
