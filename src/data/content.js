export const content = {
  profile: {
    name: "Alok Sahoo",
    firstName: "Alok",
    title: "Software Engineer",
    portfolioTitle: "Systems in motion",
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
      role: "Software Engineer Intern",
      date: "Feb — Apr 2026",
      location: "Remote",
      description:
        "Built TypeScript and Fastify REST APIs for internal services. Integrated Elasticsearch indexing and retrieval workflows, completed implementation milestones, and deployed builds to Vercel.",
    },
    {
      company: "Sapphire Infocom Private Limited",
      role: "Full-Stack Developer Intern",
      date: "Dec 2025 — Mar 2026",
      location: "Remote",
      description:
        "Built a Node.js, Express.js and MongoDB backend from scratch. Added JWT authentication, admin roles, validation and Cloudinary uploads, with modular routes and centralized error handling.",
    },
    {
      company: "Techriciate",
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
      title: "TrustNet-AI",
      slug: "trustnet-ai",
      category: "Explainable AI",
      description: "A closer look at what’s real.",
      summary:
        "An explainable digital-deception platform in development, focused on synthetic faces and manipulated images.",
      role: "End-to-end pipeline development",
      year: "",
      stack: [
        "Python",
        "FastAPI",
        "React",
        "PyTorch",
        "ViT",
        "OpenCV",
        "Docker",
      ],
      image: "",
      live: "",
      repo: "",
      status: "In development",
      visual: "forensics",
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
        "The detection and explanation pipeline is in development. No accuracy or production benchmark is claimed.",
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
    },
    {
      title: "AURA",
      slug: "aura",
      category: "Cybersecurity",
      description: "From network noise to a clearer picture.",
      summary:
        "Advanced URL Response Analyzer: an analyst-facing platform for inspecting network traffic and distinguishing attack attempts from confirmed breaches.",
      role: "Frontend & data visualization",
      year: "2025",
      stack: ["React", "Three.js", "Kibana", "Python"],
      image: "",
      live: "",
      repo: "https://github.com/FutureAlok1445/sih-aura",
      status: "SIH 2025 National Finalist",
      visual: "network",
      artLabel: "Architecture / network threat analysis",
      problem:
        "An attack attempt and a confirmed breach are different events. Analysts need a clear way to inspect the traffic behind each.",
      context:
        "Built for the Smart India Hackathon 2025 National Grand Finale cybersecurity problem.",
      decisions: [
        "Make network and threat relationships visible with React and Three.js.",
        "Use dynamic charts and Kibana dashboards for analyst-facing data exploration.",
        "Curate the traffic dataset for the hackathon problem evaluation.",
      ],
      outcome:
        "National Grand Finale finalist at Smart India Hackathon 2025. My contribution focused on the analyst frontend and data visualization.",
      details: [
        "Built the analyst-facing frontend for the Smart India Hackathon 2025 National Grand Finale.",
        "Created interactive network and threat visualizations with React, Three.js, charts and Kibana dashboards.",
        "Curated the network traffic dataset for the SIH problem evaluation.",
      ],
      nodes: [
        {
          name: "Traffic",
          text: "Curated network traffic forms the evaluation dataset.",
        },
        {
          name: "Analysis",
          text: "The platform inspects traffic for attack attempts and confirmed breaches.",
        },
        {
          name: "Visualization",
          text: "React, Three.js and dynamic charts support analyst exploration.",
        },
        { name: "Dashboard", text: "Kibana presents network and threat data." },
      ],
    },
    {
      title: "Reimbursement System",
      slug: "reimbursement-system",
      category: "Full-stack",
      description: "Less paperwork. A clearer process.",
      summary:
        "An institutional workflow platform for academic expenses, with four role-based portals and multi-tier approvals.",
      role: "Full-stack contributor",
      year: "",
      stack: ["React", "Node.js", "Express.js", "MongoDB", "REST APIs"],
      image: "",
      live: "https://reimbursement-automation-system-new-nu.vercel.app/",
      repo: "https://github.com/FutureAlok1445/reimbursement-automation-system",
      status: "Deployed for departmental operations",
      visual: "workflow",
      artLabel: "Workflow / academic expense approvals",
      problem:
        "Academic expense records need a structured submission and approval path across institutional roles.",
      context:
        "An institutional platform connecting Student, Faculty, HOD and Principal portals.",
      decisions: [
        "Separate the workflow into four role-based portals.",
        "Connect approval records to MongoDB schemas and REST APIs.",
        "Generate PDF reimbursement reports from submitted records.",
      ],
      outcome:
        "Integrated full-stack workflows deployed on Vercel for college departmental operations. Backend API and schema contribution: 20–30%.",
      details: [
        "Connected Student, Faculty, HOD and Principal portals across multi-tier approvals.",
        "Generated PDF reports from submitted reimbursement records.",
        "Contributed 20–30% of backend REST APIs and MongoDB schemas and integrated the full-stack workflow deployed on Vercel.",
      ],
      nodes: [
        { name: "Student", text: "Submit academic expense records." },
        {
          name: "Faculty",
          text: "Review submissions in a dedicated role-based portal.",
        },
        {
          name: "HOD",
          text: "Continue the multi-tier institutional approval workflow.",
        },
        {
          name: "Principal",
          text: "Access the final role-based portal and reimbursement reports.",
        },
      ],
    },
  ],
  achievements: [
    {
      title: "Smart India Hackathon",
      icon: "flag",
      result: "National Grand Finale finalist",
      issuer: "Ministry of Education / AICTE",
      year: "2025",
    },
    {
      title: "OpsStorm Hackathon",
      icon: "trophy",
      result: "1st prize",
      issuer: "Technical Systems & Automation Challenge",
      year: "2026",
    },
    {
      title: "IEEE Techithon ’26 · Hackdeck 2.0",
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
// Normalize optional fields so adding an incomplete entry cannot break a route.
content.projects = content.projects
  .filter((project) => project.title && project.slug)
  .map((project) => ({
    category: "Project",
    description: "",
    summary: "",
    role: "",
    year: "",
    image: "",
    live: "",
    repo: "",
    status: "",
    visual: "generic",
    ...project,
    stack: Array.isArray(project.stack) ? project.stack : [],
    details: Array.isArray(project.details) ? project.details : [],
    nodes: Array.isArray(project.nodes)
      ? project.nodes.filter((node) => node.name && node.text)
      : [],
  }));
