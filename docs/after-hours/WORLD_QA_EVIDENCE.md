> Historical pre-repair 3.0 snapshot. Current room, free camera, voxel Patch, mobile clearance, asset counts, test scope and fresh performance are documented in [WORLD-REPAIR-REPORT.md](../../WORLD-REPAIR-REPORT.md) and [CURRENT_STATE.md](CURRENT_STATE.md). Claims below apply only to their original snapshot.

# AFTER HOURS 3.0 — QA evidence

14 October 2026. Current local production-preview Chromium evidence is under `test-results/world-interface/`. Reports/screenshots are ignored local artifacts. This ledger identifies test scope and limits rather than inferring runtime correctness from build success. Historical v2 evidence remains in FINAL_REPORT.md and old report folders.

## Reproduction

Run `npm run lint` and `npm run build`, then start `npm run preview -- --port 4180` separately. Current package commands:

| Command | Runs |
|---|---|
| `npm run verify` | `world-content-audit.mjs`, `world-verify.mjs` |
| `npm run verify:workshop` | `world-refinement-verify.mjs`, `world-failure-verify.mjs`, `living-assets-verify.mjs` |
| `npm run verify:form` | `world-form-verify.mjs` against isolated port 4182 |
| `npm run verify:performance` | `world-performance.mjs` |
| `node scripts/world-sprite-verify.mjs` | Current frame/provenance checks |
| `node scripts/world-final-verify.mjs` | Final notebook keyboard/nav, runtime reduced-motion and poster dimension checks |

Form testing used an isolated `dist-form` build with `VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/qa-world-local`, previewed on 4182. The test intercepts this exact endpoint for every request; zero real messages are sent. This was a mock QA endpoint, never a production configuration. The isolated preview was stopped after testing; normal preview remains 4180. Chromium is required through Playwright.

## Recorded results

| Evidence | Result and scope |
|---|---|
| Build / lint | PASS after final source and QA script edits; CSS 72.05KB, entry 455.21KB, lazy scene ≈595KB, motion 132.59KB; chunk warning retained |
| `content-audit.json` | Nine factual collections unchanged against HEAD; twelve complete project records; source-managed drafts never rendered |
| `round1/report.json` | No errors; monitor apps/search/focus, four notebook pages, all twelve exact-radius ring slots/wrap, twenty inspect/return/rotate cycles, correct project, actual keycap raycast, tools/Journey/last credential/contact, Patch/cancellation, Quick disposal |
| Responsive regression | Widths 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 × seven reading surfaces; no horizontal content overflow; twelve full project routes retained |
| Round-one axe | Zero violations on monitor, toolkit, Journey, credentials and contact |
| `refined/report.json` | Errors empty; quiet-mode curved turn/front-back/completed page, close mid-turn cleanup; grouped/searchable credentials and empty/reset/last record; stable ID/year future fixture; bounded Look around and zero reading parallax; focused resize and one restored canvas; native CDP touch archive swipe |
| Refined responsive / axe | Twenty-one small-width surface checks; zero violations on all seven desktop reading surfaces |
| `failures.json` | Reduced motion gives full Quick content/twelve cases/no canvas; unavailable WebGL gives truthful fallback; context loss releases modal/scroll and retry creates one canvas; native coarse notebook/close/Patch; equivalent 125%/200% CSS viewports avoid horizontal overflow |
| `form.json` | Mocked pending/no false success, HTTP200 acceptance/reset, HTTP500 preserved input, retry, 15-second abort/preserved input; four intercepted requests, zero real messages |
| `final-focused.json` | All four notebook pages retain visible nav; Enter/ArrowLeft/Escape and inner-page focus; live reduced-motion preference change disposes canvas into complete Quick; loaded mobile poster has reserved 780×700 dimensions |
| Current sprite check | Sixteen states / 85 positions; WALK and RETURN each eight unique frames; every source pose has lowest opaque row 40; all 41 rasters have provenance sidecars |
| `test-results/living-workshop/assets-http.json` | Final current check: 104 exact-byte HTTP responses |
| `docs/after-hours/WORLD_ASSET_MANIFEST.json` | 117 public file entries plus four procedural source entries; dimensions/bytes/SHA256/provenance; inventory coverage is distinct from HTTP-test coverage |

The independent finish reviewer returned **SHIP for the reviewed fixes** after the correction batch: notebook page navigation is fully visible on desktop/mobile; Journey hotspot is attached to its left pinned record; all seven settled mobile surface captures are free of cyan highlight. Captures are in `refined/` (room poses, seven desktop surfaces, seven mobile surfaces and 320/390/768 homes). A still-image verdict does not establish timing, physical-device performance or real delivery.

## Final performance sample

The dedicated final run in `performance.json` supersedes the pre-reservation 75-mobile/68-desktop sample. Raw reports are `lighthouse-mobile.json` and `lighthouse-desktop.json`. These are local Chromium Lighthouse samples: mobile 2.5D and desktop Explore, not physical-device guarantees.

| Mode | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Mobile | 94 | 100 | 100 | 100 | 2.6s | 120ms | .002 |
| Desktop | 76 | 100 | 100 | 100 | .8s | 530ms | .021 |

The mobile poster dimension reservation reduced the observed .266 CLS to .002. Mobile LCP is still above the 2.5s aspiration. Desktop blocking/performance and the ≈595KB lazy scene are known limits; no perfect or production-certified score is claimed. Broader measurement under physical GPU/hardware, Safari/Firefox and real networks remains outstanding.

## Boundaries

125%/200% checks use equivalent CSS viewport dimensions, not native browser UI zoom. Native CDP touch is browser input emulation, not physical-device testing. Automated axe and focused keyboard checks do not establish complete assistive-technology coverage. Cleanup/resource disposal checks do not substitute for heap profiling. Build/static metadata do not establish a deployed origin. No production form endpoint or origin is configured, and no actual delivery was attempted. No publication, push, commit, merge or reset was performed.
