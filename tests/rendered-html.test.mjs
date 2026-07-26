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
  const [html, css, experienceSource] = await Promise.all([
    render().then((response) => response.text()),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(
      new URL("../app/components/StellarExperience.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  for (const sectionId of ["origin", "about", "projects", "notes", "contact"]) {
    assert.match(html, new RegExp(`<section[^>]+id="${sectionId}"`, "i"));
  }

  assert.match(html, /Skip cinematic introduction/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /scroll-snap-type:\s*y mandatory/);
  assert.match(css, /scroll-snap-stop:\s*always/);
  assert.match(experienceSource, /"scrollend"/);
  assert.match(experienceSource, /commitSettledSection/);
  assert.match(experienceSource, /"wheel", handleWheel, \{ passive: false \}/);
  assert.match(experienceSource, /handleNavigate\(destination\)/);
});

test("calculates bounded scroll progress and the closest settled section", async () => {
  const {
    canScrollWithinSection,
    calculateScrollProgress,
    findAdjacentSection,
    findClosestSection,
  } = await import(
    new URL("../app/components/scrollSnapMath.ts", import.meta.url).href
  );
  const sections = [
    { id: "origin", top: -900, height: 900 },
    { id: "about", top: 0, height: 900 },
    { id: "projects", top: 900, height: 900 },
  ];

  assert.equal(calculateScrollProgress(900, 4_500, 900), 0.25);
  assert.equal(calculateScrollProgress(-20, 4_500, 900), 0);
  assert.equal(calculateScrollProgress(8_000, 4_500, 900), 1);
  assert.equal(findClosestSection(sections, 900), "about");
  assert.equal(findAdjacentSection(sections, "about", 1), "projects");
  assert.equal(findAdjacentSection(sections, "about", -1), "origin");
  assert.equal(findAdjacentSection(sections, "origin", -1), "origin");
  assert.equal(
    canScrollWithinSection({ top: 0, height: 1_200 }, 900, 1),
    true,
  );
  assert.equal(
    canScrollWithinSection({ top: -300, height: 1_200 }, 900, 1),
    false,
  );
  assert.equal(
    canScrollWithinSection({ top: -300, height: 1_200 }, 900, -1),
    true,
  );
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

test("ships detailed surface, emission, and height maps for the solar entity", async () => {
  const solarMaps = [
    "solar-surface-albedo.jpg",
    "solar-surface-emission.jpg",
    "solar-surface-height.jpg",
  ];

  for (const solarMap of solarMaps) {
    const asset = await stat(
      new URL(`../public/textures/solar/${solarMap}`, import.meta.url),
    );

    assert.ok(
      asset.size > 100_000,
      `${solarMap} is unexpectedly small`,
    );
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

test("builds a central-lighted orbital system with a moving chase camera", async () => {
  const [sceneSource, solarSource, orbitalPlanetSource, cameraSource] =
    await Promise.all([
      readFile(new URL("../app/scene/SpaceScene.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/scene/SolarEntity.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/scene/OrbitalPlanet.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/scene/CameraRig.tsx", import.meta.url), "utf8"),
    ]);

  assert.match(sceneSource, /<SolarEntity \/>/);
  assert.match(sceneSource, /<OrbitalPlanet/);
  assert.match(sceneSource, /targets=\{orbitalTargets\}/);
  assert.doesNotMatch(sceneSource, /<directionalLight/);
  assert.match(solarSource, /<pointLight/);
  assert.match(solarSource, /emissiveMap=\{emissionTexture\}/);
  assert.match(orbitalPlanetSource, /calculateOrbitFrame/);
  assert.match(cameraSource, /id: "overview"/);
  assert.match(cameraSource, /body\.tangent/);
});

test("keeps each inclined orbital frame on its radius with an orthogonal tangent", async () => {
  const { calculateOrbitFrame } = await import(
    new URL("../app/scene/orbitalMath.ts", import.meta.url).href
  );
  const THREE = await import("three");
  const position = new THREE.Vector3();
  const tangent = new THREE.Vector3();

  calculateOrbitFrame(
    {
      radius: 10,
      angle: Math.PI / 2,
      inclination: Math.PI / 6,
      ascendingNode: Math.PI / 5,
    },
    position,
    tangent,
  );

  assert.ok(Math.abs(position.length() - 10) < 1e-10);
  assert.ok(Math.abs(tangent.length() - 1) < 1e-10);
  assert.ok(Math.abs(position.dot(tangent)) < 1e-10);
});
