# Project research and content boundaries


Inspected repository source at the following snapshots. Source outranks documentation. Unknown roles, years, model accuracy, production scale and undocumented deployments are omitted. TrustNet-AI retains supplied resume facts.


## Evidence by chapter


### HistoFacts

A historical-learning platform combining daily history, topic quizzes, multiplayer rooms, AI study notes and a social study community.


A broad development implementation; AI note generation and multiplayer routes exist, while AI/PDF quiz generation remains incomplete.

- https://github.com/FutureAlok1445/HistoFacts/blob/7780a5bd3eae982a2d2d7a037dc2d019d32b0817/backend/app/main.py

- https://github.com/FutureAlok1445/HistoFacts/blob/7780a5bd3eae982a2d2d7a037dc2d019d32b0817/backend/app/quiz/service.py

- https://github.com/FutureAlok1445/HistoFacts/blob/7780a5bd3eae982a2d2d7a037dc2d019d32b0817/backend/app/ai_notes/llm_client.py

- https://github.com/FutureAlok1445/HistoFacts/blob/7780a5bd3eae982a2d2d7a037dc2d019d32b0817/docker-compose.yml

- Boundary: The personalized quiz service uses existing and template questions, rather than an implemented LLM quiz generator.

- Boundary: The upload UI reads files as text; reliable PDF extraction is not implemented.

- Boundary: This repository is a fork. Individual authorship is not established by the inspected snapshot.


### AURA

Advanced URL Response Analyzer inspects captured traffic, layers threat detection and correlates suspicious requests with server responses to distinguish blocked attempts from possible successful attacks.


SIH 2025 National Grand Finale finalist. The inspected implementation contains the analysis pipeline and analyst interface; model validity and breach certainty are not asserted.

- https://github.com/FutureAlok1445/Advanced-URL-Response-Analyzer-SIH2025/blob/dc131a17bd0df7962247e3e03d034c437e729512/server/backend/api/parsers.py

- https://github.com/FutureAlok1445/Advanced-URL-Response-Analyzer-SIH2025/blob/dc131a17bd0df7962247e3e03d034c437e729512/server/backend/api/threat_analyzer.py

- https://github.com/FutureAlok1445/Advanced-URL-Response-Analyzer-SIH2025/blob/dc131a17bd0df7962247e3e03d034c437e729512/server/backend/api/views.py

- https://github.com/FutureAlok1445/Advanced-URL-Response-Analyzer-SIH2025/blob/dc131a17bd0df7962247e3e03d034c437e729512/server/backend/api/xai_bert.py

- Boundary: Response-status correlation is a heuristic, not proof of compromise; missing or encrypted HTTP evidence limits analysis.

- Boundary: The explainability module creates a classification head without loading a verified fine-tuned checkpoint. No explanation accuracy is claimed.


### Reimbursement Automation System

An institutional claim workflow with Student, Faculty, Coordinator, HOD, Principal and Accounts portals, applicant-specific approval paths and traceable financial processing.


A deployed portal implements claim submission, institutional review and accounts processing.

- https://github.com/FutureAlok1445/reimbursement-automation-system/blob/c61df8920af039c68404848a4bca096ac3a191d0/backend/server/routes/StudentFormRoutes.js

- https://github.com/FutureAlok1445/reimbursement-automation-system/blob/c61df8920af039c68404848a4bca096ac3a191d0/backend/server/routes/formRoutes.js

- https://github.com/FutureAlok1445/reimbursement-automation-system/blob/c61df8920af039c68404848a4bca096ac3a191d0/backend/server/prisma/schema.prisma

- https://github.com/FutureAlok1445/reimbursement-automation-system/blob/c61df8920af039c68404848a4bca096ac3a191d0/front-end/src/Pages/Dashboard/Accounts/components/PrintableForm.jsx

- Boundary: Formatted documents are generated through the browser print flow; a separate server PDF engine is not claimed.


### Techriciate

A brand-led agency website that explains services, presents work as case studies and turns visitor interest into structured contact inquiries.


An implemented agency site with a documented domain and contact integration.

- https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/components/home-page.tsx

- https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/components/hero-visual.tsx

- https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/components/work-list.tsx

- https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/components/contact-form.tsx

- https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/app/layout.tsx

- Boundary: A React Three Fiber hero module exists but is not mounted in the active homepage.

- Boundary: The current work list has no category filters; contact uses client-side native validation rather than an implemented server/Zod route.

- Boundary: The documented domain returned an automated access restriction during checking.


### Bloom Blossom

A boutique storefront for floral and gift products, combining catalog browsing, a persistent cart, WhatsApp inquiries, phone authentication and cash-on-delivery checkout with an admin workspace.


The commerce workflows and administration are implemented with configuration-dependent persistence.

- https://github.com/FutureAlok1445/Blooms-freelancing/blob/1f20669b4f837d0aa79730986d2f50fff80ec5c1/app/checkout/checkout-client.tsx

- https://github.com/FutureAlok1445/Blooms-freelancing/blob/1f20669b4f837d0aa79730986d2f50fff80ec5c1/app/api/checkout/route.ts

- https://github.com/FutureAlok1445/Blooms-freelancing/blob/1f20669b4f837d0aa79730986d2f50fff80ec5c1/lib/orders.ts

- https://github.com/FutureAlok1445/Blooms-freelancing/blob/1f20669b4f837d0aa79730986d2f50fff80ec5c1/app/admin/dashboard/actions.ts

- Boundary: No online payment gateway is implemented.

