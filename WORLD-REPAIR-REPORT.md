# AFTER HOURS — world repair and free exploration

Current local repair record, 14 October 2026. This is the authoritative report for the repair/free-roam master brief, superseding the current-state claims in the earlier 3.0 implementation and QA reports. Source artifact: local preview at `http://127.0.0.1:4180`. Work remains uncommitted on HEAD `d07072fe1d8051d591b965c236e5dfda90524211`; no reset, push, merge or deployment occurred. The owner authorized continuing the incumbent workshop and merging the approved expansion into DESIGN.md and its sidecar.

The material identity remains AFTER HOURS: midnight/navy, walnut, warm paper, frost-blue displays and practical amber light. The repair changes the physical floorplan, camera authority, window/environment and desktop Patch model. It preserves the factual portfolio and all twelve cases. The room is a deliberate open cutaway diorama, not a modeled exterior building. Drone uses the retained orthographic lens with genuinely movable position/look; it is not perspective FPS.

## A–I screenshot issue ledger

Before captures are in `test-results/after-hours/before/`: `desk.png`, `experience.png`, `contact.png`, `work.png`. They reproduce the supplied owner compositions locally. The owner's screenshots establish the visual defects; source/layout analysis establishes the causes. After paths below are relative to `test-results/after-hours/repair/`.

| ID / region / repro | Root cause | Repair and key files | Local evidence / status |
|---|---|---|---|
| A — right archive crossing desk/furniture; desk/work/experience views and rotation | Radial supports and independently placed furniture shared a movement envelope | Remove radial rods entirely; independent archive alcove, solid concentric plinth and separate pedestal trays; shared layout/collision volumes. `worldLayout.js`, `createWorkshopWorld.js`, `ObjectWorld.js`, `ArtifactModels.js` | `after-desk.png`, `after-experience.png`, `debug-bounds.png`, `rotation-0.png`, `rotation-12.png`, `rotation-24.png`; controls sweep has no recorded collisions. Resolved within tested envelopes. |
| B — crowded ring and unclear support; select/inspect each project | Fixed cramped radius and support/pivot relationships did not account for broad artifacts | Equal-angle count-derived slots; radius 5.988740 for 12 entries and minimum chord 3.1; full selected artifact and connected examination surface; source files above | `project-focus.png`, `controls.json`, `unit.json`; 48 indexed stops across three forward plus one reverse revolution; count fixtures 1/2/12/13/20/40. Resolved for tested counts and paths. |
| C — dark outer room/absent outdoor story; default/opposite/top views | Incomplete architectural boundary/window rather than a complete inhabited floorplan | New `RoomShell.js`: bounded cutaway walls, walnut plank floor, dimensional window/frame/sill, layered day/night exterior, moon/stars/sun/clouds and tiny flapping bird silhouettes; plant/pens/mat/sign | `after-desk.png`, `orbit-opposite.png`, `orbit-full.png`, `top.png`, `window-night.png`, `window-day.png`. Resolved as an intentional cutaway; exterior building shell not supplied. |
| D — shelf crop/archive clipping; desk/work/contact aspect changes | Camera composition and furniture anchors failed to reserve full artifact extents | Shared anchors; move cabinet/contact, raise Journey board, correct station legs to floor and route cable outside desk; inspectable camera poses and full-artifact framing. `worldLayout.js`, `SceneTimeline.js`, `CameraDirector.js`, `ObjectWorld.js` | `after-{desk,experience,contact}.png`, `extra.json`: full artifact frustum at 1280/1440/1920/2560 in desk/work/contact. Resolved at tested sizes. |
| E — stacked chrome/active chapter disagrees with view; chapter transitions | Always-visible redundant controls and requested rather than settled chapter state | Compact disclosed Explore and Room settings groups; chapter highlight follows settled camera. `WorkshopExperience.jsx`, `WorkshopCanvas.jsx`, `src/styles/after-hours/object-surfaces.css` | After desktop captures and latest `mobile-clear-{320,390,768}-{home,top-day}.png`. Reviewer found phone Patch overlap, then marked the reserved-flow-row repair RESOLVED. No universal viewport-area percentage is claimed. |
| F — plain/generic props and unreadable decoration; focused surfaces | Decorative tiny surfaces were carrying visual weight without material/detail hierarchy | Walnut floor/window depth and purposeful secondary props; preserve meaningful source-backed monitor/book/board content and material-owned reading surfaces. `RoomShell.js`, `ObjectWorld.js`, `ObjectSurface.jsx`, `ArtifactModels.js` | Window/project/Patch captures and seven focused surfaces in `test-results/world-interface/refined/`; genuine media retained. Resolved in reviewed compositions; artwork remains conceptual. |
| G — look-around only parallax; attempt continuous orbit/drone | Camera ownership supported preset targets and bounded offsets only | `CameraDirector.js` owns Guided/Orbit/Fly/Top/Focus/Transition, 360° orbit, pan/zoom, six-axis flight, swept conservative collisions, exact focus bookmarks, lifted scripted paths and smooth reset | `controls.json`, `unit.json`, `character-route.json`; `orbit-opposite.png`, `orbit-full.png`, `drone.png`, `top.png`. Actual pose changes tested, not inferred from stills. |
| H — desktop cat reads as billboard/block and floats; orbit/pet/walk/nap | Camera-facing Sprite cannot provide a stable cat silhouette through free camera rotation | New `PatchModel.js`: original small voxel cat with four paws, pointed ears, muzzle/whiskers and curving tail; actual grounded gait/contact. Preserve original pixel fallback. `PatchCat.jsx`, `WorkshopCanvas.jsx` | `patch-inspect.png`, `patch-pet.png`, `patch-nap.png`, `character-route.json`: eight gait samples, at least two grounded paws, zero bottom offset. Mobile reserved flow row separates Patch/patrol/instruction/actions; six latest layouts and axe clear. |
| I — maintain complete/expandable content; inspect all objects and append fixtures | Presentation geometry/selectors needed count-based adaptation without changing facts | Existing monitor, four-page notebook, project station, toolkit, Journey, credentials and contact retained; window is eighth reading surface; count-derived ring and credential selectors. `worldLayout.js`, `src/data/workshopSelectors.js`, `ObjectSurface.jsx`, `content.js` | Nine factual collections exactly equal HEAD; 12 case structures/routes; 0/1/5/20 credential fixtures; 650ms controlled mid-turn and keyboard tests. No public test records added. |

