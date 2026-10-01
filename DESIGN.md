# Alok Sahoo — Systems, with a human side

The identity and implementation history below are retained. The canonical sections at the end record the current twelve-chapter project-library extension (2 October 2026); references to three studies in earlier phases describe the former composition, not the current collection.

## Identity and purpose

Alok is a software engineer and final-year Information Technology student in Thane. His strongest thread is turning complex systems into usable software: backend APIs, institutional workflows, security visualization, and explainable detection. Within 30 seconds, visitors should see a real person, concrete engineering work, and an easy way to contact him.

## Four directions explored

1. Technical field notebook: diagrams, blue ink, annotations. Fits the backend/security work, but a pure blueprint risks hiding the person.
2. Synthwave terminal: neon, command windows, kinetic code. Fits technical curiosity, but gaming tropes would weaken recruiter clarity.
3. Tactile scrapbook: event portrait, stickers, loose project notes. Fits hackathon experience, but dense layering would compete with project evidence.
4. Editorial systems atlas: monumental typography, quiet grids, original system diagrams. Best fit: communicates human confidence and engineering structure together.

## Chosen direction

An editorial systems atlas dominates. Blue technical diagrams and a lightly tilted photo supply the personal accents. No fabricated dashboards or screenshots: project visuals are explicitly conceptual architecture studies. White space and confident type keep the technical material readable.

## Tokens

- Chalk #f5f6f8; ink #182b48; muted #526078; blue #254cbd; signal #ed6b36; white #ffffff.
- Dark: midnight #101c30, pale #edf2fa, muted #a9b6cd, accent #ff986d.
- Self-hosted Latin Space Grotesk for interface/display; Instrument Serif for editorial headings. WOFF2, swap, critical font preload.
- Fluid hero 80–240px; section titles 44–96px; body 16–20px; metadata 12–14px.
- Spacing: 8, 16, 24, 32, 48, 64, 96, 128px. Twelve-column desktop grid, six-column tablet, single-column mobile. Content max 1600px.
- Motion: 180ms hover, 550ms transitions, 850ms entrance; power3.out and expo.out. Transform/opacity only. Reduced motion renders final states; touch disables cursor/magnet/tilt.
- Cursor: native by default; contextual View disk over projects; hover state over controls; drag state over diagrams.

## Story and signature

Hook: enormous name and an event portrait. Approach: human context with a live Thane clock. Proof: asymmetric project studies. Signature: an interactive architecture diagram expands each project's actual resume-supported pipeline; tap nodes to inspect what each layer does. Credibility: skill categories, work timeline, education, honors and certificates. Contact: oversized invitation, email, and a validated form. Quiet footer marquee closes the story.

## Assumptions and missing data

- Resume is source of truth; expected graduation is 2027, final-year status retained exactly as supplied.
- Project years are omitted where the resume does not establish them. AURA is dated 2025.
- Certificate dates are year-only; Google Drive URLs and thumbnails are absent. Cards disclose that documents are not linked yet.
- TrustNet-AI has no verified repository/live link. Others use extracted PDF annotations.
- Formspree endpoint and public production domain require owner configuration. No submission is claimed without an endpoint.
- Provided aws2.jpeg is the only portrait. JPEG retained as requested; optimized WebP used for rendering. Conceptual diagrams are interface/data graphics, not product screenshots.
- No availability claim or client testimonials. Phone from resume lives in content data; public contact prioritizes email.
- No Three.js: semantic diagrams provide stronger evidence with less GPU work. Lenis is the only smooth-scroll engine.
- Writing guidance comes from frontend-design; installed X voice skill is unrelated and not applied.

## Validation log

Updated after production build, lint, responsive browser checks, keyboard interactions and contact state checks.

