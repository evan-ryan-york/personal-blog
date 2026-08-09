// One-off: copy the existing Resend contacts into the subscribers table,
// preserving their original signup dates.
//
//   node --env-file=.env.local scripts/backfill-subscribers.mjs
//
// Safe to re-run: existing emails are left untouched. Uses plain fetch rather
// than supabase-js, which needs a global WebSocket that Node 20 doesn't have.

const resendKey = process.env.RESEND_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_PRIVATE_KEY;

for (const [name, value] of Object.entries({
  RESEND_API_KEY: resendKey,
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
  SUPABASE_PRIVATE_KEY: secretKey,
})) {
  if (!value) {
    console.error(`Missing ${name}.`);
    process.exit(1);
  }
}

const contactsRes = await fetch("https://api.resend.com/contacts", {
  headers: { Authorization: `Bearer ${resendKey}` },
});

if (!contactsRes.ok) {
  console.error(`Resend returned ${contactsRes.status}: ${await contactsRes.text()}`);
  process.exit(1);
}

const { data: contacts, has_more: hasMore } = await contactsRes.json();

if (hasMore) {
  console.warn("Resend reports more contacts than one page — only the first page was read.");
}

const rows = contacts.map((contact) => ({
  email: contact.email.trim().toLowerCase(),
  source: "resend-backfill",
  resend_contact_id: contact.id,
  created_at: contact.created_at,
}));

const insertRes = await fetch(`${supabaseUrl}/rest/v1/subscribers?on_conflict=email`, {
  method: "POST",
  headers: {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
    Prefer: "resolution=ignore-duplicates,return=representation",
  },
  body: JSON.stringify(rows),
});

if (!insertRes.ok) {
  console.error(`Backfill failed (${insertRes.status}): ${await insertRes.text()}`);
  process.exit(1);
}

const inserted = await insertRes.json();

console.log(`${contacts.length} Resend contacts read, ${inserted.length} inserted.`);
for (const row of inserted) console.log(`  + ${row.email}`);
