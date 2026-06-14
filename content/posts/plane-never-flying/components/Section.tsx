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
          className="mb-4 flex items-center gap-3"
          style={{
            fontFamily: "var(--pf-font-label)",
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--pf-muted, #6b6b6b)",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "var(--pf-ink, #1d2d2f)" }}>{number}</span>
          <span
            aria-hidden
            style={{
              width: 30,
              height: 1,
              background: "var(--pf-rule, #d2cab2)",
              display: "inline-block",
            }}
          />
          <span style={{ letterSpacing: "0.2em" }}>{label}</span>
        </div>
        {children}
      </div>
    </ScrollReveal>
  );
}
