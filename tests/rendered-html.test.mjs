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
  assert.match(html, /\/projects\/astarot/);
  assert.match(html, /Orbital dossier/i);
  assert.match(html, /Skills constellation/i);
  assert.match(html, /TypeScript/);
  assert.match(html, /AI systems/i);
  assert.match(html, /View résumé/);
  assert.match(html, /\/resume\/Josh-McLain-Resume\.pdf/);
  assert.match(html, /\/resume\/Josh-McLain-Resume\.docx/);
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

test("contains narrow-screen content without sacrificing mobile navigation", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const narrowLayout = css.slice(
    css.indexOf("@media (max-width: 600px)"),
    css.indexOf("@media (prefers-reduced-motion: reduce)"),
  );

  assert.match(css, /\.observatory-shell\s*\{[^}]*overflow-x:\s*clip/s);
  assert.match(
    css,
    /\.project-card__title h3\s*\{[^}]*overflow-wrap:\s*anywhere/s,
  );
  assert.match(
    css,
    /\.field-note-prose code\s*\{[^}]*overflow-wrap:\s*anywhere/s,
  );
  assert.match(
    css,
    /\.field-note-prose pre,[\s\S]*?overflow-x:\s*auto/s,
  );
  assert.match(narrowLayout, /\.portfolio-section\s*\{[^}]*0\.75rem/s);
  assert.match(narrowLayout, /\.notes-list article\s*\{[^}]*minmax\(0,\s*1fr\)/s);
  assert.match(narrowLayout, /\.field-notes-footer\s*\{[^}]*flex-direction:\s*column/s);
  assert.match(narrowLayout, /@media \(max-width:\s*380px\)/);
  assert.match(
    narrowLayout,
    /\.site-header nav button span\s*\{[^}]*display:\s*none/s,
  );
});

test("keeps desktop project cards compact enough to reveal the scene", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const desktopProjectLayout = css.slice(
    css.indexOf("@media (min-width: 901px)"),
    css.indexOf("@media (max-width: 900px)"),
  );

  assert.match(
    desktopProjectLayout,
    /\.section-content--wide\s*\{[^}]*max-width:\s*64rem/s,
  );
  assert.match(
    desktopProjectLayout,
    /\.project-card\s*\{[^}]*min-height:\s*19\.5rem/s,
  );
  assert.match(
    desktopProjectLayout,
    /\.project-card\s*\{[^}]*background:\s*rgb\(3 8 7 \/ 68%\)/s,
  );
  assert.match(
    desktopProjectLayout,
    /\.project-card__title h3\s*\{[^}]*2\.15rem/s,
  );
});

