// The data for <TwoFutures />. Shared with `src/lib/postMarkdown.ts`, which
// restates the figure as text in the post's Markdown version.
//
// Each row is the whole of the world's valuable work as one bar. The first
// fifth is established work, with known solutions; the rest is new and
// unknown problems. The shares are illustrative, not measured.

export type SegmentKind = "workers" | "ai" | "innovators" | "newInnovators" | "unsolved";

export const SEGMENT_NAMES: Record<SegmentKind, string> = {
  workers: "Knowledge workers",
  ai: "AI",
  innovators: "Innovators",
  newInnovators: "New innovators",
  unsolved: "Unsolved problems",
};

export type FutureRow = {
  eyebrow: string;
  title: string;
  note: string;
  segments: { kind: SegmentKind; share: number }[];
};

export const ROWS: FutureRow[] = [
  {
    eyebrow: "Today",
    title: "People do the established work",
    note: "Most valuable problems go untouched.",
    segments: [
      { kind: "workers", share: 20 },
      { kind: "innovators", share: 5 },
      { kind: "unsolved", share: 75 },
    ],
  },
  {
    eyebrow: "Future A · Efficiency",
    title: "Mass unemployment",
    note: "AI does the established work. The people who did it are let go, and the savings pool with whoever owns the technology.",
    segments: [
      { kind: "ai", share: 20 },
      { kind: "innovators", share: 5 },
      { kind: "unsolved", share: 75 },
    ],
  },
  {
    eyebrow: "Future B · Capacity",
    title: "More people tackling unsolved problems",
    note: "AI does the established work. The savings are reinvested in the same people, trained and paid to take on what nobody had time for.",
    segments: [
      { kind: "ai", share: 20 },
      { kind: "innovators", share: 5 },
      { kind: "newInnovators", share: 20 },
      { kind: "unsolved", share: 55 },
    ],
  },
];

export const LEGEND: { kind: SegmentKind; text: string }[] = [
  { kind: "workers", text: "perform work within established solutions." },
  { kind: "innovators", text: "tackle new and unknown problems." },
  { kind: "newInnovators", text: "are those same workers, redirected to problem-solving." },
  { kind: "ai", text: "takes over the established work in both futures." },
  { kind: "unsolved", text: "are valuable problems nobody is working on." },
];

export const FOOTNOTE = "Illustrative scenarios, not measured workforce shares or a forecast.";
