import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

// A big display quote — no box, no fill. Large italic serif, centered, with
// room to breathe. Typography is inline (not just the CSS class) so it renders
// at full size regardless of stylesheet caching.
// Used for the historical (Cubberley) quote and the closing line.
export default function Callout({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <figure
        style={{
          margin: "clamp(3.75rem, 9vh, 6rem) auto",
          maxWidth: 660,
          textAlign: "center",
        }}
      >
        <div
          className="pf-callout-content"
          style={{
            fontFamily: "var(--pf-font-display), Georgia, serif",
            fontSize: "clamp(1.6rem, 3.4vw, 2.35rem)",
            fontStyle: "italic",
            fontWeight: 500,
            lineHeight: 1.34,
            letterSpacing: "-0.01em",
            color: "var(--pf-ink, #1d2d2f)",
          }}
        >
          {children}
        </div>
      </figure>
    </ScrollReveal>
  );
}
