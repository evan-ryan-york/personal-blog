import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";
import { isAuthorSessionEnabled } from "@/lib/preview";
import { PublishError, publishPost } from "@/lib/githubPublisher";

const SAFE_SLUG = /^[a-z0-9-]+$/;

function unavailable() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const requestUrl = new URL(request.url);
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    requestUrl.protocol.replace(/:$/, "");
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    requestUrl.host;

  return origin === `${protocol}://${host}`;
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
