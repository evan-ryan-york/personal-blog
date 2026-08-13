"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);

    try {
      await fetch("/api/preview", { method: "DELETE" });
    } finally {
      window.location.href = "/";
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loggingOut}
      className="rounded border border-paper-warm px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {loggingOut ? "Logging out..." : "Log out"}
    </button>
  );
}
