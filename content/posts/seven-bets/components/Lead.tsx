import type { ReactNode } from "react";

// The ramp into the post: body serif a step up in size and brightness, so the
// opening has an entry point instead of starting at full prose density.
export default function Lead({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--sb-font-body)",
        fontSize: "clamp(1.25rem, 2.3vw, 1.5625rem)",
        lineHeight: 1.6,
        color: "var(--sb-heading)",
        textWrap: "pretty",
        margin: "0 0 1.75rem",
      }}
    >
      {children}
    </div>
  );
}
