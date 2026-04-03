"use client";

import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export function Barriers({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4" style={{ margin: "2.5rem 0" }}>
      {children}
    </div>
  );
}

export function BarrierCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal delay={0.05}>
      <div
        className="transition-colors duration-300"
        style={{
          background: "white",
          border: "1px solid var(--lp-divider, #d9d3ca)",
          padding: "1.8rem 2rem",
          borderRadius: 3,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "var(--lp-accent, #c45d3e)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--lp-divider, #d9d3ca)")
        }
      >
        <div
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--lp-secondary, var(--lp-accent, #c45d3e))",
            fontWeight: 600,
            marginBottom: "0.6rem",
          }}
        >
          {label}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: "1.3rem",
            fontWeight: 400,
            color: "var(--lp-deep, #2c2520)",
            marginBottom: "0.5rem",
          }}
        >
          {title}
        </h3>
        <div
          style={{
            fontSize: "0.95rem",
            color: "var(--lp-muted, #8a8278)",
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {children}
        </div>
      </div>
    </ScrollReveal>
  );
}
