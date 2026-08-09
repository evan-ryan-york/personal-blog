import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

// Each bet opens on its own mini hero: the art full-bleed, the circled letter
// and title sitting on it the way the main hero's title sits on the portals.
// The argument follows below on clean ground.
export default function BetHero({
  letter,
  src,
  alt,
  caption,
  children,
}: {
  letter: string;
  src: string;
  alt: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <figure id={`bet-${letter.toLowerCase()}`} className="sb-bethero">
        <div className="sb-bethero-frame">
          <img
            className="sb-bethero-img"
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            width={1456}
            height={816}
          />
          <div aria-hidden className="sb-bethero-scrim" />
          <div className="sb-bethero-inner">
            <div className="sb-bethero-rule">
              <span aria-hidden className="sb-bethero-badge">
                {letter}
              </span>
              <span aria-hidden className="sb-bethero-line" />
            </div>
            <h2 className="sb-bet-title">{children}</h2>
          </div>
        </div>
        {caption ? (
          <figcaption className="sb-bethero-caption">{caption}</figcaption>
        ) : null}
      </figure>
    </ScrollReveal>
  );
}
