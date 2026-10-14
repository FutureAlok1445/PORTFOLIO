> Historical v2 report. The current 3.0 implementation and QA are documented in [WORLD_IMPLEMENTATION_REPORT.md](WORLD_IMPLEMENTATION_REPORT.md) and [WORLD_QA_EVIDENCE.md](WORLD_QA_EVIDENCE.md). Scores and acceptance below apply only to the earlier build.

# AFTER HOURS — final local implementation report

14 October 2026. Implemented in the existing `codex/after-hours` checkout. HEAD remains `d07072fe1d8051d591b965c236e5dfda90524211`; all changes are uncommitted. No reset, push, merge, deployment, external-project change or real form message was performed. Preview: `http://127.0.0.1:4180/`.

## Before and after

The previous version had one desktop desk, small seven-state Patch, a flat project shelf and mostly static paper sections. The upgrade preserves its factual foundations and self-hosted fonts, then adds:

- One genuine Three.js world with desk/monitor/lamp/keyboard/notebook/mug/photo/window, a twelve-artifact archive, category workbench and journey board. Six interruptible camera compositions share materials and lighting; Contact shifts toward dawn. Lamp and physical objects have useful actions with HTML equivalents.
- Original Patch art: twelve states, 66 authored frame positions, transparent atlas, contact sheet and poster. Walking/return each use eight distinct paw/body/tail poses. All exported frames share ground row 40, projected using the manifest’s `[24,41]` anchor. Pet, wake, stretch, look, blink, tail, peek, paw, sleep and a bounded return walk work; visitor reactions take priority over rare idle cues.
- A draggable/snap archive, keyboard arrows/Home/End, stable inspection, selected project announcements, native touch swipe and a separate `/projects` collection. All twelve accurate cases retain their engineering explanations, limits and links; guided traces explain documented layers without pretending to run external software.
- Notebook tabs; depressed tool keys and project evidence; expandable truthful journey pins; preserved education, achievements, credentials and contact. Quick View persists, Help has native modal focus behavior, and reduced/touch/limited/unavailable-WebGL paths remain complete.
- Faithful desktop/phone renders from the actual scene, original project diagram family, genuine supplied portrait/logo/product photos, and thirteen actual 1200×630 PNG share graphics. Build-time case metadata and local hosting rewrites complement client-side route metadata.

Baseline and final screenshots are under `test-results/living-workshop/baseline/`, `corrections/` and `states/`. The independent Impeccable reviewer scored all six material visual findings resolved: mobile composition, control collisions, journey contrast, upper safe areas, contact cable and semantic hierarchy. Its SHIP disposition covers those reviewed fixes, not a universal quality/award claim.

## Core acceptance evidence

| Gate | Local outcome / evidence |
|---|---|
| A — identity | Real name/role/photo, visible work/resume/GitHub/contact paths. Actual resume download passed. All original profile/project/skills/journey/education/credential/social facts compared equal to the audited HEAD. |
| B — scene | Real geometry and shadows, six physical raycast actions, drag, lamp and context restoration passed in `corrections/report.json`. Procedural source is editable; no GLB pack is claimed. |
| C — spatial experience | Six settled camera compositions captured at 1440px; chapter jumps interrupt camera targets. One scrolling owner and bounded pointer parallax. |
| D — Patch | Runtime pet/wake/stretch/walk/return/idle checks; actual CSS frame positions differed in `states/report.json`; dimensions/alpha/ground/difference checks in `sprite-quality.json`. |
| E — projects | All twelve case routes at nine widths; complete browse-all and source links. All thirteen provided repository/live URLs returned HTTP200 during read-only checks. Twelve rendered cover samples reviewed together. |
| F — toolkit/journey | Physical and DOM category keys update the real panel; skill matches derive from stacks. Physical and DOM journey pins expose original truthful descriptions. |
| G — contact | Validation, pending, mocked HTTP200/reset, HTTP500/retry and 15-second stalled-request abort passed. Fields survive errors; unconfigured delivery reports that fact and offers genuine email. Real delivery is not configured or verified. |
| H — access/input | Home nine widths in both themes; zero axe findings on checked home/collection/AURA and phone/tablet captures. Native touch swipe, reduced motion, no WebGL, save-data, Help/inspection Escape focus, layered dialogs, cyclic drag, Ctrl+K, hashes/history and download passed. |
| I — verification | Build/lint passed throughout and at final build. Main regression has 108 case layouts plus 18 home theme layouts; no captured runtime errors. Two self-review passes plus independent review/fix verdict. See raw JSON and screenshots; compilation alone was never the visual gate. |
| J — integrity | Existing working code retained as historical foundation; no publishing/commits. Source-backed facts unchanged, original asset recipes/provenance and limitations documented. |

