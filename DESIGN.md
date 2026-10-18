---
name: "AFTER HOURS — Alok’s digital workshop"
description: "A personal engineering workshop built from warm paper, matte objects and source evidence."
colors:
  deep: "#111820"
  navy: "#19212B"
  paper: "#F5EFE5"
  steel: "#87A9C4"
  amber: "#D7A35D"
  coral: "#D98E7D"
  mint: "#8FAE9C"
  surface-light: "#fffaf1"
  muted-light: "#53616a"
  muted-dark: "#afbcc6"
  line-light: "#c9c4bb"
  line-dark: "#3e4a54"
  accent-light: "#825a26"
  artifact-ground: "#28333e"
  ink-950: "#111821"
  ink-800: "#202d39"
  paper-100: "#f5f0e6"
  paper-300: "#d7cec0"
  lamp-amber: "#f2c477"
  screen-blue: "#82b4cf"
  moss: "#92af9a"
  room-midnight: "#111922"
  room-wall: "#1d2935"
  reading-paper: "#f5efe4"
  paper-edge: "#d8cebe"
  walnut: "#675347"
  room-gold: "#f2c47b"
  monitor-frost: "#9bc7d6"
  pale-text: "#f4f0e8"
  paper-ink: "#1b2933"
  terminal: "#152b38"
  terminal-chrome: "#233c49"
typography:
  display:
    fontFamily: "Instrument, serif"
    fontSize: "clamp(62px, 6.2vw, 96px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Instrument, serif"
    fontSize: "clamp(38px, 4.4vw, 64px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  case-display:
    fontFamily: "Instrument, serif"
    fontSize: "clamp(43px, 6vw, 86px)"
    fontWeight: 400
    lineHeight: 1.07
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Space, sans-serif"
    fontSize: "21px"
    lineHeight: 1.3
  body:
    fontFamily: "Space, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Space, sans-serif"
    fontSize: "13px"
  room-name:
    fontFamily: "Instrument, serif"
    fontSize: "38px"
    lineHeight: 1
    letterSpacing: "-0.025em"
  reading-body:
    fontFamily: "Space, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  reading-title:
    fontFamily: "Space, sans-serif"
    fontSize: "27px"
    lineHeight: 1.2
rounded:
  handoff: "9px"
  paper: "2px"
  control: "3px"
  key: "4px"
  artifact: "5px 5px 0 0"
  dialog: "6px"
  desk: "8px"
spacing:
  compact: "8px"
  control-gap: "12px"
  action-block: "16px"
  small: "20px"
  medium: "24px"
  toolkit: "28px"
  section-heading: "36px"
  paper: "44px"
  column: "70px"
  gutter: "clamp(20px, 4vw, 72px)"
  section: "clamp(70px, 8vw, 128px)"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.deep}"
    rounded: "{rounded.key}"
    padding: "16px 24px"
  button-text-dark:
    textColor: "{colors.paper}"
    padding: "0"
  filter-selected-dark:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  filter-selected-light:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  contact-field:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.navy}"
    rounded: "{rounded.paper}"
    padding: "13px"
  toolkit-key:
    rounded: "{rounded.key}"
    padding: "10px 12px"
  toolkit-card:
    rounded: "{rounded.key}"
    padding: "28px"
  notebook:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
    rounded: "{rounded.paper}"
    padding: "44px 44px 32px"
  contact-note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
    rounded: "{rounded.paper}"
    padding: "36px"
  object-primary:
    backgroundColor: "{colors.room-gold}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  object-field:
    backgroundColor: "#183340"
    textColor: "{colors.pale-text}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
---

# Design System: AFTER HOURS

## Overview

**Creative North Star: "AFTER HOURS — the world is the interface"**

Alok's personal engineering workshop uses walnut furniture, midnight walls, warm paper, frost-blue displays and amber practical light. The original identity, truthful portfolio, self-hosted fonts and editorial Quick View remain. The owner's 3.0 direction intentionally extends this material world into object-owned reading surfaces: operating a prop opens its monitor, paper, terminal, board or stationery, with semantic HTML aligned to the actual surface.

The workshop is a visual metaphor rather than a claim about Alok's physical room. Patch is an original fictional character. Project illustrations represent source-grounded workflows and do not imply application screenshots or unverified results. The approved repair extends this same identity into a bounded cutaway room, a dimensional day/night window, genuinely free camera controls and a grounded voxel Patch. It preserves the existing visual direction; historical implementation reports describe their original snapshots only.

**Key Characteristics:**

