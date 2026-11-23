import type { ReactNode } from "react";
import ScrollReveal from "../../seven-bets/components/ScrollReveal";

// Act VI — "Entrepreneurs need coaching" — told as a rehearsal: numbered
// beats down a gold spine, each one a scene in Denise's six weeks. Inside the
// beats, the pieces that were buried in paragraphs get their own shapes: the
// manager's lines set like a script, the two clinics side by side, the fork
// she chooses at, the pilot as a spec card, the weekly ritual as a loop, and
// the two ways a manager can read a pilot that ends.
//
// The Markdown export restates each of these from their props (see the
// coaching rules in src/lib/postMarkdown.ts).

/** The spine that holds the beats. */
export function Rehearsal({ children }: { children: ReactNode }) {
  return <ol className="wa-rehearsal">{children}</ol>;
}

/** One scene on the spine: a numbered node, a kicker and a title. */
export function Beat({
  n,
  kicker,
  title,
  children,
}: {
  n: string;
  kicker?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="wa-beat">
      <span aria-hidden className="wa-beat-node">
        {n}
      </span>
      <ScrollReveal>
        <div className="wa-beat-body">
          {kicker ? <div className="wa-beat-kicker">{kicker}</div> : null}
          <h3 className="wa-beat-title">{title}</h3>
          {children}
        </div>
      </ScrollReveal>
    </li>
  );
}

/** A spoken line, set like a script: the speaker in small caps, then the line. */
export function Line({ who, children }: { who: string; children: ReactNode }) {
  return (
    <blockquote className="wa-line">
      <span className="wa-line-who">{who}</span>
      <span className="wa-line-text">{children}</span>
    </blockquote>
  );
}

/** Side-by-side cards. */
export function Clinics({ children }: { children: ReactNode }) {
  return <div className="wa-clinics">{children}</div>;
}

/** What a clinic can and can't afford. */
export function Clinic({
  name,
  can,
  cant,
}: {
  name: string;
  can: string;
  cant: string;
}) {
  return (
    <div className="wa-clinic">
      <div className="wa-clinic-name">{name}</div>
      <dl className="wa-clinic-dl">
        <div>
          <dt>Can afford</dt>
          <dd>{can}</dd>
        </div>
        <div className="wa-clinic-cant">
          <dt>Can&rsquo;t afford</dt>
          <dd>{cant}</dd>
        </div>
      </dl>
    </div>
  );
}

/** A coaching aside in the margin of a beat. */
export function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="wa-note">
      <span className="wa-note-label">{label}</span>
      <span className="wa-note-text">{children}</span>
    </aside>
  );
}

/** The fork: the paths open to her, with the one she takes lit. */
export function Options({ children }: { children: ReactNode }) {
  return <ul className="wa-options">{children}</ul>;
}

export function Option({
  picked = false,
  children,
}: {
  picked?: boolean;
  children: ReactNode;
}) {
  return (
    <li className={`wa-option${picked ? " wa-option-picked" : ""}`}>
      <span aria-hidden className="wa-option-mark">
        {picked ? "✓" : ""}
      </span>
      <span>{children}</span>
      {picked ? <span className="sr-only"> (her pick)</span> : null}
    </li>
  );
}

/** A question set large on its own card. */
export function Question({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="wa-question">
      <span className="wa-question-label">{label}</span>
      <p className="wa-question-text">{children}</p>
    </div>
  );
}

/** The pilot, as a spec card of big figures. */
export function Spec({ children }: { children: ReactNode }) {
  return <dl className="wa-spec">{children}</dl>;
}

export function SpecItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="wa-spec-item">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** The weekly ritual, drawn as a loop of steps that comes back around. */
export function Loop({ children }: { children: ReactNode }) {
  return (
    <div className="wa-loop">
      <ol className="wa-loop-steps">{children}</ol>
      <span aria-hidden className="wa-loop-return">
        &#8635; Every week
      </span>
    </div>
  );
}

export function LoopStep({ children }: { children: ReactNode }) {
  return <li className="wa-loop-step">{children}</li>;
}

/** Two readings of the same result, side by side. */
export function Outcomes({ children }: { children: ReactNode }) {
  return <div className="wa-outcomes">{children}</div>;
}

export function Outcome({
  when,
  good = false,
  children,
}: {
  when: string;
  good?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`wa-outcome${good ? " wa-outcome-good" : ""}`}>
      <span className="wa-outcome-when">{when}</span>
      <span className="wa-outcome-then">{children}</span>
    </div>
  );
}
