import { PROJECTS_DATA } from './projects';
import { EXPERIENCES_DATA } from './experience';
import { SKILL_GROUPS_DATA, CONSTELLATIONS_DATA } from './skills';
import { ACHIEVEMENTS_DATA, CERTIFICATIONS_DATA } from './achievements';

export type { Project } from './projects';
export type { Experience } from './experience';
export type { SemanticSkillGroup, ConstellationGroup, StarTech } from './skills';
export type { AchievementItem, CertificationItem } from './achievements';

export { PROJECTS_DATA } from './projects';
export { EXPERIENCES_DATA } from './experience';
export { SKILL_GROUPS_DATA, CONSTELLATIONS_DATA } from './skills';
export { ACHIEVEMENTS_DATA, CERTIFICATIONS_DATA } from './achievements';

export interface ProfileData {
  name: string;
  fullName: string;
  firstName: string;
  role: string;
  headline: string;
  summary: string;
  aboutNarrative: {
    intro: string;
    engineerType: string;
    whatIBuild: string;
    technicalFocus: string;
  };
  education: {
    degree: string;
    institution: string;
    period: string;
    cgpa: string;
    status: string;
    location: string;
    seniorCapstone: string;
    coursework: string[];
  };
  social: {
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    location: string;
  };
}

export const PROFILE_DATA: ProfileData = {
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
};

export const PORTFOLIO_DATA = {
  profile: PROFILE_DATA,
  projects: PROJECTS_DATA,
  experiences: EXPERIENCES_DATA,
  skillGroups: SKILL_GROUPS_DATA,
  constellations: CONSTELLATIONS_DATA,
  achievements: ACHIEVEMENTS_DATA,
  certifications: CERTIFICATIONS_DATA,
};