- One persistent procedural matte room on eligible desktop browsers.
- Crisp semantic text on meaningful physical surfaces, with a touch-oriented 2.5D handoff.
- Self-hosted editorial serif and clear sans-serif interface type.
- Complete Quick View, direct case routes, visible focus and reduced-motion access.

## Colors

Warm paper and walnut distinguish physical records from cool operational displays. Root theme tokens remain available for Quick View and case pages; room-scoped tokens in the frontmatter describe the warm practical/cool display relationship across authored night and day moods.

### Primary

- **Room gold:** actions, selected technical details, practical lamp accents and visible focus.
- **Paper amber:** the darker focus/action accent on light reading material.

### Secondary

- **Monitor frost and steel blue:** selected apps, monitor light and technical cues.
- **Coral and moss:** restrained pins, bindings, notebook and character details.

### Neutral

- **Room midnight and wall:** connected architecture and navigation backing.
- **Walnut:** examination station and journey-board framing.
- **Reading paper and edge:** notebooks, credentials and stationery; dark paper ink supplies readable copy.
- **Terminal and chrome:** cool display surfaces with pale text.

**The Material Rule.** Use warm paper for physical reading and cool ink displays for operational interfaces. Object artwork may use local material colors; readable text must retain the surface's semantic contrast.

## Typography

**Display Font:** self-hosted Instrument Serif, registered as `Instrument`, with serif fallback.
**Body Font:** self-hosted Space Grotesk, registered as `Space`, with sans-serif fallback.

Instrument is regular (400); Space has real 400/500/700 files. Preserve these local WOFF2 files and their licenses. The existing editorial display, headline and case roles remain for Quick View and case routes. The compact room name uses the room-name role (42px on narrow screens). Reading body uses the dedicated 16px / 1.65 role, generally capped at 70ch. Object chrome uses 16px medium text; object reading titles use 27px, with local serif notebook and case-document titles.

**The Meaningful Label Rule.** Labels identify real actions, records or states. Do not substitute pseudo-writing strokes for useful content or add redundant heading lead-ins.

## Layout

World view centers the connected room below the controls and compact identity. One object reading surface is authoritative at a time. Desktop bounds are projected from real Three.js surface corners; the camera approaches the same physical bezel/page/station. Reading containers have flexible inner scrolling rather than forcing the entire page beneath fixed chrome. Notebook navigation stays outside the scrollable print region.

At widths at or below 1024px, or with coarse input, Explore becomes a lightweight 2.5D room with actual renderer-derived home/top/day plan images, labeled object entrances, touch archive and responsive reading surfaces. Desktop orbit/drone controls belong only to eligible live 3D; the mobile plan does not imply free 3D. Patch and patrol occupy a reserved flow row before instructions and object actions; the Room settings tray anchors to the whole control cluster. The handoff keeps material-specific borders and fills the available viewport with bounded margins. Explorer stacks, archive files scroll horizontally, notebook flyleaf yields to the reading leaf, toolkit uses two columns, and records/contact stack. Native vertical scrolling remains available.

Reduced motion, low-power hints, explicit Quick View or scene failure select the complete editorial content path. The live renderer additionally requires width at least 1025px and fine input. These are distinct gates: touch does not automatically mean Quick View. Quick View preserves its existing fluid gutter, 1360px content cap, responsive shelves and case typography.

**The Shared Access Rule.** Every substantive object action has a semantic keyboard and touch path. No project, evidence or contact route is available only through a mesh hit.

## Elevation & Depth

Depth comes from actual matte furniture, architectural anchors, local light and a controlled orthographic camera. Paper sheets, pinned notes, drawer files and bezels retain physical edges. Paper shadows and shallow key elevation support their materials; ordinary copy remains quiet. The current room uses one canvas; desktop Patch is an original voxel cat with four paws, pointed ears, muzzle/whiskers, curving tail and grounded gait/contact. Original nearest-filtered pixel artwork remains the mobile/Quick fallback.

CameraDirector is the single camera authority. Look around supplies true 360° orbit, pan and orthographic zoom; Free roam supplies six-axis travel and drag look within conservative room/furniture bounds; Top view supplies overhead pan/zoom. Object focus bookmarks and restores the prior pose. Lifted scripted routes avoid major solids. The orthographic lens is retained deliberately; free position/look is not a perspective FPS. A user-triggered page turn combines a hinged curved paper mesh and matching front/back HTML over 650ms. Reduced motion presents stable readable pages. The sidecar records motion and shadow extensions.

**The Finite Response Rule.** Deliberate interactions move, explain their state and settle. Avoid perpetual gallery rotation, camera wandering or decorative signal wallpaper.

## Shapes