- Boundary: Without MongoDB, preview checkout returns a simulated order without persistence; real operation requires configured database and auth services.


### FinCoach AI

An AI coaching interface aimed at Indian freelancers and gig workers, using demo spending context to generate insights, risk discussions and financial-behavior explanations.


An active browser-AI interface prototype with a scaffolded backend, not a connected financial-data service.

- https://github.com/FutureAlok1445/fincoach-ai/blob/493b236a5fddcc3ea2ee6f9866ea282875db48d3/frontend/src/App.jsx

- https://github.com/FutureAlok1445/fincoach-ai/blob/493b236a5fddcc3ea2ee6f9866ea282875db48d3/frontend/public/index.html

- https://github.com/FutureAlok1445/fincoach-ai/blob/493b236a5fddcc3ea2ee6f9866ea282875db48d3/backend/main.py

- Boundary: Spending context is demo data; statement ingestion and linked bank accounts are not implemented.

- Boundary: FastAPI routes are scaffolded and are not the active AI pipeline.

- Boundary: Listed fallback models depend on provider availability; no successful integration with every named model is asserted.


### Talent-Sync

An internship matching pipeline that checks eligibility and skill overlap, retrieves candidates using SBERT embeddings and ranks them with policy features and an optional XGBoost scorer.


The matching and artifact-generation pipeline is implemented; deployment and ranking accuracy are not independently established.

- https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/services/matching_service.py

- https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/ml/feature_builder.py

- https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/ml/encoder.py

- https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/ml/scorer.py

- https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/services/llm_provider.py

- Boundary: The fallback still requires the SBERT embedding layer; it is not a fully offline keyword-only replacement.

- Boundary: Scorer artifacts require the repository preprocessing and training workflow. No matching-quality metric is claimed.


### Credit Card Fraud Detection

A Flask web application that validates transaction features, runs a trained XGBoost artifact and returns a fraud probability, classification and separate risk tier.


A local model-serving application with checked-in trained artifacts and an interactive result interface.

- https://github.com/FutureAlok1445/CreditCardFraudDetection/blob/5cba7b529f4d45f6ab5c0d07296a517f8706ab07/flask_app/app.py

- https://github.com/FutureAlok1445/CreditCardFraudDetection/blob/5cba7b529f4d45f6ab5c0d07296a517f8706ab07/flask_app/templates/index.html

- Boundary: Random Forest and logistic model artifacts also exist, but the Flask application serves XGBoost only.

- Boundary: No independently verified accuracy or production deployment is claimed.


### BookItNow

A Flutter movie and live-event browsing prototype with detail screens, a validated booking form and an optional AI movie suggestion screen.


A Flutter interface prototype; browsing and form validation are implemented, while reservation fulfillment is not.

- https://github.com/FutureAlok1445/bookitnow/blob/14a4ae24a7b566b086e54bf41df860bf76eee4f2/lib/main.dart

- https://github.com/FutureAlok1445/bookitnow/blob/14a4ae24a7b566b086e54bf41df860bf76eee4f2/lib/booking_screen.dart

- https://github.com/FutureAlok1445/bookitnow/blob/14a4ae24a7b566b086e54bf41df860bf76eee4f2/lib/gemini_service.dart

- Boundary: No booking backend, seat inventory, payment processing or persisted reservation exists.

- Boundary: The recommendation service ships with an empty API key. A local confirmation does not represent a real booking.


### Speedotype

A React typing practice application with sentence prompts, per-character feedback, elapsed-time WPM, positional accuracy and a locally saved personal best.


A focused browser typing-practice implementation with local persistence.

- https://github.com/FutureAlok1445/Speedotype/blob/602f0d78af039f63618bc386e40579ea629ee65f/src/App.jsx

- https://github.com/FutureAlok1445/Speedotype/blob/602f0d78af039f63618bc386e40579ea629ee65f/src/components/Body.jsx

- Boundary: No backend, account system, multiplayer leaderboard or additional test modes are implemented.

- Boundary: The repository source was inspected; an independently working deployment was not established.


### COSMEON FS-LITE

A simulated orbital distributed filesystem that erasure-codes files, distributes shards across constellation planes and queues transfers during disrupted communication.


A distributed-systems simulation with file reconstruction, failure controls and an interactive constellation UI.

- https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/core/encoder.py

- https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/core/distributor.py

- https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/core/reassembler.py

- https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/intelligence/dtn_queue.py

- https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/intelligence/raft_consensus.py

- https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/intelligence/zkp_audit.py

- Boundary: Raft is a shared-process emulator with degraded quorum behavior, not a production distributed consensus guarantee.

- Boundary: The audit is a hash-challenge simulation, not a cryptographic zero-knowledge proof.

- Boundary: DTN behavior is protocol-inspired; real spacecraft communication and availability guarantees are not claimed.


### TrustNet-AI

An explainable digital-deception platform in development, focused on synthetic faces and manipulated images.


The detection and explanation pipeline is in development. No accuracy or production benchmark is claimed.

- Boundary: Project information comes from the supplied resume and existing portfolio. A public repository and accuracy benchmarks were not available for verification.


## Visual evidence

No usable application screenshots were established in the inspected inventories. Most covers are labeled, source-derived system illustrations, not application screenshots. Bloom Blossom uses its own repository product imagery; Techriciate uses its company logo. Compressed WebP copies retain source provenance.


## Live URLs

Reimbursement: HTTP 200 at its documented Vercel portal. Techriciate: documented in source and supplied resume, automated request returned HTTP 403; no successful automated availability claim. Other undocumented deployments are omitted.