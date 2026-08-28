"use client";

import { useState } from "react";

/**
 * Shown only while previewing an unpublished post, so a draft is never
 * mistaken for the live thing.
 */
export default function DraftBanner() {
  const [leaving, setLeaving] = useState(false);

  async function exitPreview() {
    setLeaving(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } finally {
      window.location.href = "/";
    }
  }

  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-ink px-4 py-2 text-white"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span className="text-xs uppercase tracking-widest">
        Draft &mdash; visible only to you
      </span>
      <button
        onClick={exitPreview}
        disabled={leaving}
        className="shrink-0 rounded border border-white/40 px-2 py-1 text-xs uppercase tracking-widest transition-colors hover:bg-white/10 disabled:opacity-50"
      >
        {leaving ? "..." : "Exit preview"}
      </button>
    </div>
  );
}
