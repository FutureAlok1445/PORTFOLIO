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
rounded:
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
---

# Design System: AFTER HOURS

## Overview

**Creative North Star: "AFTER HOURS — the personal engineering workshop"**

Alok’s engineering work lives in one personal after-hours workshop. Warm paper, deep ink, matte miniature objects and restrained amber/steel light connect the real person to inspectable project evidence. The name, engineering statement, portrait and work/resume actions lead; the desk and quiet charcoal companion support them.

This is the owner-pinned Experience direction implemented in code, with no approved image comp. The surface composition and quality bar remain in `.impeccable/surfaces/after-hours-home.md`. The workshop is a metaphor, not a claim about Alok’s physical room; Patch is an original fictional companion. Project illustrations describe workflows and must not imply application screenshots or unverified results.

**Key Characteristics:**

- One procedural matte desk on eligible desktop browsers, with immediate authored vector fallback.
- Self-hosted editorial serif headings and clear sans-serif body/interface text.
- Distinct source-grounded artifacts, warm notebook pages, tactile tool keys and compact archive rows.
- Native phone scrolling, semantic controls, visible focus and readable reduced-motion states.

## Colors

Warm neutrals establish the workshop; restrained functional accents identify light, action and object details. The frontmatter is normative.

### Primary

- **Warm amber:** primary actions, dark-theme accent/focus, selection and lamp/object details.
- **Paper amber:** the darker light-theme accent keeps labels and focus readable on paper.

### Secondary

- **Steel blue:** cool monitor light and technical marks inside the authored objects.
- **Soft coral:** notebook marks and small object details.
- **Muted mint:** plant/lamp/notebook details and quiet status dots.

### Neutral

- **Deeper ink / ink:** dark background and raised surface; ink becomes text on light paper.
- **Warm paper / raised paper:** light background and fields. Notebook, ledger and contact remain paper in both themes.
- **Light/dark muted text and rules:** theme-specific supporting copy and one-pixel separation.
- **Artifact ground:** the illustration stage, scoped to project artwork.

Light mode maps background to paper, surface to raised paper, text to navy, muted/rule to the light variants and accent/focus to paper amber. Dark maps background to deep, surface to navy, text to paper, muted/rule to the dark variants and accent/focus to amber. Dark is the initial workshop atmosphere; the theme control remains available.

**The Material Rule.** Object colors stay local to their artwork; shared text and controls use semantic theme colors.

## Typography

**Display Font:** self-hosted Instrument Serif, registered as `Instrument`, with serif fallback.
**Body Font:** self-hosted Space Grotesk, registered as `Space`, with sans-serif fallback.

Instrument provides narrow editorial contrast; Space keeps evidence, labels and actions legible. Local WOFF2 files use swap; Space has real regular, medium and bold faces (400/500/700), Instrument regular (400). Do not synthesize extra faces.

The frontmatter records the current hero, section, case, title, body and label roles. Body paragraphs use generous leading; project descriptions are compact (14px), About copy is larger (18px, 16px on phone), and supporting metadata is 12–13px. Case summaries scale (17–22px); technical copy generally caps at 65ch, with architecture descriptions up to 75ch. The hero summary caps at 39ch on desktop. Dates use tabular numerals.

**The Meaningful Label Rule.** Labels identify real domains, sources, states or location/time. Avoid redundant lead-ins above already clear headings.

## Layout

The centered content width caps at 1360px with the fluid gutter token; section spacing uses the fluid section token. Desktop hero columns are 0.9fr/1.1fr; About and Journey use 0.8fr/1.2fr, Contact equal columns. These are surface compositions, not a universal card grid.

The artifact shelf uses three equal columns and gaps (44px vertically, 28px horizontally), two columns at 1100px and below, then one at 520px and below with a 35px gap. All twelve files share discoverability; filters express domains without ranking projects.

At 768px and below, hero, About, Journey and Contact stack; the desk follows the introduction and caps at 620px. Navigation becomes a wrapping menu. At 520px and below, gutters become 20px, toolkit/honors and case text grids become single-column, forms tighten to 25px 22px and case architecture to 22px. Hero name becomes 70px; the case title becomes 48px and can wrap long words. Above 520px, the final base hero rule retains the frontmatter clamp, superseding earlier responsive font-size declarations. The 1700px rule widens hero spacing, but its earlier font-size declaration is superseded by the final base rule.

The desk stage retains a 10:7 ratio and the final desk radius. WebGL eligibility starts at 1025px with fine pointer and no reduced-motion preference; saving data and reported low device capacity also select the authored fallback. Lenis eligibility begins at 769px with fine pointer and no reduced-motion preference. These gates are intentionally distinct.

**The Readable First Rule.** Critical copy and actions render immediately; motion and the scene never gate access to content.

## Elevation & Depth

Depth belongs to physical workshop objects and paper, with quiet tonal separation elsewhere. The procedural desk uses actual mesh thickness, matte materials (roughness 0.88, metalness 0.02), orthographic framing and warm/cool lights. It is the only real-time 3D anchor.

