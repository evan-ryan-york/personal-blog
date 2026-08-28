import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "journal";

/** Extensions the journal accepts for pasted screenshots, and their types. */
const IMAGE_TYPES: Record<string, string> = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const EXTENSION_FOR_TYPE: Record<string, string> = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Screenshots are big; anything past this is a mistake, not a screenshot. */
export const MAX_ASSET_BYTES = 10 * 1024 * 1024;

/** Storage objects are `<uuid>.<ext>` — no user-controlled path segments. */
const SAFE_ASSET = /^[0-9a-f-]{36}\.(?:avif|gif|jpe?g|png|webp)$/;

export interface JournalEntry {
  entryDay: string;
  body: string;
  updatedAt: string;
}

interface JournalEntryRow {
  entry_day: string;
  body: string;
  updated_at: string;
}

/**
 * The journal needs the secret-key client: `journal_entries` has RLS on with no
 * policies, so the anon key cannot reach it at all. Without the key configured
 * the feature degrades to unavailable rather than throwing.
 */
export function isJournalConfigured(): boolean {
  return getSupabaseAdmin() !== null;
}

/**
 * Is this a real calendar day in `YYYY-MM-DD`? The day comes from the browser
 * (it must be the author's local day, not UTC's), so it is untrusted input.
 */
export function isValidEntryDay(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  // Round-tripping catches impossible dates like 2026-02-31, which `Date`
  // would otherwise silently roll forward into March.
  return new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);
}

function toEntry(row: JournalEntryRow): JournalEntry {
  return {
    entryDay: row.entry_day,
    body: row.body,
    updatedAt: row.updated_at,
  };
}

/** The most recent entries, newest first, for the journal's scrollback. */
export async function listEntries(limit = 30): Promise<JournalEntry[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("journal_entries")
    .select("entry_day, body, updated_at")
    .order("entry_day", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to list journal entries:", error.message);
    return [];
  }

  return (data as JournalEntryRow[]).map(toEntry);
}

export async function getEntry(entryDay: string): Promise<JournalEntry | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("journal_entries")
    .select("entry_day, body, updated_at")
    .eq("entry_day", entryDay)
    .maybeSingle();

  if (error) {
    console.error("Failed to read journal entry:", error.message);
    return null;
  }

  return data ? toEntry(data as JournalEntryRow) : null;
}

/**
 * Save the day's entry, creating it on first write. One row per day, so this is
 * an upsert on `entry_day` rather than an insert.
 */
export async function saveEntry(
  entryDay: string,
  body: string
): Promise<JournalEntry | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("journal_entries")
    .upsert(
      { entry_day: entryDay, body, updated_at: new Date().toISOString() },
      { onConflict: "entry_day" }
    )
    .select("entry_day, body, updated_at")
    .single();

  if (error) {
    console.error("Failed to save journal entry:", error.message);
    return null;
  }

  return toEntry(data as JournalEntryRow);
}

/**
 * Store a pasted screenshot and return its filename. The name is a fresh UUID,
 * never anything the client supplied, so nothing can escape the bucket.
 */
export async function saveAsset(
  bytes: ArrayBuffer,
  mimeType: string
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const extension = EXTENSION_FOR_TYPE[mimeType];
  if (!supabase || !extension) return null;

  const filename = `${randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, bytes, { contentType: mimeType, upsert: false });

  if (error) {
    console.error("Failed to upload journal asset:", error.message);
    return null;
  }

  return filename;
}

/**
 * Read a screenshot back out of the private bucket. Callers must have already
 * confirmed the author's session — this does no access checking of its own.
 */
export async function readAsset(
  filename: string
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase || !SAFE_ASSET.test(filename)) return null;

  const { data, error } = await supabase.storage.from(BUCKET).download(filename);
  if (error || !data) return null;

  const extension = filename.split(".").pop()!;
  return { bytes: await data.arrayBuffer(), contentType: IMAGE_TYPES[extension] };
}

export function isSupportedImageType(mimeType: unknown): mimeType is string {
  return typeof mimeType === "string" && mimeType in EXTENSION_FOR_TYPE;
}
