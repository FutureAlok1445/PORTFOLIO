export interface Project {
  number: string;
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  description: string;
  techStack: string;
  problem: string;
  whatIBuilt: string;
  keyDetails: string[];
  metrics: string[];
  githubUrl: string;
  liveUrl?: string;
  previewVariant: 'network' | 'radar' | 'ledger';
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  isRemote?: boolean;
  website?: string;
  summary: string;
  responsibilities: string[];
  techStack: string;
}

export interface SemanticSkillGroup {
  category: string;
  skills: string[];
}

export interface AchievementItem {
  number: string;
  title: string;
  position: string;
  organization?: string;
  year: string;
  description: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  detail: string;
  year: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: 'ALOK SAHOO',
    fullName: 'Alok Kumar Sahoo',
    firstName: 'Alok',
    role: 'Software Engineer',
    headline: 'Software Engineer · Backend, Full-Stack, AI/ML & Distributed Systems',
    summary: 'Final-year B.E. IT student at A. P. Shah Institute of Technology with practical experience in backend and full-stack development, REST APIs, and databases. Skilled in TypeScript, Python, JavaScript, AI/ML, cybersecurity, and computer vision.',
    aboutNarrative: {
      intro: 'I am a software engineer based in Thane, Maharashtra, India, and a final-year B.E. Information Technology student at A. P. Shah Institute of Technology.',
      engineerType: 'I focus on backend architecture, full-stack systems, REST APIs, and database engineering. My technical foundation spans TypeScript, Python, JavaScript, AI/ML, cybersecurity, and computer vision.',
      whatIBuild: 'I build real-world software across production internships and engineering projects—ranging from high-throughput packet inspection pipelines and deepfake detection transformers to institutional state machine workflows and commercial web platforms.',
      technicalFocus: 'My core focus areas include scalable REST APIs, microservices, asynchronous data processing, relational and document databases (MongoDB, PostgreSQL, Elasticsearch), and explainable machine learning.',
    },
    education: {
      degree: 'Bachelor of Engineering (B.E.), Information Technology',
      institution: 'A. P. Shah Institute of Technology',
      period: 'Expected 2027',
      cgpa: '7.94 / 10.0',
      status: 'Final Year Undergraduate',
      location: 'Thane, Maharashtra, India',
      seniorCapstone: 'TrustNet-AI | Explainable Digital-Deception Detection Platform',
      coursework: [
        'Data Structures & Algorithms',
        'Database Management Systems (DBMS)',
        'Operating Systems',
        'Computer Networks',
      ],
    },
    social: {
      phone: '+91 9892826951',
      email: 'aloknsahoo@gmail.com',
      linkedin: 'https://linkedin.com/in/alok-kumar-sahoo1445',
      github: 'https://github.com/FutureAlok1445',
      location: 'Thane, Maharashtra, India',
    },
  },

  // SECTION 1: SELECTED WORK (Strictly the 3 verified projects from resume)
  projects: [
    {
      number: '01',
      id: 'trustnet-ai',
      title: 'TrustNet-AI',
      subtitle: 'Digital Trust & Deception Detection Platform',
      category: 'Deepfake & AI Forensics',
      date: 'SENIOR CAPSTONE',
      description: 'An explainable digital-deception platform focused on image deepfake detection, architecting an end-to-end pipeline to identify synthetic faces and manipulated media.',
      techStack: 'Python · FastAPI · React · PyTorch · ViT · OpenCV · Docker',
      problem: 'The rapid proliferation of synthetic media and deepfakes across digital platforms lacks standardized, verifiable, and explainable multi-layer forensic detection.',
      whatIBuilt: 'Architected an end-to-end digital deception platform integrating Hugging Face Vision Transformers (ViT) and EfficientNet spatial backbones with multi-layer forensics (2D FFT, Error Level Analysis, sensor noise) and Grad-CAM explainability across modular FastAPI microservices and React.',
      keyDetails: [
        'Vision Transformer (ViT) and EfficientNet spatial backbones for deep representation learning.',
        'Multi-layer forensic analysis combining 2D FFT spectral anomalies, Error Level Analysis (ELA), and sensor noise profiling.',
        'Grad-CAM visual explainability maps providing verifiable localization of manipulated facial regions.',
        'Containerized modular FastAPI microservice architecture serving low-latency inference endpoints to a React interface.',
      ],
      metrics: [
        'Senior Capstone Project in Explainable AI & Digital Deception',
        'Multi-layer spatial, spectral, and transformer forensic pipeline',
        'Grad-CAM visual explainability integrated across FastAPI endpoints',
      ],
      githubUrl: 'https://github.com/FutureAlok1445',
      previewVariant: 'network',
    },
    {
      number: '02',
      id: 'project-aura',
      title: 'AURA',
      subtitle: 'Advanced URL Response Analyzer (SIH 2025 National Finalist)',
      category: 'Cybersecurity & Telemetry',
      date: 'SIH 2025 FINALS',
      description: 'A cybersecurity analysis platform built for the Smart India Hackathon 2025 National Grand Finale that inspects network traffic to distinguish attack attempts from confirmed breaches.',
      techStack: 'React · Three.js · Kibana · Data Visualization · Python',
      problem: 'High-volume network traffic streams make it computationally intensive for security analysts to differentiate benign probes and attack attempts from confirmed network breaches.',
      whatIBuilt: 'Built the analyst-facing frontend for a Smart India Hackathon 2025 National Grand Finale cybersecurity platform. Created interactive network and threat visualizations using React, Three.js, dynamic charts, and Kibana dashboards, curating the network traffic dataset required for SIH problem evaluation.',
      keyDetails: [
        'Analyst-facing incident dashboard inspecting raw network traffic to isolate confirmed security breaches.',
        'Interactive 3D network topology and threat activity visualizations engineered with Three.js and dynamic charting.',
        'Kibana telemetry dashboard integration for deep query analysis and incident timeline inspection.',
        'Curated and preprocessed specialized network traffic datasets for national-level problem evaluation.',
      ],
      metrics: [
        'Smart India Hackathon 2025 National Grand Finale Finalist',
        'Interactive 3D network inspection visualization using Three.js & React',
        'Real-time threat telemetry and Kibana dashboard integration',
      ],
      githubUrl: 'https://github.com/FutureAlok1445',
      previewVariant: 'radar',
    },
    {
      number: '03',
      id: 'reimbursement-automation',
      title: 'Reimbursement Automation System',
      subtitle: 'Institutional Workflow Platform',
      category: 'Full-Stack Architecture',
      date: 'OPERATIONAL',
      description: 'An institutional web platform digitizing academic expense submissions and streamlining multi-tier approval workflows across 4 role-based portals.',
      techStack: 'React.js · Node.js · Express.js · MongoDB · REST APIs',
      problem: 'Physical paper-based academic reimbursement claims caused delays, lacked transparent audit trails, and suffered from fragmented review processes across departments.',
      whatIBuilt: 'Developed an institutional platform streamlining multi-tier approval workflows across 4 role-based portals (Student, Faculty, HOD, Principal). Generated PDF reports for submitted records, built 20–30% of backend REST APIs and MongoDB schemas, and integrated full-stack workflows deployed on Vercel for college departmental operations.',
      keyDetails: [
        '4 dedicated role-based portals: Student, Faculty, Head of Department (HOD), and Principal.',
        'Automated multi-tier approval state machine enforcing departmental governance and compliance.',
        'Automated PDF report generation for expense auditing and institutional accounting reconciliation.',
        'Designed 20–30% of backend REST APIs and MongoDB schemas, deploying full-stack workflows on Vercel.',
      ],
      metrics: [
        'Active deployment for college departmental operations on Vercel',
        'Structured 4-tier approval flow spanning Student, Faculty, HOD, and Principal',
        'Automated PDF report generation with persistent audit trails',
      ],
      githubUrl: 'https://github.com/FutureAlok1445',
      previewVariant: 'ledger',
    },
  ] as Project[],

  // SECTION 2: EXPERIENCE (Strictly 3 verified experiences from resume)
  experiences: [
    {
      id: 'ims-learning',
      company: 'IMS Learning Resources Pvt Ltd',
      role: 'Software Engineer Intern',
      period: 'Feb 2026 – Apr 2026',
      location: 'Remote',
      isRemote: true,
      summary: 'Engineered backend REST APIs, search indexing workflows, and version-controlled deployment pipelines for internal services.',
      responsibilities: [
        'Developed backend REST APIs using TypeScript and Fastify to handle structured routing and CRUD operations for assigned internal services.',
        'Integrated Elasticsearch for data indexing and search queries, evaluating retrieval workflows in local development environments.',
        'Managed version control with Git and GitHub, independently completing milestone implementation tickets and deploying builds to Vercel.',
      ],
      techStack: 'TypeScript · Fastify · Elasticsearch · REST APIs · Git · GitHub · Vercel',
    },
    {
      id: 'sapphire-infocom',
      company: 'Sapphire Infocom Private Limited',
      role: 'Full-Stack Developer Intern',
      period: 'Dec 2025 – Mar 2026',
      location: 'Remote',
      isRemote: true,
      summary: 'Built application backend services from scratch with secure authentication, custom middleware, and cloud media pipelines.',
      responsibilities: [
        'Built the application backend from scratch using Node.js, Express.js, and MongoDB, designing database schemas and REST APIs for users, posts, and social interactions.',
        'Implemented secure JWT authentication, role-based admin access, custom middleware, input validation, and Cloudinary media upload integration.',
        'Wrote modular route handlers with centralized error handling and deployed the completed full-stack application on Vercel.',
      ],
      techStack: 'Node.js · Express.js · MongoDB · JWT · Middleware · Cloudinary · Vercel',
    },
    {
      id: 'techriciate',
      company: 'Techriciate (Early-Stage Startup)',
      website: 'https://techriciate.com',
      role: 'Project-based Technical Contributor',
      period: '2026',
      location: 'Remote',
      isRemote: true,
      summary: 'Contributed web platform engineering, official portfolio development, and admin catalog management systems.',
      responsibilities: [
        'Supported an early-stage startup by independently developing its official portfolio website using Next.js, Tailwind CSS, and Framer Motion, including domain DNS, SSL, and business email setup.',
        'Contributed to a commercial web platform using Next.js, TypeScript, and MongoDB Atlas, implementing product catalogs, dynamic category filters, cart management, and WhatsApp order redirection.',
        'Built protected admin dashboard routes for product, category, and banner management with Cloudinary media integration, delivering demonstration milestone releases on Vercel.',
      ],
      techStack: 'Next.js · TypeScript · Tailwind CSS · Framer Motion · MongoDB Atlas · Cloudinary · Vercel',
    },
  ] as Experience[],

  // SECTION 3: SKILLS (Exact semantic categories from resume)
  skillGroups: [
    {
      category: 'LANGUAGES',
      skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'],
    },
    {
      category: 'FRAMEWORKS',
      skills: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'Fastify', 'FastAPI'],
    },
    {
      category: 'DATABASES',
      skills: ['MongoDB', 'PostgreSQL', 'Elasticsearch'],
    },
    {
      category: 'AI / MACHINE LEARNING',
      skills: ['PyTorch', 'Hugging Face Transformers', 'OpenCV', 'Deep Learning', 'Computer Vision', 'XAI'],
    },
    {
      category: 'ARCHITECTURE & SYSTEMS',
      skills: ['REST APIs', 'Microservices', 'WebSockets', 'JWT', 'OAuth'],
    },
    {
      category: 'DEVOPS & TOOLS',
      skills: ['Docker', 'Git', 'GitHub Actions', 'Kibana'],
    },
    {
      category: 'AI SPECIALIZATION',
      skills: ['LLMs', 'Prompt Engineering'],
    },
  ] as SemanticSkillGroup[],

  // SECTION 4: ACHIEVEMENTS & HONORS (Exact 5 achievements from resume)
  achievements: [
    {
      number: '01',
      title: 'Smart India Hackathon 2025',
      position: 'National Grand Finale Finalist',
      organization: 'Ministry of Education / AICTE',
      year: '2025',
      description: 'Selected as a National Grand Finale Finalist by the Ministry of Education & AICTE for developing Project AURA—a network traffic inspection and cybersecurity analysis platform.',
    },
    {
      number: '02',
      title: 'OpsStorm Hackathon',
      position: '1st Prize Winner',
      organization: 'Technical Systems & Automation Challenge',
      year: '2026',
      description: 'Awarded 1st Prize in the Technical Systems & Automation Challenge for engineering an automated infrastructure monitoring and system remediation pipeline under rapid sprint conditions.',
    },
    {
      number: '03',
      title: 'IEEE Techithon ’26 (Hackdeck 2.0)',
      position: '1st Rank',
      organization: 'Atharva University Mumbai',
      year: '2026',
      description: 'Secured 1st Rank at Atharva University Mumbai (Hackdeck 2.0), recognized for architectural scalability, security, and usability.',
    },
    {
      number: '04',
      title: 'HackStreak 2.0',
      position: 'First Place (Third Year Category)',
      organization: 'ITSA, A. P. Shah Institute of Technology',
      year: '2026',
      description: 'Awarded First Place in the Third Year Category by ITSA, A. P. Shah Institute of Technology, for rapid system design and implementation.',
    },
    {
      number: '05',
      title: 'DataWeb Hackathon',
      position: '2nd Prize, Generative AI Domain',
      organization: 'Intercollegiate 6-Hour Hackathon',
      year: '2026',
      description: 'Secured 2nd Prize in the Generative AI Domain at an intercollegiate 6-hour hackathon for building an efficient generative application under tight time constraints.',
    },
  ] as AchievementItem[],

  // SECTION 5: CERTIFICATIONS (Exact 7 credentials from resume)
  certifications: [
    {
      name: 'Oracle Agentic AI Foundations (2026)',
      issuer: 'Oracle University',
      detail: 'Foundational Agentic AI Certification',
      year: '2026',
    },
    {
      name: 'NPTEL DBMS (Elite) & Software Engineering',
      issuer: 'NPTEL',
      detail: 'Elite Certification in Database Management Systems',
      year: '2025',
    },
    {
      name: 'IBM Web Development Fundamentals',
      issuer: 'IBM / IBM SkillsBuild',
      detail: 'Full-Stack Web Foundations',
      year: '2025',
    },
    {
      name: 'Fortinet Network Security Associate Virtual Internship',
      issuer: 'Fortinet',
      detail: 'Network Security Fundamentals & Threat Mitigation',
      year: '2025',
    },
    {
      name: 'AWS Data Engineering & Google Cloud Generative AI',
      issuer: 'Virtual Internships',
      detail: 'Cloud Data Pipelines & GenAI Specialization',
      year: '2025',
    },
    {
      name: 'Google Android Developer Virtual Internship',
      issuer: 'Google Developers / EduSkills',
      detail: 'Native Android Architecture & SDKs',
      year: '2025',
    },
    {
      name: 'Java, Machine Learning & MERN Stack',
      issuer: 'Success Classes of Engineering',
      detail: 'Comprehensive Software Architecture Training',
      year: '2025',
    },
  ] as CertificationItem[],
};
