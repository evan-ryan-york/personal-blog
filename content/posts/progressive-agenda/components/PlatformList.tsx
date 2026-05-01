import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export function PlatformSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <div
        style={{
          margin: "2rem 0",
          padding: "2rem 2rem 2rem 2.5rem",
          background: "#ffffff",
          border: "1px solid var(--pa-divider, #e5e7eb)",
          borderRadius: 2,
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "var(--pa-accent, #1e3a5f)",
            borderRadius: "2px 2px 0 0",
          }}
        />
        <h4
          style={{
            fontFamily: "var(--pa-font-display)",
            fontSize: "1.2rem",
            fontWeight: 400,
            color: "var(--pa-accent, #1e3a5f)",
            marginBottom: "1rem",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h4>
        <div
          style={{
            fontFamily: "var(--pa-font-body)",
            fontSize: "0.98rem",
            lineHeight: 1.8,
            color: "var(--pa-ink, #374151)",
            fontWeight: 400,
          }}
        >
          {children}
        </div>
      </div>
    </ScrollReveal>
  );
}