Scene filenames in this report live under `src/scene/`; UI files under `src/components/after-hours/` unless otherwise identified. The ledger describes causal repairs and tested bounds, not proof of perfect collision physics at arbitrary future coordinates.

## Delivered phases

0. Freeze/reproduction preserved current worktree and factual baseline; local before images record the supplied compositions.
1. Geometry moved the archive into its own alcove, removed spokes, derived clearance from content count and corrected furniture/grounding.
2. A single camera director added actual orbit, fly, top, focus/return and reset, with collision-aware movement and lifted authored transitions.
3. The bounded cutaway room gained floor/wall/window/outdoor depth and restrained inhabited details with night/day mood.
4. All existing object-owned reading experiences and twelve cases survived; Patch became a real desktop voxel character; window became an eighth surface.
5. Disclosed navigation and settled chapter state reduced chrome. Final reviewer feedback led to a dedicated phone companion flow row and re-captures at 320/390/768.
6. Build/lint and local automated suites passed as scoped below; fresh performance and asset/provenance results were recorded. No publication step was taken.

## Exact visitor controls

Open **Explore** on an eligible desktop. **Guided** follows chapter destinations. **Look around** enables true 360° orbit: left-drag rotates, right-drag or Shift-drag pans, wheel zooms the orthographic lens. **Free roam** enables drone movement: W/S or up/down arrows forward/back, A/D or left/right arrows sideways, Q/E down/up; drag to look, Shift moves faster, speed is adjustable from 1–8. There is no pointer lock. Text fields retain their keys.

**Top view** gives overhead pan/zoom. Open an object through its semantic control or mesh; **Back**/Escape restores the precise bookmarked free camera pose. **Reset view** or R returns smoothly to guided home when not typing. Escape provides exit/return. Mode and chapter are distinct; chapter highlighting settles with the camera. Room settings exposes lighting/night/day, effects/pause and help. Focus the window and choose day/night to see the actual environment change.

On coarse input or widths ≤1024px, Explore uses a lightweight 2.5D handoff: real renderer-derived home/top/day plan images and direct readable object surfaces. Top/day and window mood work there; desktop orbit/drone are not advertised as mobile free 3D. The companion and patrol control have a reserved flow row; instructions and object buttons follow. Quick View remains a complete direct content path. Reduced motion/low power/WebGL failure retain complete readable content.

