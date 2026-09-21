export interface StarTech {
  name: string;
  usedIn: string;
  x: number; // percentage in SVG coordinate space
  y: number;
}

export interface ConstellationGroup {
  discipline: string;
  name: string;
  stars: StarTech[];
  links: [number, number][]; // index pairs to draw constellation lines
}

export interface SemanticSkillGroup {
  category: string;
  skills: string[];
}

export const SKILL_GROUPS_DATA: SemanticSkillGroup[] = [
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
];

export const CONSTELLATIONS_DATA: ConstellationGroup[] = [
  {
    discipline: 'LANGUAGES',
    name: 'Constellation Linguis',
    stars: [
      { name: 'JavaScript', usedIn: 'Dynamic UI logic & React components across production projects & web platforms.', x: 20, y: 35 },
      { name: 'TypeScript', usedIn: 'Fastify backend REST APIs at IMS Learning & Next.js commercial platform at Techriciate.', x: 50, y: 20 },
      { name: 'Python', usedIn: 'PyTorch & ViT backends for TrustNet-AI, and network data processing for SIH Project AURA.', x: 80, y: 35 },
      { name: 'Java', usedIn: 'Core object-oriented design patterns, algorithmic data structures, and engineering coursework.', x: 35, y: 75 },
      { name: 'SQL', usedIn: 'Relational database queries, schema design, and ACID transactions (NPTEL Elite Certification).', x: 65, y: 75 },
    ],
    links: [[0, 1], [1, 2], [0, 3], [3, 4], [4, 2]],
  },
  {
    discipline: 'FRAMEWORKS',
    name: 'Constellation Structura',
    stars: [
      { name: 'React.js', usedIn: 'Analyst dashboards for AURA (SIH 2025 Finals), TrustNet-AI frontend, and Reimbursement platform.', x: 18, y: 25 },
      { name: 'Next.js', usedIn: 'Official startup website and commercial e-commerce web platform at Techriciate.', x: 50, y: 15 },
      { name: 'Node.js', usedIn: 'Application backend services from scratch at Sapphire Infocom & college reimbursement platform.', x: 82, y: 25 },
      { name: 'Express.js', usedIn: 'REST APIs, custom middleware, JWT auth, and centralized error handling at Sapphire Infocom.', x: 25, y: 75 },
      { name: 'Fastify', usedIn: 'High-performance backend REST APIs and structured routing for internal services at IMS Learning.', x: 55, y: 80 },
      { name: 'FastAPI', usedIn: 'Low-latency inference microservices and deepfake detection model serving for TrustNet-AI.', x: 80, y: 65 },
    ],
    links: [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [5, 2]],
  },
  {
    discipline: 'DATABASES',
    name: 'Constellation Persistis',
    stars: [
      { name: 'MongoDB', usedIn: 'Database schemas, aggregation pipelines, and Atlas clusters at Sapphire Infocom & Techriciate.', x: 25, y: 35 },
      { name: 'PostgreSQL', usedIn: 'Relational schema design, normalization, indexing, and transactional data integrity.', x: 75, y: 35 },
      { name: 'Elasticsearch', usedIn: 'Data indexing and search query evaluation in local environments at IMS Learning Resources.', x: 50, y: 75 },
    ],
    links: [[0, 1], [1, 2], [2, 0]],
  },
  {
    discipline: 'AI / MACHINE LEARNING',
    name: 'Constellation Neuralis',
    stars: [
      { name: 'PyTorch', usedIn: 'Model development and tensor evaluation pipelines for Senior Capstone TrustNet-AI.', x: 20, y: 25 },
      { name: 'Hugging Face Transformers', usedIn: 'Vision Transformer (ViT-B/16) fine-tuning for synthetic face representation learning.', x: 55, y: 18 },
      { name: 'OpenCV', usedIn: 'Image preprocessing, face alignment, and spatial artifact extraction.', x: 82, y: 30 },
      { name: 'Deep Learning', usedIn: 'EfficientNet spatial backbones and multi-layer deception detection models.', x: 25, y: 75 },
      { name: 'Computer Vision', usedIn: '2D FFT frequency spectral analysis and Error Level Analysis (ELA) forensic maps.', x: 58, y: 70 },
      { name: 'XAI', usedIn: 'Grad-CAM visual explainability maps providing verifiable heatmaps of manipulated facial regions.', x: 82, y: 75 },
    ],
    links: [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]],
  },
  {
    discipline: 'ARCHITECTURE & SYSTEMS',
    name: 'Constellation Architectura',
    stars: [
      { name: 'REST APIs', usedIn: 'Modular endpoints across IMS Learning, Sapphire Infocom, and college administrative portal.', x: 20, y: 30 },
      { name: 'Microservices', usedIn: 'Decoupled FastAPI inference containers and independent Fastify backend services.', x: 55, y: 20 },
      { name: 'WebSockets', usedIn: 'Real-time bidirectional event streaming and incident telemetry communication.', x: 82, y: 35 },
      { name: 'JWT', usedIn: 'Secure stateless authentication and role-based access control at Sapphire Infocom.', x: 30, y: 75 },
      { name: 'OAuth', usedIn: 'Third-party authorization workflows and delegated identity security protocols.', x: 70, y: 75 },
    ],
    links: [[0, 1], [1, 2], [0, 3], [3, 4], [4, 2]],
  },
  {
    discipline: 'DEVOPS & TOOLS',
    name: 'Constellation Operatus',
    stars: [
      { name: 'Docker', usedIn: 'Containerization of deep learning FastAPI microservices and deployment runtimes.', x: 25, y: 30 },
      { name: 'Git', usedIn: 'Version control workflows, milestone branch management, and collaborative code reviews.', x: 75, y: 30 },
      { name: 'GitHub Actions', usedIn: 'Automated continuous integration checks, linting, and build verification.', x: 30, y: 75 },
      { name: 'Kibana', usedIn: 'Deep incident query dashboards and network telemetry inspection for SIH Project AURA.', x: 75, y: 75 },
    ],
    links: [[0, 1], [1, 3], [3, 2], [2, 0], [0, 3]],
  },
  {
    discipline: 'AI SPECIALIZATION',
    name: 'Constellation Cognitio',
    stars: [
      { name: 'LLMs', usedIn: 'Oracle Agentic AI Foundations certified; intelligent agent orchestration workflows.', x: 30, y: 45 },
      { name: 'Prompt Engineering', usedIn: 'Structured prompt design, zero/few-shot reasoning workflows in GenAI hackathons.', x: 70, y: 45 },
    ],
    links: [[0, 1]],
  },
];
