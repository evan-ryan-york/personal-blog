"use client";

import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Try again.");
        setStatus("idle");
        return;
      }

      setPassword("");
      // Hard navigation: the bypass cookie has to be sent with a fresh
      // document request for the server to re-render anything cached.
      window.location.href = "/drafts";
    } catch {
      setError("Something went wrong. Try again.");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={status === "loading"}
        className="w-full rounded-md border border-paper-warm bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
        style={{ fontFamily: "var(--font-mono)" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {status === "loading" ? "..." : "Sign in"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
