import type { Post } from "./posts";
import { authorName, postUrl, siteName, siteUrl } from "./site";

// Deliberately not imported from `./posts`: that module reads the filesystem
// at import time, and two of the post layouts that render a "copy this post"
// button are client components. A type-only import of `Post` erases; a value
// import would pull `fs` into the browser bundle.
function lastModified(post: Post): string {
  return post.frontmatter.updated || post.frontmatter.date;
}

// A post body is Markdown mixed with that post's own JSX components. The
// clipboard wants plain Markdown, so every component carrying prose is
// unwrapped into its nearest Markdown equivalent and anything left over is
// stripped bare. Rules are ordered: specific components first, generic
// tag-stripping last as the backstop.
type Rule = (source: string) => string;

function attr(attrs: string, name: string): string {
  const match = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : "";
}

function tidy(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

// <TheSeven bets={[{ letter, title }, ...]} /> -> a Markdown list
const theSeven: Rule = (source) =>
  source.replace(
    /<TheSeven\s+bets=\{\[([\s\S]*?)\]\}\s*\/>/g,
    (_match, entries: string) => {
      const rows = [...entries.matchAll(/letter:\s*"([^"]*)",\s*title:\s*"([^"]*)"/g)]
        .map(([, letter, title]) => `- **${letter}.** ${title}`)
        .join("\n");
      return `## The seven\n\n${rows}`;
    }
  );

// <BetHero letter caption>Title</BetHero> -> a heading, caption as a dek
const betHero: Rule = (source) =>
  source.replace(
    /<BetHero\b([^>]*)>([\s\S]*?)<\/BetHero>/g,
    (_match, attrs: string, title: string) => {
      const caption = attr(attrs, "caption");
      const heading = `## ${attr(attrs, "letter")}. ${tidy(title)}`;
      return caption ? `${heading}\n\n*${caption}*` : heading;
    }
  );

// <CynefinPlate caption /> -> the plate's four quadrants as a Markdown list.
// The diagram is drawn in a canvas, so there is no image to link to; the text
// it renders has to be restated here or it leaves the Markdown entirely.
const CYNEFIN_ROWS: [string, string, string][] = [
  ["Simple", "Processing an invoice that has already been approved.", "AI already can fully do this work"],
  ["Complicated", "Performing an appendectomy.", "AI can do this work with the proper training, tools, and oversight"],
  ["Complex", "Designing and adapting a teacher-training program to improve student math outcomes tenfold.", "Most of this work is and will remain human"],
  ["Chaotic", "Coordinating rescue operations after an earthquake strikes a dense urban center.", "This work is entirely human. Instinct, speed, and judgment prevail."],
];

const cynefinPlate: Rule = (source) =>
  source.replace(/<CynefinPlate\b([^>]*)\/>/g, (_match, attrs: string) => {
    const rows = CYNEFIN_ROWS.map(
      ([domain, example, implication]) =>
        `- **${domain}.** Example: ${example} AI implication: ${implication}`
    ).join("\n");
    const caption = attr(attrs, "caption");
    return caption ? `${rows}\n\n*${caption}*` : rows;
  });

// <WhyItMatters lead>body</WhyItMatters> -> subheading, bolded lead, body
const whyItMatters: Rule = (source) =>
  source.replace(
    /<WhyItMatters\b([^>]*)>([\s\S]*?)<\/WhyItMatters>/g,
    (_match, attrs: string, body: string) =>
      `### Why it matters\n\n**${attr(attrs, "lead")}**\n\n${body.trim()}`
  );

// <FullArgument href lead?>text</FullArgument> -> an inline Markdown link
const fullArgument: Rule = (source) =>
  source.replace(
    /<FullArgument\b([^>]*)>([\s\S]*?)<\/FullArgument>/g,
    (_match, attrs: string, text: string) => {
      const lead = /\blead=/.test(attrs) ? attr(attrs, "lead") : "Full argument:";
      const link = `[${tidy(text)}](${attr(attrs, "href")})`;
      return lead ? `${lead} ${link}` : link;
    }
  );

// <Closing statement={<>...</>}>body</Closing>. The statement prop holds JSX
// rather than a string, so <em> is converted before the generic strip runs.
const closing: Rule = (source) =>
  source.replace(
    /<Closing\s+statement=\{([\s\S]*?)\}>([\s\S]*?)<\/Closing>/g,
    (_match, statement: string, body: string) => {
      const text = tidy(
        statement
          .replace(/<\/?em>/g, "*")
          .replace(/<\/?>/g, "")
      );
      return `## ${text}\n\n${body.trim()}`;
    }
  );

// <Wagers items={[…]} /> -> a Markdown list. Keeps the row reading as an
// enumeration instead of a run-on sentence of capitalized fragments.
const wagers: Rule = (source) =>
  source.replace(
    /<Wagers\s+items=\{\[([\s\S]*?)\]\}\s*\/>/g,
    (_match, entries: string) =>
      [...entries.matchAll(/"([^"]*)"/g)].map(([, item]) => `- ${item}`).join("\n")
  );

/* --------------------------------------------------------------------------
 * The other three posts.
 *
 * `stripComponents` below keeps anything a component wraps, so prose survives
 * on its own. What it cannot save is content living in *props* — every
 * `title=`, `number=`, `label=` and `caption=` in the post. Those are headings
 * and captions the reader sees, so without a rule per component the Markdown
 * came out as unlabelled walls of text. One rule each, same shape as above.
 * ----------------------------------------------------------------------- */

/** `<FlowStep number title>` — the sense/interpret/grow loop. */
const flowStep: Rule = (source) =>
  source.replace(
    /<FlowStep\b([^>]*)>([\s\S]*?)<\/FlowStep>/g,
    (_match, attrs: string, body: string) =>
      `### ${attr(attrs, "number")}. ${attr(attrs, "title")}\n\n${body.trim()}`
  );

/** `<BarrierCard label title>` — the open questions. */
const barrierCard: Rule = (source) =>
  source.replace(
    /<BarrierCard\b([^>]*)>([\s\S]*?)<\/BarrierCard>/g,
    (_match, attrs: string, body: string) =>
      `### ${attr(attrs, "title")}\n\n${body.trim()}`
  );

/** `<BlueprintItem number title>` — the numbered design principles. */
const blueprintItem: Rule = (source) =>
  source.replace(
    /<BlueprintItem\b([^>]*)>([\s\S]*?)<\/BlueprintItem>/g,
    (_match, attrs: string, body: string) =>
      `### ${attr(attrs, "number")}. ${attr(attrs, "title")}\n\n${body.trim()}`
  );

/** `<PlatformSection title>` — the planks of the platform. */
const platformSection: Rule = (source) =>
  source.replace(
    /<PlatformSection\b([^>]*)>([\s\S]*?)<\/PlatformSection>/g,
    (_match, attrs: string, body: string) =>
      `### ${attr(attrs, "title")}\n\n${body.trim()}`
  );

/** `<Scene label>` — the narrative interlude. */
const scene: Rule = (source) =>
  source.replace(
    /<Scene\b([^>]*)>([\s\S]*?)<\/Scene>/g,
    (_match, attrs: string, body: string) => {
      const label = attr(attrs, "label");
      return label ? `### ${label}\n\n${body.trim()}` : body.trim();
    }
  );

/** Set-apart emphasis blocks become blockquotes, which is what they are. */
const blockquoteComponents: Rule = (source) =>
  source.replace(
    /<(KeyBox|Callout)\b[^>]*>([\s\S]*?)<\/\1>/g,
    (_match, _name: string, body: string) =>
      body
        .trim()
        .split("\n")
        .map((line) => (line.trim() ? `> ${line.trim()}` : ">"))
        .join("\n")
  );

/** `<Bullet>` inside `<BulletList>` — a list that was never a list in source. */
const bullet: Rule = (source) =>
  source.replace(
    /<Bullet>([\s\S]*?)<\/Bullet>/g,
    (_match, text: string) => `- ${tidy(text)}`
  );

/**
 * Footnotes. The refs become real Markdown footnote references and the
 * definitions become real definitions, so a reader — or a model — can still
 * follow a claim to its source once the post leaves the page.
 */
const footnoteRef: Rule = (source) =>
  source.replace(/<FootnoteRef\s+id=\{(\d+)\}\s*\/>/g, "[^$1]");

const footnote: Rule = (source) =>
  source.replace(
    /<Footnote\s+id=\{(\d+)\}>([\s\S]*?)<\/Footnote>/g,
    (_match, id: string, text: string) => `[^${id}]: ${tidy(text)}`
  );

const footnotesHeading: Rule = (source) =>
  source.replace(/<Footnotes>/g, "## Notes\n").replace(/<\/Footnotes>/g, "");

/**
 * `<QuadrantChart />` is drawn into a canvas, so — like `<CynefinPlate />`
 * above — there is no text to keep and no image to link. Its four quadrants
 * are the argument of the essay, so they are restated here or they are gone.
 */
const QUADRANT_ROWS: [string, string][] = [
  ["Republicans", "High abundance agenda, low equitable distribution. Free market theory, protectionist reality."],
  ["Progressives today", "Low abundance agenda, high equitable distribution. Moral clarity, no engine."],
  ["The soft center", "Low on both. No conviction on either front."],
  ["The progressive abundance agenda", "High on both — the empty quadrant. Build everything. Share everything."],
];

const quadrantChart: Rule = (source) =>
  source.replace(/<QuadrantChart\b[^>]*\/>/g, () =>
    [
      "Four positions, plotted against an abundance agenda and equitable distribution:",
      "",
      ...QUADRANT_ROWS.map(([name, note]) => `- **${name}.** ${note}`),
    ].join("\n")
  );

/** `<PostImage src alt caption />` -> a real Markdown image plus its caption. */
const postImage: Rule = (source) =>
  source.replace(/<PostImage\b([^>]*?)\/>/g, (_match, attrs: string) => {
    const image = `![${attr(attrs, "alt")}](${attr(attrs, "src")})`;
    const caption = attr(attrs, "caption");
    return caption ? `${image}\n\n*${caption}*` : image;
  });

// Whatever the rules above missed: drop component tags, keep their contents.
// Only capitalized names match, so any literal HTML in the prose survives.
const stripComponents: Rule = (source) =>
  source.replace(/<\/?[A-Z][\w.]*(?:\s[^>]*?)?\/?>/g, "");

// Root-relative links are meaningless once the text leaves the site.
const absolutizeLinks: Rule = (source) =>
  source.replace(/\]\(\//g, `](${siteUrl}/`);

const collapseBlankLines: Rule = (source) =>
  source.replace(/\n{3,}/g, "\n\n").trim();

const RULES: Rule[] = [
  // seven-bets
  theSeven,
  betHero,
  cynefinPlate,
  whyItMatters,
  fullArgument,
  closing,
  wagers,
  // the-living-product, progressive-agenda, plane-never-flying
  flowStep,
  barrierCard,
  blueprintItem,
  platformSection,
  scene,
  bullet,
  quadrantChart,
  postImage,
  footnoteRef,
  footnote,
  footnotesHeading,
  // Must follow the rules above: those match specific tags, this one reaches
  // inside any component that is still standing.
  blockquoteComponents,
  stripComponents,
  absolutizeLinks,
  collapseBlankLines,
];

export function postBodyToMarkdown(content: string): string {
  return RULES.reduce((source, rule) => rule(source), content);
}

/**
 * The whole post as Markdown: title, byline, tags, TL;DR, then the body.
 *
 * Served at `/posts/<slug>.md` and concatenated into `/llms-full.txt`. The
 * header is deliberately verbose — when a model retrieves this file it has
 * nothing else to go on, so the text has to say who wrote it, when, and where
 * it came from without relying on any surrounding page.
 */
export function postToMarkdown(post: Post): string {
  const { title, description, date, tags, tldr } = post.frontmatter;

  const format = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });

  const published = format(date);
  const modified = lastModified(post);

  const meta = [
    `${authorName} · ${published} · ${post.readingTime}`,
    modified !== date ? `Updated ${format(modified)}` : null,
    tags?.length ? `Topics: ${tags.join(", ")}` : null,
    `Source: ${postUrl(post.slug)}`,
  ].filter(Boolean);

  const parts = [
    `# ${title}`,
    `*${description}*`,
    meta.join("\n"),
  ];

  if (tldr?.length) {
    parts.push(`## TL;DR\n\n${tldr.map((item) => `- ${item}`).join("\n")}`);
  }

  parts.push("---", postBodyToMarkdown(post.content));
  parts.push("---", `From ${siteName} — ${siteUrl}`);

  return `${parts.join("\n\n")}\n`;
}