## Measured performance

Representative Lighthouse runs used local production preview and Chromium. They are lab measurements, not guarantees for every device/network.

| | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---|---|---|
| Mobile / Quick | 89 | 100 | 100 | 100 | 2.8s | 240ms | .02 |
| Desktop / Explore, optimized | 94 | 100 | 100 | 100 | .9s | 190ms | .004 |

The first desktop run scored 74 with 580ms blocking time. Sharing identical geometry reduced reported geometry objects from 277 to 119 while keeping the same models; the subsequent run scored 94. Both raw reports are retained. Latest physical run sampled 240 continuous RAF intervals: median 16.7ms, p95 16.9ms; 93,248 rendered triangles and 27 textures. A busier intermediate run had p95 33.4ms. These are browser frame intervals, not GPU timestamps or a physical-phone benchmark. A settled scene stops its RAF loop.

Final emitted weights: entry JS 425.11KB raw / 133.51KB gzip; optional Three.js scene 576.75KB / 147.00KB gzip; optional desktop motion 132.59KB / 49.71KB gzip; CSS 50.71KB / 10.75KB gzip. Vite’s >500KB scene warning remains visible. The scene is gated/lazy rather than included in mobile startup; the warning was not suppressed. The asset HTTP audit verifies exact bytes for all 95 artwork/metadata files; provenance scan found no missing raster origin records.

## Fixes made during review

Neighboring scene clutter and noisy material maps were removed. Desktop copy regions were protected. Phone/tablet controls moved into document flow; floating mobile Top was removed while the footer action remains. Paper labels now use material-scoped readable colors. The phone hero brings the workshop/Patch into the first view. Contact has one active visible Patch and no settled cable across copy. Sprite ground/gait, live projection, visitor priority and paused-ambient interactions were corrected. Geometry reuse, individual cap materials, hidden raycast filtering, native-drag suppression, negative-cycle wrapping, nested Escape and route metadata were addressed through concrete tests.

## Main changed files

- `src/scene/{createWorkshopWorld,ArtifactModels,SceneTimeline,WorkshopCanvas}` — original geometry, camera, interactions and resource lifecycle.
- `src/components/after-hours/{WorkshopExperience,WorkshopStage,ExperienceControls,ArtifactCarousel,PatchCat,WorkshopHero}` — scene state, modes, character and discovery.
- `src/components/{Hero,Credibility,Closing,Projects,ProjectArchitecture,Seo}`, `src/pages/{Home,ProjectIndex,Project}`, `src/App.jsx` — complete sections/cases/navigation.
- `src/styles/after-hours/living.css`, local artwork under `public/images/after-hours/`, `scripts/living-*.mjs`, SEO/hosting configuration, README and `docs/after-hours/` — presentation, reproducible assets, tests and handoff.

## Remaining limits and owner configuration

1. Set `VITE_FORMSPREE_ENDPOINT` to the owner’s real service. Mocked success is verified; real email delivery and that service’s production behavior are not. Direct email already works as a contact path.
2. Set `VITE_SITE_URL` to the authorized production origin for absolute public canonical/sitemap/share URLs. Local case HTML/PNG metadata is served and tested; a live deployment/rewrite/social-preview cache has not been tested because publishing is unauthorized.
3. Tests used Chromium with responsive/touch emulation and headless WebGL. Physical iOS/Android, Safari/Firefox, assistive-technology sessions and every GPU/network are unverified. No universal 60fps, Lighthouse or award claim is made.
4. Bilal’s live reference was access-challenged; Utsubo’s sampled browser view remained partially loading, and Pablo’s current domain showed a blog. No unsupported claim of reproducing their live behavior is made. The supplied references informed principles only; their assets/code/layouts/cats were not copied.
5. Optional GLB exports, cinematic shutters, a game, advanced shader trails, dynamic measured Lite tier, Patch purr audio and individual per-frame PNGs were not needed for the implemented core gates and are not claimed.

## Run and reproduce

The last aggregate verification passed all 15 groups after the grounding and pause adjustments. A focused follow-up (`scripts/living-paused-visitor.mjs`) confirmed that ambient pause freezes idle, a visitor-triggered walk advances real frames, and its return restores paused idle. The final asset HTTP check again matched all 95 files to their source bytes.

```sh
npm run lint
npm run build
npm run preview -- --port 4180
# In another terminal:
npm run verify
npm run verify:workshop
node scripts/living-edge-interactions.mjs
node scripts/living-evidence.mjs
node scripts/living-performance.mjs
```

For asset recipes and isolated mocked form setup, use README and the scene/sprite/asset/interaction documents in this directory. Screenshots and raw measurements stay in ignored local `test-results/living-workshop/`. No permission to commit, push or deploy is inferred from this handoff.
