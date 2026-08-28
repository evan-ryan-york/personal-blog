import { NextResponse } from "next/server";
import { isAuthorSessionEnabled } from "@/lib/preview";
import { isSameOrigin } from "@/lib/sameOrigin";
import {
  MAX_ASSET_BYTES,
  isJournalConfigured,
  isSupportedImageType,
  saveAsset,
} from "@/lib/journal";

function unavailable() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

/**
 * Receives a screenshot pasted into the journal. The image arrives as a raw
 * body typed by its `Content-Type`, which keeps the client to a single fetch
 * with the blob straight off the clipboard.
 */
export async function POST(request: Request) {
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

  const mimeType = request.headers.get("content-type")?.split(";")[0]?.trim();
  if (!isSupportedImageType(mimeType)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 415 });
  }

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength === 0) {
    return NextResponse.json({ error: "Empty image." }, { status: 400 });
  }
  if (bytes.byteLength > MAX_ASSET_BYTES) {
    return NextResponse.json({ error: "That image is too large." }, { status: 413 });
  }

  const filename = await saveAsset(bytes, mimeType);
  if (!filename) {
    return NextResponse.json({ error: "Could not save the image." }, { status: 500 });
  }

  return NextResponse.json({ url: `/api/journal/assets/${filename}` }, { status: 201 });
}
