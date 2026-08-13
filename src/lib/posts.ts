import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostStatus = "published" | "draft" | "unlisted";

/**
 * A post is a draft until it says otherwise. Anything without an explicit
 * `status: "published"` (or `"unlisted"`) stays invisible to the public, so a
 * new post can never leak by forgetting a frontmatter field.
 */
export function resolveStatus(frontmatter: PostFrontmatter): PostStatus {
  return frontmatter.status === "published" ||
    frontmatter.status === "unlisted"
    ? frontmatter.status
    : "draft";
}

export interface PostQuery {
  /**
   * Include drafts in the results. Only ever true for the authenticated
   * author preview — see `isPreviewEnabled()` in `@/lib/preview`.
   */
  includeDrafts?: boolean;
}

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  ogImage?: string;
  layout?: "custom";
  status?: PostStatus;
  /** Short summary bullets, shown above the post and included in its Markdown. */
  tldr?: string[];
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  /** Frontmatter status, resolved — drafts included. */
  status: PostStatus;
  content: string;
  readingTime: string;
}

function readAllPosts(): Post[] {
  const slugs = fs
    .readdirSync(postsDirectory)
    .filter((name) =>
      fs.statSync(path.join(postsDirectory, name)).isDirectory()
    );

  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

/** Posts for indexes and feeds. Unlisted posts are reachable but never listed. */
export function getAllPosts({ includeDrafts = false }: PostQuery = {}): Post[] {
  return readAllPosts().filter(
    (post) =>
      post.status === "published" || (includeDrafts && post.status === "draft")
  );
}

/** Slugs the public can reach directly. Drafts are served on demand instead. */
export function getPublicPostSlugs(): string[] {
  return readAllPosts()
    .filter((post) => post.status !== "draft")
    .map((post) => post.slug);
}

/** Unpublished posts, newest first — for the author's drafts index. */
export function getDraftPosts(): Post[] {
  return readAllPosts().filter((post) => post.status === "draft");
}

export function getPostBySlug(slug: string): Post | null {
  const postPath = path.join(postsDirectory, slug, "index.mdx");

  if (!fs.existsSync(postPath)) return null;

  const fileContents = fs.readFileSync(postPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);
  const frontmatter = data as PostFrontmatter;

  return {
    slug,
    frontmatter,
    status: resolveStatus(frontmatter),
    content,
    readingTime: stats.text,
  };
}

export function getAllTags(query: PostQuery = {}): Map<string, number> {
  const posts = getAllPosts(query);
  const tags = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    }
  }

  return tags;
}

export function getPostsByTag(tag: string, query: PostQuery = {}): Post[] {
  return getAllPosts(query).filter((post) =>
    post.frontmatter.tags.includes(tag)
  );
}

export function getMostRecentPost(query: PostQuery = {}): Post | null {
  return getAllPosts(query)[0] || null;
}

export function postHasCustomLayout(slug: string): boolean {
  return fs.existsSync(
    path.join(postsDirectory, slug, "layout.tsx")
  );
}

export function postHasComponents(slug: string): boolean {
  const componentsDir = path.join(postsDirectory, slug, "components");
  return (
    fs.existsSync(componentsDir) &&
    fs.statSync(componentsDir).isDirectory()
  );
}
