# AFTER HOURS implementation report

Completed locally on 14 October 2026 (Asia/Calcutta). Branch: `codex/after-hours`. No push, merge, deployment, backend change or external project modification.

## Delivered

- The entire portfolio now uses the AFTER HOURS workshop identity: ink, paper, warm lamp light, self-hosted Instrument Serif and Space Grotesk.
- Original procedural Three.js desk with monitor, articulated lamp, notebook, keyboard, ceramic mug and pinned notes. Camera movement is bounded; monitor, notebook and note have accessible DOM links. A faithful local SVG poster renders immediately.
- Original charcoal Patch: seven transparent 48×48 sprite sets, **32 distinct frames**. Idle 4, blink 3, tail 5, walk 8, sleep 4, peek 4 and paw 4. Walking alternates paws and turns for the short return path. Patch appears on the hero desk and sleeps near Contact; reactions require a click/keyboard activation. Reduced motion displays sitting/sleeping frames. No autoplay sound.
- All **12 projects** remain visible/filterable, with distinct authored cover art and individual case-study routes. Techriciate retains its genuine logo; Bloom retains all three genuine product photos. All covers disclose conceptual artwork or genuine-media compositions.
- Case files retain problem, operation, complete interactive architecture, features, decisions, stack, supplied details, truthful status, scope boundaries, repository/demo links, source references and previous/next navigation.
- About is a paper note, Skills a selectable toolkit linked to actual project stacks, Journey a dated ledger, Achievements and credentials a compact archive, Contact a validated note.
- Header navigation, command palette, theme persistence, clipboard, resume download, footer sound preference, 404, responsive layouts and email fallback remain.
- Removed the superseded constellation, contextual cursor, horizontal project books, old cover components/styles and large marquee. GSAP authors one entrance and the timeline; eligible desktop uses one route-scoped Lenis instance, while phones/touch/reduced motion use native scrolling.
- Production no-JavaScript HTML contains the real profile and all twelve project summaries/source links, generated from the same content source.

## Phases and commits

1. Audit: `a1fbfcb`. Inspected existing application, truthful source research, assets, routes, form behavior, motion lifecycles, docs and tests.
2. Visual system/assets: `bd81e05`. Palette, type, original SVG artwork, sprite generation and manifest.
3. Hero/desk/Patch: `8426eb8`. Lazy procedural scene, poster, character and entry identity.
4. Project shelf/case files: `73c3a21`. All twelve routes and detailed engineering content.
5. Remaining sections: `2380b77`. Toolkit, note, ledger, archive and contact.
6. Interactions/fallbacks: `169d2f8`. Motion gates, tactile states and asset refinements.
7. Final QA/refinement/documentation: final local commit after all checks below.

Build and lint were run throughout. Dependencies were absent initially; first checks could not launch. Early overlapping installation attempts collided on Windows directories; a completed sequential installation resolved this. Subsequent build and lint checks pass. `three` is the sole new production dependency; `sharp` is a development-only asset encoder.

## Truth and content

`src/data/content.js` remains the single editable content source. Existing portrait, resume, links, education, experience, awards and credentials remain. Draft slots are hidden, missing credentials remain unlinked, and TrustNet remains in development with no fabricated public link.

The repository's existing `PROJECT_RESEARCH.md` records source boundaries. These are now visible in the case studies. Old “limitations” strings sometimes described unsupported capabilities; they are not presented as trustworthy limitations. In particular, BookItNow is described as a browsing/form prototype with local confirmation, and Techriciate's agency site is distinguished from separate commercial-platform contributions. No new personal facts, metrics, clients, screenshots or production guarantees were inferred.

No project screenshots exist in the provided asset inventory, so original workflow metaphors are used. The workshop represents a design metaphor, not Alok's photographed physical desk. Patch is fictional.

## Assets and provenance

`ASSET_MANIFEST.md` lists paths, byte sizes, formats and origins. `scripts/after-hours-assets.mjs` regenerates the artwork, exact pixel frames, deterministic texture, compressed poster and OG images.

- 34 new SVG/PNG/WebP media assets, one sprite manifest and five WebP provenance sidecars: 40 generated files, approximately 145KB combined.
- All twelve covers have distinct file hashes.
- All sprite frames have distinct decoded pixel hashes; dimensions, alpha and frame counts match the manifest.
- PNG origin is embedded in tEXt; WebP origin is recorded in JSON sidecars. Impeccable provenance scan: 13 rasters, zero missing.
- Existing user-supplied images retain their original provenance. Font licenses remain under `public/fonts/`. Original generated assets follow the repository's ISC declaration.
- Canonical project slugs name artwork files, rather than shortened aliases in the brief. `desk-layer.svg` is the production poster; `desk-poster.webp` is its compressed secondary fallback. Individual desk SVGs are editable object studies; the real scene source is `DeskScene3D.jsx`.
- All 40 generated files are served from production preview with bytes identical to their source files.

## Verification evidence

Production preview: `http://127.0.0.1:4173/`. Automated browser: local Playwright Chromium on Windows, not physical-device certification.

