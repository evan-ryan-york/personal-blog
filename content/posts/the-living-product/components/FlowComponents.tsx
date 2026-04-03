import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export function Flow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0" style={{ margin: "2rem 0" }}>
      {children}
    </div>
  );
}

export function FlowStep({
  number,
  title,
  children,
  last = false,
}: {
  number: string;
  title: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <ScrollReveal delay={0.05}>
      <div
        className="flex items-start gap-6"
        style={{
          padding: last ? "1.5rem 0 0 0" : "1.5rem 0",
          position: "relative",
        }}
      >
        {!last && (
          <div
            style={{
              content: "''",
              position: "absolute",
              left: 19,
              top: "3.2rem",
              bottom: 0,
              width: 1,
              background: "color-mix(in srgb, var(--lp-secondary, var(--lp-divider, #d9d3ca)) 30%, var(--lp-divider, #d9d3ca))",
            }}
          />
        )}
        <div
          className="flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            minWidth: 40,
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--lp-secondary, var(--lp-accent, #c45d3e)) 15%, var(--lp-paper, #f6f3ee))",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--lp-secondary, var(--lp-accent, #c45d3e))",
            position: "relative",
            zIndex: 1,
          }}
        >
          {number}
        </div>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.4rem",
              fontWeight: 400,
              marginBottom: "0.4rem",
              color: "var(--lp-deep, #2c2520)",
            }}
          >
            {title}
          </h3>
          <div
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              margin: 0,
              color: "var(--lp-muted, #8a8278)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function SystemLabel({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <div
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--lp-accent, #c45d3e)",
          fontWeight: 500,
          marginBottom: "0.4rem",
          marginTop: "2.5rem",
        }}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}

export function SystemSubtitle({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-display), Georgia, serif",
        fontSize: "1.25rem",
        color: "var(--lp-deep, #2c2520)",
        marginBottom: "1.5rem",
      }}
    >
      {children}
    </div>
  );
}
