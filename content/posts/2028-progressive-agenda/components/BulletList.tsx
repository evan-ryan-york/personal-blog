import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export function BulletList({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "2rem 0",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {children}
      </ul>
    </ScrollReveal>
  );
}

export function Bullet({ children }: { children: ReactNode }) {
  return (
    <li
      style={{
        fontFamily: "var(--pa-font-body)",
        fontSize: "1rem",
        lineHeight: 1.7,
        color: "var(--pa-ink, #374151)",
        paddingLeft: "1.75rem",
        position: "relative",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: "0.55em",
          width: 8,
          height: 2,
          background: "var(--pa-secondary, #b91c1c)",
          borderRadius: 1,
        }}
      />
      {children}
    </li>
  );
}