Physical edges determine the reading silhouette: monitor bezel, notebook binding, examination board, drawer tab and stationery. Shared small controls use restrained 3px corners; room navigation uses 6px and the responsive object handoff 9px. Circular pins and Patch's pixel clusters stay local to their objects. The archive is a real independent alcove with a solid concentric plinth and pedestal trays, without radial rods. Evenly spaced content-derived slots and a radius that grows to preserve chord clearance keep artifacts separate from the desk. The cutaway room uses a walnut plank floor, bounded walls and a dimensional signature window; the exposed diorama opening is intentional.

## Components

### Actions, navigation and fields

Real buttons and anchors expose selected/pressed/current states. Reading actions and inputs generally retain 44px targets; compact chrome close controls use 36px. Object focus uses a 3px amber outline offset 3px. Selected desktop apps invert frost and ink; selected document tabs invert walnut and paper. Fields use explicit labels, readable errors and native text editing. Preserve the established theme and command controls.

### Object-owned reading surfaces

The monitor contains Explorer/search/filter, Architecture, About, Build Notes and Contact. Notebook pages contain actual profile/field notes. Project inspection uses a connected examination station with real overview/implementation/architecture/source content. Toolkit keys control their attached terminal. Journey opens truthful pinned records; credentials use a searchable grouped drawer; contact uses the existing form on stationery. The window is an eighth reading surface and controls authored night/day mood with moon/stars, sun/clouds and tiny bird silhouettes. Surface geometry and matching responsive framing replace the earlier detached content-panel arrangement.

### Archive and records

Slots derive from project count; selection wraps and returns to the same slot after inspection. Keep all twelve current projects discoverable through the ring, monitor, browse-all route and full case routes. Credential IDs derive from supplied IDs or kind/title/date, records sort by available year with stable source-order ties, and grouping/search are presentation adapters over content.js. Missing credential URLs stay visibly unlinked and TODO slots stay hidden.

### Patch and motion ownership

Patch has sixteen authored fallback state strips and 85 frame positions on a 48px grid. Live desktop rendering uses the procedural voxel cat; the projected DOM button remains the accessible interaction target. Touch/Quick use the original semantic pixel control. A bounded walk and return path with changing paw poses keeps the live character grounded on the desk. Paused ambient motion does not remove intentional visitor reactions; reduced motion and visibility gates stop incidental animation.

React owns semantic state, one scene renderer owns transforms, and one eligible route-scoped Lenis owns enhanced scrolling. Clean up events, timers, observers, ticker hooks and GPU resources. Render on invalidation and stop settled/hidden/offscreen work.

## Do's and Don'ts

### Do:

- **Do** preserve the original identity, truthful facts, self-hosted fonts and material relationships.
- **Do** keep content and project facts in `src/data/content.js`.
- **Do** keep all twelve cases, direct work/resume actions and complete Quick View access.
- **Do** preserve keyboard focus, touch access, reduced-motion states and complete cleanup.
- **Do** distinguish local measured evidence from physical-device or service guarantees.

### Don't:

- **Don't** invent clients, dates, awards, testimonials, metrics, links or screenshots.
- **Don't** replace object-owned reading with detached generic side panels.
- **Don't** expose TODO slots, link absent credentials or report form success before service acceptance.
- **Don't** treat conceptual artwork or repository existence as proof of production capability.
- **Don't** commit, push, merge or publish this upgrade without owner authorization.

Assumptions: the room and fictional Patch express a metaphor, not biographical facts. No production origin or Formspree endpoint is configured. Real service delivery, physical-device behavior and browsers beyond local Chromium remain unverified. Current implementation/QA status lives in [WORLD-REPAIR-REPORT.md](WORLD-REPAIR-REPORT.md) and docs/after-hours/CURRENT_STATE.md; earlier ledgers/scores are historical. The cutaway room, orthographic drone and static mobile 2.5D plan are intentional scope choices. Conservative proxy collisions and local Chromium checks do not guarantee universal hardware or physics behavior.

Writing Desk & Navigation Assumptions:
- Mailto links are avoided site-wide to prevent triggering local mail client popups (e.g., Microsoft Outlook). Email interaction points either copy the address directly with visual/audio feedback or focus the Writing Desk message form.
- The Writing Desk and Visitor Dossier explicitly address two primary audience personas: Engineering Recruiters (evaluating technical skills, backend reliability, and full-time hiring) and Students/Peers (exploring architecture blueprints, hackathon lessons, and tech roadmaps).
- Device view delivery: Mobile and touch viewports (< 1025px) automatically default to Quick View for maximum speed, battery efficiency, and clean editorial presentation; desktop and laptop viewports (>= 1025px with fine pointer) default to the immersive 3D Workshop Atelier. Both retain access to toggle views in room settings.

