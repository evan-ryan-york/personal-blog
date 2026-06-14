import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Scene({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <div
        className="pf-scene"
        style={{
          background: "#fefefb",
          margin: "3.5rem -2rem",
          padding: "3rem 2.5rem",
          borderTop: "1px solid var(--pf-rule, #d2cab2)",
          borderBottom: "1px solid var(--pf-rule, #d2cab2)",
        }}
      >
        {label ? (
          <div
            style={{
              fontFamily: "var(--pf-font-label)",
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "var(--pf-muted, #6b6b6b)",
              marginBottom: "1.75rem",
            }}
          >
            {label}
          </div>
        ) : null}
        <div className="pf-scene-content">{children}</div>
      </div>
    </ScrollReveal>
  );
}
