-- Public share links for individual journal days.
--
-- The journal stays private by default: `journal_entries` keeps RLS on with no
-- policies, so nothing here loosens what the browser's anon key can reach. A
-- share link is an *unguessable capability* — 32 base64url characters minted by
-- the author — that the server trades for exactly one day's row. Revoking is
-- setting the column back to null, which invalidates the URL immediately.

alter table public.journal_entries
  add column if not exists share_token text unique,
  add column if not exists shared_at timestamptz;
