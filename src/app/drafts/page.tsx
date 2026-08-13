import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDraftPosts } from "@/lib/posts";
import { isPreviewEnabled } from "@/lib/preview";
import { isGitHubPublishingConfigured } from "@/lib/githubPublisher";
import DraftBanner from "@/components/DraftBanner";
import PublishButton from "@/components/PublishButton";

export const metadata: Metadata = {
  title: "Drafts — Ryan York",
  robots: { index: false, follow: false },
};

// Never prerender: this page's contents depend entirely on who's asking.
export const dynamic = "force-dynamic";

export default async function DraftsPage() {
  if (!(await isPreviewEnabled())) notFound();

  const drafts = getDraftPosts();
  const publishingConfigured = isGitHubPublishingConfigured();

  return (
    <>
      <DraftBanner />
      <section className="px-6 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="mb-12">
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
              Drafts
            </h1>
            <p
              className="mt-2 text-sm text-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {drafts.length} unpublished {drafts.length === 1 ? "post" : "posts"}
            </p>
          </header>

          {drafts.length === 0 ? (
            <p className="text-sm text-muted">
              Nothing in progress. Add a post under{" "}
              <code>content/posts/</code> and it starts here.
            </p>
          ) : (
            <div className="space-y-10">
              {drafts.map((post) => (
                <article key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group block"
                  >
                    <div
                      className="mb-1 flex items-center gap-3 text-xs uppercase tracking-widest text-muted"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
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
                      <span className="text-paper-warm">/</span>
                      <span className="text-accent">{post.slug}</span>
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
                  </Link>
                  <PublishButton
                    slug={post.slug}
                    title={post.frontmatter.title}
                    configured={publishingConfigured}
                  />
                </article>
              ))}
            </div>
          )}

          <p className="mt-16 text-xs text-muted" style={{ lineHeight: 1.7 }}>
            Publishing commits the status change to <code>main</code>. Vercel
            then deploys the post automatically.
          </p>
        </div>
      </section>
    </>
  );
}
