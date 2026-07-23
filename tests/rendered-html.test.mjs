import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://xeno.test/", {
      headers: {
        accept: "text/html",
        host: "xeno.test",
        "x-forwarded-host": "xeno.test",
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

test("server-renders the observatory shell and site metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Xenobiology Observatory/);
  assert.match(html, /I build digital/);
  assert.match(html, /Selected transmissions/);
  assert.match(html, /Send a signal/);
  assert.match(
    html,
    /<meta[^>]+property="og:image"[^>]+content="https:\/\/xeno\.test\/og\.png"/i,
  );
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
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
