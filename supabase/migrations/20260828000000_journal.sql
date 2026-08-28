-- Daily developer journal: one entry per calendar day, private to the author.
--
-- This table holds unpublished, in-progress thinking about work that isn't
-- announced yet, so it is at least as sensitive as `subscribers`. It follows the
-- same rule: RLS on with zero policies, meaning the anon key that ships to the
-- browser can neither read nor write it. Every access goes through the server
-- with the secret key, behind the author's Draft Mode session.

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  -- The author's *local* calendar day, decided by the browser. Journaling at
  -- 9pm Pacific must land on that day, not on UTC's tomorrow.
  entry_day date not null unique,
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journal_entries_entry_day_idx
  on public.journal_entries (entry_day desc);

alter table public.journal_entries enable row level security;

-- Screenshots pasted into entries. Private bucket: no public URL exists, and
-- reads are proxied by /api/journal/assets/[filename] behind the same session
-- check. `public = false` is the load-bearing column here.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'journal',
  'journal',
  false,
  10485760, -- 10MB, matching MAX_ASSET_BYTES in src/lib/journal.ts
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
