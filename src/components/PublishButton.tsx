"use client";

import { useState } from "react";

type PublishState = "idle" | "publishing" | "published" | "error";

export default function PublishButton({
  slug,
  title,
  configured,
}: {
  slug: string;
  title: string;
  configured: boolean;
}) {
  const [state, setState] = useState<PublishState>("idle");
  const [message, setMessage] = useState("");
  const [commitUrl, setCommitUrl] = useState<string | null>(null);

  async function publish() {
    const confirmed = window.confirm(
      `Publish “${title}”? This commits the post to main and starts a production deployment.`
    );
    if (!confirmed) return;

    setState("publishing");
    setMessage("");

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setState("error");
        setMessage(result.error || "Publishing failed. Try again.");
        return;
      }

      setState("published");
      setMessage(result.message || "Publishing started.");
      setCommitUrl(result.commitUrl || null);
    } catch {
      setState("error");
      setMessage("Publishing failed. Try again.");
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={publish}
        disabled={!configured || state === "publishing" || state === "published"}
        className="rounded-md bg-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {!configured
          ? "Publishing not configured"
          : state === "publishing"
            ? "Publishing…"
            : state === "published"
              ? "Publishing started"
              : "Publish"}
      </button>

      {message && (
        <p
          className={`text-xs ${state === "error" ? "text-red-600" : "text-muted"}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {message}
          {commitUrl && (
            <>
              {" "}
              <a
                href={commitUrl}
                target="_blank"
                rel="noreferrer"
                className="underline transition-colors hover:text-accent"
              >
                View commit
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}
