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
      <div className="relative mb-6" style={{ paddingTop: "0.5rem" }}>
        {/* Large watermark number */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-1.8rem",
            left: "-0.3rem",
            fontFamily: "var(--pa-font-display)",
            fontSize: "7rem",
            fontWeight: 400,
            lineHeight: 1,
            color: "var(--pa-divider, #e5e7eb)",
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-0.04em",
          }}
        >
          {number}
        </div>
        {/* Label */}
        <div
          className="relative"
          style={{
            fontFamily: "var(--pa-font-body)",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--pa-secondary, #b91c1c)",
            marginBottom: "0.75rem",
            paddingLeft: "0.1rem",
          }}
        >
          {label}
        </div>
        <div className="relative">{children}</div>
      </div>
    </ScrollReveal>
  );
}
