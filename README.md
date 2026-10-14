# AFTER HOURS — Alok's living workshop

A React + Vite portfolio with a bounded cutaway room, dimensional night/day window and true desktop orbit, orthographic drone and top view. The room is the interface: an operational monitor, readable notebook, circular twelve-project archive and examination station, keycap terminal, journey board, credential drawer and stationery. Desktop Patch is an original grounded voxel cat; the sixteen-state pixel character remains the touch/Quick fallback. Real semantic reading surfaces align to the physical objects; coarse/narrow Explore uses a lightweight 2.5D handoff, and Quick View remains complete.

Current implementation, controls, A–I repairs and evidence: [WORLD-REPAIR-REPORT.md](WORLD-REPAIR-REPORT.md). Current ignored screenshots/results are under test-results/after-hours/repair/ and test-results/world-interface/. Earlier 3.0 reports are historical snapshots.

## Local development

```sh
npm ci
npm run dev
```

## Production preview and checks

```sh
npm run lint
npm run build
npm run preview -- --port 4180
```

With preview running separately:

```sh
npm run verify
npm run verify:workshop
npm run verify:performance
```

`verify` runs the factual-content audit and current world regression: nine widths, seven reading surfaces, twelve case routes, ring cycles, semantic interaction and axe. `verify:workshop` runs refinement, failure/fallback and exact-byte asset checks. Chromium is required through Playwright. Current reports/screenshots are local ignored files under `test-results/world-interface/`; exact asset responses are recorded under `test-results/living-workshop/assets-http.json`. Historical results describe their original versions; the root repair report explicitly identifies current after-hours/repair evidence.

Form tests require an isolated `dist-form` build/preview at port 4182 with `VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/qa-world-local`. `npm run verify:form` intercepts every service request; it sends zero real messages. Do not point that test at a production endpoint. The current QA report explains the setup and measured limits.

## Content and configuration

Edit factual portfolio content in `src/data/content.js`. Original facts, twelve cases, supplied resume, portrait, Techriciate logo and Bloom photos remain preserved. Project diagrams are conceptual. Missing credential URLs remain unlinked; draft slots are hidden.

Configure `VITE_FORMSPREE_ENDPOINT` and `VITE_SITE_URL` using `.env.example`. The form succeeds after accepted service response, preserves fields after failure and aborts stalled requests after 15 seconds. Unconfigured delivery offers direct email. Production canonical URLs/sitemap need the owner's real origin. Build prepares static case metadata and hosting rewrites; it does not deploy.

## Editable artwork

- Scene: `src/scene/RoomShell.js`, `CameraDirector.js`, `PatchModel.js`, `createWorkshopWorld.js`, `ObjectWorld.js`, `ArtifactModels.js`, `SceneTimeline.js`, `worldLayout.js`.
- Pixel art: `scripts/living-sprites.mjs` → sixteen strips, 85 frame positions, atlas/contact sheet/poster/manifest. Live Patch is procedural voxel geometry; the original pixel strips remain the touch/Quick fallback. A DOM button provides accessible activation.
- Textures/posters/social/provenance: `scripts/living-textures.mjs`, `living-posters.mjs`, `living-social.mjs`, `living-provenance.mjs`.

The renderer reuses geometry, stops settled work, pauses hidden/offscreen and disposes on exit. Reduced motion, low-power hints and unavailable WebGL retain full content. `DeskScene3D.jsx` is a historical foundation, not the active scene entry point.

See [current state](docs/after-hours/CURRENT_STATE.md), [historical 3.0 implementation](docs/after-hours/WORLD_IMPLEMENTATION_REPORT.md), [historical 3.0 QA evidence](docs/after-hours/WORLD_QA_EVIDENCE.md), [scene bible](docs/after-hours/SCENE_BIBLE.md), [sprite specification](docs/after-hours/SPRITE_SPEC.md), [assets](docs/after-hours/ASSET_MANIFEST.md), [interactions](docs/after-hours/INTERACTION_CONTRACTS.md), and [design system](DESIGN.md). [FINAL_REPORT](docs/after-hours/FINAL_REPORT.md) records historical v2 evidence.

Latest work remains local and uncommitted. No push, merge or deployment is authorized.

## Explore controls

On an eligible desktop, open Explore → Look around: left-drag orbit, right/Shift-drag pan, wheel orthographic zoom. Free roam: WASD/arrows, Q/E down/up, drag look, Shift faster, adjustable speed 1–8. Top view pans/zooms overhead. Back/Escape restores the prior focused camera; R/Reset view returns home when not typing. There is no pointer lock. Room settings and the window control authored night/day mood.

Phones/coarse input receive renderer-derived home/top/day 2.5D plans and direct object reading, not mobile free 3D. Latest 320/390/768 layout checks include Patch clearance, real day taps, keyboard, window axe and successful resume download. The root repair report distinguishes full regression timing from targeted latest checks, and records fresh Lighthouse 95 mobile / 84 desktop plus unverified physical-device/browser/service limits.
