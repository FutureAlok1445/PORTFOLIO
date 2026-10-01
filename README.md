# Alok Sahoo — portfolio

React + Vite portfolio based on the provided resume and event portrait. The design rationale, explored concepts, tokens, assumptions and verification notes are in DESIGN.md.

## Run

Requires Node 22.12+ or 24+. Run `npm install`, then `npm run dev`. Production: `npm run build`; inspect with `npm run preview`. Run `npm run lint` for source checks.

## Edit content

All profile facts, skills, work history, education, honors, project records and certificates live in `src/data/content.js`. Add projects to `content.projects` with a unique slug, description, summary, role, optional year, stack, image, live, repo, status and nodes. Leave missing URLs as empty strings. Nodes contain `name` and `text`; the detail view uses them for the interactive architecture study. Set `visual` to `forensics`, `network` or `workflow` for a conceptual fallback; an image is optional. These studies are not product screenshots. Hidden TODO examples live in `content.drafts`; they never render publicly.

Add certificate records to `content.certificates`: title, issuer, date, url and optional thumbnail. Use a shared Google Drive URL with public viewing permissions. Missing URLs render as a clearly unlinked card. Put media in public/images. Replace the portrait JPEG and WebP together. Resume download is public/resume.pdf.

## Colors and type

Edit the CSS variables at the start of `src/style.css`. Dark values live in `[data-theme=dark]`. Fonts are self-hosted Latin subsets in public/fonts. Change @font-face declarations and the preload in index.html together. Layout uses a 12-column concept expressed through flexible CSS grids; mobile has separate portrait and project compositions.

## Connect the form

Copy `.env.example` to `.env`. Create and verify a Formspree form, then set `VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID`. Restart Vite or rebuild. The form validates inputs, shows loading, reports success only on a successful response, and explains failures. Without an endpoint it directs visitors to email. Never place secret credentials in VITE variables: they are public client values.

## Deploy

Vercel: import this Git repository, select Vite, build command `npm run build`, output `dist`. vercel.json includes SPA rewrites. Netlify: build command `npm run build`, publish `dist`; public/_redirects provides the fallback. Set the Formspree endpoint and VITE_SITE_URL to your actual production origin in the hosting environment. The build generates absolute canonical, Open Graph, robots and sitemap URLs. Hosting preview domains are not substituted for a production identity.

## Interactions

Ctrl/Cmd+K opens a native modal command palette with keyboard focus containment. Theme follows system on first visit and then remembers your choice. Project filters, detail navigation, architecture exploration, copy-email toast, live Thane clock and downloadable resume all work without account integrations. Sound starts off; the footer’s small sparkle button reveals a connection easter egg. Touch and reduced motion disable pointer effects. The canvas stops offscreen and when hidden. All content remains accessible independent of animation.

## Verification

`npm run verify` checks production pages at 360, 768, 1024, 1440 and 1920px, screenshots, routes, filters, theme persistence, modal keyboard behavior, reduced motion, accessibility and form fallback. Install Chromium with `npx playwright install chromium` if needed. Results live in ignored test-results/. Lighthouse must be run against `npm run preview`; performance reports are measured locally and are not a guarantee for every device or deployment.

Configured form states were verified with `scripts/form-states.mjs` against a separate build whose endpoint is `/form-test`, served on port 4175. The script intercepts every form request and tests validation, pending state, success, reset, error and retry without sending a message. The normal build leaves the endpoint empty until you configure Formspree.

Skills used: frontend-design for the design and copy guidance, build-awwwards-quality-sites for the art direction and animation safeguards, PDF for resume extraction, and Playwright for browser verification. All facts came from the supplied resume. The supplied event photo is the portrait; project artwork consists of disclosed conceptual system diagrams.

## Remaining owner inputs

Certificate document links; optional TrustNet-AI public links; optional real project screenshots; Formspree endpoint; production origin. Resume facts are already populated. No client names, testimonials or availability claims were invented.
