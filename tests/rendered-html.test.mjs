import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${pathname}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(pathname, "https://portfolio.test"), {
      headers: {
        accept: "text/html",
        host: "portfolio.test",
        "x-forwarded-host": "portfolio.test",
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Josh McLain's portfolio and site metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Josh McLain/);
  assert.match(html, /I build web/);
  assert.match(html, /Selected builds/);
  assert.match(html, /Send a signal/);
  assert.match(html, /me@joshmclain\.com/);
  assert.match(html, /github\.com\/daemon-node-byte/);
  assert.match(html, /linkedin\.com\/in\/joshmclain45/);
  assert.match(html, /crispy-happiness-gilt\.vercel\.app/);
  assert.match(html, /react-icons|Source code/i);
  assert.match(
    html,
    /<meta[^>]+property="og:image"[^>]+content="https:\/\/portfolio\.test\/og\.png"/i,
  );
  assert.doesNotMatch(
    html,
    /Xenobiology Observatory|hello@xenobiology|codex-preview|Your site is taking shape/i,
  );
});

test("renders every navigation destination as a semantic section", async () => {
  const [html, css] = await Promise.all([
    render().then((response) => response.text()),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  for (const sectionId of ["origin", "about", "projects", "notes", "contact"]) {
    assert.match(html, new RegExp(`<section[^>]+id="${sectionId}"`, "i"));
  }

  assert.match(html, /Skip cinematic introduction/);
  assert.match(css, /prefers-reduced-motion/);
});

test("builds the field-notes index and dynamic article routes from Markdown", async () => {
  const slugs = [
    "designing-interfaces-that-feel-discovered",
    "the-useful-friction-of-unfamiliar-worlds",
    "light-as-an-interaction-material",
  ];
  const indexResponse = await render("/field-notes");
  assert.equal(indexResponse.status, 200);
  const indexHtml = await indexResponse.text();

  for (const slug of slugs) {
    assert.match(indexHtml, new RegExp(`/field-notes/${slug}`));
    const articleResponse = await render(`/field-notes/${slug}`);
    assert.equal(articleResponse.status, 200);
    const articleHtml = await articleResponse.text();
    assert.match(articleHtml, /All field notes/);
    assert.match(articleHtml, /Josh McLain/);
  }

  assert.match(indexHtml, /Notes from/);
  assert.match(indexHtml, /Designing interfaces that feel discovered/);
});

test("ships paired 2K surface and terrain maps for every world and moon", async () => {
  const worlds = [
    "signal",
    "virelia",
    "khepri",
    "calyx",
    "nox",
    "signal-moon",
    "khepri-moon",
  ];

  for (const world of worlds) {
    const [albedo, height] = await Promise.all([
      stat(
        new URL(
          `../public/textures/planets/${world}-albedo.jpg`,
          import.meta.url,
        ),
      ),
      stat(
        new URL(
          `../public/textures/planets/${world}-height.jpg`,
          import.meta.url,
        ),
      ),
    ]);

    assert.ok(albedo.size > 100_000, `${world} albedo map is unexpectedly small`);
    assert.ok(height.size > 100_000, `${world} height map is unexpectedly small`);
  }
});

test("renders planetary rings with banded shader material and volumetric dust", async () => {
  const [planetSource, ringSource] = await Promise.all([
    readFile(new URL("../app/scene/Planet.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/scene/RingSystem.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(planetSource, /<RingSystem/);
  assert.doesNotMatch(planetSource, /emissiveIntensity=\{0\.18\}/);
  assert.match(ringSource, /broadBands/);
  assert.match(ringSource, /planetaryShadow/);
  assert.match(ringSource, /<points ref=\{dustRef\}>/);
  assert.match(ringSource, /depthWrite=\{false\}/);
});