## Test and evidence ledger

These results were produced by the primary implementation pass, not rerun by the documentation pass. Most evidence is local and ignored by Git. The broad main suite preceded the latest local role/route/model/phone changes; targeted suites below cover those later changes. A static capture demonstrates composition, not continuous motion.

| Command / result | Scope and durable evidence |
|---|---|
| `npm run build`, `npm run lint` — PASS after final UI change | Production build and lint. Entry 462.26KB / 143.49KB gzip; scene 612.30KB / 158KB gzip; CSS 77.24KB / 15.99KB gzip; motion 132.59KB / 49.71KB gzip. Scene exceeds default 500KB warning; missing `VITE_SITE_URL` notice remains. |
| `npm run verify` — PASS | Nine widths 320–1920 × seven surfaces; 12 case routes; 20 archive inspect cycles; monitor/apps/search/source/book/keycaps/pins/credentials/contact/Patch/Quick; five Quick axe samples, zero violations; errors empty. `test-results/world-interface/round1/` and `content-audit.json`. |
| `node scripts/world-refinement-verify.mjs` — PASS | Seven desktop surfaces axe zero; 21 small-width surface checks; native CDP swipe; resize; controlled 650ms front/back turn sampled at 280ms with virtual browser clock. `test-results/world-interface/refined/report.json`. |
| `node scripts/world-failure-verify.mjs` — PASS | Reduced motion, unavailable WebGL, context-loss/retry exactly one canvas, coarse touch and 125%/200% equivalent CSS viewport checks. These are not native UI zoom. `test-results/world-interface/failures.json`. |
| `node scripts/world-final-verify.mjs` — PASS | Notebook navigation, inner focus, Enter/ArrowLeft/Escape, runtime reduced motion, intrinsic poster dimensions. `test-results/world-interface/final-focused.json`. |
| `node scripts/repair-verify.mjs` — PASS | Three forward plus one reverse revolutions / 48 indexed stops; per-frame OBB collision accumulator empty, numeric frame count not persisted; orbit/right-pan/wheel/top/all six fly axes/window/exact prior-pose return/R reset. `test-results/after-hours/repair/controls.json`. |
| `node scripts/repair-extra-verify.mjs` — PASS | Full artifact frustum 1280/1440/1920/2560, desk/work/contact; Meet Patch/pet/return; 0/1/5/20 credential fixtures; coarse top/day/window. `extra.json`. |
| `node scripts/repair-unit.mjs` — PASS | 1/2/12/13/20/40 project layout, chord/clearance, swept drone stops before desk/floor/perimeter. `unit.json`. |
| `node scripts/repair-character-route-verify.mjs` — PASS | Eight varying gait poses, minimum two grounded feet, exact bottom contact; 300 scripted lifted-route samples outside furniture proxies. `character-route.json`. |
| `node scripts/repair-mobile-clearance.mjs` — PASS | Latest six 320/390/768 home/top-day bounds and keyboard layouts; zero axe violations/errors; window eighth surface axe zero; actual `resume.pdf` download succeeded. `mobile-clearance.json`. |
| `npm run verify:form` — PASS, isolated 4182 preview | Four intercepted requests; pending, accepted HTTP200, HTTP500/input preservation, successful retry and 15-second abort; zero real messages. `test-results/world-interface/form.json`. |
| `node scripts/living-external-links.mjs` — PASS | 13 supplied external URLs HTTP200 at local check time; availability is not a future guarantee. |
| `node scripts/world-content-audit.mjs` — PASS | Profile, projects, skills, experience, education, achievements, certificates, socials and projectBoundaries unchanged against HEAD; all 12 story structures. `test-results/world-interface/content-audit.json`. |
| `node scripts/living-assets-verify.mjs` — PASS | 110 files/metadata responses exact-byte HTTP200. `test-results/living-workshop/assets-http.json`. |
| `node scripts/world-asset-manifest.mjs` — generated | 123 public entries plus six procedural source entries. `docs/after-hours/WORLD_ASSET_MANIFEST.json`. |
| Raster provenance / detector | 44 shipping rasters, zero missing provenance; `.impeccable/review/repair-provenance.txt`. Detector ran once and returned `[]` in `repair-detector.json`; not a guarantee of every visual property. |

### Screenshot index and finish review

