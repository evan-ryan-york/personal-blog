import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Section({
  number,
  label,
  children,
}: {
  number: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <div className="mb-6">
        <div
          className="mb-3"
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--lp-secondary, var(--lp-accent, #c45d3e))",
            fontWeight: 500,
          }}
        >
          {number} — {label}
        </div>
        {children}
      </div>
    </ScrollReveal>
  );
}
