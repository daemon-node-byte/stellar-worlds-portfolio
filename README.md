# Xenobiology Observatory

A cinematic, scroll-driven portfolio staged as an alien solar-system
expedition. Each planetary approach reveals a destination: About, Projects,
Field Notes, and Contact.

## Experience

- Scroll-controlled camera travel with smooth cinematic interpolation
- Five procedurally textured worlds with real displacement and bump detail
- Dynamic shadow-casting lights, atmospheres, rings, moons, and orbital debris
- Bloom, chromatic aberration, grain, and vignette post-processing
- Responsive editorial interface with keyboard navigation and reduced-motion
  support
- Host-aware Open Graph and X metadata with a bespoke social card

## Architecture

### Interface layer

`app/components/` owns the document interface and scroll state. It depends on
the portfolio content module and passes only a mutable scroll-progress contract
to the scene. It does not contain rendering algorithms or persistence logic.

Example: add a destination label in `app/data/portfolioContent.ts`, then render
its content in `ObservatoryInterface.tsx`.

### Scene layer

`app/scene/` owns camera choreography, procedural planet materials, lighting,
particles, and post-processing. Scene components depend on React Three Fiber,
Three.js, and React Postprocessing. They do not depend on page markup or
portfolio copy.

Example: tune a planet's palette or orbital details in `SpaceScene.tsx` without
changing the navigation.

### Content layer

`app/data/portfolioContent.ts` is the authoritative source for navigation,
projects, and field notes. It contains presentation-ready data but no rendering
or browser behavior.

Example: replace the sample projects in `selectedProjects` with real work while
preserving the scene and card layouts.

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

- Replace navigation, project, and article content in
  `app/data/portfolioContent.ts`.
- Replace the introductory, about, and contact copy in
  `app/components/ObservatoryInterface.tsx`.
- Update `hello@xenobiology.studio` before using the contact link publicly.
- Tune world positions, palettes, lights, and effect intensity in
  `app/scene/SpaceScene.tsx`.
- Replace `public/og.png` after changing the site's title or visual identity.
