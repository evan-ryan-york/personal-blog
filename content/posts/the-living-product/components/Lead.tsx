import type { ReactNode } from "react";

export default function Lead({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: "1.15rem",
        lineHeight: 1.85,
        color: "#5a534b",
        marginBottom: "1.3rem",
      }}
    >
      {children}
    </div>
  );
}
