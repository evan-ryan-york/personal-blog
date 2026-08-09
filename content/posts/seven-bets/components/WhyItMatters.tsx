import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

// The consequence block that closes each bet: a gold hairline down the left,
// a mono label, the claim in italic display type, then the argument.
export default function WhyItMatters({
  lead,
  children,
}: {
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <div style={{ paddingTop: "clamp(3rem, 7vw, 5.25rem)" }}>
        <div
          style={{
            borderLeft: "1px solid var(--sb-gold)",
            paddingLeft: "clamp(1.5rem, 4vw, 2.25rem)",
            display: "flex",
            flexDirection: "column",
            gap: "1.375rem",
          }}
        >
          <div className="sb-eyebrow">Why it matters</div>
          <p className="sb-why-lead">{lead}</p>
          <div className="sb-why-body">{children}</div>
        </div>
      </div>
    </ScrollReveal>
  );
}

// The pointer to a bet's own full-length post.
export function FullArgument({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <div className="sb-full-argument">
      Full argument: <a href={href}>{children} &rarr;</a>
    </div>
  );
}