- All seven implementation phases have independent Git commits and successful production builds/lint.
- Playwright: 360, 768, 1024, 1440 and 1920px screenshots reviewed; no horizontal overflow. Axe reports zero violations in light and dark mode. Console/page error list is empty.
- Verified project filters, three detail routes, next/previous links, architecture node selection, modal focus containment, Escape and Ctrl+K, theme persistence, clipboard, mobile navigation, 404, reduced-motion static content and no-JavaScript fallback.
- Contact validation, loading, success, reset, service error and retry tested against intercepted requests in a separate configured build. No external messages sent. Production build retains the unconfigured endpoint fallback.
- Local Lighthouse mobile measurement: Performance 93, Accessibility 100, Best Practices 100, SEO 100. LCP 2.8s. This is a local measurement, not a universal 60fps or deployment guarantee.
- Initial JavaScript reduced from 444KB to approximately 304KB through lazy motion imports; GSAP, ScrollTrigger/SplitText/Lenis, project routes and field canvas are separate chunks. Latin fonts and responsive WebP portrait are self-hosted; font licenses included.
- External GitHub profile/repositories, reimbursement demo and Techriciate returned HTTP 200. LinkedIn returned 999 (automated access restriction); retained the exact resume URL rather than claiming successful verification.
- Origin-dependent sitemap/canonical/social URLs intentionally require VITE_SITE_URL. Certificate documents and TrustNet-AI public links remain owner inputs.
- Motion changes from the initial proposal: bounded CSS tilt/magnet effects prevent overlapping GSAP owners; GSAP handles typography, page entrances, pinned desktop experience, scrubbed timeline, parallax and velocity marquee. No forced horizontal scrolling; mobile stacks the studies.

## Upgrade brief — Systems in Motion

The existing architecture remains. The refinement uses editorial tech maximalism for typography, restrained photographic imperfection and the existing navy/coral identity. No new project facts or missing dates are inferred.

Baseline audit: build/lint pass; Codex Browser console is clean. 35 sampled metadata elements render below 12px. SplitText autoSplit can rebuild character wrappers after font loading/resizing, restarting the name reveal. Portrait pointer rotation is unbounded relative to its intended treatment. Header progress and active link share the same baseline. Native anchor calls compete with Lenis. Credentials repeat an unfinished label; artwork repeats one generic subtitle. The stylesheet has overlapping media overrides and negative-margin mobile portrait composition. Footer visibility handlers can resume the marquee when offscreen. Sound preference resets after route changes. Route motion initializes above Suspense, before lazy content is mounted.

Phase 1 fixes: stable masked line wrappers; no letter opacity or reconstruction; once-only entrance with fast-scroll completion; bounded ±1.5° tilt; route-local motion initialization; one Lenis scroll coordinator; responsive matchMedia teardown; readable minimum metadata; missing credential URLs render plain noninteractive articles without placeholder text; canonical TrustNet-AI and Reimbursement System names; project cursor ownership separated from route animations.
Phase 2 design: centralized navy/paper/coral tokens replace scattered hover colors. Cream Journey chapter remains paper in both themes; other chapters follow the selected theme. Work now has three large indexed rows with role, stack, category, available year and supported status. Case-study additions are interpretations of the existing resume facts (problem context and design intent), never new results or benchmarks. Skills use an application anchor and category lists without confidence ranking. Education and timeline text share a parent subgrid. Recognition keeps the featured finalist; semantic flag/trophy/medal icons distinguish honors. Seven certificates become seven compact index rows, with no empty grid position. All body copy is 16–18px, metadata 13–14px, and microcopy is at least 12px. Mobile hero uses parent grid placement instead of negative margins.

### Upgrade phase 3 — interactions and case studies

The command palette now filters sections, projects, resume, social links and actions. Native dialog focus containment is retained; arrows, Home/End and Enter offer quick selection while Tab reaches every real button/link. Shortcut labels follow the platform. Tooltips appear on hover and keyboard focus.

React Router's native View Transition integration now shares project artwork names across the card and case-study hero. The existing routes are registered as data-router children under the App shell; the small case-study component loads eagerly to avoid capturing a Suspense loading screen. Unsupported browsers and reduced motion use normal navigation. Case studies render supplied problem, context, decisions and outcome fields only. The same media component handles illustrations and future screenshots in both locations.

Form errors attach to individual controls and focus the first invalid field. Pending and failed requests preserve values; only successful HTTP responses clear the form. Copy feedback lasts 1.8 seconds. Sound remains opt-in and persists within the session; oscillators disconnect after playback. The footer's 40-second loop runs only when visible and the document is active, including live reduced-motion changes. Work uses large vertical editorial rows instead of another pinned section: this preserves all three projects, natural scrolling and laptop usability.

