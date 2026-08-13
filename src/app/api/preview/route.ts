import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { isAuthorAuthConfigured, verifyAuthorPassword } from "@/lib/authorAuth";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

// Best-effort throttle. Serverless means this is per-instance rather than
// global, but it still makes a naive guessing loop useless.
const attempts = new Map<string, { count: number; firstAt: number }>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function isLockedOut(key: string): boolean {
  const record = attempts.get(key);
  if (!record) return false;

  if (Date.now() - record.firstAt > LOCKOUT_MS) {
    attempts.delete(key);
    return false;
  }

  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const record = attempts.get(key);

  if (!record || Date.now() - record.firstAt > LOCKOUT_MS) {
    attempts.set(key, { count: 1, firstAt: Date.now() });
    return;
  }

  record.count += 1;
}

/** Sign in as the author: enables Draft Mode so drafts become visible. */
export async function POST(request: Request) {
  if (!isAuthorAuthConfigured()) {
    console.warn("AUTHOR_PASSWORD is not configured — preview is disabled.");
    return NextResponse.json(
      { error: "Preview is not configured." },
      { status: 503 }
    );
  }

  const key = clientKey(request);

  if (isLockedOut(key)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  let password: unknown;

  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!verifyAuthorPassword(password)) {
    recordFailure(key);
    return NextResponse.json(
      { error: "That password is not right." },
      { status: 401 }
    );
  }

  attempts.delete(key);

  const draft = await draftMode();
  draft.enable();

  return NextResponse.json({ success: true });
}

/** Sign out: drops the bypass cookie, so the site goes back to public. */
export async function DELETE() {
  const draft = await draftMode();
  draft.disable();

  return NextResponse.json({ success: true });
}
