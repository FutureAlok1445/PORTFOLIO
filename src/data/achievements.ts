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

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    number: '01',
    title: 'Smart India Hackathon 2025',
    position: 'National Grand Finale Finalist',
    organization: 'Ministry of Education / AICTE (NCIIPC / NTRO)',
    year: '2025',
    description: 'Selected as a National Grand Finale Finalist by the Ministry of Education & AICTE for engineering Project AURA—an analyst-facing network traffic inspection and IPDR/PCAP log analysis platform.',
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
    position: '1st Rank (Team Lead)',
    organization: 'Atharva University Mumbai',
    year: '2026',
    description: 'Secured 1st Rank as Team Lead at Atharva University Mumbai (Hackdeck 2.0), recognized by judges for architectural scalability, security standards, and responsive user experience.',
  },
  {
    number: '04',
    title: 'HackStreak 2.0',
    position: 'First Place (Third Year Category)',
    organization: 'ITSA, A. P. Shah Institute of Technology',
    year: '2026',
    description: 'Awarded First Place in the Third Year Category by ITSA, A. P. Shah Institute of Technology, for rapid full-stack system design, schema modeling, and working prototype delivery.',
  },
  {
    number: '05',
    title: 'DataWeb Hackathon',
    position: '2nd Prize, Generative AI Domain',
    organization: 'Intercollegiate 6-Hour Hackathon',
    year: '2026',
    description: 'Secured 2nd Prize in the Generative AI Domain at an intercollegiate 6-hour hackathon for constructing an efficient generative AI application prototype under strict time constraints.',
  },
];

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    name: 'Oracle Agentic AI Foundations (2026)',
    issuer: 'Oracle University',
    detail: 'Foundational Agentic AI & Autonomous Agent Architecture',
    year: '2026',
  },
  {
    name: 'NPTEL DBMS (Elite) & Software Engineering',
    issuer: 'NPTEL / IIT Kharagpur',
    detail: 'Elite Certification in Database Management Systems (Top 5%)',
    year: '2025',
  },
  {
    name: 'IBM Web Development Fundamentals',
    issuer: 'IBM / IBM SkillsBuild',
    detail: 'Full-Stack Web Engineering Foundations',
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
    detail: 'Comprehensive Software Architecture & Data Structures Training',
    year: '2025',
  },
];
