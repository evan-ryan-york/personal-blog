import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";
import { isAuthorSessionEnabled } from "@/lib/preview";
import { PublishError, publishPost } from "@/lib/githubPublisher";
import { isSameOrigin } from "@/lib/sameOrigin";

const SAFE_SLUG = /^[a-z0-9-]+$/;

function unavailable() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}


export async function POST(request: Request) {
  if (!(await isAuthorSessionEnabled())) return unavailable();

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let slug: unknown;
  try {
    ({ slug } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof slug !== "string" || !SAFE_SLUG.test(slug)) {
    return NextResponse.json({ error: "Invalid post." }, { status: 400 });
  }

  const post = getPostBySlug(slug);
  if (!post || post.status !== "draft") return unavailable();

  try {
    const published = await publishPost({
      slug,
      title: post.frontmatter.title,
    });

    return NextResponse.json({
      success: true,
      ...published,
      message: "Publishing started. Vercel will deploy the new commit shortly.",
    });
  } catch (error) {
    if (error instanceof PublishError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Publish failed:", error);
    return NextResponse.json(
      { error: "Something went wrong while publishing." },
      { status: 500 }
    );
  }
}
