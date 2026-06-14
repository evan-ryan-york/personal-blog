import type { ReactNode } from "react";

export default function Lead({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--pf-font-display), Georgia, serif",
        fontSize: "clamp(1.6rem, 3.4vw, 2.45rem)",
        fontStyle: "italic",
        fontWeight: 500,
        lineHeight: 1.22,
        letterSpacing: "-0.01em",
        color: "var(--pf-ink, #1d2d2f)",
        marginBottom: "2.2rem",
      }}
    >
      {children}
    </div>
  );
}