### Upgrade phase 4 — bounded atmosphere

The hero constellation contains exactly 28 deterministic nodes, nearby network connections and four decorative labels (API, AI, DB, SYS). Drawing is capped at 30 frames per second and pixel ratio 1.5. Slow movement and pointer influence stay bounded to a few pixels. It stops offscreen and when hidden, and is disabled below 769px, for coarse input, reduced motion, data saving and reported low hardware capacity. No nodes are React elements. Media changes restart only one loop; effect cleanup cancels frames, observers and listeners.

A deterministic 128px paper grain is confined to the portrait frame and cream Journey chapter. The existing candid photo remains intact. The portrait's 1.5-degree offset frame and coral dot provide the intentional imperfection; no extra tapes, gradients or glass layers were added.

The 320px audit exposed an intrinsic-width project grid track. Tracks and children now explicitly shrink, and the narrow forensics diagram uses a smaller matrix with readable labels. Theme QA also caught a transient low-contrast button during opposite foreground/background color interpolation; button colors now switch atomically while pointer translation remains animated.

Visual review caught nested aspect ratios cropping the case-study artwork. The media wrapper now follows its child's natural ratio, with content-safe minimum heights and narrower mobile compositions. Grain opacity was reduced below four percent. Programmatic section navigation also synchronizes Lenis with the real browser offset before applying a new target, covering keyboard focus and scrollbar jumps during an active animation.

A fast route-return test revealed the old delayed hash anchor could overtake a newer Back to top action. Hash targets now queue for the next rendered frame and direct user navigation cancels the pending target. The fallback before Lenis is ready is an instant browser jump, avoiding two smooth-scroll systems. Case-study links with no URL are omitted, and project routes identify Work as the active navigation section.

The cursor test caught scroll events hiding the View cursor after a hover-triggered browser scroll. A single queued hit test now checks the artwork under the saved pointer position; it stays visible while the artwork remains beneath the pointer and disappears elsewhere. The native cursor is suppressed only while the contextual cursor is actually active. Media changes, clicks, blur and pointer exit clear it, with all listeners and queued frames cleaned up.

Final console QA found Lenis's automatic anchor handler racing React Router's cross-route hash navigation, producing missing-target warnings. Automatic anchors are disabled; the hero action and route/navigation controls use the same explicit scroll helper. The installed Lenis version already accounts for CSS scroll padding, so duplicate manual offsets and section scroll margins were removed. One 96px root scroll-padding token supplies the header clearance. Universal font and portrait preloads were also removed: routes request the fonts they actually use, while the hero's responsive image retains high fetch priority without fetching an unused larger source on mobile. The no-JavaScript project name is canonical too.

The final touch review restores a visible Search icon for the command button when its desktop shortcut label is hidden. Its accessible label and keyboard shortcut remain available at all sizes.

A direct native API probe showed the first wildcard bridge still left descendant declarative Routes outside the data-router transition context. Routes now register as real children in the entry point and App renders an Outlet; Home receives its existing callbacks through Outlet context. URLs, pages and animation lifecycles remain the same. The probe requires the browser transition's ready and finished promises to succeed, and verifies both reduced-motion and unavailable-API fallbacks.

First-visit case-study accessibility also identified the brief welcome surface outside a landmark; it is now a native named section.

### Final upgrade evidence

- `npm run build`, `npm run lint`, `npm run verify`, `node scripts/extended-verify.mjs` and the separate mocked `scripts/form-states.mjs` checks pass.
- Home: 320, 375, 430, 768, 1024, 1280, 1440 and 1920px, both themes; zero overflow, axe violations, under-12px content or browser warnings/errors. Keyboard search/selection, native modal focus containment, Escape, mobile navigation, copy, resume download, filters, routes and theme/sound persistence pass.
- All three case studies: all eight widths; no overflow or artwork-label clipping. Case-study axe scans pass at 320px. Touch has a visible command button, usable palette, inactive particle field and no contextual cursor.
- Native transition: actual browser API invoked, ready and finished both true. Reduced motion does not invoke it. An unavailable API retains working route navigation.
- Lifecycle: 701 DOM elements, one canvas, one desktop pin and 20 ScrollTriggers remain stable over three route-return cycles at 1440px. The pin is removed at the mobile breakpoint. Hidden/offscreen gates are verified at hero, Journey and footer; offscreen running count is zero. Heap retention is not measured.
- Form: all requests mocked against an isolated build. Invalid controls receive inline errors and focus; loading and failed requests retain input; only successful responses clear values, including a successful retry. No message was sent.
- Final local mobile Lighthouse: 94 performance / 100 accessibility / 100 best practices / 100 SEO. FCP 2.2s, LCP 2.6s, TBT 100ms, CLS 0.015. A prior run scored 95 performance; results vary by timing. No typecheck command is configured.

