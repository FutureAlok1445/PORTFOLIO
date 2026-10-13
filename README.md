# AFTER HOURS — Alok’s digital workshop

A complete React/Vite engineering portfolio: one original procedural desktop desk, a quiet animated pixel companion, twelve source-grounded project files, notebook/About, toolkit, journey, credentials and contact.

## Run locally

```sh
npm ci
npm run dev
```

Production preview:

```sh
npm run build
npm run preview -- --port 4173
```

## Content and configuration

Edit facts and UI copy in `src/data/content.js`. Missing public links are omitted; credential entries with no URL stay plain articles. Project artwork is conceptual and clearly labeled. Portrait, resume, Techriciate logo and Bloom product photographs are genuine supplied media.

Copy `.env.example` to a local environment file when configuring Formspree and the production origin. The form reports success only after an accepted HTTP response; unconfigured delivery has a direct-email fallback. No service credentials are committed.

## Assets and verification

```sh
node scripts/after-hours-assets.mjs
npm run lint
npm run build
npm run verify
node scripts/library-verify.mjs
node scripts/extended-verify.mjs
node scripts/after-hours-fallbacks.mjs
node scripts/after-hours-asset-verify.mjs
node scripts/after-hours-capture.mjs
```

Browser scripts use production preview on port 4173 and an installed Playwright Chromium browser. `scripts/form-states.mjs` uses an isolated configured preview on port 4175 with endpoint `http://127.0.0.1:4175/form-test`; all requests are intercepted, never sent externally.

The main scene is in `src/components/after-hours/DeskScene3D.jsx`. It lazy loads only on eligible desktops, stops offscreen/hidden and cleans up on route changes. Touch/reduced/unsupported devices get immediate local artwork and native scrolling. Patch has seven exact pixel sheets and a manifest with 32 distinct frames.

See [DESIGN.md](DESIGN.md), [ASSET_MANIFEST.md](ASSET_MANIFEST.md), [PROJECT_RESEARCH.md](PROJECT_RESEARCH.md) and [AFTER_HOURS_IMPLEMENTATION_REPORT.md](AFTER_HOURS_IMPLEMENTATION_REPORT.md) for the design system, provenance, truth boundaries, actual QA and limitations. Screenshots and measured browser reports remain locally under ignored `test-results/after-hours/`.

No publication, push or merge is authorized by the implementation.
