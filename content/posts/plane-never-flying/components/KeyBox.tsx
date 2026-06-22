import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

// A framed, accented panel for the single most important paragraph in the
// piece — the thesis on what AI is actually for. Uses the coral primary accent
// (not the teal of the Blueprint) so it reads as the one passage to stop on.
// Typography is inline so it renders correctly regardless of stylesheet caching.
export default function KeyBox({
  label = "This is the whole point",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <aside
        style={{
          margin: "clamp(3rem, 6vh, 4.5rem) 0",
          padding: "clamp(1.6rem, 3.5vw, 2.25rem)",
          background: "rgba(212, 86, 45, 0.05)",
          border: "1px solid var(--pf-rule, #d2cab2)",
          borderLeft: "4px solid var(--pf-coral, #d4562d)",
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
              color: "var(--pf-coral, #d4562d)",
              marginBottom: "1.1rem",
            }}
          >
            {label}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: "var(--pf-font-body), Georgia, serif",
            fontSize: "clamp(1.08rem, 1.7vw, 1.22rem)",
            lineHeight: 1.66,
            color: "var(--pf-ink, #1d2d2f)",
            fontWeight: 450,
            letterSpacing: "-0.005em",
          }}
        >
          {children}
        </div>
      </aside>
    </ScrollReveal>
  );
}
