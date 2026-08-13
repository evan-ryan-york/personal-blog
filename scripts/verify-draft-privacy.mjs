import assert from "node:assert/strict";

const baseUrl = process.env.DRAFT_TEST_BASE_URL || "http://127.0.0.1:4317";
const password = process.env.DRAFT_TEST_PASSWORD;

if (!password) {
  throw new Error("DRAFT_TEST_PASSWORD is required.");
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
}

await assertPrivateResponse("/posts/seven-bets");
await assertPrivateResponse("/posts/seven-bets", {
  headers: { RSC: "1" },
});
await assertPrivateResponse("/drafts");

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

const rejectedLogin = await request("/api/preview", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password: `${password}-incorrect` }),
});
assert.equal(rejectedLogin.status, 401, "an incorrect password should be rejected");

const acceptedLogin = await request("/api/preview", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password }),
});
assert.equal(acceptedLogin.status, 200, "the author password should enable preview");

const setCookie = acceptedLogin.headers.get("set-cookie") || "";
const cookie = setCookie.split(";", 1)[0];
assert.match(cookie, /^__prerender_bypass=.+/, "preview should set an HTTP-only cookie");
assert.match(setCookie, /HttpOnly/i, "preview cookie should be HTTP-only");
assert.match(setCookie, /Secure/i, "preview cookie should be secure");

for (const path of ["/posts/seven-bets", "/drafts"]) {
  const response = await request(path, { headers: { Cookie: cookie } });
  assert.equal(response.status, 200, `${path} should be visible to the author`);
  assert.match(await response.text(), /Seven Bets/, `${path} should contain the draft`);
}

const authorAsset = await request("/api/draft-assets/seven-bets/hero.jpg", {
  headers: { Cookie: cookie },
});
assert.equal(authorAsset.status, 200, "the author should receive draft assets");
assert.equal(authorAsset.headers.get("content-type"), "image/jpeg");
assert.match(authorAsset.headers.get("cache-control") || "", /private/);
assert.match(authorAsset.headers.get("cache-control") || "", /no-store/);

const logout = await request("/api/preview", {
  method: "DELETE",
  headers: { Cookie: cookie },
});
assert.equal(logout.status, 200, "logout should succeed");
assert.match(
  logout.headers.get("set-cookie") || "",
  /__prerender_bypass=;/,
  "logout should clear the preview cookie"
);

await assertPrivateResponse("/posts/seven-bets");

console.log(`Draft privacy verified at ${baseUrl}.`);