Before: `test-results/after-hours/before/{desk,experience,contact,work}.png`. After: `test-results/after-hours/repair/after-{desk,experience,contact}.png`. Rotation: `rotation-{0,12,24}.png`; bounds: `debug-bounds.png`; camera: `orbit-opposite.png`, `orbit-full.png`, `drone.png`, `top.png`; environment: `window-night.png`, `window-day.png`; cat: `patch-{inspect,pet,nap}.png`; archive: `project-focus.png`.

Latest phone/tablet evidence is `mobile-clear-{320,390,768}-{home,top-day}.png`; it supersedes earlier mobile captures for clearance. `mobile-top-day.png` and `mobile-window.png` show the handoff. Focused monitor/notebook/project/toolkit/Journey/credentials/contact and controlled mid-turn capture remain under `test-results/world-interface/refined/`. Canonical current review copies are `.impeccable/review/desktop.png`, `mobile.png`, `user-1920.png`.

An independent finish reviewer inspected all three supplied owner captures and forty required local captures plus source/geometry. The full review found one P2 phone Patch overlap and no other material findings. After the reserved-row change and fresh captures, the reviewer marked that issue RESOLVED and returned a scoped SHIP for the correction. This was substantive visual/source review, not independent interaction verification or universal acceptance of every possible state.

## Original assets and provenance

The new room/window/environment and voxel cat are actual procedural geometry in `RoomShell.js` and `PatchModel.js`, supported by `worldLayout.js`, `ObjectWorld.js`, `ArtifactModels.js`, `createWorkshopWorld.js`. Their production format is editable JavaScript/Three.js geometry; no GLB or Blender deliverable is needed or claimed. Birds are tiny silhouettes with flaps, not elaborate flight animation. No audio, stock model pack or imported reference assets were added.

The original pixel companion remains sixteen state strips / 85 authored frame positions, including eight unique walk and eight unique return positions; it is the mobile/Quick fallback, not the desktop billboard. The actual renderer supplies home/top/day fallback posters. Existing project SVGs are original conceptual system art, not application screenshots. Real portrait, Techriciate logo, Bloom product photographs, resume and self-hosted licensed fonts remain intact.

The machine inventory `docs/after-hours/WORLD_ASSET_MANIFEST.json` records per-file path, purpose, source/provenance, generation format, dimensions where applicable, byte cost, use, license boundary and fallback. Six procedural source records describe generated geometry; no invented polygon budget or downloadable model weight is asserted. See `docs/after-hours/ASSET_MANIFEST.md` for the human ledger.

## Fresh measured performance

Dedicated local Chromium Lighthouse run, with no other automated browser tests active; `test-results/after-hours/repair/performance.json`:

| Mode | Performance / Accessibility / Best practices / SEO | LCP | TBT | CLS | Recorded bytes |
|---|---|---|---|---|---|
| Mobile 2.5D | 95 / 100 / 100 / 100 | 2.6s | 50ms | 0.002 | 238,305 |
| Desktop Explore | 84 / 100 / 100 / 100 | 0.8s | 350ms | 0.014 | 650,279 |

Earlier 94/76 performance scores are preserved in `prior-performance.json` as history. Scores are lab samples, not a promise of 60FPS, low-end hardware performance or production transfer costs. Desktop blocking and the large lazy scene chunk remain limits.

## Remaining limitations and explicit not-done items

- No production form endpoint or origin is configured. Mocked service states pass; real delivery has not been verified. Direct email remains available. Production canonical URLs/sitemap need the owner's actual `VITE_SITE_URL`.
- Physical devices, Firefox/WebKit, native browser UI zoom, broad assistive technology and heap profiling were not verified. CDP touch and CSS viewport emulation do not replace those checks.
- Room/furniture collisions use conservative proxies and sampled OBB checks; this is not complete mesh physics. The open cutaway is intentional. Orthographic drone is genuine free position/look with an orthographic lens, not FPS perspective.
- Mobile is a static renderer-derived 2.5D room/top/day plan with direct reading surfaces, not free 3D orbit/drone. Tiny bird flaps have no elaborate paths or sound. No audio is present.
- No fake facts, public fixture records, credential links, awards or delivery claims were added. Missing credential links remain unlinked, drafts remain hidden, and conceptual artwork is labeled appropriately.
- No commit, reset, push, merge, deployment or production service message was performed. The current implementation and report are local review artifacts.
