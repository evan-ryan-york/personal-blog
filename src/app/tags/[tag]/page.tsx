import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { isPreviewEnabled } from "@/lib/preview";
import { generateTagJsonLd, jsonLdScript } from "@/lib/seo";
import { tagDescription, tagMetaDescription } from "@/lib/tags";
import { tagUrl } from "@/lib/site";
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
  const posts = getPostsByTag(decodedTag);
  const description = tagMetaDescription(decodedTag, posts.length);

  return {
    title: `${decodedTag}`,
    description,
    alternates: { canonical: tagUrl(decodedTag) },
    openGraph: {
      type: "website",
      title: `${decodedTag} — Ryan York`,
      description,
      url: tagUrl(decodedTag),
    },
  };
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const includeDrafts = await isPreviewEnabled();
  const posts = getPostsByTag(decodedTag, { includeDrafts });

  if (posts.length === 0) notFound();

  const intro = tagDescription(decodedTag);

  return (
    <section className="px-6 py-16 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          generateTagJsonLd(
            decodedTag,
            tagMetaDescription(decodedTag, posts.length),
            posts
          )
        )}
      />
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
          {/* The tag page used to be a heading and a list — nothing a search
              engine could rank or an assistant could quote. */}
          {intro && (
            <p
              className="mt-6 text-base text-ink/80"
              style={{ lineHeight: 1.8 }}
            >
              {intro}
            </p>
          )}
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
                  {post.status === "draft" && (
                    <span className="rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-medium normal-case text-white">
                      Draft
                    </span>
                  )}
                  <time dateTime={post.frontmatter.date}>
                    {new Date(post.frontmatter.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      }
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
