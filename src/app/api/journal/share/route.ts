import { NextResponse } from "next/server";
import { isAuthorSessionEnabled } from "@/lib/preview";
import { isSameOrigin } from "@/lib/sameOrigin";
import {
  isJournalConfigured,
  isValidEntryDay,
  shareEntry,
  unshareEntry,
} from "@/lib/journal";

function unavailable() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

/**
 * Both handlers mutate who can read a day, so they hold to the same bar as
 * saving one: a verified Supabase session, not merely Draft Mode, plus the
 * same-origin check that keeps the cookie from being spent by another site.
 */
async function authorize(request: Request) {
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

  return null;
}

async function readEntryDay(request: Request): Promise<string | null> {
  try {
    const { entryDay } = ((await request.json()) ?? {}) as { entryDay?: unknown };
    return isValidEntryDay(entryDay) ? entryDay : null;
  } catch {
    return null;
  }
}

/** Mint (or re-hand-back) the day's public link. */
export async function POST(request: Request) {
  const denied = await authorize(request);
  if (denied) return denied;

  const entryDay = await readEntryDay(request);
  if (!entryDay) {
    return NextResponse.json({ error: "Invalid day." }, { status: 400 });
  }

  const shareToken = await shareEntry(entryDay);
  if (!shareToken) {
    return NextResponse.json(
      { error: "Write something first — there's nothing to share yet." },
      { status: 409 }
    );
  }

  return NextResponse.json({ shareToken, path: `/journal/shared/${shareToken}` });
}

/** Revoke it. The URL stops resolving immediately. */
export async function DELETE(request: Request) {
  const denied = await authorize(request);
  if (denied) return denied;

  const entryDay = await readEntryDay(request);
  if (!entryDay) {
    return NextResponse.json({ error: "Invalid day." }, { status: 400 });
  }

  if (!(await unshareEntry(entryDay))) {
    return NextResponse.json({ error: "Could not remove the link." }, { status: 500 });
  }

  return NextResponse.json({ shareToken: null });
}
