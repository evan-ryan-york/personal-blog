import type { Post } from "./posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ryanyork.io";

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
  theSeven,
  betHero,
  cynefinPlate,
  whyItMatters,
  fullArgument,
  closing,
  wagers,
  stripComponents,
  absolutizeLinks,
  collapseBlankLines,
];

export function postBodyToMarkdown(content: string): string {
  return RULES.reduce((source, rule) => rule(source), content);
}

/** The whole post as Markdown: title, byline, TL;DR, then the body. */
export function postToMarkdown(post: Post): string {
  const { title, description, date, tldr } = post.frontmatter;

  const published = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const parts = [
    `# ${title}`,
    `*${description}*`,
    `Ryan York · ${published} · ${post.readingTime}\n${siteUrl}/posts/${post.slug}`,
  ];

  if (tldr?.length) {
    parts.push(`## TL;DR\n\n${tldr.map((item) => `- ${item}`).join("\n")}`);
  }

  parts.push("---", postBodyToMarkdown(post.content));

  return `${parts.join("\n\n")}\n`;
}
