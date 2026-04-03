import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Callout({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        className="relative overflow-hidden"
        style={{
          background: "var(--lp-deep, #2c2520)",
          color: "var(--lp-paper, #f6f3ee)",
          padding: "3rem 2.5rem",
          borderRadius: 4,
          margin: "3rem 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 4,
            height: "100%",
            background: "var(--lp-secondary, var(--lp-accent, #c45d3e))",
          }}
        />
        <div className="callout-content">{children}</div>
      </div>
    </ScrollReveal>
  );
}
