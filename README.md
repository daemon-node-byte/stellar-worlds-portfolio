# Josh McLain Portfolio

A cinematic, scroll-driven full-stack web developer portfolio staged as an
alien solar-system expedition. Each planetary approach reveals a destination:
About, Projects, Field Notes, and Contact.

## Experience

- A full-system opening view followed by snap-aligned, scene-to-scene camera
  approaches that chase each moving world
- Wheel and trackpad gestures use the same paced transition as header navigation
- A central textured solar entity with animated plasma, a particle corona, and
  the scene's inverse-square, shadow-casting light
- Occlusion-aware god rays and procedural anamorphic lens glare from the star
- Five planets in distinct inclined orbits, with original 2K equirectangular
  surface maps and matching displacement and bump detail
- Subtle atmospheres, shader-banded rings with volumetric dust, textured moons,
  and orbital debris
- Bloom, chromatic aberration, grain, vignette, and solar glare post-processing
- Responsive editorial interface with keyboard navigation and reduced-motion
  support
- Section content enters only after its destination has settled in the viewport
- File-driven Markdown field notes with YAML front matter and shareable routes
- Real project, source-code, contact, and social profile links
- Host-aware Open Graph and X metadata with a bespoke social card

## Architecture

### Interface layer

`app/components/` owns the document interface and scroll state. It depends on
the portfolio content module and passes only a mutable scroll-progress contract
to the scene. It does not contain rendering algorithms or persistence logic.

Example: add a destination label in `app/data/portfolioContent.ts`, then render
its content in `ObservatoryInterface.tsx`.

### Scene layer

`app/scene/` owns orbital motion, camera choreography, image-based planet and
solar materials, lighting, particles, and post-processing. Scene components
depend on React Three Fiber, Three.js, and React Postprocessing. They do not
depend on page markup or portfolio copy.

Example: tune a planet's palette or orbital details in
`solarSystemConfig.ts` without changing the navigation.

The generated planet and moon assets live in `public/textures/planets/`. Each
body uses one `*-albedo.jpg` map for visible surface color and one
`*-height.jpg` map for bump and vertex displacement. The stellar albedo,
emission, and height maps live in `public/textures/solar/`.

### Content layer

`app/data/portfolioContent.ts` is the authoritative source for navigation,
projects, and social profiles. Field-note documents live in
`app/content/field-notes/` as Markdown with YAML front matter.
`app/lib/fieldNotes.ts` discovers those documents at build time, validates their
metadata, and supplies both the home-page list and the `/field-notes/[slug]`
routes.

Example: add `a-new-note.md` to the field-notes directory and it becomes a list
item whose URL is `/field-notes/a-new-note`.

### Hosting layer

`worker/`, `build/`, and `.openai/hosting.json` provide the Cloudflare-compatible
vinext runtime used by Sites. Product components must not import hosting-layer
code.

## Local development

```bash
npm install
npm run dev
npm run build
node --test tests/rendered-html.test.mjs
```

The project requires Node.js 22.13 or newer.

## Customizing the portfolio

- Replace navigation, project, and social content in
  `app/data/portfolioContent.ts`.
- Add, remove, or edit field-note Markdown documents in
  `app/content/field-notes/`; the filename is the URL slug.
- Replace the introductory, about, and contact copy in
  `app/components/ObservatoryInterface.tsx`.
- Tune orbit radii, speeds, inclinations, and world palettes in
  `app/scene/solarSystemConfig.ts`.
- Tune the solar entity, corona, and central light in
  `app/scene/SolarEntity.tsx`.
- Replace a world by preserving its paired albedo and height-map filenames in
  `public/textures/planets/`.
- Replace `public/og.png` after changing the site's title or visual identity.
