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
  previewVariant: 'network' | 'radar' | 'ledger' | 'terminal' | 'stats';
}

export const PROJECTS_DATA: Project[] = [
  {
    number: '01',
    id: 'trustnet-ai',
    title: 'TrustNet-AI',
    subtitle: 'Explainable Digital Trust & Deepfake Detection Platform',
    category: 'Computer Vision & AI Forensics',
    date: 'SENIOR CAPSTONE',
    description: 'An explainable digital-deception platform focused on image deepfake detection, architecting an end-to-end multi-layer pipeline to identify synthetic faces and manipulated media.',
    techStack: 'Python · FastAPI · React · PyTorch · ViT · OpenCV · Docker',
    problem: 'The proliferation of synthetic media and deepfakes across social and enterprise platforms lacks standardized, verifiable, and explainable multi-layer forensic detection.',
    whatIBuilt: 'Architected an end-to-end digital deception platform integrating Hugging Face Vision Transformers (ViT) and EfficientNet spatial backbones with multi-layer forensics (2D FFT spectral analysis, Error Level Analysis, and sensor noise profiling) and Grad-CAM visual explainability served via containerized FastAPI microservices to a React dashboard.',
    keyDetails: [
      'Vision Transformer (ViT) and EfficientNet spatial backbones for deep representation learning of facial artifacts.',
      'Multi-layer forensic analysis combining 2D FFT spectral frequency anomalies, Error Level Analysis (ELA), and sensor noise profiling.',
      'Grad-CAM visual explainability maps providing verifiable heatmap localization of manipulated facial regions.',
      'Containerized modular FastAPI microservice architecture serving low-latency inference endpoints to a React interface.',
    ],
    metrics: [
      'Senior Capstone in Explainable AI & Digital Deception',
      'Multi-layer spatial, spectral (2D FFT), and transformer forensic pipeline',
      'Grad-CAM visual explainability integrated across FastAPI endpoints',
    ],
    githubUrl: 'https://github.com/FutureAlok1445',
    previewVariant: 'network',
  },
  {
    number: '02',
    id: 'project-aura',
    title: 'AURA',
    subtitle: 'Security Log Analysis Pipeline (SIH 2025 National Finalist)',
    category: 'Cybersecurity & Telemetry',
    date: 'SIH 2025 FINALS',
    description: 'A cybersecurity analysis platform built for the Smart India Hackathon 2025 National Grand Finale that parses raw network logs (IPDR/PCAP) to distinguish attack attempts from confirmed breaches.',
    techStack: 'React · Three.js · Python · Django · Kibana · Data Pipelines',
    problem: 'High-volume network traffic streams make it computationally intensive for security analysts to differentiate benign probes and attack attempts from confirmed network breaches.',
    whatIBuilt: 'Built the analyst-facing frontend and data ingestion interface for a Smart India Hackathon 2025 National Grand Finale cybersecurity platform. Engineered interactive network and threat visualizations using React, Three.js, dynamic charts, and Kibana dashboards, curating the network traffic dataset required for national problem evaluation.',
    keyDetails: [
      'Analyst-facing incident dashboard inspecting raw IPDR and PCAP network traffic to isolate confirmed security breaches.',
      'Interactive 3D network topology and threat activity visualizations engineered with Three.js and dynamic charting.',
      'Kibana telemetry dashboard integration for deep query analysis and incident timeline inspection.',
      'Curated and preprocessed specialized network traffic datasets for national-level problem evaluation under NCIIPC/NTRO.',
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
    title: 'Reimbursement Automation',
    subtitle: 'Institutional Workflow Platform',
    category: 'Full-Stack Architecture',
    date: 'OPERATIONAL',
    description: 'An institutional web platform digitizing academic expense submissions and streamlining multi-tier approval workflows across 4 role-based departmental portals.',
    techStack: 'React.js · Node.js · Express.js · MongoDB · REST APIs · Vercel',
    problem: 'Physical paper-based academic reimbursement claims caused delays, lacked transparent audit trails, and suffered from fragmented review processes across academic departments.',
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
  {
    number: '04',
    id: 'logistics-management',
    title: 'Logistics Management System',
    subtitle: 'Decentralized Domain Microservices Platform',
    category: 'Distributed Systems & Cloud',
    date: 'APR 2026',
    description: 'A decentralized logistics platform isolating routing, inventory, and user management as domain microservices, Dockerized for consistent execution and fault tolerance.',
    techStack: 'Node.js · Microservices · Docker · React.js · REST APIs',
    problem: 'Monolithic logistics backends suffer from cascading failures, rigid scaling bottlenecks during route spikes, and tight coupling between inventory and transport modules.',
    whatIBuilt: 'Engineered a modular logistics architecture separating delivery routing, inventory tracking, and client auth into standalone domain microservices. Containerized each service with Docker for isolated deployment, predictable orchestration, and resilient fault tolerance.',
    keyDetails: [
      'Domain-driven microservices architecture decoupling routing, warehouse inventory, and user management.',
      'Docker containerization ensuring environment parity, fast cold-starts, and container lifecycle reliability.',
      'RESTful inter-service communication contracts with centralized payload validation and error boundaries.',
      'Interactive React client interface providing operational tracking views across active freight routes.',
    ],
    metrics: [
      'Fully containerized domain microservices architecture with Docker',
      'Decoupled service boundaries for routing, inventory, and client access',
      'Resilient REST contracts with strict schema validation',
    ],
    githubUrl: 'https://github.com/FutureAlok1445',
    previewVariant: 'terminal',
  },
  {
    number: '05',
    id: 'histofacts',
    title: 'HistoFacts',
    subtitle: 'Interactive Historical Intelligence Dashboard',
    category: 'Data Applications & APIs',
    date: 'MAR 2025',
    description: 'A minimal-latency historical events dashboard aggregating daily historical occurrences and milestones from external REST APIs into an interactive, filterable interface.',
    techStack: 'Python · Streamlit · REST APIs · Data Wrangling',
    problem: 'Historical event records across external archives are fragmented, raw, and lack clean categorization or responsive exploratory tooling.',
    whatIBuilt: 'Constructed an interactive data application in Python and Streamlit that fetches, caches, and indexes historical event records from public REST endpoints, presenting chronological event cards and date-filtered milestones with sub-second retrieval.',
    keyDetails: [
      'Automated daily ingestion from public historical REST endpoints with payload normalization and error handling.',
      'Interactive Streamlit UI featuring date filters, milestone categories, and dynamic search indexing.',
      'In-memory data caching layer minimizing outbound API call frequency and latency.',
      'Clean tabular and card-based historical data visualization designed for quick chronological exploration.',
    ],
    metrics: [
      'Interactive Python & Streamlit analytics application',
      'Real-time ingestion and caching from public historical REST endpoints',
      'Sub-second query response with date-indexed filtering',
    ],
    githubUrl: 'https://github.com/FutureAlok1445',
    previewVariant: 'stats',
  },
];
