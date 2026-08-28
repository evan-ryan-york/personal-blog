import assert from "node:assert/strict";

const baseUrl = process.env.DRAFT_TEST_BASE_URL || "http://127.0.0.1:4317";
const email = process.env.DRAFT_TEST_EMAIL;
const password = process.env.DRAFT_TEST_PASSWORD;

if (!email || !password) {
  throw new Error("DRAFT_TEST_EMAIL and DRAFT_TEST_PASSWORD are required.");
}

const privateMarkers = [
  "Seven Bets",
  "Where AI takes software",
  "Everyone is betting on how AI reshapes the world",
  "Software stops waiting for us",
];

async function request(path, init) {
  return fetch(new URL(path, baseUrl), { redirect: "manual", ...init });
}

/**
 * Signing in now sets several cookies — Supabase's session, chunked across as
 * many `sb-…-auth-token` cookies as the token needs, plus Draft Mode's bypass —
 * so the author's identity is a jar, not a single header.
 */
function collectCookies(response, jar = new Map()) {
  for (const header of response.headers.getSetCookie()) {
    const [pair] = header.split(";", 1);
    const separator = pair.indexOf("=");
    jar.set(pair.slice(0, separator).trim(), pair.slice(separator + 1));
  }
  return jar;
}

function cookieHeader(jar) {
  return [...jar]
    .filter(([, value]) => value !== "")
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

async function signIn(credentials) {
  return request("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

async function assertPrivateResponse(path, init) {
  const response = await request(path, init);
  assert.equal(response.status, 404, `${path} should return 404 anonymously`);
  const body = await response.text();

  for (const marker of privateMarkers) {
    assert.equal(
      body.includes(marker),
      false,
      `${path} leaked private marker: ${marker}`
    );
  }
}

async function assertPublicSurfaceClean(path) {
  const response = await request(path);
  assert.equal(response.status, 200, `${path} should remain public`);
  const body = await response.text();

  for (const marker of ["Seven Bets", "seven-bets"]) {
    assert.equal(body.includes(marker), false, `${path} listed the draft`);
  }

  if (path === "/") {
    assert.match(body, /href="\/login"/, "the public footer should link to login");
    assert.doesNotMatch(
      body,
      /href="\/drafts"/,
      "the public footer should not link to drafts"
    );
  }
}

await assertPrivateResponse("/posts/seven-bets");
await assertPrivateResponse("/posts/seven-bets", {
  headers: { RSC: "1" },
});
await assertPrivateResponse("/drafts");
await assertPrivateResponse("/journal");

// The journal holds unpublished thinking, so every one of its surfaces has to
// be invisible anonymously — the page, both mutations, and the asset proxy.
const journalOrigin = new URL(baseUrl).origin;
const anonymousJournalRequests = [
  ["/api/journal?day=2026-01-01", {}],
  [
    "/api/journal",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Origin: journalOrigin },
      body: JSON.stringify({ entryDay: "2026-01-01", body: "leak" }),
    },
  ],
  [
    "/api/journal/assets",
    {
      method: "POST",
      headers: { "Content-Type": "image/png", Origin: journalOrigin },
      body: "not-an-image",
    },
  ],
  ["/api/journal/assets/00000000-0000-4000-8000-000000000000.png", {}],
];

for (const [path, init] of anonymousJournalRequests) {
  const response = await request(path, init);
  assert.equal(response.status, 404, `${path} should be invisible anonymously`);
}


const anonymousPublish = await request("/api/publish", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: new URL(baseUrl).origin,
  },
  body: JSON.stringify({ slug: "seven-bets" }),
});
assert.equal(
  anonymousPublish.status,
  404,
  "publishing should be invisible without an author session"
);

for (const assetPath of [
  "/posts/seven-bets/hero.jpg",
  "/api/draft-assets/seven-bets/hero.jpg",
  "/api/draft-assets/seven-bets/bet-a.webp",
]) {
  const response = await request(assetPath);
  assert.equal(response.status, 404, `${assetPath} should be private`);
}

for (const path of ["/", "/tags/AI", "/feed.xml", "/sitemap.xml"]) {
  await assertPublicSurfaceClean(path);
}

const rejectedPassword = await signIn({
  email,
  password: `${password}-incorrect`,
});
assert.equal(rejectedPassword.status, 401, "an incorrect password should be rejected");

// The password alone is not the credential any more: it has to belong to
// AUTHOR_EMAIL, so a valid account on the same project still gets nowhere.
const rejectedEmail = await signIn({ email: `someone-else+${email}`, password });
assert.equal(rejectedEmail.status, 401, "a non-author email should be rejected");

const acceptedLogin = await signIn({ email, password });
assert.equal(acceptedLogin.status, 200, "the author credentials should sign in");

const jar = collectCookies(acceptedLogin);
const cookie = cookieHeader(jar);
assert.ok(jar.has("__prerender_bypass"), "signing in should enable draft mode");
assert.ok(
  [...jar.keys()].some((name) => name.startsWith("sb-")),
  "signing in should set a Supabase session cookie"
);

for (const header of acceptedLogin.headers.getSetCookie()) {
  assert.match(header, /HttpOnly/i, `${header.split("=", 1)[0]} should be HTTP-only`);
  assert.match(header, /Secure/i, `${header.split("=", 1)[0]} should be secure`);
}

for (const path of ["/posts/seven-bets", "/drafts"]) {
  const response = await request(path, { headers: { Cookie: cookie } });
  assert.equal(response.status, 200, `${path} should be visible to the author`);
  assert.match(await response.text(), /Seven Bets/, `${path} should contain the draft`);
}

const authorJournal = await request("/journal", { headers: { Cookie: cookie } });
assert.equal(authorJournal.status, 200, "the journal should be visible to the author");

const authorHome = await request("/", { headers: { Cookie: cookie } });
assert.equal(authorHome.status, 200, "the homepage should remain available to the author");
const authorHomeBody = await authorHome.text();
assert.match(
  authorHomeBody,
  /href="\/drafts"/,
  "the authenticated footer should link to drafts"
);
assert.doesNotMatch(
  authorHomeBody,
  /href="\/login"/,
  "the authenticated footer should replace login with drafts"
);

const authorAsset = await request("/api/draft-assets/seven-bets/hero.jpg", {
  headers: { Cookie: cookie },
});
assert.equal(authorAsset.status, 200, "the author should receive draft assets");
assert.equal(authorAsset.headers.get("content-type"), "image/jpeg");
assert.match(authorAsset.headers.get("cache-control") || "", /private/);
assert.match(authorAsset.headers.get("cache-control") || "", /no-store/);

const logout = await request("/api/auth", {
  method: "DELETE",
  headers: { Cookie: cookie },
});
assert.equal(logout.status, 200, "logout should succeed");

const clearedJar = collectCookies(logout, new Map(jar));
assert.equal(
  clearedJar.get("__prerender_bypass"),
  "",
  "logout should clear the preview cookie"
);
for (const [name, value] of clearedJar) {
  if (name.startsWith("sb-")) {
    assert.equal(value, "", `logout should clear ${name}`);
  }
}

await assertPrivateResponse("/posts/seven-bets");

console.log(`Draft privacy verified at ${baseUrl}.`);