The sidecar owns exact shadow and motion values. Paper pages share a diffuse shadow and a local paper-noise texture; tool cards/keys use shallow soft elevation; artifact art lifts slightly without adopting the former book spine or page-edge stack. The dialog alone receives a larger modal shadow.

**The Local Depth Rule.** Keep dimensional treatments on meaningful workshop objects; do not spread 3D canvases or heavy shadows across ordinary copy.

## Shapes

Paper edges are nearly square; keys, small controls and modal corners remain restrained. Artifact tops soften without rounded bottoms. One-pixel borders supply structure; small dots are circular. The notebook’s half-degree tilt and short amber tape mark are local authored details. The final desk is a softly rounded rectangular stage, superseding the earlier arch silhouette.

## Components

### Actions and navigation

Primary actions use amber, deep ink text, medium weight, the action padding and a shallow shadow. Hover lifts 2px over 180ms. Resume/text actions underline on hover. Shared focus is a 2px theme outline offset 5px; controls generally provide a 44px minimum target, with the compact phone header using 38px minimum widths. The sticky header is 80px high, 70px on narrower screens, with a one-pixel bottom rule and selected-section inset accent. Theme and command controls remain real buttons.

### Project artifacts and case files

Each artifact has a whole case-study link, distinct 8:5 source-grounded illustration, title, description, available status/technology and separate available code/live links. Its art lifts 4px and rotates −0.4 degrees over 250ms on hover; reduced motion removes the transform. Source photographs/logos remain distinguishable from conceptual illustrations. Missing links are omitted. Case pages preserve problem, implementation, interactive architecture, decisions, source references and honest scope; selected architecture controls invert semantic colors.

### Toolkit keys and filters

Domain filters and tool groups use pressed/selected states with semantic color inversion. Toolkit containers use the key radius and medium padding; keys use a shallow shadow, 44px minimum height and 13px type. Hover lifts 2px; pressed keys sink 2px. Selection explains the tool’s actual application rather than expressing an invented proficiency score.

### Notebook, ledger and archive

About is a paper note with readable personal context; substantive location/time appears in its footer. Journey is a paper ledger with real dated records and a thin progress rule. Credentials are compact rows; credentials without URLs remain visibly unlinked, and TODO slots are hidden.

### Contact note and command dialog

The contact form stays warm paper with navy text, a subtle amber top edge and diffuse paper shadow. Fields use raised paper, a one-pixel neutral border, small corners, 13px inset padding and a darker paper focus/caret. Invalid fields report their errors; pending/failure states retain entries. Submission success requires a successful service response. The command dialog is bounded to 600px / viewport minus 32px, has a dark backdrop and keyboard-operable results.

### Desk and Patch

The desk’s Work/About/Contact hotspots have ordinary DOM links beneath the artwork. The immediate SVG poster remains behind the lazy desktop canvas and survives unsupported rendering or context loss. The scene renders at a capped 30fps, pixel ratio capped at 1.5, and stops offscreen/hidden. Pointer influence is damped and bounded.

Patch uses original 48×48 source frames: idle 4, blink 3, tail 5, walk 8, sleep 4, peek 4 and paw 4 (32 distinct frames). The default CSS display is 96px, with desk scaling to 0.8 at 768px and 0.55 at 520px. Walk is confined to a 24px local stroll; no viewport wandering. Sprite loops pause offscreen/hidden; reduced motion uses the first idle frame (sleep retains its static pose). Keyboard activation triggers the same quiet reactions as click.

GSAP entrances move copy 12px over 0.8s and desk 8px over 1s with expo.out. The ledger rule scrubs with no easing. One route-scoped Lenis uses 0.85s duration on eligible desktop; phones use native scroll. Every effect must remove listeners, observers, timers and ticker hooks and dispose GPU resources.

## Do's and Don'ts

### Do:

- **Do** preserve the pinned workshop world, self-hosted fonts and semantic theme mappings.
- **Do** keep all twelve artifacts equally discoverable and source-grounded.
- **Do** edit content and project facts only in `src/data/content.js`.
- **Do** keep semantic text, keyboard controls, visible focus, touch access and reduced-motion final states.
- **Do** preserve one eligible route-scoped Lenis instance, native phone scrolling and complete resource cleanup.

### Don't:

- **Don't** invent clients, dates, awards, testimonials, metrics, project links or application screenshots.
- **Don't** infer authorship, deployment or production readiness from repository existence.
- **Don't** obscure meaningful artwork labels or reintroduce redundant heading eyebrows.
- **Don't** expose TODO slots, link missing credentials or report form success before service success.
- **Don't** publish without owner authorization.

Missing service endpoint, production origin, credential document URLs and TrustNet public links remain owner inputs. Existing resume facts and supplied development status remain accurate; concept art does not certify application capability.

Current evidence is in `test-results/after-hours`: runtime records support nine widths (320, 375, 390, 430, 768, 1024, 1280, 1440, 1920), both home themes and twelve case studies at those widths. The independent finish verdict is ship for the two scored fixes; it does not certify runtime behavior. Final local measurements and their sampling context belong in [the implementation report](AFTER_HOURS_IMPLEMENTATION_REPORT.md). These are local measured results, not universal performance or design guarantees; heap was not measured.
