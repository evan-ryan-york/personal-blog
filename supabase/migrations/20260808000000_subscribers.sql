-- Newsletter subscribers captured by the site footer form.
-- Resend stays the sending system; this table is our own durable copy of the list.

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'site',
  resend_contact_id text,
  created_at timestamptz not null default now()
);

-- Emails are PII and the anon key ships to the browser, so no anon or
-- authenticated access at all. RLS on with zero policies means only the
-- secret key (server-side only) can read or write this table.
alter table public.subscribers enable row level security;
