// The short version of the Cynefin plate, used by "What Happens to Us When AI
// Does Our Work?": one description line, an example only where the essay has
// one of its own, and one line on what AI can take. Kept out of the
// "use client" plate so the Markdown export can read the same copy.

export type BriefQuadrant = {
  title: string;
  body: string;
  example?: string;
  ai: string;
};

export const CYNEFIN_BRIEF: BriefQuadrant[] = [
  {
    title: "Simple",
    body: "The steps are known and the same every time.",
    ai: "Does this today.",
  },
  {
    title: "Complicated",
    body: "It takes expertise, but an expert can teach it and check it.",
    example: "Closing a company's books.",
    ai: "Can do this with training, tools, and oversight.",
  },
  {
    title: "Complex",
    body: "Nobody knows the answer in advance. You find it by trying things.",
    example: "Making a dialysis machine a rural clinic can afford.",
    ai: "Mostly human, for a long time.",
  },
  {
    title: "Chaotic",
    body: "A crisis. You act first and understand later.",
    ai: "Human.",
  },
];

/** One line per quadrant, as the plate's text alternative and Markdown read it. */
export function briefLine(q: BriefQuadrant): string {
  return [q.body, q.example ? `e.g. ${q.example}` : "", `AI: ${q.ai}`]
    .filter(Boolean)
    .join(" ");
}
