import ScrollReveal from "../../seven-bets/components/ScrollReveal";
import { FOOTNOTE, LEGEND, ROWS, SEGMENT_NAMES } from "./futures";

// One present, two futures, drawn as three stacked bars of the world's
// valuable work. The first fifth of every bar is established work; the rest
// is new and unknown problems. Efficiency hands that fifth to AI and stops;
// capacity hands it to AI and puts the same people on the unsolved remainder.
//
// HTML rather than shipped art so it reflows: on wide screens the row titles
// sit to the left of the bars with segment names above them; on narrow ones
// each title stacks over its bar and the legend names the colors.
//
// The data lives in `futures.ts` so the Markdown version can restate it.

export default function TwoFutures({ caption }: { caption?: string }) {
  return (
    <ScrollReveal>
      <figure className="sb-figure wa-futures">
        {caption ? <figcaption className="wa-futures-title">{caption}</figcaption> : null}

        {/* Bracket over the bars: established work vs. the unknown */}
        <div aria-hidden className="wa-futures-scale">
          <span className="wa-futures-bracket" style={{ flexBasis: "20%" }}>
            Established work
          </span>
          <span className="wa-futures-bracket" style={{ flexBasis: "80%" }}>
            New and unknown problems
          </span>
        </div>

        {ROWS.map((row, i) => (
          <div key={row.title} className={`wa-futures-row${i === 0 ? " wa-futures-row-now" : ""}`}>
            <div className="wa-futures-head">
              <div className="wa-futures-eyebrow">{row.eyebrow}</div>
              <p className="wa-futures-row-title">{row.title}</p>
              <p className="wa-futures-note">{row.note}</p>
            </div>
            <div className="wa-futures-track">
              <div aria-hidden className="wa-futures-names">
                {row.segments.map((s) => (
                  <span key={s.kind} style={{ flexBasis: `${s.share}%` }}>
                    {SEGMENT_NAMES[s.kind]}
                  </span>
                ))}
              </div>
              <div
                className="wa-futures-bar"
                role="img"
                aria-label={row.segments
                  .map((s) => `${SEGMENT_NAMES[s.kind]} ${s.share}%`)
                  .join(", ")}
              >
                {row.segments.map((s) => (
                  <span
                    key={s.kind}
                    className={`wa-seg wa-seg-${s.kind}`}
                    style={{ flexBasis: `${s.share}%` }}
                  >
                    {s.share}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <ul className="wa-futures-legend">
          {LEGEND.map((item) => (
            <li key={item.kind}>
              <span aria-hidden className={`wa-swatch wa-seg-${item.kind}`} />
              <span>
                <strong>{SEGMENT_NAMES[item.kind]}</strong> {item.text}
              </span>
            </li>
          ))}
        </ul>

        <p className="wa-futures-footnote">{FOOTNOTE}</p>
      </figure>
    </ScrollReveal>
  );
}
