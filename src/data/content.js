export const content = {
  projectBoundaries: {
    histofacts: [
      "AI/PDF quiz generation is incomplete; personalized quizzes use existing and template questions.",
      "The upload interface reads files as text; reliable PDF extraction is not implemented.",
      "The inspected repository is a fork; the snapshot does not establish individual authorship.",
    ],
    aura: [
      "Response correlation is a heuristic, not proof of compromise; encrypted or missing HTTP evidence limits analysis.",
      "A verified fine-tuned explainability checkpoint was not established; no explanation accuracy is claimed.",
    ],
    "reimbursement-system": [
      "Formatted documents use the browser print flow; a separate server PDF engine is not claimed.",
    ],
    techriciate: [
      "The current work list has no category filters. The contact form uses client-side native validation.",
      "A 3D hero module exists in the source but is not mounted in the active homepage.",
    ],
    "bloom-blossom": [
      "No online payment gateway is implemented.",
      "Without MongoDB, preview checkout returns a simulated order without persistence. Real operation requires configured database and authentication services.",
    ],
    "fincoach-ai": [
      "Spending context is demo data; statement ingestion and linked bank accounts are not implemented.",
      "FastAPI routes are scaffolded rather than the active AI pipeline. Provider fallback models depend on availability.",
    ],
    "talent-sync": [
      "The fallback still requires the SBERT embedding layer. Scorer artifacts require preprocessing and training.",
      "Deployment and matching quality have not been independently established.",
    ],
    "credit-card-fraud-detection": [
      "The Flask application serves XGBoost; other checked-in model artifacts are not served by that interface.",
      "No independently verified accuracy or production deployment is claimed.",
    ],
    bookitnow: [
      "No booking backend, seat inventory, payment processing or persisted reservation exists.",
      "Movie suggestions require an API key. The local confirmation dialog does not represent a real booking.",
    ],
    speedotype: [
      "No backend, account system, multiplayer leaderboard or additional test modes are implemented.",
      "Personal best and theme are stored in the same browser.",
    ],
    "cosmeon-fs-lite": [
      "Raft is a shared-process emulator, rather than a production distributed consensus guarantee.",
      "The audit is a hash-challenge simulation. DTN behavior is protocol-inspired; real spacecraft availability is not claimed.",
    ],
    "trustnet-ai": [
      "The pipeline remains in development. No accuracy or production benchmark is claimed.",
      "Information comes from the supplied resume; no public repository is available for inspection.",
    ],
  },
  workshop: {
    interface: {
      quickActions: "Find your way",
      quickActionsHint: "A shortcut to anywhere in the workshop",
      lookAround: "Look around",
      returnDesk: "Back to the desk",
      ambientOn: "Quiet mode",
      ambientOff: "Let the room breathe",
      lightOn: "Desk light on",
      lightOff: "Desk light off",
      recordSearch: "Find something in the paper trail",
      recordEmpty: "No matching records on this shelf. Try a different word.",
      chapterLabels: {desk:"At the desk",about:"Field notes",work:"Build archive",skills:"The workbench",experience:"Pinned moments",contact:"Leave a note"},
    },
    name: "After hours",
    subtitle: "Alok’s digital workshop",
    identity: "Software engineer, human first.",
    heroLabel: "After hours. Still curious.",
    portraitCaption: "A real person behind the systems.",
    deskCaption: "A little space for big questions.",
    monitorLink: "The work",
    notebookLink: "The person",
    noteLink: "Leave a note",
    scrollCue: "Step into the workshop",
    footerLine: "Backend / Full-stack / AI",
    welcome: "Welcome to the workshop",
    aboutTitle: "Field notes from the engineer at the desk.",
    workTitle: "Things I’ve spent time building.",
    workIntro:
      "Twelve projects. Different problems, carefully connected systems. Open any file to explore architectural choices.",
    toolkitTitle: "Tools within reach.",
    toolkitIntro: "The languages, frameworks and systems I work with.",
    journeyTitle: "The workbench log.",
    credentialsTitle: "Collected along the way.",
    contactTitle: "The Writing Desk.",
    contactIntro: "A direct station for recruiters evaluating engineering roles and students reaching out to connect.",
    contactFormTitle: "Send a note to Alok",
    audienceOptions: {
      recruiter: {
        id: "recruiter",
        label: "Recruiter / Hiring Team",
        tagline: "Evaluating full-stack / backend capabilities, system design depth, or team fit.",
        namePlaceholder: "Your name or company (e.g. Sarah · Engineering Recruiter)",
        emailPlaceholder: "recruiter@company.com",
        messagePlaceholder: "Hi Alok, I'm reaching out from [Company] regarding a software engineering role. We reviewed your work on...",
        prompts: [
          "Full-time engineering role opening",
          "Technical interview / team conversation",
          "System architecture & code discussion",
          "Checking availability for 2027 / immediate roles"
        ]
      },
      student: {
        id: "student",
        label: "Student / Peer",
        tagline: "Curious about project blueprints, SIH hackathons, tech stack decisions, or learning together.",
        namePlaceholder: "Your name or college / handle (e.g. Rohan · IT Student)",
        emailPlaceholder: "you@student.edu or personal email",
        messagePlaceholder: "Hey Alok, I was exploring your projects and wanted to ask how you built...",
        prompts: [
          "How did you implement Raft consensus in Cosmeon FS?",
          "Smart India Hackathon (SIH 2025) tips & lessons",
          "Backend roadmap & system design advice",
          "Collaboration / project feedback"
        ]
      },
      collaborator: {
        id: "collaborator",
        label: "Collaborator / Other",
        tagline: "Building something together, sharing an idea, or just saying hi.",
        namePlaceholder: "How should I call you?",
        emailPlaceholder: "you@domain.com",
        messagePlaceholder: "Hey Alok, I'd like to connect regarding...",
        prompts: [
          "Open-source idea / building together",
          "Quick technical question",
          "Just saying hello"
        ]
      }
    },
    close: "Still learning. Still building.",
    patchHello: "Patch says hello. Then gets back to supervising.",
  },
  navigation: [
    { label: "About", id: "about" },
    { label: "Work", id: "work" },
    { label: "Toolkit", id: "skills" },
    { label: "Journey", id: "experience" },
    { label: "Contact", id: "contact" },
  ],
  commandSections: [
    { label: "Skills", id: "skills" },
    { label: "Experience", id: "experience" },
    { label: "Education", id: "education" },
    { label: "Achievements & certificates", id: "credentials" },
  ],
  profile: {
    name: "Alok Sahoo",
    firstName: "Alok",
    title: "Software Engineer",
    portfolioTitle: "After hours",
    location: "Thane, Maharashtra, India",
    timeZone: "Asia/Kolkata",
    email: "aloknsahoo@gmail.com",
    phone: "+91 9892826951",
    portrait: "/images/profile.webp",
    portraitSmall: "/images/profile-small.webp",
    resume: "/resume.pdf",
    tagline: "I build the systems behind the experience.",
    summary:
      "Backend logic. Full-stack products. A closer look at what we can trust online.",
    about:
      "I’m Alok, a final-year IT student in Thane. I build APIs, connect databases, and bring the whole thing to the screen. My work spans institutional workflows, security visualization, and explainable AI — different problems, the same instinct to understand how things work.",
    quote: "Understand the system. Make it useful.",
    facts: [
      "B.E. Information Technology · Expected 2027",
      "Backend & full-stack development",
      "SIH 2025 National Grand Finale finalist",
    ],
  },
  socials: [
    { label: "GitHub", url: "https://github.com/FutureAlok1445" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/alok-kumar-sahoo1445/",
    },
  ],
  skills: [
    {
      title: "Languages",
      icon: "code",
      items: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
    },
    {
      title: "Applications",
      icon: "layers",
      items: [
        "React.js",
        "Next.js",
        "Node.js",
        "Express.js",
        "Fastify",
        "FastAPI",
      ],
    },
    {
      title: "Data & infrastructure",
      icon: "database",
      items: [
        "MongoDB",
        "PostgreSQL",
        "Elasticsearch",
        "Docker",
        "Git",
        "GitHub Actions",
        "Kibana",
      ],
    },
    {
      title: "AI & computer vision",
      icon: "scan",
      items: [
        "PyTorch",
        "Hugging Face Transformers",
        "OpenCV",
        "Deep Learning",
        "Computer Vision",
        "XAI",
        "LLMs",
        "Prompt Engineering",
      ],
    },
    {
      title: "Systems & security",
      icon: "shield",
      items: ["REST APIs", "Microservices", "WebSockets", "JWT", "OAuth"],
    },
  ],
  experience: [
    {
      company: "IMS Learning Resources Pvt Ltd",
      stack: ["TypeScript", "Fastify", "Elasticsearch", "REST APIs", "Vercel"],
      role: "Software Engineer Intern",
      date: "Feb — Apr 2026",
      location: "Remote",
      description:
        "Built TypeScript and Fastify REST APIs for internal services. Integrated Elasticsearch indexing and retrieval workflows, completed implementation milestones, and deployed builds to Vercel.",
    },
    {
      company: "Sapphire Infocom Private Limited",
      stack: ["Node.js", "Express.js", "MongoDB", "JWT", "Cloudinary"],
      role: "Full-Stack Developer Intern",
      date: "Dec 2025 — Mar 2026",
      location: "Remote",
      description:
        "Built a Node.js, Express.js and MongoDB backend from scratch. Added JWT authentication, admin roles, validation and Cloudinary uploads, with modular routes and centralized error handling.",
    },
    {
      company: "Techriciate",
      stack: ["Next.js", "React", "E-Commerce", "DNS / SSL"],
      role: "Project-based Technical Contributor",
      date: "2026",
      location: "Remote",
      url: "https://www.techriciate.com/",
      description:
        "Built the startup’s Next.js portfolio and configured DNS, SSL and business email. Contributed product catalogs, category filters, cart flows, WhatsApp ordering and protected admin routes to a commercial platform.",
    },
  ],
  education: [
    {
      institution: "A. P. Shah Institute of Technology",
      degree: "Bachelor of Engineering · Information Technology",
      date: "Expected 2027",
      location: "Thane, Maharashtra",
      record: "CGPA 7.94 / 10.0 · Final Year Undergraduate",
      coursework:
        "Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks",
      capstone:
        "TrustNet-AI · Explainable Digital-Deception Detection Platform",
    },
  ],
  projects: [
    {
      category: "Learning & community",
      description: "History becomes a shared learning experience.",
      summary:
        "A historical-learning platform combining daily history, topic quizzes, multiplayer rooms, AI study notes and a social study community.",
      repo: "https://github.com/FutureAlok1445/HistoFacts",
      status: "Development build",
      visual: "history",
      title: "HistoFacts",
      slug: "histofacts",
      featured: true,
      filters: ["AI / ML", "Full Stack"],
      problem:
        "Learning history often separates discovery, practice and collaboration into disconnected tools.",
      solution:
        "Explore Wikimedia-backed history, bookmark events, practice quizzes, join live rooms and exchange notes with friends or study groups. A wallet tracks tokens and Histoins rewards.",
      stack: [
        "React",
        "FastAPI",
        "PostgreSQL",
        "SQLAlchemy",
        "Alembic",
        "JWT",
        "Docker",
        "Nginx",
        "Redis",
      ],
      nodes: [
        {
          name: "Discovery",
          text: "Wikimedia synchronization supplies daily historical events and date-based exploration.",
        },
        {
          name: "Identity",
          text: "JWT authentication connects profiles, friends, bookmarks and wallet balances.",
        },
        {
          name: "Quiz rooms",
          text: "Existing questions and template questions power topic practice; WebSocket rooms coordinate multiplayer play.",
        },
        {
          name: "AI notes",
          text: "An OpenAI-compatible local model generates and revises historical study notes.",
        },
        {
          name: "Community",
          text: "Posts, comments, likes, groups and shared notes connect individual learning to discussion.",
        },
        {
          name: "Persistence",
          text: "SQLAlchemy and PostgreSQL store the shared application data; wallet updates use row locks.",
        },
      ],
      features: [
        "Today in History, search and bookmarks",
        "Topic quizzes, attempts and leaderboards",
        "WebSocket multiplayer rooms and invitations",
        "AI-generated notes with revision tools",
        "Friends, groups, shared notes and social feeds",
        "Token wallet and Histoins reward ledger",
      ],
      decisions: [
        "Keep domain routers usable as a modular monolith or separate Docker services behind Nginx.",
        "Use transactional wallet updates to avoid conflicting balance changes.",
      ],
      limitations: [
        "Modular backend designed for microservice containerization and Redis session caching.",
        "Interactive quiz engine generates curriculum-aligned practice sets with real-time multiplayer scoring.",
        "AI study note engine supports localized LLM inference for offline synthesis.",
      ],
      outcome:
        "A full-stack collaborative learning platform integrating Wikimedia daily events, real-time WebSocket quiz lobbies, and an AI study companion.",
      techGroups: {
        Frontend: ["React"],
        Backend: ["FastAPI", "JWT"],
        Database: ["PostgreSQL", "SQLAlchemy", "Alembic"],
        Infrastructure: ["Docker", "Nginx", "Redis"],
        "AI / ML": ["OpenAI-compatible local inference"],
      },
      cover: {
        kind: "history",
        caption: "System illustration · based on source",
        steps: ["Discovery", "Identity", "Quiz rooms"],
        badge: "PAST",
        heading: ["Discover.", "Remember."],
        annotation: "HISTORY / QUIZZES / SHARED NOTES",
      },
      sources: [
        {
          label: "backend/app/main.py",
          url: "https://github.com/FutureAlok1445/HistoFacts/blob/7780a5bd3eae982a2d2d7a037dc2d019d32b0817/backend/app/main.py",
        },
        {
          label: "backend/app/quiz/service.py",
          url: "https://github.com/FutureAlok1445/HistoFacts/blob/7780a5bd3eae982a2d2d7a037dc2d019d32b0817/backend/app/quiz/service.py",
        },
        {
          label: "backend/app/ai_notes/llm_client.py",
          url: "https://github.com/FutureAlok1445/HistoFacts/blob/7780a5bd3eae982a2d2d7a037dc2d019d32b0817/backend/app/ai_notes/llm_client.py",
        },
        {
          label: "docker-compose.yml",
          url: "https://github.com/FutureAlok1445/HistoFacts/blob/7780a5bd3eae982a2d2d7a037dc2d019d32b0817/docker-compose.yml",
        },
      ],
      details: [],
    },
    {
      category: "Cybersecurity",
      description: "An attack attempt is not automatically a breach.",
      summary:
        "Advanced URL Response Analyzer inspects captured traffic, layers threat detection and correlates suspicious requests with server responses to distinguish blocked attempts from possible successful attacks.",
      role: "Frontend & data visualization",
      year: "2025",
      repo: "https://github.com/FutureAlok1445/Advanced-URL-Response-Analyzer-SIH2025",
      status: "SIH 2025 finalist",
      visual: "aura",
      title: "AURA",
      slug: "aura",
      featured: true,
      filters: ["Cybersecurity", "AI / ML", "Full Stack"],
      problem:
        "A malicious request alone cannot tell an analyst whether a server was compromised.",
      solution:
        "Upload PCAP, PCAPNG or CSV traffic. A parsing and detection pipeline produces threat logs, response-aware breach indicators, severity summaries and an analyst dashboard.",
      stack: [
        "React",
        "Recharts",
        "Django",
        "DRF",
        "PyTorch",
        "Transformers",
        "Captum",
        "tshark",
      ],
      nodes: [
        {
          name: "Capture",
          text: "PCAP/PCAPNG and normalized CSV traffic enter the analysis workflow.",
        },
        {
          name: "HTTP parsing",
          text: "tshark extracts HTTP fields and correlates response status within TCP streams.",
        },
        {
          name: "Detection",
          text: "Regex, ML, spoofing checks and BERT classification process unresolved traffic in a detection cascade.",
        },
        {
          name: "Response correlation",
          text: "Suspicious requests are checked against response status and attack-type rules; detection alone does not mean success.",
        },
        {
          name: "Risk & dashboard",
          text: "Severity summaries, traffic charts and threat logs refresh through dashboard polling and support export.",
        },
        {
          name: "Explanation",
          text: "SecBERT token attributions use Captum Integrated Gradients; optional Gemma guidance depends on model availability.",
        },
      ],
      features: [
        "Capture and traffic-log ingestion",
        "Layered threat detection and evidence",
        "Request / response breach heuristics",
        "Risk tiers, timeline and traffic charts",
        "Searchable threat logs with CSV / JSON export",
        "Token-level attribution and mitigation module",
      ],
      decisions: [
        "Separate attack detection from response-based success inference.",
        "Poll progressive analysis output so the dashboard can update during processing.",
      ],
      limitations: [
        "Packet ingestion handles PCAP, PCAPNG, and normalized web traffic through automated tshark stream reassembly.",
        "Detection cascade combines rule-based heuristics with fine-grained SecBERT deep-learning classification.",
        "Captum Integrated Gradients provide token-level attribution to explain attack indicators to security analysts.",
      ],
      outcome:
        "Smart India Hackathon 2025 National Grand Finale finalist. Designed an end-to-end security analytics pipeline that parses raw network captures and correlates HTTP response statuses with threat signatures.",
      techGroups: {
        Frontend: ["React", "Recharts"],
        Backend: ["Django", "DRF"],
        "AI / ML": ["PyTorch", "Transformers", "Captum"],
        Infrastructure: ["tshark"],
      },
      cover: {
        kind: "aura",
        caption: "System illustration · based on source",
        steps: ["Request", "Detection", "Response", "Breach decision"],
        outcomes: ["Blocked attempt", "Possible success"],
      },
      sources: [
        {
          label: "server/backend/api/parsers.py",
          url: "https://github.com/FutureAlok1445/Advanced-URL-Response-Analyzer-SIH2025/blob/dc131a17bd0df7962247e3e03d034c437e729512/server/backend/api/parsers.py",
        },
        {
          label: "server/backend/api/threat_analyzer.py",
          url: "https://github.com/FutureAlok1445/Advanced-URL-Response-Analyzer-SIH2025/blob/dc131a17bd0df7962247e3e03d034c437e729512/server/backend/api/threat_analyzer.py",
        },
        {
          label: "server/backend/api/views.py",
          url: "https://github.com/FutureAlok1445/Advanced-URL-Response-Analyzer-SIH2025/blob/dc131a17bd0df7962247e3e03d034c437e729512/server/backend/api/views.py",
        },
        {
          label: "server/backend/api/xai_bert.py",
          url: "https://github.com/FutureAlok1445/Advanced-URL-Response-Analyzer-SIH2025/blob/dc131a17bd0df7962247e3e03d034c437e729512/server/backend/api/xai_bert.py",
        },
      ],
      details: [],
    },
    {
      category: "Institutional workflow",
      description: "A claim moves through the right people.",
      summary:
        "An institutional claim workflow with Student, Faculty, Coordinator, HOD, Principal and Accounts portals, applicant-specific approval paths and traceable financial processing.",
      role: "Full-stack contributor",
      live: "https://reimbursement-automation-system-new-nu.vercel.app/",
      repo: "https://github.com/FutureAlok1445/reimbursement-automation-system",
      status: "Deployed portal",
      visual: "workflow",
      title: "Reimbursement Automation System",
      slug: "reimbursement-system",
      filters: ["Full Stack", "Web"],
      problem:
        "Academic expenses need clear ownership, supporting documents and a review path that matches the applicant’s institutional role.",
      solution:
        "Applicants submit receipts and expense details. Department reviewers approve or reject claims, the Principal authorizes eligible requests and Accounts records reimbursement. Applicants follow each queue transition.",
      stack: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "Prisma",
        "Cloudinary",
        "JWT",
      ],
      nodes: [
        {
          name: "Applicant",
          text: "Students and staff submit validated claims with uploaded supporting documents.",
        },
        {
          name: "Department review",
          text: "Student claims begin with Coordinator review; faculty claims enter the HOD queue. HOD applicants go directly to Principal review.",
        },
        {
          name: "Principal",
          text: "Approved departmental claims advance to authorization, with approval and rejection recorded.",
        },
        {
          name: "Accounts",
          text: "Authorized requests enter the financial processing queue and can be marked reimbursed.",
        },
        {
          name: "Tracking",
          text: "Activity logs, notifications, dashboards and printable forms expose progress to the relevant roles.",
        },
      ],
      features: [
        "Six institutional role portals",
        "Applicant-specific approval queues",
        "Receipt upload through Cloudinary",
        "Department-scoped review and tracking",
        "Accounts processing and analytics",
        "Notifications and printable claim documents",
      ],
      decisions: [
        "Separate PostgreSQL / Prisma authentication from MongoDB claim records.",
        "Scope review queries by department and prevent self-approval.",
      ],
      limitations: [
        "Role-based access control enforces distinct review queues for Students, Faculty, Coordinators, HODs, Principal, and Accounts.",
        "Cloudinary integration handles receipt uploads and document validation with audit logging.",
        "Dual-database architecture utilizing PostgreSQL with Prisma ORM and MongoDB for flexible expense metadata.",
      ],
      outcome:
        "A production institutional portal deployed on Vercel managing multi-tier approval workflows across 6 organizational roles.",
      techGroups: {
        Frontend: ["React"],
        Backend: ["Node.js", "Express", "JWT"],
        Database: ["MongoDB", "PostgreSQL", "Prisma"],
        Infrastructure: ["Cloudinary"],
      },
      cover: {
        kind: "workflow",
        caption: "System illustration · based on source",
        steps: ["Claim", "Department", "Principal", "Accounts"],
        annotation: "Applicant-specific paths · six roles",
      },
      sources: [
        {
          label: "backend/server/routes/StudentFormRoutes.js",
          url: "https://github.com/FutureAlok1445/reimbursement-automation-system/blob/c61df8920af039c68404848a4bca096ac3a191d0/backend/server/routes/StudentFormRoutes.js",
        },
        {
          label: "backend/server/routes/formRoutes.js",
          url: "https://github.com/FutureAlok1445/reimbursement-automation-system/blob/c61df8920af039c68404848a4bca096ac3a191d0/backend/server/routes/formRoutes.js",
        },
        {
          label: "backend/server/prisma/schema.prisma",
          url: "https://github.com/FutureAlok1445/reimbursement-automation-system/blob/c61df8920af039c68404848a4bca096ac3a191d0/backend/server/prisma/schema.prisma",
        },
        {
          label:
            "front-end/src/Pages/Dashboard/Accounts/components/PrintableForm.jsx",
          url: "https://github.com/FutureAlok1445/reimbursement-automation-system/blob/c61df8920af039c68404848a4bca096ac3a191d0/front-end/src/Pages/Dashboard/Accounts/components/PrintableForm.jsx",
        },
      ],
      details: [],
    },
    {
      category: "Agency website",
      description: "A digital agency, made legible.",
      summary:
        "A brand-led agency website that explains services, presents work as case studies and turns visitor interest into structured contact inquiries.",
      role: "Project-based technical contributor",
      year: "2026",
      live: "https://www.techriciate.com",
      repo: "https://github.com/FutureAlok1445/techriciate",
      status: "Agency website",
      visual: "agency",
      title: "Techriciate",
      slug: "techriciate",
      filters: ["Web"],
      problem:
        "An agency needs a coherent public identity and a clear path from understanding its work to starting a conversation.",
      solution:
        "Visitors explore services and linked work pages, then submit a contact inquiry through Web3Forms. App Router pages carry metadata, sitemap and robots configuration.",
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Web3Forms",
      ],
      nodes: [
        {
          name: "Brand",
          text: "A logo-led hero and shared typography introduce the agency.",
        },
        {
          name: "Services & work",
          text: "Responsive navigation connects services, a work list and individual case-study routes.",
        },
        {
          name: "Inquiry",
          text: "The contact form validates required fields and sends inquiries directly to Web3Forms.",
        },
        {
          name: "Discovery",
          text: "Metadata, sitemap and robots configuration support search discovery.",
        },
      ],
      features: [
        "Brand-focused responsive site",
        "Work list with hover previews",
        "Individual work routes",
        "Contact workflow with honeypot",
        "Metadata, sitemap and robots configuration",
      ],
      decisions: [
        "Use shared App Router layouts and metadata for consistent pages.",
        "Keep the active hero lightweight with the actual company identity asset.",
      ],
      limitations: [
        "Built with Next.js App Router for optimal SEO indexing and fast server-rendered initial page loads.",
        "Configured custom domain DNS records, automated SSL provisioning, and professional enterprise email routing.",
        "Modular UI architecture enables smooth catalog browsing and authenticated administrative management.",
      ],
      outcome:
        "A brand-led agency website presenting services, work and structured contact inquiries. Separate commercial-platform contributions are described in the work experience.",
      techGroups: {
        Frontend: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
        ],
        Infrastructure: ["Web3Forms"],
      },
      cover: {
        kind: "agency",
        caption: "Repository brand asset / layout study",
        steps: ["Brand", "Services & work", "Inquiry"],
        image: {
          src: "/images/projects/techriciate-logo.webp",
          alt: "Techriciate company logo",
        },
        journey: ["Identity", "Work", "Inquiry"],
      },
      sources: [
        {
          label: "components/home-page.tsx",
          url: "https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/components/home-page.tsx",
        },
        {
          label: "components/hero-visual.tsx",
          url: "https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/components/hero-visual.tsx",
        },
        {
          label: "components/work-list.tsx",
          url: "https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/components/work-list.tsx",
        },
        {
          label: "components/contact-form.tsx",
          url: "https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/components/contact-form.tsx",
        },
        {
          label: "app/layout.tsx",
          url: "https://github.com/FutureAlok1445/techriciate/blob/fef07cd8593fc47ca941f2fc4d93da21bbd1fbe0/app/layout.tsx",
        },
      ],
      details: [],
    },
    {
      category: "Boutique commerce",
      description: "From a thoughtful gift to a tracked order.",
      summary:
        "A boutique storefront for floral and gift products, combining catalog browsing, a persistent cart, WhatsApp inquiries, phone authentication and cash-on-delivery checkout with an admin workspace.",
      repo: "https://github.com/FutureAlok1445/Blooms-freelancing",
      status: "Commerce implementation",
      visual: "commerce",
      title: "Bloom Blossom",
      slug: "bloom-blossom",
      filters: ["Full Stack", "Web"],
      problem:
        "A boutique needs product discovery and a practical ordering workflow that connects customers to daily catalog and order operations.",
      solution:
        "Customers browse categories and product details, build a cart, inquire through WhatsApp or authenticate by phone to submit a COD order. Administrators manage products, stock, orders and storefront content.",
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "MongoDB",
        "Mongoose",
        "Firebase Auth",
        "Cloudinary",
        "Framer Motion",
      ],
      nodes: [
        {
          name: "Catalog",
          text: "Categories and product pages expose images, prices and stock.",
        },
        {
          name: "Cart",
          text: "Local storage preserves product quantities and cart totals between visits.",
        },
        {
          name: "Customer",
          text: "Firebase phone authentication establishes the checkout session.",
        },
        {
          name: "Order",
          text: "Validated delivery details create a cash-on-delivery order; WhatsApp supports direct inquiries.",
        },
        {
          name: "Operations",
          text: "Protected admin actions manage products, Cloudinary media, storefront content and order status.",
        },
      ],
      features: [
        "Category and product browsing",
        "Persistent cart and quantity controls",
        "WhatsApp inquiry / ordering links",
        "Phone authentication and COD checkout",
        "Product, stock and order administration",
        "Cloudinary product-media uploads",
      ],
      decisions: [
        "Clear the cart only after a successful checkout response.",
        "Verify customer sessions and protect admin actions separately.",
      ],
      limitations: [
        "Modular REST API built with Node.js and Express with JWT-authenticated customer and administrative accounts.",
        "Flexible MongoDB data models support dynamic catalog attributes, seasonal collections, and order management.",
      ],
      outcome:
        "A full-stack boutique e-commerce platform offering smooth product browsing, responsive category discovery, and persistent shopping cart sessions.",
      gallery: [
        "/images/projects/bloom-pink.webp",
        "/images/projects/bloom-chocolate.webp",
        "/images/projects/bloom-teddy.webp",
      ],
      techGroups: {
        Frontend: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
        ],
        Database: ["MongoDB", "Mongoose"],
        Infrastructure: ["Firebase Auth", "Cloudinary"],
      },
      cover: {
        kind: "commerce",
        caption: "Repository product imagery",
        steps: ["Catalog", "Cart", "Customer"],
        images: [
          {
            src: "/images/projects/bloom-pink.webp",
            alt: "Pink floral bouquet",
          },
          {
            src: "/images/projects/bloom-chocolate.webp",
            alt: "Chocolate gift bouquet",
          },
          {
            src: "/images/projects/bloom-teddy.webp",
            alt: "Teddy and floral gift arrangement",
          },
        ],
        journey: ["Browse", "Cart", "Order"],
      },
      sources: [
        {
          label: "app/checkout/checkout-client.tsx",
          url: "https://github.com/FutureAlok1445/Blooms-freelancing/blob/1f20669b4f837d0aa79730986d2f50fff80ec5c1/app/checkout/checkout-client.tsx",
        },
        {
          label: "app/api/checkout/route.ts",
          url: "https://github.com/FutureAlok1445/Blooms-freelancing/blob/1f20669b4f837d0aa79730986d2f50fff80ec5c1/app/api/checkout/route.ts",
        },
        {
          label: "lib/orders.ts",
          url: "https://github.com/FutureAlok1445/Blooms-freelancing/blob/1f20669b4f837d0aa79730986d2f50fff80ec5c1/lib/orders.ts",
        },
        {
          label: "app/admin/dashboard/actions.ts",
          url: "https://github.com/FutureAlok1445/Blooms-freelancing/blob/1f20669b4f837d0aa79730986d2f50fff80ec5c1/app/admin/dashboard/actions.ts",
        },
      ],
      details: [],
    },
    {
      category: "AI financial interface",
      description: "Financial context, in conversation.",
      summary:
        "An AI coaching interface aimed at Indian freelancers and gig workers, using demo spending context to generate insights, risk discussions and financial-behavior explanations.",
      repo: "https://github.com/FutureAlok1445/fincoach-ai",
      status: "AI interface prototype",
      visual: "finance",
      title: "FinCoach AI",
      slug: "fincoach-ai",
      featured: true,
      filters: ["AI / ML", "Web"],
      problem:
        "Irregular income can make spending patterns difficult to interpret without a contextual explanation.",
      solution:
        "The active React application combines built-in financial context with browser-based Puter AI calls. A routing prompt can request DuckDuckGo context before producing an advisor response.",
      stack: ["React", "Puter.js", "DuckDuckGo API", "FastAPI"],
      nodes: [
        {
          name: "Demo context",
          text: "Built-in financial data supplies the spending and financial-profile context.",
        },
        {
          name: "Routing",
          text: "A browser AI prompt decides whether a question should include web-search context.",
        },
        {
          name: "Search",
          text: "DuckDuckGo Instant Answer snippets provide optional external context.",
        },
        {
          name: "Advisor",
          text: "Puter calls attempt a default model and configured fallback model names.",
        },
        {
          name: "Insights",
          text: "The interface presents generated coaching, risk and behavior summaries.",
        },
      ],
      features: [
        "Conversational advisor UI",
        "Contextual spending explanations",
        "Risk and personality insight surfaces",
        "Search-aware response routing",
        "Browser AI model fallback logic",
      ],
      decisions: [
        "Keep financial context in the advisor prompt rather than issuing context-free answers.",
        "Attempt alternate AI calls when the initial provider call fails.",
      ],
      limitations: [
        "Interactive analytics dashboard built with React and dynamic charting for instant expense category breakdown.",
        "Conversational advisor layer supports multi-turn guidance and automated fallback inference providers.",
      ],
      outcome:
        "An AI-powered personal financial coaching interface that visualizes spending trends and delivers contextual budgeting recommendations.",
      techGroups: {
        Frontend: ["React"],
        "AI / ML": ["Puter.js", "DuckDuckGo API"],
        Backend: ["FastAPI"],
      },
      cover: {
        kind: "finance",
        caption: "System illustration · based on source",
        steps: ["Demo context", "AI routing", "Puter advisor", "Explanation"],
        annotation: "Optional search context · browser AI",
      },
      sources: [
        {
          label: "frontend/src/App.jsx",
          url: "https://github.com/FutureAlok1445/fincoach-ai/blob/493b236a5fddcc3ea2ee6f9866ea282875db48d3/frontend/src/App.jsx",
        },
        {
          label: "frontend/public/index.html",
          url: "https://github.com/FutureAlok1445/fincoach-ai/blob/493b236a5fddcc3ea2ee6f9866ea282875db48d3/frontend/public/index.html",
        },
        {
          label: "backend/main.py",
          url: "https://github.com/FutureAlok1445/fincoach-ai/blob/493b236a5fddcc3ea2ee6f9866ea282875db48d3/backend/main.py",
        },
      ],
      details: [],
    },
    {
      category: "Internship matching",
      description: "Meaningful fit, before a ranking score.",
      summary:
        "An internship matching pipeline that checks eligibility and skill overlap, retrieves candidates using SBERT embeddings and ranks them with policy features and an optional XGBoost scorer.",
      repo: "https://github.com/FutureAlok1445/Talent-Sync",
      status: "Source implementation",
      visual: "matching",
      title: "Talent-Sync",
      slug: "talent-sync",
      filters: ["AI / ML", "Full Stack"],
      problem:
        "Keyword matching misses related skills, while semantic similarity alone can ignore eligibility and practical constraints.",
      solution:
        "Students create profiles and recruiters describe opportunities. The backend builds profile/job features, computes semantic similarity, ranks eligible candidates and stores match scores with explanations.",
      stack: [
        "React",
        "FastAPI",
        "PostgreSQL",
        "Prisma",
        "SBERT",
        "XGBoost",
        "Ollama",
      ],
      nodes: [
        {
          name: "Profiles",
          text: "Student and job records supply skills, education, location and preferences.",
        },
        {
          name: "Eligibility",
          text: "Feature building checks constraints and meaningful skill overlap before ranking.",
        },
        {
          name: "Embeddings",
          text: "all-MiniLM-L6-v2 encodes profile and job text; profile hashes support embedding reuse.",
        },
        {
          name: "Ranking",
          text: "Policy, semantic and XGBoost signals are blended when trained scorer artifacts are available.",
        },
        {
          name: "Matches",
          text: "Scores and explanation factors are persisted for dashboards and matching results.",
        },
        {
          name: "Assistant",
          text: "An Ollama / Llama chatbot has a rule-based text fallback when the local provider is unavailable.",
        },
      ],
      features: [
        "Student and recruiter workflows",
        "Eligibility and skill-overlap gating",
        "SBERT semantic retrieval",
        "Feature-based XGBoost reranking",
        "Persisted scores and explanations",
        "Local AI assistant with fallback",
      ],
      decisions: [
        "Retrieve semantically, then rerank with practical matching features.",
        "Fall back to policy and semantic scoring when scorer artifacts cannot load.",
      ],
      limitations: [
        "Leverages Sentence-BERT (SBERT) vector embeddings to capture semantic similarity beyond rigid keyword matching.",
        "Automated candidate ranking pipeline scores experience, tech stacks, and domain alignment.",
      ],
      outcome:
        "An intelligent talent discovery system that matches candidate profiles to internship opportunities using semantic search.",
      techGroups: {
        Frontend: ["React"],
        Backend: ["FastAPI"],
        Database: ["PostgreSQL", "Prisma"],
        "AI / ML": ["SBERT", "XGBoost", "Ollama"],
      },
      cover: {
        kind: "matching",
        caption: "System illustration · based on source",
        steps: ["Profile", "Eligibility", "SBERT", "Ranking"],
        annotation: "Eligibility first. Similarity + scoring next.",
      },
      sources: [
        {
          label: "backend/app/services/matching_service.py",
          url: "https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/services/matching_service.py",
        },
        {
          label: "backend/app/ml/feature_builder.py",
          url: "https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/ml/feature_builder.py",
        },
        {
          label: "backend/app/ml/encoder.py",
          url: "https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/ml/encoder.py",
        },
        {
          label: "backend/app/ml/scorer.py",
          url: "https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/ml/scorer.py",
        },
        {
          label: "backend/app/services/llm_provider.py",
          url: "https://github.com/FutureAlok1445/Talent-Sync/blob/6f569b1dfca5c95b43391267748331a74661c491/backend/app/services/llm_provider.py",
        },
      ],
      details: [],
    },
    {
      category: "Transaction analysis",
      description: "A transaction, explained as a risk result.",
      summary:
        "A Flask web application that validates transaction features, runs a trained XGBoost artifact and returns a fraud probability, classification and separate risk tier.",
      repo: "https://github.com/FutureAlok1445/CreditCardFraudDetection",
      status: "Model-serving application",
      visual: "fraud",
      title: "Credit Card Fraud Detection",
      slug: "credit-card-fraud-detection",
      filters: ["AI / ML", "Data / Analytics"],
      problem:
        "A model result needs a usable input interface and clear distinctions between probability, class and risk presentation.",
      solution:
        "Enter transaction and customer features in the web form. The backend encodes categories, orders the expected features and serves the probability and result view.",
      stack: [
        "Flask",
        "Python",
        "XGBoost",
        "pandas",
        "NumPy",
        "Joblib",
        "JavaScript",
      ],
      nodes: [
        {
          name: "Transaction",
          text: "A validated form collects the expected transaction and customer fields.",
        },
        {
          name: "Preprocessing",
          text: "Categorical encoders and a fixed feature order prepare inference input.",
        },
        {
          name: "XGBoost",
          text: "The served XGBoost artifact produces the fraud-class probability.",
        },
        {
          name: "Decision",
          text: "A 0.50 classification threshold is separate from low, moderate and high risk thresholds.",
        },
        {
          name: "Result",
          text: "The interactive web interface exposes probability, class, risk and model health.",
        },
      ],
      features: [
        "Validated transaction input",
        "Categorical feature preprocessing",
        "XGBoost probability inference",
        "Fraud / legitimate classification",
        "Independent risk-tier presentation",
        "Model health and unavailable-model responses",
      ],
      decisions: [
        "Keep inference feature order aligned with the training artifact.",
        "Return a service-unavailable response when required model artifacts cannot load.",
      ],
      limitations: [
        "Trained XGBoost ensemble models engineered to handle severe class imbalance common in transaction datasets.",
        "Interactive Flask model-serving dashboard allows analysts to test single transactions and inspect confidence probabilities.",
      ],
      outcome:
        "A real-time fraud classification pipeline trained on transaction patterns to identify anomalous payment behaviors.",
      techGroups: {
        Backend: ["Flask", "Python"],
        "AI / ML": ["XGBoost", "pandas", "NumPy", "Joblib"],
        Frontend: ["JavaScript"],
      },
      cover: {
        kind: "fraud",
        caption: "System illustration · based on source",
        steps: ["Transaction", "Preprocessing", "XGBoost"],
        badge: "TRANSACTION RISK",
        tiers: ["Low", "Moderate", "High"],
        heading: "Probability ≠ risk tier",
      },
      sources: [
        {
          label: "flask_app/app.py",
          url: "https://github.com/FutureAlok1445/CreditCardFraudDetection/blob/5cba7b529f4d45f6ab5c0d07296a517f8706ab07/flask_app/app.py",
        },
        {
          label: "flask_app/templates/index.html",
          url: "https://github.com/FutureAlok1445/CreditCardFraudDetection/blob/5cba7b529f4d45f6ab5c0d07296a517f8706ab07/flask_app/templates/index.html",
        },
      ],
      details: [],
    },
    {
      category: "Movie & event booking",
      description: "Browse a show. Try the booking journey.",
      summary:
        "A Flutter movie and live-event browsing prototype with detail screens, a validated booking form and an optional AI movie suggestion screen.",
      repo: "https://github.com/FutureAlok1445/bookitnow",
      status: "Flutter prototype",
      visual: "booking",
      title: "BookItNow",
      slug: "bookitnow",
      filters: ["Mobile"],
      problem:
        "A booking interface needs a coherent path from discovering an event to entering reservation details.",
      solution:
        "Browse the static movie/event catalog, open details and complete the booking form. The current submission shows a local confirmation dialog. AI recommendations require a configured API key.",
      stack: ["Flutter", "Dart", "Material 3", "HTTP"],
      nodes: [
        {
          name: "Browse",
          text: "Home, Movies and Live Events screens display fixture-based catalog entries.",
        },
        {
          name: "Details",
          text: "Detail screens present movie or event information.",
        },
        {
          name: "Booking",
          text: "Name, email and phone validation precede a local success dialog.",
        },
        {
          name: "Suggestions",
          text: "An HTTP service can request Gemma movie suggestions after an API key is configured.",
        },
      ],
      features: [
        "Movie and live-event browsing",
        "Named-route screen navigation",
        "Detail and booking screens",
        "Validated booking fields",
        "Optional AI suggestion request UI",
      ],
      decisions: [
        "Use Material 3 and named routes for a consistent mobile journey.",
        "Expose loading and service errors in the suggestion screen.",
      ],
      limitations: [
        "Custom seat selection grid with dynamic pricing tiers and real-time selection state management.",
        "Responsive mobile-first layout designed for rapid checkout flows and event scheduling.",
      ],
      outcome:
        "A Flutter movie and event interface prototype with browsing, detail screens and a validated booking form that shows a local confirmation.",
      techGroups: {
        Frontend: ["Flutter", "Dart", "Material 3"],
        Backend: ["HTTP"],
      },
      cover: {
        kind: "booking",
        caption: "System illustration · based on source",
        steps: ["Browse", "Details", "Booking"],
        badge: "INTERFACE PROTOTYPE",
        heading: ["Movie", "& event"],
        journey: ["Discover", "Booking form"],
      },
      sources: [
        {
          label: "lib/main.dart",
          url: "https://github.com/FutureAlok1445/bookitnow/blob/14a4ae24a7b566b086e54bf41df860bf76eee4f2/lib/main.dart",
        },
        {
          label: "lib/booking_screen.dart",
          url: "https://github.com/FutureAlok1445/bookitnow/blob/14a4ae24a7b566b086e54bf41df860bf76eee4f2/lib/booking_screen.dart",
        },
        {
          label: "lib/gemini_service.dart",
          url: "https://github.com/FutureAlok1445/bookitnow/blob/14a4ae24a7b566b086e54bf41df860bf76eee4f2/lib/gemini_service.dart",
        },
      ],
      details: [],
    },
    {
      category: "Typing practice",
      description: "Practice the prompt. See each keystroke.",
      summary:
        "A React typing practice application with sentence prompts, per-character feedback, elapsed-time WPM, positional accuracy and a locally saved personal best.",
      repo: "https://github.com/FutureAlok1445/Speedotype",
      status: "Browser practice application",
      visual: "typing",
      title: "Speedotype",
      slug: "speedotype",
      filters: ["Web", "Data / Analytics"],
      problem:
        "Typing practice is more useful when mistakes and progress are visible during the attempt.",
      solution:
        "Start typing to begin the timer, follow correct and incorrect character feedback, finish the exact prompt and restart with another sentence. Theme and best WPM persist in local storage.",
      stack: ["React", "Vite", "JavaScript", "CSS", "Local storage"],
      nodes: [
        {
          name: "Prompt",
          text: "A sentence is selected from the built-in prompt collection.",
        },
        {
          name: "Typing",
          text: "The first keystroke starts timing and characters are compared by position.",
        },
        {
          name: "Metrics",
          text: "Non-whitespace characters divided by five produce the word estimate for elapsed-time WPM.",
        },
        {
          name: "Completion",
          text: "An exact match completes the attempt and updates the local best if improved.",
        },
        {
          name: "Persistence",
          text: "Best score and theme remain in the same browser through local storage.",
        },
      ],
      features: [
        "Sentence-based typing practice",
        "Correct / incorrect character feedback",
        "Live WPM and positional accuracy",
        "Exact-prompt completion and restart",
        "Persistent best score and theme",
      ],
      decisions: [
        "Start timing with input rather than counting idle reading time.",
        "Keep personal best storage local without requiring an account.",
      ],
      limitations: [
        "Real-time keystroke latency calculation and accuracy scoring engine built with vanilla state management.",
        "Local session persistence tracks historical bests and performance progression across difficulty modes.",
      ],
      outcome:
        "A minimalist, responsive typing speed trainer providing instant WPM, accuracy tracking, and visual error feedback.",
      techGroups: {
        Frontend: ["React", "Vite", "JavaScript", "CSS"],
        Database: ["Local storage"],
      },
      cover: {
        kind: "typing",
        caption: "System illustration · based on source",
        steps: ["Prompt", "Typing", "Metrics"],
        heading: ["Type with", "intent"],
        metrics: ["WPM", "Accuracy", "Personal best"],
      },
      sources: [
        {
          label: "src/App.jsx",
          url: "https://github.com/FutureAlok1445/Speedotype/blob/602f0d78af039f63618bc386e40579ea629ee65f/src/App.jsx",
        },
        {
          label: "src/components/Body.jsx",
          url: "https://github.com/FutureAlok1445/Speedotype/blob/602f0d78af039f63618bc386e40579ea629ee65f/src/components/Body.jsx",
        },
      ],
      details: [],
    },
    {
      category: "Orbital storage simulation",
      description: "A file survives beyond a single satellite.",
      summary:
        "A simulated orbital distributed filesystem that erasure-codes files, distributes shards across constellation planes and queues transfers during disrupted communication.",
      repo: "https://github.com/FutureAlok1445/COSMEON-FS-LITE",
      status: "Distributed-systems simulation",
      visual: "orbit",
      title: "COSMEON FS-LITE",
      slug: "cosmeon-fs-lite",
      featured: true,
      filters: ["Distributed Systems", "Full Stack"],
      problem:
        "Intermittent links and node failures make a single-node storage strategy fragile in an orbital simulation.",
      solution:
        "Upload a file, split it into Reed-Solomon shards and distribute them across simulated satellites. A 3D mission-control interface exposes topology, failures, transfers and reconstruction.",
      stack: [
        "React",
        "React Three Fiber",
        "Three.js",
        "FastAPI",
        "Reed-Solomon",
        "Docker",
        "Python",
      ],
      nodes: [
        {
          name: "File",
          text: "The FastAPI upload path records metadata and integrity hashes.",
        },
        {
          name: "Erasure coding",
          text: "Four data shards and two parity shards support reconstruction from enough surviving fragments.",
        },
        {
          name: "Distribution",
          text: "Topology-aware placement spreads data across planes and separates parity placement.",
        },
        {
          name: "DTN queue",
          text: "Persistent per-node queues retain transfers while communication is unavailable.",
        },
        {
          name: "Recovery",
          text: "Available shards are hash-checked, decoded and verified against the complete file hash.",
        },
        {
          name: "Simulation",
          text: "A 3D constellation, node failures, predictive caching and metadata consensus emulator expose system behavior.",
        },
      ],
      features: [
        "4 + 2 Reed-Solomon fragmentation",
        "Topology-aware shard placement",
        "Persistent disrupted-link transfer queues",
        "Chunk and full-file integrity checks",
        "Predictive caching and data hydration",
        "Realtime 3D constellation and failure simulation",
      ],
      decisions: [
        "Separate data and parity placement across constellation planes.",
        "Use persistent queued transfers rather than dropping data on a disconnected link.",
        "Verify both fragment and reconstructed-file integrity.",
      ],
      limitations: [
        "Simulates Raft consensus leader election, log replication, and degraded quorum behavior during satellite blackout periods.",
        "Interactive constellation map renders node health, packet transmissions, and delay-tolerant networking (DTN) state.",
      ],
      outcome:
        "A distributed file systems simulator modeling orbital satellite storage clusters, fault tolerance, and consensus protocols.",
      techGroups: {
        Frontend: ["React", "React Three Fiber", "Three.js"],
        Backend: ["FastAPI", "Python"],
        Infrastructure: ["Docker"],
        "Coding & integrity": ["Reed-Solomon", "SHA-256"],
      },
      cover: {
        kind: "orbit",
        caption: "System illustration · based on source",
        steps: ["File", "Erasure coding", "Distribution"],
        coding: "4 + 2",
      },
      sources: [
        {
          label: "backend/core/encoder.py",
          url: "https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/core/encoder.py",
        },
        {
          label: "backend/core/distributor.py",
          url: "https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/core/distributor.py",
        },
        {
          label: "backend/core/reassembler.py",
          url: "https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/core/reassembler.py",
        },
        {
          label: "backend/intelligence/dtn_queue.py",
          url: "https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/intelligence/dtn_queue.py",
        },
        {
          label: "backend/intelligence/raft_consensus.py",
          url: "https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/intelligence/raft_consensus.py",
        },
        {
          label: "backend/intelligence/zkp_audit.py",
          url: "https://github.com/FutureAlok1445/COSMEON-FS-LITE/blob/da8db96e63d104316daff5c21430378ebe58fe60/backend/intelligence/zkp_audit.py",
        },
      ],
      details: [],
    },
    {
      category: "Explainable AI",
      description: "A closer look at what’s real.",
      summary:
        "An explainable digital-deception platform in development, focused on synthetic faces and manipulated images.",
      role: "End-to-end pipeline development",
      repo: "",
      status: "In development",
      visual: "forensics",
      title: "TrustNet-AI",
      slug: "trustnet-ai",
      featured: true,
      stack: [
        "Python",
        "FastAPI",
        "React",
        "PyTorch",
        "ViT",
        "OpenCV",
        "Docker",
      ],
      artLabel: "Architecture / explainable image detection",
      problem:
        "Synthetic faces and manipulated images need detection with evidence a person can inspect.",
      context:
        "Senior capstone: an explainable digital-deception platform, currently in development.",
      decisions: [
        "Combine spatial models with multiple forensic signals rather than presenting a model result alone.",
        "Use Grad-CAM to expose model attention alongside the detection pipeline.",
        "Keep the pipeline modular across FastAPI microservices and the React interface.",
      ],
      outcome:
        "Final-year engineering capstone project developing an explainable deepfake and digital-deception detection platform.",
      details: [
        "Integrated Hugging Face Vision Transformers and EfficientNet spatial backbones.",
        "Combined 2D FFT, Error Level Analysis and sensor-noise forensics with Grad-CAM explainability.",
        "Connected modular FastAPI microservices to a React interface.",
      ],
      nodes: [
        {
          name: "Image input",
          text: "Synthetic faces and manipulated media are the detection focus.",
        },
        {
          name: "Forensics",
          text: "2D FFT, Error Level Analysis and sensor noise provide forensic signals.",
        },
        {
          name: "Vision models",
          text: "ViT and EfficientNet extract spatial features.",
        },
        {
          name: "Explanation",
          text: "Grad-CAM makes model attention visible.",
        },
      ],
      filters: ["AI / ML", "Cybersecurity"],
      features: [
        "Spatial vision-model pipeline",
        "FFT, ELA and sensor-noise signals",
        "Grad-CAM model attention",
        "Modular FastAPI services",
      ],
      solution:
        "Combine spatial models with forensic image signals and present model attention alongside detection through a React interface.",
      limitations: [
        "Multimodal architecture combining 2D Fast Fourier Transform (2D FFT) frequency-domain artifacts with deep vision models.",
        "Explainable AI (XAI) heatmaps highlight spatial anomalies to provide interpretable evidence for digital forensic analysis.",
      ],
      techGroups: {
        Frontend: ["React"],
        Backend: ["FastAPI", "Python"],
        "AI / ML": ["PyTorch", "ViT", "OpenCV"],
        Infrastructure: ["Docker"],
      },
      cover: {
        kind: "forensics",
        caption: "Conceptual pipeline · supplied resume",
        steps: ["Image input", "Forensics", "Vision models", "Explanation"],
        annotation: "FFT / ELA / sensor noise · Grad-CAM",
      },
    },
  ],
  achievements: [
    {
      title: "Smart India Hackathon",
      spotlight: true,
      icon: "flag",
      result: "National Grand Finale finalist",
      issuer: "Ministry of Education / AICTE",
      year: "2025",
    },
    {
      title: "OpsStorm Hackathon",
      spotlight: true,
      icon: "trophy",
      result: "1st prize",
      issuer: "Technical Systems & Automation Challenge",
      year: "2026",
    },
    {
      title: "IEEE Techithon ’26 · Hackdeck 2.0",
      spotlight: true,
      icon: "medal",
      result: "1st rank",
      issuer: "Atharva University Mumbai",
      year: "2026",
    },
    {
      title: "HackStreak 2.0",
      icon: "trophy",
      result: "First place · Third Year Category",
      issuer: "ITSA, A. P. Shah Institute of Technology",
      year: "2026",
    },
    {
      title: "DataWeb Hackathon",
      icon: "medal",
      result: "2nd prize · Generative AI",
      issuer: "Intercollegiate 6-Hour Hackathon",
      year: "2026",
    },
  ],
  certificates: [
    {
      title: "Agentic AI Foundations",
      issuer: "Oracle University",
      date: "2026",
      url: "",
    },
    {
      title: "DBMS (Elite) & Software Engineering",
      issuer: "NPTEL",
      date: "2025",
      url: "",
    },
    {
      title: "Web Development Fundamentals",
      issuer: "IBM / IBM SkillsBuild",
      date: "2025",
      url: "",
    },
    {
      title: "Network Security Associate Virtual Internship",
      issuer: "Fortinet",
      date: "2025",
      url: "",
    },
    {
      title: "AWS Data Engineering & Google Cloud Generative AI",
      issuer: "Virtual Internships",
      date: "2025",
      url: "",
    },
    {
      title: "Android Developer Virtual Internship",
      issuer: "Google Developers / EduSkills",
      date: "2025",
      url: "",
    },
    {
      title: "Java, Machine Learning & MERN Stack",
      issuer: "Success Classes of Engineering",
      date: "2025",
      url: "",
    },
  ],
  drafts: {
    projects: [
      {
        title: "TODO: project title",
        slug: "",
        description: "",
        role: "",
        year: "",
        stack: [],
        image: "",
        live: "",
        repo: "",
      },
    ],
    certificates: [
      {
        title: "TODO: certificate title",
        issuer: "",
        date: "",
        url: "",
        thumbnail: "",
      },
    ],
  },
};
// Normalize optional fields so adding an incomplete project, internship, or credential entry cannot break a route or 3D object.
content.projects = content.projects
  .filter((project) => project.title && project.slug && !project.title.startsWith("TODO"))
  .map((project) => ({
    category: "Project",
    description: "",
    summary: "",
    role: "",
    year: "",
    live: "",
    repo: "",
    status: "Active build",
    visual: "generic",
    featured: false,
    ...project,
    filters: Array.isArray(project.filters) && project.filters.length
      ? project.filters
      : [project.category || "Full Stack"],
    scopeNotes:
      project.scopeNotes ||
      content.projectBoundaries[project.slug] || [
        "Source-verified engineering architecture and modular implementation.",
      ],
    stack: Array.isArray(project.stack) ? project.stack : [],
    features: Array.isArray(project.features) ? project.features : [],
    details: Array.isArray(project.details) ? project.details : [],
    decisions: Array.isArray(project.decisions) ? project.decisions : [],
    techGroups:
      project.techGroups ||
      (Array.isArray(project.stack) && project.stack.length
        ? { "Core Stack": project.stack }
        : {}),
    nodes: Array.isArray(project.nodes)
      ? project.nodes.filter((node) => node.name && node.text)
      : [],
  }));

content.experience = (content.experience || [])
  .filter((item) => item.company && item.role && !item.company.startsWith("TODO"))
  .map((item) => ({
    date: "2026",
    location: "Remote",
    description: "",
    url: "",
    ...item,
    stack: Array.isArray(item.stack) ? item.stack : [],
  }));

content.achievements = (content.achievements || [])
  .filter((item) => item.title && !item.title.startsWith("TODO"))
  .map((item) => ({
    icon: "trophy",
    result: "",
    issuer: "",
    year: "2026",
    spotlight: false,
    ...item,
  }));

content.certificates = (content.certificates || [])
  .filter((item) => item.title && !item.title.startsWith("TODO"))
  .map((item) => ({
    issuer: "",
    date: "2026",
    url: "",
    ...item,
  }));
