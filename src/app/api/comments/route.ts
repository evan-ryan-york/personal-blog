import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabase } from "@/lib/supabase";

let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic();
  return _anthropic;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "slug query parameter is required." },
      { status: 400 }
    );
  }

  const { data, error } = await getSupabase()
    .from("comments")
    .select("*")
    .eq("post_slug", slug)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { error: "Failed to load comments." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { post_slug, parent_id, author_name, body: commentBody } = body;

    if (!post_slug || typeof post_slug !== "string") {
      return NextResponse.json(
        { error: "post_slug is required." },
        { status: 400 }
      );
    }

    const trimmedName = (author_name ?? "").trim();
    const trimmedBody = (commentBody ?? "").trim();

    if (!trimmedName || trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Name is required and must be under 100 characters." },
        { status: 400 }
      );
    }

    if (!trimmedBody || trimmedBody.length > 2000) {
      return NextResponse.json(
        { error: "Comment is required and must be under 2000 characters." },
        { status: 400 }
      );
    }

    // Moderate with Claude before inserting
    const moderation = await getAnthropic().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 16,
      messages: [
        {
          role: "user",
          content: `You are a comment moderator. Decide if this blog comment should be ALLOWED or REJECTED. Reject spam, hate speech, harassment, gibberish, or promotional content. Reply with exactly one word: ALLOWED or REJECTED.

Name: ${trimmedName}
Comment: ${trimmedBody}`,
        },
      ],
    });

    const verdict =
      moderation.content[0].type === "text"
        ? moderation.content[0].text.trim().toUpperCase()
        : "";

    if (verdict !== "ALLOWED") {
      return NextResponse.json(
        {
          error:
            "Your comment doesn't meet our quality standards and will not be posted.",
        },
        { status: 422 }
      );
    }

    const { data, error } = await getSupabase()
      .from("comments")
      .insert({
        post_slug,
        parent_id: parent_id || null,
        author_name: trimmedName,
        body: trimmedBody,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to insert comment:", error);
      return NextResponse.json(
        { error: "Failed to post comment." },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
