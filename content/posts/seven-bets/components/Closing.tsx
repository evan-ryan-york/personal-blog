import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Closing({
  statement,
  children,
}: {
  statement: ReactNode;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <div
        style={{
          marginTop: "clamp(5rem, 12vw, 8.75rem)",
          borderTop: "1px solid var(--sb-rule)",
          paddingTop: "clamp(2.75rem, 7vw, 3.75rem)",
          display: "flex",
          flexDirection: "column",
          gap: "1.625rem",
        }}
      >
        <div className="sb-eyebrow">Closing</div>
        <p className="sb-closing-statement">{statement}</p>
        <div className="sb-closing-body">{children}</div>
      </div>
    </ScrollReveal>
  );
}