### Upgrade phase 5 — polish and refresh experience

- Scroll restoration on refresh: `history.scrollRestoration` is set to manual early in index.html and main.jsx. On browser refresh/reload, the scroll offset immediately resets to 0 (Hero section on Home, top of case study on detail pages), preventing browsers from restoring arbitrary scroll positions. Hash targets from previous navigations are cleaned and suppressed on initial reload, ensuring the Hero is always the first visual state. Lenis initializes cleanly at offset 0.
- Frosted-glass header: `.nav` adopts a subtle frosted-glass background (`color-mix(in srgb, var(--bg) 88%, transparent)` with `backdrop-filter: blur(12px)` and smooth color transitions), maintaining WCAG AA contrast while creating depth as content glides beneath.
- Hero cue interaction: "Scroll to connect" in Hero is linked to `scrollToTarget("about")`, replacing the abrupt native jump with coordinated Lenis smooth scrolling.
- Floating Back to Top button: Unobtrusive floating button appears once scroll exceeds 480px, with keyboard focus, accessible label, reduced motion compliance, and smooth Lenis scroll to 0.
- Project case-study wayfinding: Direct "Home / Hero" return links added to the top navigation bar and bottom pagination in project detail pages.

The editorial identity, candid portrait, self-hosted type and resume facts remain intact. Missing credential URLs remain visibly unlinked. The form endpoint and production origin are owner configuration inputs; the email fallback works. No site was published.

## Overview

**Creative North Star: "Editorial systems atlas"**

The portfolio retains its navy, paper and coral identity, candid portrait and self-hosted typography. The owner explicitly pinned a digital technical-library direction for Projects; this is an approved extension of the incumbent world, not an identity replacement. Its technical diagrams explain domain workflows, while concise case studies expose evidence and limits for recruiters and engineering peers.

The current collection comprises twelve equally treated chapters: HistoFacts, AURA, Reimbursement Automation System, Techriciate, Bloom Blossom, FinCoach AI, Talent-Sync, Credit Card Fraud Detection, BookItNow, Speedotype, COSMEON FS-LITE and TrustNet-AI. AURA uses its corrected repository mapping; Reimbursement is one updated chapter. Historical three-study descriptions above remain implementation history.

**Key Characteristics:**

- Equal chapter importance, with domain filters and technology/domain command search.
- Readable technical publishing, quiet book edges and semantic workflow illustrations.
- Source evidence and resume provenance remain distinct from claims of authorship or production readiness.
- Native desktop collection scrolling and full-width mobile chapters.

## Colors

The extension inherits the live theme variables in `src/style.css`: navy and raised paper surfaces, coral interaction accents, muted text and quiet divider lines. Covers use restrained domain-specific tints inside the same notation grammar; those local illustration colors are not replacements for the portfolio palette.

**The Inherited Palette Rule.** New library surfaces use the existing semantic theme variables; a project's cover tint does not become a global accent.

