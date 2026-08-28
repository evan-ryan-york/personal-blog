import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { isAuthorAuthConfigured } from "@/lib/authorAuth";
import { createRouteSupabase } from "@/lib/supabaseServer";

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

/**
 * Sign in as the author.
 *
 * Two cookies come out of a successful sign-in: Supabase's session, which is
 * the identity and outlives both browser restarts and deploys, and Draft Mode's
 * bypass, which is what actually makes drafts render. See `@/lib/preview`.
 */
export async function POST(request: Request) {
  if (!isAuthorAuthConfigured()) {
    console.warn("Supabase auth or AUTHOR_EMAIL is not configured — sign-in is disabled.");
    return NextResponse.json(
      { error: "Sign-in is not configured." },
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

  let email: unknown;
  let password: unknown;

  try {
    ({ email, password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // One message for every failure, so this never becomes an oracle for which
  // half was wrong — or for whether the author's address is what you guessed.
  const rejected = NextResponse.json(
    { error: "Those credentials are not right." },
    { status: 401 }
  );

  // Checked before Supabase sees anything, so a stray account on the project
  // cannot spend our rate limit or Supabase's on a sign-in that can never pass.
  if (email.trim().toLowerCase() !== process.env.AUTHOR_EMAIL!.toLowerCase()) {
    recordFailure(key);
    return rejected;
  }

  const supabase = await createRouteSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    recordFailure(key);
    return rejected;
  }

  attempts.delete(key);

  const draft = await draftMode();
  draft.enable();

  return NextResponse.json({ success: true });
}

/** Sign out: drops both cookies, so the site goes back to public. */
export async function DELETE() {
  if (isAuthorAuthConfigured()) {
    const supabase = await createRouteSupabase();
    await supabase.auth.signOut();
  }

  const draft = await draftMode();
  draft.disable();

  return NextResponse.json({ success: true });
}
