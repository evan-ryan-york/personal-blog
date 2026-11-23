// The data for <TwoFutures />. Shared with `src/lib/postMarkdown.ts`, which
// restates the figure as text in the post's Markdown version.
//
// Each bar is all the valuable problems we could be working on. Color shows
// who is working on each part; the dark part is what nobody is working on.
// The reader only has to compare the dark part across the three rows. The
// shares set the widths but are never printed: they're illustrative.

export type SegmentKind = "people" | "ai" | "nobody";

export const SEGMENT_NAMES: Record<SegmentKind, string> = {
  people: "People",
  ai: "AI",
  nobody: "Nobody is working on this",
};

export type FutureRow = {
  eyebrow: string;
  note: string;
  segments: { kind: SegmentKind; share: number }[];
  /** People removed from the bar, drawn as a ghost under its first segment. */
  letGo?: number;
};

export const AXIS_LABEL = "All the valuable problems we could be working on";
export const LET_GO_LABEL = "People let go";

export const ROWS: FutureRow[] = [
  {
    eyebrow: "Today",
    note: "People do the work we already know how to do. Most valuable problems go untouched.",
    segments: [
      { kind: "people", share: 25 },
      { kind: "nobody", share: 75 },
    ],
  },
  {
    eyebrow: "Future A · Efficiency",
    note: "AI does that work. The people who did it are let go, and the same problems go untouched.",
    segments: [
      { kind: "ai", share: 20 },
      { kind: "people", share: 5 },
      { kind: "nobody", share: 75 },
    ],
    letGo: 20,
  },
  {
    eyebrow: "Future B · Capacity",
    note: "AI does that work. The same people are paid to take on problems nobody had time for.",
    segments: [
      { kind: "ai", share: 20 },
      { kind: "people", share: 25 },
      { kind: "nobody", share: 55 },
    ],
  },
];

export const FOOTNOTE = "Illustrative, not a forecast.";

// The bars carry no numbers, so their text alternatives describe the shares
// in words.
const SHARE_WORDS: Record<number, string> = {
  5: "a sliver",
  20: "a fifth",
  25: "a quarter",
  55: "just over half",
  75: "three quarters",
};

export function shareInWords(share: number): string {
  return SHARE_WORDS[share] ?? `${share} percent`;
}

/** One row's bar, in words: "People, a quarter; Nobody is working on this, three quarters." */
export function describeRow(row: FutureRow): string {
  const parts = row.segments
    .map((s) => `${SEGMENT_NAMES[s.kind]}, ${shareInWords(s.share)}`)
    .join("; ");
  const letGo = row.letGo ? ` ${LET_GO_LABEL}: ${shareInWords(row.letGo)}.` : "";
  return `${parts}.${letGo}`;
}
