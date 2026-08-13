import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

// The line a bet turns on. Set large in brass display type, centered between
// two fading hairlines, so the pivot reads as a plate inside the prose rather
// than one more paragraph. Reserved for a single statement per bet.
//
// Two-sentence turns run long enough that the display size would stack them
// six or seven lines deep, so anything past ~90 characters steps down a size
// and widens — same plate, still bigger than the prose around it.
// Auto-detection only sees plain string children, so a turn built from JSX
// (line breaks between beats) asks for the smaller tier with `long`.
const LONG = 90;

export default function Turn({
  children,
  long: forceLong = false,
}: {
  children: ReactNode;
  long?: boolean;
}) {
  const long =
    forceLong || (typeof children === "string" && children.length > LONG);

  return (
    <ScrollReveal>
      <div className="sb-turn">
        <span aria-hidden className="sb-turn-rule sb-turn-rule-top" />
        <p className={`sb-turn-line${long ? " sb-turn-line-long" : ""}`}>
          {children}
        </p>
        <span aria-hidden className="sb-turn-rule sb-turn-rule-bottom" />
      </div>
    </ScrollReveal>
  );
}
