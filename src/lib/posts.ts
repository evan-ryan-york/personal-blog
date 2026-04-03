import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  ogImage?: string;
  layout?: "custom";
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export function getAllPosts(): Post[] {
  const slugs = fs
    .readdirSync(postsDirectory)
    .filter((name) =>
      fs.statSync(path.join(postsDirectory, name)).isDirectory()
    );

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const postPath = path.join(postsDirectory, slug, "index.mdx");

  if (!fs.existsSync(postPath)) return null;

  const fileContents = fs.readFileSync(postPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: stats.text,
  };
}

export function getAllTags(): Map<string, number> {
  const posts = getAllPosts();
  const tags = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    }
  }

  return tags;
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.frontmatter.tags.includes(tag));
}

export function getMostRecentPost(): Post | null {
  const posts = getAllPosts();
  return posts[0] || null;
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
