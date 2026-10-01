# Alok Sahoo — Systems, with a human side

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
