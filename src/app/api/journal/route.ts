import { NextResponse } from "next/server";
import { isAuthorSessionEnabled, isPreviewEnabled } from "@/lib/preview";
import { isSameOrigin } from "@/lib/sameOrigin";
import {
  getEntry,
  isJournalConfigured,
  isValidEntryDay,
  saveEntry,
} from "@/lib/journal";

/** A day's entry is prose, not a document store. This is a sanity ceiling. */
const MAX_BODY_CHARS = 200_000;

function unavailable() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

/**
 * Load one day's entry. Which day is "today" depends on the author's timezone,
 * which the server does not know, so the client decides and asks for it here
 * rather than the page guessing at render time.
 */
export async function GET(request: Request) {
  if (!(await isPreviewEnabled())) return unavailable();

  const day = new URL(request.url).searchParams.get("day");
  if (!isValidEntryDay(day)) {
    return NextResponse.json({ error: "Invalid day." }, { status: 400 });
  }

  const entry = await getEntry(day);
  return NextResponse.json({
    entryDay: day,
    body: entry?.body ?? "",
    updatedAt: entry?.updatedAt ?? null,
    // Carried on the load so the Share control shows the day's real state as
    // the author pages back and forth, without a second round trip per day.
    shareToken: entry?.shareToken ?? null,
  });
}

export async function PUT(request: Request) {
  // Mutations require a real password-backed session. `isPreviewEnabled()`
  // would be wrong here: it returns true unconditionally in development.
  if (!(await isAuthorSessionEnabled())) return unavailable();

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!isJournalConfigured()) {
    return NextResponse.json(
      { error: "The journal is not configured yet." },
      { status: 503 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { entryDay, body } = (payload ?? {}) as {
    entryDay?: unknown;
    body?: unknown;
  };

  if (!isValidEntryDay(entryDay)) {
    return NextResponse.json({ error: "Invalid day." }, { status: 400 });
  }

  if (typeof body !== "string" || body.length > MAX_BODY_CHARS) {
    return NextResponse.json({ error: "Invalid entry." }, { status: 400 });
  }

  const saved = await saveEntry(entryDay, body);
  if (!saved) {
    return NextResponse.json({ error: "Could not save the entry." }, { status: 500 });
  }

  return NextResponse.json({ updatedAt: saved.updatedAt });
}
