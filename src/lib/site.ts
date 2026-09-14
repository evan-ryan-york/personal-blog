/**
 * One description of the site, its author, and where both live.
 *
 * Everything that needs to name Ryan, link the site, or state what it is about
 * reads it from here: metadata, JSON-LD, the sitemap, the feeds, `llms.txt`,
 * and the Markdown twins of each post. Before this existed the site URL was
 * re-derived from the environment in five files and the tagline was retyped in
 * four, which is how a site ends up describing itself differently depending on
 * which crawler asked.
 */

// www, not the apex: ryanyork.io 307s to www.ryanyork.io, so pointing the
// canonicals, feeds and JSON-LD ids at the apex sent every crawler through a
// redirect to reach the page they were already being told was canonical.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ryanyork.io";

export const siteName = "Ryan York";

/** The sentence the site leads with everywhere it introduces itself. */
export const siteTagline =
  "Writing about tech, product, politics, purpose, happiness, and education.";

/**
 * The longer version, for places that reward specificity over brevity — search
 * result descriptions, `llms.txt`, and the answer to "what is this site."
 */
export const siteDescription =
  "Essays by Ryan York on artificial intelligence, education, product, and politics — how technology reshapes work and learning, and who ends up sharing in what it creates.";

export const authorName = "Ryan York";
export const authorEmail = "ryan@ryanyork.io";
export const authorJobTitle = "Chief Product & Technology Officer";
export const authorOrg = { name: "Willow Education", url: "https://willowed.org" };

/**
 * Profiles that verifiably belong to the author. Search engines and LLMs use
 * these to resolve "Ryan York" to one person rather than guessing between the
 * several who share the name, so the list is only ever links he controls.
 */
export const authorProfiles = [
  "https://x.com/evan_ryan_york",
  "https://www.linkedin.com/in/ryan-york-148356a9/",
  "https://www.facebook.com/e.ryan.york",
  "https://www.instagram.com/e.ryan.york/",
  "https://soundcloud.com/ryan_york",
];

/** Subjects the author writes about, as entity-resolvable topic names. */
export const authorTopics = [
  "Artificial intelligence",
  "Education technology",
  "Product management",
  "Software engineering",
  "Public policy",
  "Economic mobility",
];

/** Stable JSON-LD node ids, so one page's graph references another's nodes. */
export const ids = {
  person: `${siteUrl}/#person`,
  website: `${siteUrl}/#website`,
  blog: `${siteUrl}/#blog`,
};

export function postUrl(slug: string): string {
  return `${siteUrl}/posts/${slug}`;
}

/** The Markdown twin of a post — see `src/app/api/posts/[slug]/markdown`. */
export function postMarkdownUrl(slug: string): string {
  return `${siteUrl}/posts/${slug}.md`;
}

export function tagUrl(tag: string): string {
  return `${siteUrl}/tags/${encodeURIComponent(tag)}`;
}
