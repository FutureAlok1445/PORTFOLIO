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

export const EXPERIENCES_DATA: Experience[] = [
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
];
