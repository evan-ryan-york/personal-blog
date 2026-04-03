import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import type { Metadata } from "next";

type Params = Promise<{ tag: string }>;

export async function generateStaticParams() {
  const tags = getAllTags();
  return Array.from(tags.keys()).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Posts tagged "${decodedTag}" — Ryan York`,
    description: `All posts about ${decodedTag}.`,
  };
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) notFound();

  return (
    <section className="px-6 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="animate-fade-up mb-12">
          <Link
            href="/"
            className="mb-4 inline-block text-sm font-medium tracking-tight text-muted transition-colors hover:text-accent"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ryan York
          </Link>
          <h1
            className="text-3xl font-bold tracking-tight md:text-4xl"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
            }}
          >
            {decodedTag}
          </h1>
          <p className="mt-2 text-sm text-muted" style={{ fontFamily: "var(--font-mono)" }}>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </header>

        <div className="space-y-10">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className={`animate-fade-up delay-${i + 1} group block`}
            >
              <article>
                <div
                  className="mb-1 flex items-center gap-3 text-xs uppercase tracking-widest text-muted"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <time dateTime={post.frontmatter.date}>
                    {new Date(post.frontmatter.date).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                  <span className="text-paper-warm">/</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2
                  className="mb-1 text-xl font-bold tracking-tight transition-colors group-hover:text-accent"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {post.frontmatter.title}
                </h2>
                <p className="text-muted" style={{ lineHeight: 1.6 }}>
                  {post.frontmatter.description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
