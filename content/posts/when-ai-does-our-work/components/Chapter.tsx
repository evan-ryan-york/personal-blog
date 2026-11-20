import type { ReactNode } from "react";

// A chapter head: the act label ("Act I", "Act IIIa") as a small kicker over
// the title in display type. The essay reads as a play in acts, after the
// theater in its hero, and the labels keep that shape visible as you scroll.
function slugify(node: ReactNode): string | undefined {
  if (typeof node !== "string") return undefined;
  return node
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function Chapter({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <h2 id={slugify(children)} className="sb-chapter">
      <span className="sb-chapter-num">
        <span aria-hidden className="sb-chapter-rule" />
        {number}
      </span>
      <span className="sb-chapter-title">{children}</span>
    </h2>
  );
}
