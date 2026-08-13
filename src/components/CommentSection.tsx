"use client";

import { useState, useEffect, type FormEvent } from "react";

interface Comment {
  id: string;
  post_slug: string;
  parent_id: string | null;
  author_name: string;
  body: string;
  created_at: string;
}

async function loadComments(slug: string): Promise<Comment[] | null> {
  try {
    const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
    return res.ok ? await res.json() : null;
  } catch {
    // Comments are non-critical, so a failed refresh leaves the current list.
    return null;
  }
}

function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function CommentForm({
  slug,
  parentId,
  onSuccess,
  onCancel,
  autoFocus,
}: {
  slug: string;
  parentId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_slug: slug,
          parent_id: parentId || null,
          author_name: name,
          body,
        }),
      });

      if (res.ok) {
        setName("");
        setBody("");
        setStatus("idle");
        onSuccess();
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={status === "loading"}
        autoFocus={autoFocus}
        maxLength={100}
        className="w-full rounded-md border border-paper-warm bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
        style={{ fontFamily: "var(--font-mono)" }}
      />
      <textarea
        required
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={status === "loading"}
        maxLength={2000}
        rows={parentId ? 2 : 3}
        className="w-full resize-none rounded-md border border-paper-warm bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
        style={{ fontFamily: "var(--font-mono)" }}
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-50"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {status === "loading" ? "..." : parentId ? "Reply" : "Comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm text-muted transition-colors hover:text-ink"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Cancel
          </button>
        )}
      </div>
      {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
    </form>
  );
}

function CommentThread({
  comment,
  replies,
  allComments,
  slug,
  depth,
  onReplySuccess,
}: {
  comment: Comment;
  replies: Comment[];
  allComments: Comment[];
  slug: string;
  depth: number;
  onReplySuccess: () => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const canReply = depth < 2;

  const childReplies = (childId: string) =>
    allComments.filter((c) => c.parent_id === childId);

  return (
    <div className={depth > 0 ? "ml-6 border-l border-paper-warm pl-4" : ""}>
      <div className="py-3">
        <div
          className="mb-1 flex items-center gap-2 text-xs text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span
            className="font-semibold text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {comment.author_name}
          </span>
          <span className="text-paper-warm">/</span>
          <time dateTime={comment.created_at}>{timeAgo(comment.created_at)}</time>
        </div>
        <p className="text-sm leading-relaxed text-ink whitespace-pre-wrap">
          {comment.body}
        </p>
        {canReply && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-1 text-xs text-muted transition-colors hover:text-accent"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {showReplyForm ? "Cancel" : "Reply"}
          </button>
        )}
        {showReplyForm && (
          <div className="mt-3">
            <CommentForm
              slug={slug}
              parentId={comment.id}
              autoFocus
              onSuccess={() => {
                setShowReplyForm(false);
                onReplySuccess();
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>
      {replies.map((reply) => (
        <CommentThread
          key={reply.id}
          comment={reply}
          replies={childReplies(reply.id)}
          allComments={allComments}
          slug={slug}
          depth={depth + 1}
          onReplySuccess={onReplySuccess}
        />
      ))}
    </div>
  );
}

export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchComments() {
    const nextComments = await loadComments(slug);
    if (nextComments) setComments(nextComments);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    loadComments(slug).then((nextComments) => {
      if (cancelled) return;
      if (nextComments) setComments(nextComments);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  return (
    <section className="mt-16 border-t border-paper-warm pt-8">
      <h2
        className="mb-6 text-lg font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Comments{comments.length > 0 && ` (${comments.length})`}
      </h2>

      {loading ? (
        <p
          className="text-sm text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Loading comments...
        </p>
      ) : (
        <>
          {topLevel.length > 0 ? (
            <div className="mb-8 divide-y divide-paper-warm">
              {topLevel.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  replies={getReplies(comment.id)}
                  allComments={comments}
                  slug={slug}
                  depth={0}
                  onReplySuccess={fetchComments}
                />
              ))}
            </div>
          ) : (
            <p className="mb-8 text-sm text-muted">
              No comments yet. Be the first!
            </p>
          )}

          <CommentForm slug={slug} onSuccess={fetchComments} />
        </>
      )}
    </section>
  );
}
