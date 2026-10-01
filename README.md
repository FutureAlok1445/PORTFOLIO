# Alok Sahoo — portfolio

React + Vite portfolio based on the provided resume and event portrait. The design rationale, explored concepts, tokens, assumptions and verification notes are in DESIGN.md.

## Run

Requires Node 22.12+ or 24+. Run `npm install`, then `npm run dev`. Production: `npm run build`; inspect with `npm run preview`. Run `npm run lint` for source checks.

## Edit content

All profile facts, skills, work history, education, honors, project records and certificates live in `src/data/content.js`. Add projects to `content.projects` with a unique slug, description, summary, role, optional year, stack, image, live, repo, status and nodes. Optional case-study fields are problem, context, decisions (an array), outcome and artLabel. Empty sections and links stay hidden. Leave missing URLs as empty strings. Nodes contain `name` and `text`; the detail view uses them for the interactive architecture study. Set `visual` to `forensics`, `network` or `workflow` for a conceptual fallback; an image is optional. These studies are not product screenshots. Hidden TODO examples live in `content.drafts`; they never render publicly.

Add certificate records to `content.certificates`: title, issuer, date, url and optional thumbnail. Use a shared Google Drive URL with public viewing permissions. Missing URLs render as a clearly unlinked row with no placeholder action. Put media in public/images. Replace the portrait JPEG and WebP together. Resume download is public/resume.pdf.

## Colors and type

Edit the CSS variables at the start of `src/style.css`. Dark values live in `[data-theme=dark]`. Fonts are self-hosted Latin subsets in public/fonts. Change the @font-face declarations when replacing font assets. Layout uses a 12-column concept expressed through flexible CSS grids; mobile has separate portrait and project compositions.

## Connect the form

Copy `.env.example` to `.env`. Create and verify a Formspree form, then set `VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID`. Restart Vite or rebuild. The form validates inputs, shows loading, reports success only on a successful response, and explains failures. Without an endpoint it directs visitors to email. Never place secret credentials in VITE variables: they are public client values.

## Deploy

Vercel: import this Git repository, select Vite, build command `npm run build`, output `dist`. vercel.json includes SPA rewrites. Netlify: build command `npm run build`, publish `dist`; public/_redirects provides the fallback. Set the Formspree endpoint and VITE_SITE_URL to your actual production origin in the hosting environment. The build generates absolute canonical, Open Graph, robots and sitemap URLs. Hosting preview domains are not substituted for a production identity.

## Interactions

Ctrl/Cmd+K opens a searchable native modal command palette with keyboard focus containment. Arrow keys and Home/End select commands, Enter opens them, and Escape closes the dialog. The shortcut label follows the platform. Theme follows system on first visit and then remembers your choice. Project filters, detail navigation, architecture exploration, copy-email toast, live Thane clock and downloadable resume all work without account integrations. Sound starts off, remembers the choice for the session and plays only after clicking the labeled connection button. Touch and reduced motion disable pointer effects. The hero canvas contains 28 nodes, draws at most 30 fps and stops offscreen and when hidden. It is disabled on mobile, coarse input, reduced motion and reported low-power devices. The footer marquee runs a 40-second loop only while visible. All content remains accessible independent of animation.

## Verification

`npm run verify` checks production pages at 320, 375, 430, 768, 1024, 1280, 1440 and 1920px. It captures screenshots and checks both themes, overflow, minimum text size, axe accessibility, routes, filters, resume download, theme and sound persistence, modal search and keyboard behavior, reduced motion, clipboard and form fallback. It also probes three route cycles for bounded DOM/canvas/ScrollTrigger counts, cursor behavior, live breakpoint changes and offscreen loop activity. Heap usage is not measured. Run `node scripts/extended-verify.mjs` for all three case studies at every width, artwork text bounds, case-study accessibility, touch controls, actual native transition completion and reduced/unsupported fallbacks. Install Chromium with `npx playwright install chromium` if needed. Results live in ignored test-results/. Lighthouse must be run against `npm run preview`; performance reports are measured locally and are not a guarantee for every device or deployment.

Configured form states were verified with `scripts/form-states.mjs` against a separate build whose endpoint is `/form-test`, served on port 4175. The script intercepts every form request and tests validation, pending state, success, reset, error and retry without sending a message. The normal build leaves the endpoint empty until you configure Formspree. Tests verify that values survive loading and failure, and that a successful retry clears the form.

Skills used: frontend-design for the design and copy guidance, build-awwwards-quality-sites for the art direction and animation safeguards, PDF for resume extraction, and Playwright for browser verification. The upgrade also uses optimize-web-animations for lifecycle and runtime checks. All facts came from the supplied resume. The supplied event photo is the portrait; project artwork consists of disclosed conceptual system diagrams.

## Remaining owner inputs

Certificate document links; optional TrustNet-AI public links; optional real project screenshots; Formspree endpoint; production origin. Resume facts are already populated. No client names, testimonials or availability claims were invented.

## Native artwork transitions

React Router registers the existing pages as children under the App shell. An Outlet renders them with native View Transition integration. Project artwork uses a stable shared name between cards and detail heroes. Unsupported browsers and reduced-motion users get normal navigation. The small case-study component loads eagerly, avoiding a loading-screen snapshot. Section navigation uses one Lenis instance; queued route anchors yield to direct user actions. The design uses large vertical project rows instead of another pinned Work section.

## Latest upgrade verification

Build and lint pass without application warnings. Production browser checks pass at all eight widths in both themes, with no horizontal overflow, axe violations, text below 12px or console warnings/errors. All three case studies also pass all eight widths; their artwork labels remain within bounds. The native View Transition probe confirms ready and finished promises succeed, with ordinary navigation for reduced motion and unsupported browsers. Form validation, loading, success, failed submission, preserved values and successful retry pass against a mocked service.

Three route-return cycles retain 701 DOM elements, one canvas, one desktop pin and 20 ScrollTriggers at the same sample point. The desktop pin disappears on mobile. In the app browser, the hero field pauses in Journey and at the footer; the footer runs only in view. Offscreen running loop count is zero at all sampled positions. These checks do not measure heap retention.

Final local Lighthouse mobile run: performance 94, accessibility 100, best practices 100, SEO 100; FCP 2.2s, LCP 2.6s, total blocking time 100ms and CLS 0.015. A prior sample scored performance 95; timing scores vary. Reports and screenshots are in ignored test-results/. No typecheck script is configured for this JavaScript project. The site is not published.