Pre-existing documentation drift is recorded, not repaired in this extension: the historical Tokens section names chalk (#f5f6f8) and dark muted (#a9b6cd), while current CSS uses paper (#f5f1e9) and dark secondary text (#b6c2d4). Its 850ms entrance proposal also differs from the existing slow token (1200ms). The original section is preserved rather than treating its historical values as fresh measurements.

## Typography

**Display / Body Font:** self-hosted Space Grotesk, registered as `Space`, with sans-serif fallback.
**Editorial Font:** self-hosted Instrument Serif, registered as `Instrument`, with serif fallback where specified.

The library balances serif chapter titles against compact, readable interface text. Library headings use a fluid display size (48–80px), line height (1.04); book titles use Instrument Serif (34px, 400, 1.06), becoming 36px on mobile and 32px at the narrowest breakpoint. Case titles use Instrument Serif (48–88px, 400, 1.04). Book descriptions use body copy (14px, 1.6); case summaries scale (18–23px, 1.6). Metadata and cover evidence use 12–13px; explanatory architecture text uses 17px. These are current library measurements, not a rewrite of unrelated page type.

**The Meaningful Label Rule.** Chapter positions and architecture steps express real sequence. Domain labels belong to covers, filters and case metadata; redundant heading eyebrows and decorative feature numbers are omitted.

## Layout

The inherited container caps content at 1600px, with fluid side gutters (20–64px). Above 768px, the library is a native horizontal flex track with mandatory snap alignment, a gap (28px) and equally sized book slots (330–420px). It displays chapter position, transform-based progress and previous/next controls. Horizontal input stays native; the track opts out of Lenis wheel handling without converting vertical wheel motion into horizontal navigation.

At 768px and below, chapters stack vertically at full available width; desktop track navigation is hidden. Case-study introduction, engineering and status layouts collapse to one column. Architecture and feature grids become two columns, then one at 375px and below. Cover stages remain readable in a two-column mobile pipeline; the case hero uses four columns for the same pipeline on desktop. Detail routes retain return-to-library and wrapping previous/next chapter navigation.

**The Equal Chapter Rule.** The full collection remains visible through one shared structural grammar. Filters select domains without featured, secondary or archive tiers.

## Elevation & Depth

Book depth is local to the owner-requested chapter objects: perspective (1100px), a neutral spine (8px), thin borders and layered page-edge shadows. At rest the exact shadow stack is `5px 7px 0 -3px var(--bg), 7px 7px 0 -3px var(--line), 10px 18px 25px -20px #0008`. Fine-pointer hover substitutes `5px 8px 0 -3px var(--bg), 7px 8px 0 -3px var(--line), 12px 28px 35px -22px #0009`. These page edges are a scoped book metaphor, not permission to add hard-offset shadows across other portfolio surfaces.

## Shapes

Books use subtly asymmetric corners (2px 5px 5px 2px), one-pixel outlines and a quiet neutral spine. Filters and architecture buttons use restrained corners (2px); chapter arrow buttons are circular (46px). Cover nodes, AURA outcome markers and active architecture descriptions use one-pixel rules. No thick accent strips are introduced as a reusable library device.

## Components

### Chapter books and covers

Each complete book is one semantic case-study link, with chapter position, project-specific visual, title, purpose, up to three technology tags and a visible exploration action. No essential information depends on hover. Keyboard focus supplies an explicit outline (2px, offset 6px). Fine mouse input alone enables bounded rotation (±5° horizontal, ±2° vertical); hover lifts the book (7px), scales it (1.008) and shifts adjacent books (5px). Transform and shadow transitions take 450ms using the inherited easing. Queued pointer frames are cancelled during reset and unmount.

Cover content, workflow labels, imagery references and provenance captions are editable only in `src/data/content.js`; presentation components supply geometry. TrustNet-AI now shows Image input → Forensics → Vision models → Explanation and explicitly labels its pipeline as conceptual and supplied-resume based. FinCoach shows its demo-context/advisor/explanation workflow, without invented financial plot measurements. Icons use the existing Lucide stroke system. The same media renderer supplies library and case-study artwork.

### Filters, navigation and architecture

Domain filters expose pressed state and at least 44px targets. On desktop, ArrowLeft/ArrowRight and Home/End move through the native track and focus chapter links; Enter opens the focused chapter. Track measurement uses a ResizeObserver, passive scroll listener and one queued animation frame, all cleaned up. Chapter navigation retains real links; architecture steps are ordered buttons with pressed state and a live status description, usable by keyboard and touch.

### Source, role, status and media assumptions

Repository code outranks README claims. `PROJECT_RESEARCH.md` records inspected snapshots and implementation limitations; source links in each case expose that evidence. A system capability is not an individual contribution claim. Roles and years appear only where supplied evidence establishes them. HistoFacts is a fork with unestablished individual authorship. TrustNet's facts and contribution come from the supplied resume; its public repository and accuracy benchmarks are unavailable, its development status remains visible and no public link is fabricated.

Only documented live URLs are rendered. Reimbursement's documented portal returned HTTP 200 during research; Techriciate's documented URL returned HTTP 403 to automated checking, so no successful availability assertion is made. Other unverified deployments are omitted. Prototype, demo-data, configuration-dependent, simulated and incomplete behavior stays explicit: FinCoach is not linked to banking data, BookItNow does not fulfill reservations, Bloom's persistence requires configuration, and COSMEON's consensus/audit are simulations. No accuracy, throughput, user-count or production-scale metrics are inferred.

No usable application screenshots were established in the repository inventories. Authored covers are labeled system illustrations, not screenshots or measured results. Bloom Blossom uses repository product imagery and Techriciate uses its repository logo; compressed WebP assets retain their recorded provenance. Library imagery is lazy except prioritized case artwork. No stock art, fabricated dashboard or new GPU scene was added.

### Motion and performance scope

One Lenis instance remains the vertical-scroll coordinator. Native track navigation uses instant movement under reduced motion. CSS removes book transforms/transitions, progress transitions and ticket rotation for that preference; touch and coarse pointers receive no book tilt. Progress animates with scaleX rather than width. The existing route-transition fallback, field visibility/hardware gates, and cleaned-up GSAP lifecycle remain part of the incumbent implementation. No dependency was added for the library. These implementation facts do not establish a new Lighthouse score, constant frame rate or measured heap-retention guarantee.

### Scoped validation — 2 October 2026

Fresh parent implementation evidence reports **PASS** for build and lint, full `npm run verify` at nine widths in both themes (zero axe violations, console errors or overflow), `scripts/library-verify.mjs` at eight widths, and `scripts/extended-verify.mjs` across all twelve detail routes at nine widths (320, 375, 390, 430, 768, 1024, 1280, 1440, 1920px: 108 route-width checks). Functional coverage includes filters, Home/End/arrows/Enter, architecture interaction, stack/domain search, bounded hover and ordinary vertical wheel behavior. Main verification waits 600ms for the existing theme crossfade to settle, removing a transient mid-transition navigation-contrast false failure. Isolated mocked contact checks also **PASS** for pending, success, error and retry; no external message was sent and form success requires a successful service response. `PROJECT_LIBRARY_REPORT.md` records implementation and QA scope. The documenter inspected source and recorded this evidence; it did not rerun browser QA or inspect screenshots.

The independent screenshot review initially returned **fix**, listing eight material items. Source inspection confirms fixes 1–7: semantic TrustNet/FinCoach pipelines, resume provenance, repaired apostrophe, removed redundant eyebrows/feature numbering, Lucide arrows, one-pixel accent rules and centralized cover content. This merge addresses documentation item 8. The final independent reviewer returned scoped disposition **ship**: all eight listed fixes resolved across 31 valid final captures, with no fix-batch regressions observed. This is a screenshot-based fix-list review, not a whole-surface independent functional audit; the fresh functional results above are supplied separately by the parent. Historical Lighthouse scores above belong to earlier phases, not this twelve-chapter extension.

## Do's and Don'ts

### Do:

- **Do** preserve the inherited editorial systems atlas and its self-hosted fonts.
- **Do** keep all twelve chapters equally discoverable, with source evidence and honest boundaries.
- **Do** edit project facts, cover wording and provenance in `src/data/content.js`.
- **Do** preserve native scrolling, keyboard focus, touch access and reduced-motion final states.

### Don't:

- **Don't** infer authorship, dates, metrics, deployment or model validity from repository existence.
- **Don't** present conceptual diagrams as screenshots or resume-supported facts as verified source implementation.
- **Don't** turn local cover colors, book-edge shadows or genuine sequence markers into unrelated decorative patterns.
- **Don't** canonize redundant eyebrows, decorative feature numbering, glyph icon stand-ins or thick accent strips as the library system.
- **Don't** link absent credentials, expose TODO slots, claim form success before service success or publish without owner authorization.
