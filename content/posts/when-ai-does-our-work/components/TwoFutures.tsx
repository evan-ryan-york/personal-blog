import ScrollReveal from "../../seven-bets/components/ScrollReveal";
import {
  AXIS_LABEL,
  FOOTNOTE,
  LET_GO_LABEL,
  ROWS,
  SEGMENT_NAMES,
  describeRow,
} from "./futures";

// One present, two futures, drawn as three bars. Every bar is all the
// valuable problems we could be working on; color shows who is working on
// each part (people in gold, AI in off-white) and the dark part is what
// nobody is working on. The only comparison the reader has to make is the
// size of the dark part, row to row.
//
// Each segment names itself once. A segment too narrow to hold its name
// (Future A's people) carries it above the bar instead. Future A also shows
// the people it let go as a faded, outlined ghost under the AI that replaced
// them, outside the bar.
//
// HTML rather than shipped art so it reflows: on wide screens each row's
// sentence sits to the left of its bar; on narrow ones it stacks above.
//
// The data lives in `futures.ts` so the Markdown version can restate it.

// Below this share a name won't fit inside its segment on a phone.
const LABEL_INSIDE_MIN = 10;

export default function TwoFutures({ caption }: { caption?: string }) {
  return (
    <ScrollReveal>
      <figure className="sb-figure wa-futures">
        {caption ? <figcaption className="wa-futures-title">{caption}</figcaption> : null}

        {ROWS.map((row, i) => {
          // Left edge of each segment, for names set above the bar.
          const starts = row.segments.map((_, j) =>
            row.segments.slice(0, j).reduce((sum, s) => sum + s.share, 0)
          );
          const above = row.segments
            .map((s, j) => ({ ...s, start: starts[j] }))
            .filter((s) => s.share < LABEL_INSIDE_MIN);

          return (
            <div key={row.eyebrow} className={`wa-futures-row${i === 0 ? " wa-futures-row-now" : ""}`}>
              <div className="wa-futures-head">
                <div className="wa-futures-eyebrow">{row.eyebrow}</div>
                <p className="wa-futures-note">{row.note}</p>
              </div>

              <div className="wa-futures-track">
                {i === 0 ? (
                  <div aria-hidden className="wa-futures-axis">
                    {AXIS_LABEL}
                  </div>
                ) : null}

                {above.length > 0 ? (
                  <div aria-hidden className="wa-futures-above">
                    {above.map((s) => (
                      <span
                        key={s.kind}
                        className={`wa-futures-above-label wa-above-${s.kind}`}
                        style={{ left: `${s.start}%` }}
                      >
                        {SEGMENT_NAMES[s.kind]}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="wa-futures-bar" role="img" aria-label={`${row.eyebrow}: ${describeRow(row)}`}>
                  {row.segments.map((s) => (
                    <span
                      key={s.kind}
                      className={`wa-seg wa-seg-${s.kind}`}
                      style={{ flexBasis: `${s.share}%` }}
                    >
                      {s.share >= LABEL_INSIDE_MIN ? SEGMENT_NAMES[s.kind] : null}
                    </span>
                  ))}
                </div>

                {row.letGo ? (
                  <div aria-hidden className="wa-futures-letgo">
                    <span className="wa-futures-ghost" style={{ flexBasis: `${row.letGo}%` }} />
                    <span className="wa-futures-letgo-label">{LET_GO_LABEL}</span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        <p className="wa-futures-footnote">{FOOTNOTE}</p>
      </figure>
    </ScrollReveal>
  );
}
