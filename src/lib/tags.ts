/**
 * What each tag actually means on this site.
 *
 * Tag pages used to be a heading and a list of links — thin enough that a
 * search engine has no reason to rank one and an assistant has nothing to
 * quote. A few sentences of real copy turns each into a topic hub that can
 * stand on its own and be cited as an overview.
 *
 * A tag with no entry here still works; it just renders without the intro.
 */
export const TAG_DESCRIPTIONS: Record<string, string> = {
  AI: "Artificial intelligence is the through-line of almost everything here. Not the product launches or the model benchmarks, but the slower question underneath them: what happens to work, learning, and ownership when the cost of thinking collapses. These essays argue that AI is the most powerful engine of abundance we have built, and that who ends up sharing in what it creates is a decision, not a forecast.",

  education: "American school is a hundred-year-old design built for a problem we no longer have, and no amount of tuning fixes a plane that was never going to fly. These posts make the case for starting over — meeting each child where they are, treating relationships and play as preconditions for thinking rather than rewards for it, and using AI to buy back the money and the hours that a century of triage swallowed.",

  policy: "The gap between a good idea and a governing agenda is where most good ideas die. These essays try to close it: what a serious platform for AI abundance and equitable distribution would actually commit to, how energy and infrastructure become the binding constraint of the decade, and why standards without co-investment are just a way of asking someone else to pay.",

  politics: "A moral conviction without a theory of how prosperity gets made is not a program. These posts argue that progressives have to own both halves — the engine and the distribution — and that the quadrant where a movement builds everything and shares everything is, for the moment, empty.",

  product: "Software has spent its whole history as something humans construct from the outside and maintain by hand. These essays are about what replaces that: products that sense their environment, decide what matters, test adaptations, and prune what fails — and what the human job becomes when the product participates in its own development.",

  technology: "Predictions worth making are the ones that change what you do on Monday. These posts lay out specific bets on the next ten years — where software goes, what human work becomes, why long-term memory turns into the moat, and why the physical world stays stubbornly harder than the digital one.",
};

export function tagDescription(tag: string): string | null {
  return TAG_DESCRIPTIONS[tag] ?? null;
}

/** The short version, for `<meta name="description">` and social cards. */
export function tagMetaDescription(tag: string, count: number): string {
  const full = TAG_DESCRIPTIONS[tag];
  if (!full) {
    return `${count} ${count === 1 ? "essay" : "essays"} by Ryan York about ${tag}.`;
  }
  // First sentence, which is written to stand alone.
  const firstSentence = full.match(/^[^.]+\./)?.[0] ?? full;
  return `${firstSentence} ${count} ${count === 1 ? "essay" : "essays"} by Ryan York.`;
}
