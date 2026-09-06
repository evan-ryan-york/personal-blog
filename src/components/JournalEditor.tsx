"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";
import type { Editor } from "@tiptap/core";

/** How long typing has to pause before the entry is written back. */
const AUTOSAVE_DELAY_MS = 1200;

export interface JournalDaySummary {
  entryDay: string;
  preview: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * The author's local calendar day. Deliberately not UTC: an entry written at
 * 9pm Pacific belongs to that day, not to tomorrow.
 */
function localDay(date = new Date()): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** The local day never changes underneath us mid-session, so nothing to subscribe to. */
const subscribeToNothing = () => () => {};

function shiftDay(day: string, offset: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return localDay(new Date(year, month - 1, date + offset));
}

function formatDay(day: string): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ToolbarButton({
  label,
  isActive = false,
  onClick,
}: {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      // Keep focus in the document so the command applies to the selection.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded px-2 py-1 text-xs transition-colors ${
        isActive
          ? "bg-accent text-white"
          : "text-muted hover:bg-paper-warm hover:text-ink"
      }`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {label}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  // Subscribing to editor state is what makes the active states track the
  // cursor; reading `editor.isActive` directly would not re-render.
  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      bold: instance.isActive("bold"),
      italic: instance.isActive("italic"),
      code: instance.isActive("code"),
      h2: instance.isActive("heading", { level: 2 }),
      h3: instance.isActive("heading", { level: 3 }),
      bulletList: instance.isActive("bulletList"),
      orderedList: instance.isActive("orderedList"),
      blockquote: instance.isActive("blockquote"),
      codeBlock: instance.isActive("codeBlock"),
    }),
  });

  return (
    <div className="sticky top-0 z-10 -mx-2 mb-4 flex flex-wrap items-center gap-1 border-b border-paper-warm bg-paper/95 px-2 py-2 backdrop-blur">
      <ToolbarButton
        label="B"
        isActive={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="I"
        isActive={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="Code"
        isActive={state.code}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <span className="mx-1 h-4 w-px bg-paper-warm" />
      <ToolbarButton
        label="H2"
        isActive={state.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label="H3"
        isActive={state.h3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <span className="mx-1 h-4 w-px bg-paper-warm" />
      <ToolbarButton
        label="• List"
        isActive={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="1. List"
        isActive={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <span className="mx-1 h-4 w-px bg-paper-warm" />
      <ToolbarButton
        label="Quote"
        isActive={state.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        label="Block"
        isActive={state.codeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
    </div>
  );
}

export default function JournalEditor({
  recentDays,
}: {
  recentDays: JournalDaySummary[];
}) {
  // `localDay()` is a client-only value — reading it while rendering on the
  // server would bake the server's timezone into the markup. This returns null
  // on the server and the browser's day after hydration, which avoids both the
  // mismatch and a state-setting effect.
  const clientDay = useSyncExternalStore(
    subscribeToNothing,
    () => localDay(),
    () => null
  );
  // Only set when the author navigates away from today.
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const day = selectedDay ?? clientDay;
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [uploads, setUploads] = useState(0);
  const [error, setError] = useState("");
  // The current day's public link, mirrored from whatever the load returned.
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const editorRef = useRef<Editor | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The day the editor's current content belongs to. Read inside async saves so
  // an in-flight autosave can never write yesterday's text onto today's entry.
  const activeDay = useRef<string | null>(null);
  // Suppresses the autosave that would otherwise fire from programmatically
  // loading a day's content into the editor.
  const loading = useRef(false);

  const save = useCallback(async (targetDay: string, body: string) => {
    setSaveState("saving");
    try {
      const response = await fetch("/api/journal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryDay: targetDay, body }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setSaveState("error");
        setError(result.error || "Could not save.");
        return false;
      }

      setSaveState("saved");
      setError("");
      setSavedAt(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
      return true;
    } catch {
      setSaveState("error");
      setError("Could not save.");
      return false;
    }
  }, []);

  const queueSave = useCallback(
    (instance: Editor) => {
      if (loading.current || !activeDay.current) return;

      const targetDay = activeDay.current;
      const body = instance.getMarkdown();

      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void save(targetDay, body);
      }, AUTOSAVE_DELAY_MS);
    },
    [save]
  );

  const uploadImages = useCallback(async (files: File[]) => {
    setUploads((count) => count + files.length);

    for (const file of files) {
      try {
        const response = await fetch("/api/journal/assets", {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          setError(result.error || "Could not upload that image.");
          continue;
        }

        editorRef.current?.chain().focus().setImage({ src: result.url }).run();
      } catch {
        setError("Could not upload that image.");
      } finally {
        setUploads((count) => count - 1);
      }
    }
  }, []);

  /**
   * Publish the day at an unguessable URL.
   *
   * Flushes the pending autosave first: sharing is only defined for a day that
   * exists, and the author's mental model is "share what I'm looking at", not
   * "share whatever last reached the server".
   */
  const share = useCallback(async () => {
    const targetDay = activeDay.current;
    const instance = editorRef.current;
    if (!targetDay || !instance || sharing) return;

    setSharing(true);
    setCopied(false);
    try {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      if (!(await save(targetDay, instance.getMarkdown()))) return;

      const response = await fetch("/api/journal/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryDay: targetDay }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error || "Could not create a link.");
        return;
      }

      setError("");
      setShareToken(result.shareToken);
    } catch {
      setError("Could not create a link.");
    } finally {
      setSharing(false);
    }
  }, [save, sharing]);

  const unshare = useCallback(async () => {
    const targetDay = activeDay.current;
    if (!targetDay || sharing) return;

    setSharing(true);
    try {
      const response = await fetch("/api/journal/share", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryDay: targetDay }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setError(result.error || "Could not remove the link.");
        return;
      }

      setError("");
      setShareToken(null);
      setCopied(false);
    } catch {
      setError("Could not remove the link.");
    } finally {
      setSharing(false);
    }
  }, [sharing]);

  const editor = useEditor({
    // The page is server-rendered, so the editor must not render on the server.
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Markdown,
    ],
    content: "",
    // Stays read-only until a day's content has loaded, otherwise keystrokes
    // typed during that window are silently wiped by `setContent`.
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[55vh] focus:outline-none prose-headings:font-semibold prose-img:rounded-md prose-img:border prose-img:border-paper-warm",
      },
      handlePaste: (_view, event) => {
        const images = Array.from(event.clipboardData?.files ?? []).filter(
          (file) => file.type.startsWith("image/")
        );
        if (images.length === 0) return false;

        // A screenshot on the clipboard is the common case; let it win over
        // ProseMirror's default paste handling.
        event.preventDefault();
        void uploadImages(images);
        return true;
      },
      handleDrop: (_view, event) => {
        const images = Array.from(
          (event as DragEvent).dataTransfer?.files ?? []
        ).filter((file) => file.type.startsWith("image/"));
        if (images.length === 0) return false;

        event.preventDefault();
        void uploadImages(images);
        return true;
      },
    },
    onUpdate: ({ editor: instance }) => queueSave(instance),
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Load whichever day is selected, flushing any pending save for the day we
  // are leaving so switching days never drops the last keystrokes.
  useEffect(() => {
    if (!editor || !day) return;

    let cancelled = false;

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
      const previousDay = activeDay.current;
      if (previousDay && previousDay !== day) {
        void save(previousDay, editor.getMarkdown());
      }
    }

    loading.current = true;
    editor.setEditable(false);
    setSaveState("idle");
    setError("");
    setShareToken(null);
    setCopied(false);

    fetch(`/api/journal?day=${day}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (cancelled || !result) return;
        editor.commands.setContent(result.body || "", {
          contentType: "markdown",
          emitUpdate: false,
        });
        activeDay.current = day;
        setShareToken(result.shareToken ?? null);
        setSavedAt(null);
        editor.setEditable(true);
        editor.commands.focus("end");
      })
      .catch(() => {
        if (!cancelled) setError("Could not load that day.");
      })
      .finally(() => {
        if (!cancelled) loading.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [editor, day, save]);

  // A pending autosave must not die with the page. `keepalive` lets the request
  // outlive the document, so it reuses the same endpoint and CSRF check rather
  // than needing a beacon-shaped duplicate of it.
  useEffect(() => {
    function flush() {
      if (!saveTimer.current || !editorRef.current || !activeDay.current) return;
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
      void fetch("/api/journal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryDay: activeDay.current,
          body: editorRef.current.getMarkdown(),
        }),
        keepalive: true,
      });
    }

    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, []);

  // `window` is safe here: `shareToken` is only ever set by a client fetch, so
  // nothing that reads this renders on the server.
  const shareUrl = shareToken
    ? `${window.location.origin}/journal/shared/${shareToken}`
    : "";

  async function copyShareUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy — select the link and copy it by hand.");
    }
  }

  const today = day !== null && day === clientDay;
  const status =
    uploads > 0
      ? `Uploading ${uploads} image${uploads === 1 ? "" : "s"}…`
      : saveState === "saving"
        ? "Saving…"
        : saveState === "saved" && savedAt
          ? `Saved ${savedAt}`
          : "";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_14rem]">
      <div>
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => day && setSelectedDay(shiftDay(day, -1))}
              aria-label="Previous day"
              className="rounded px-2 py-1 text-sm text-muted transition-colors hover:bg-paper-warm hover:text-ink"
            >
              ‹
            </button>
            <h1
              className="text-xl font-bold tracking-tight md:text-2xl"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.02em",
              }}
            >
              {day ? formatDay(day) : "…"}
            </h1>
            <button
              type="button"
              onClick={() => day && setSelectedDay(shiftDay(day, 1))}
              aria-label="Next day"
              disabled={today}
              className="rounded px-2 py-1 text-sm text-muted transition-colors hover:bg-paper-warm hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ›
            </button>
            {!today && (
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="ml-1 rounded border border-paper-warm px-2 py-0.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Today
              </button>
            )}
          </div>
          <p
            className={`text-xs ${error ? "text-red-600" : "text-muted"}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {error || status}
          </p>
        </header>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {shareToken ? (
            <>
              <input
                readOnly
                value={shareUrl}
                onFocus={(event) => event.currentTarget.select()}
                aria-label="Public link to this entry"
                className="min-w-0 flex-1 rounded border border-paper-warm bg-paper-warm/40 px-2 py-1 text-xs text-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              />
              <button
                type="button"
                onClick={copyShareUrl}
                className="rounded border border-paper-warm px-2 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={unshare}
                disabled={sharing}
                className="rounded border border-paper-warm px-2 py-1 text-xs text-muted transition-colors hover:border-red-600 hover:text-red-600 disabled:opacity-50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Make private
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={share}
              disabled={sharing || !day}
              className="rounded border border-paper-warm px-2 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {sharing ? "Creating link…" : "Create public link"}
            </button>
          )}
        </div>

        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />

        <p
          className="mt-8 border-t border-paper-warm pt-4 text-xs text-muted/70"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Paste or drop a screenshot to add it. Saves as you type.
        </p>
      </div>

      <aside className="lg:border-l lg:border-paper-warm lg:pl-6">
        <h2
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Recent
        </h2>
        {recentDays.length === 0 ? (
          <p className="text-xs text-muted/70">No entries yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentDays.map((entry) => (
              <li key={entry.entryDay}>
                <button
                  type="button"
                  onClick={() => setSelectedDay(entry.entryDay)}
                  className={`block w-full text-left transition-colors hover:text-accent ${
                    entry.entryDay === day ? "text-accent" : "text-muted"
                  }`}
                >
                  <span
                    className="block text-xs"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {entry.entryDay}
                  </span>
                  <span className="block truncate text-xs text-muted/70">
                    {entry.preview || "—"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