| Check | Evidence |
|---|---|
| Build / lint | `npm run build`, `npm run lint` pass |
| Main behavior | `npm run verify`: nine widths, both themes, zero axe violations/overflow, readable text, filters, keyboard, palette focus, history, downloads, clipboard, form fallback, toolkit, 404 and motion lifecycle |
| Every project | `node scripts/extended-verify.mjs`: 12 routes × 9 widths (108 layouts), artwork bounds, narrow-case axe, touch, actual native View Transition promises and reduced/unsupported fallbacks |
| Library / frames | `node scripts/library-verify.mjs`: all projects, all architecture nodes, every category, correct links/status/source references, unique covers and all 32 frames |
| Service states | `node scripts/form-states.mjs` against isolated configured build on port 4175: invalid, pending, success/reset, failure/value preservation and retry. All requests mocked; no messages sent |
| Fallbacks | `node scripts/after-hours-fallbacks.mjs`: disabled WebGL, mounted-SPA offline/reconnect, failed artwork and throttled network |
| Assets | `node scripts/after-hours-asset-verify.mjs`: exact bytes for all 40 production assets/metadata |
| External links | All 14 checked GitHub/demo/profile URLs and all 42 source-reference URLs return HTTP 200; LinkedIn returns 999 automated-access restriction. No independent LinkedIn availability claim |
| Lifecycle | Three route-return cycles retain one hero canvas, one ScrollTrigger and a stable DOM count; case pages have zero canvases. Offscreen/hidden gates and actual WebGL context loss/recovery pass. Heap retention is not measured |

Widths: **320, 375, 390, 430, 768, 1024, 1280, 1440, 1920px**. The final main verification JSON records actual current DOM counts. Browser errors/warnings were checked; the Three.js shadow deprecation discovered during QA was corrected to supported PCF shadows.

Rendering is capped at 30fps and DPR 1.5, with a 512px lamp shadow and 1024px directional shadow. The scene stops offscreen/hidden and is disposed on route departure. Rendering is disabled on touch, reduced motion, narrow/weak hardware or reported data saving. These are explicit gates and a frame cap, not a universal smoothness/60fps claim.

## Visual review

First review identified and fixed repeated cover fallbacks caused by two mismatched art keys, striped-looking texture, an awkward desk-edge cat placement and oversized accent borders. Final production captures include nine hero widths, complete home, all major sections, phone shelf, light/reduced variants and three different case files (AURA, Bloom, COSMEON).

The independent Impeccable reviewer validated the captures and requested two material fixes: remove redundant introductory eyebrows and repair Bloom's obscured gift-tag lettering. Both were applied in one batch. The reviewer returned **ship** after scoring both fixes resolved and recaptures valid; this verdict is scoped to those fixes, not a new runtime audit or a claim of perfection.

Screenshots: `test-results/after-hours/final/` (23 captures listed in `captures.json`).
Reviews: `test-results/after-hours/impeccable-review.md` and `impeccable-verdict.md`.
Other browser evidence: `test-results/after-hours/`, `test-results/extended-qa.json` and case axe JSONs. Screenshots/test results are intentionally ignored by Git but retained in this local workspace. The implementation report, source assets and deterministic scripts are committed.

## Measured performance and limits

Local mobile Lighthouse, production preview with simulated throttling/headless Chromium:

| Metric | Initial | Final after phone gating and stable page context |
|---|---:|---:|
| Performance | 85 | 86 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 2.6s | 2.8s |
| TBT | 400ms | 340ms |
| CLS | 0.008 | 0 |

The final performance sample includes the two visual fixes and stable page context. An earlier sample scored 91. Two later samples scored 64 (one during concurrent QA, one with the suite stopped), prompting a startup profile and stable shared callbacks to avoid app-shell-driven page rerenders. Those lower samples are retained as `lighthouse-concurrent.json` and `lighthouse-before-context-fix.json`; the final sample is 86. Raw baseline/final reports: `lighthouse.json`, `lighthouse-final.json`. The separate optional “agentic browsing” category reports 50; it is not represented as part of the four standard scores. Timings vary with this machine. The 2.5s LCP target is **not met** in this sample, although CLS is below 0.1.

Initial application JS is approximately 408KB minified / 129KB gzip. The eligible-desktop scene is a separate 541KB / 136KB gzip chunk; GSAP/Lenis motion is another separate 133KB / 50KB gzip chunk and is not requested on phones/touch. Vite reports the scene's >500KB chunk warning; this is documented rather than hidden. No R3F, Drei, postprocessing, remote fonts or external art downloads were added.

Remaining owner configuration: `VITE_FORMSPREE_ENDPOINT`, `VITE_SITE_URL`, optional credential URLs and TrustNet public links. Without a form endpoint, the UI honestly offers direct email and reports that the form is not connected. Real delivery cannot be certified without that service configuration. Offline checks cover an already-mounted SPA; no cold-start offline service worker is added. Physical phones, broad GPU models and heap profiling were not tested. The fallback avoids making the site depend on WebGL.