test("renders an accessible interactive skills constellation", async () => {
  const [html, componentSource, css] = await Promise.all([
    render().then((response) => response.text()),
    readFile(
      new URL("../app/components/SkillsConstellation.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const tabletLayout = css.slice(
    css.indexOf("@media (max-width: 900px)"),
    css.indexOf("@media (max-width: 600px)"),
  );
  const mobileLayout = css.slice(
    css.indexOf("@media (max-width: 600px)"),
    css.indexOf("@media (prefers-reduced-motion: reduce)"),
  );

  assert.match(html, /Interactive technology skill map/i);
  assert.match(componentSource, /useState<SkillConstellationNodeId>/);
  assert.match(componentSource, /aria-pressed=/);
  assert.match(componentSource, /onPointerEnter=/);
  assert.match(componentSource, /onFocus=/);
  assert.match(componentSource, /aria-live="polite"/);
  assert.match(
    css,
    /\.section-content--about\s*\{[^}]*display:\s*grid/s,
  );
  assert.match(
    tabletLayout,
    /\.section-content--about\s*\{[^}]*display:\s*block/s,
  );
  assert.match(
    mobileLayout,
    /\.section-content--about h2\s*\{[^}]*2\.2rem/s,
  );
  assert.match(css, /@keyframes constellation-core-pulse/);
});

test("calculates constellation connections across the fixed map aspect", async () => {
  const {
    calculateConstellationConnection,
    skillConstellationCenter,
  } = await import(
    new URL(
      "../app/components/skillConstellationMath.ts",
      import.meta.url,
    ).href
  );

  assert.deepEqual(
    calculateConstellationConnection(skillConstellationCenter),
    { angle: 0, length: 0 },
  );
  assert.deepEqual(
    calculateConstellationConnection({ x: 80, y: 48 }),
    { angle: 0, length: 30 },
  );

  const downwardConnection = calculateConstellationConnection({
    x: 50,
    y: 64.5,
  });
  assert.ok(Math.abs(downwardConnection.angle - 90) < 0.000_001);
  assert.ok(Math.abs(downwardConnection.length - 10) < 0.000_001);
  assert.throws(
    () => calculateConstellationConnection({ x: 50, y: 60 }, undefined, 0),
    /aspect ratio must be positive/i,
  );
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

test("ships browser-viewable and downloadable résumé files", async () => {
  const [pdf, docx] = await Promise.all([
    readFile(
      new URL("../public/resume/Josh-McLain-Resume.pdf", import.meta.url),
    ),
    readFile(
      new URL("../public/resume/Josh-McLain-Resume.docx", import.meta.url),
    ),
  ]);

  assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
  assert.equal(docx.subarray(0, 2).toString(), "PK");
  assert.ok(pdf.length > 50_000, "résumé PDF is unexpectedly small");
  assert.ok(docx.length > 20_000, "résumé DOCX is unexpectedly small");
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

test("builds the project archive and dynamic case-study routes from Markdown", async () => {
  const slugs = ["astarot", "ableton-mcp", "ts-env-validator"];
  const indexResponse = await render("/projects");
  assert.equal(indexResponse.status, 200);
  const indexHtml = await indexResponse.text();

  assert.match(indexHtml, /Orbital/);
  assert.match(indexHtml, /dossiers/);

  for (const slug of slugs) {
    assert.match(indexHtml, new RegExp(`/projects/${slug}`));
    const caseStudyResponse = await render(`/projects/${slug}`);
    assert.equal(caseStudyResponse.status, 200);
    const caseStudyHtml = await caseStudyResponse.text();
    assert.match(caseStudyHtml, /All project dossiers/);
    assert.match(caseStudyHtml, /Mission record/);
    assert.match(caseStudyHtml, /Next orbital dossier/);
  }
});

test("renders themed orbital project visuals with reduced-motion coverage", async () => {
  const [visualSource, css] = await Promise.all([
    readFile(
      new URL(
        "../app/components/ProjectOrbitalVisual.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(visualSource, /project-orbital-visual--\$\{theme\}/);
  assert.match(visualSource, /project-orbital-visual__body/);
  assert.match(visualSource, /project-orbital-visual__moon/);
  assert.match(css, /@keyframes project-orbit-rotate/);
  assert.match(css, /\.project-dossier--violet/);
  assert.match(css, /\.project-dossier--cyan/);
  assert.match(css, /\.project-dossier--amber/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
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

  assert.match(sceneSource, /<SolarEntity/);
  assert.match(sceneSource, /<OrbitalPlanet/);
  assert.match(sceneSource, /targets=\{orbitalTargets\}/);
  assert.doesNotMatch(sceneSource, /<directionalLight/);
  assert.match(solarSource, /<pointLight/);
  assert.match(solarSource, /emissiveMap=\{emissionTexture\}/);
  assert.match(orbitalPlanetSource, /calculateOrbitFrame/);
  assert.match(cameraSource, /id: "overview"/);
  assert.match(cameraSource, /body\.tangent/);
  assert.match(cameraSource, /applyAxisAngle/);
  assert.match(cameraSource, /calculateCameraOrbitAngle/);
  assert.match(cameraSource, /calculateSunwardCameraOffset/);
  assert.match(cameraSource, /sunward:/);
  assert.match(sceneSource, /ambientLight[^>]+intensity=\{0\.11\}/);
  assert.match(sceneSource, /hemisphereLight[^>]+0\.16/);
});

test("mounts safe solar glare and god rays around the brighter star", async () => {
  const [sceneSource, solarSource] = await Promise.all([
    readFile(new URL("../app/scene/SpaceScene.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/scene/SolarEntity.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(sceneSource, /<GodRays/);
  assert.match(sceneSource, /sun=\{godRaysSource\}/);
  assert.match(sceneSource, /if \(!godRaysSource\) return null/);
  assert.doesNotMatch(sceneSource, /<LensFlare/);
  assert.match(solarSource, /intensity=\{760\}/);
  assert.match(solarSource, /onGodRaysSourceChange/);
  assert.match(solarSource, /new THREE\.DataTexture/);
  assert.match(solarSource, /<sprite/);
  assert.match(solarSource, /depthWrite=\{false\}/);
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

test("keeps close-up camera orbit motion subtle and disables it for reduced motion", async () => {
  const { calculateCameraOrbitAngle } = await import(
    new URL("../app/scene/cameraOrbitMath.ts", import.meta.url).href
  );
  const motion = {
    orbitArc: 0.2,
    orbitSpeed: 0.1,
    orbitPhase: 0.4,
  };

  const angle = calculateCameraOrbitAngle(12, motion, false);
  assert.ok(Math.abs(angle) <= motion.orbitArc);
  assert.equal(calculateCameraOrbitAngle(12, motion, true), 0);
});

test("lands close-up cameras on the star-facing side while retaining orbital trailing", async () => {
  const { calculateSunwardCameraOffset } = await import(
    new URL("../app/scene/cameraLandingMath.ts", import.meta.url).href
  );
  const THREE = await import("three");
  const bodyPosition = new THREE.Vector3(10, 0, 0);
  const bodyTangent = new THREE.Vector3(0, 0, 1);
  const radialDirection = new THREE.Vector3();
  const cameraOffset = new THREE.Vector3();

  calculateSunwardCameraOffset(
    {
      bodyPosition,
      bodyTangent,
      radius: 2,
      trailing: 4,
      sunward: 3,
      height: 1,
    },
    radialDirection,
    cameraOffset,
  );

  const directionToStar = bodyPosition.clone().negate().normalize();
  assert.ok(cameraOffset.dot(directionToStar) > 0);
  assert.ok(cameraOffset.dot(bodyTangent) < 0);
  assert.equal(cameraOffset.y, 2);
});
