import type { ReactNode } from "react";

export default function Lead({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--pa-font-body)",
        fontSize: "1.18rem",
        lineHeight: 1.85,
        color: "var(--pa-ink, #1f2937)",
        marginBottom: "1.5rem",
      }}
    >
      {children}
    </div>
  );
}
