import { useState } from 'react';
import { Github, ShieldAlert, GitCommit } from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '../../data/portfolioData';
import { ProjectModal } from '../ui/ProjectModal';

// Bespoke High-Precision Engineering Visuals with Coherent Neutral Palette
const ProjectVisualPreview = ({ variant }: { variant: 'network' | 'radar' | 'ledger' }) => {
  if (variant === 'network') {
    // TrustNet-AI: Credibility Graph & Veracity Score Schematic
    return (
      <div className="w-full h-64 sm:h-72 md:h-80 rounded-lg bg-[#0b0d11] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-5 select-none transition-transform duration-500 ease-out group-hover:scale-[1.008]">
        {/* Subtle coordinate dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-3 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-primary font-medium tracking-wide">TRUSTNET-AI PIPELINE</span>
            <span className="text-muted">v1.4</span>
          </div>
          <div className="flex items-center gap-4 text-muted">
            <span className="hidden sm:inline">ARCHITECTURE: GNN + NLP</span>
            <span className="text-accent font-medium">VERACITY: 96.4%</span>
          </div>
        </div>

        {/* Center Node Topology */}
        <div className="relative z-10 my-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-1 sm:px-4">
          {/* Ingest Node */}
          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06] w-full sm:w-44 text-left">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1">
              Ingested Stream
            </span>
            <p className="text-xs text-primary font-mono truncate">
              payload.claim.digest
            </p>
            <span className="text-[10px] font-mono text-secondary block mt-1">
              Tokens: 512 · Verified
            </span>
          </div>

          {/* Central Transformer Line */}
          <div className="hidden sm:flex flex-1 items-center justify-center">
            <svg className="w-full max-w-[180px] h-8" viewBox="0 0 180 32" fill="none">
              <path
                d="M 10 16 L 75 16 M 105 16 L 170 16"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle cx="90" cy="16" r="12" fill="#111318" stroke="rgba(201,154,94,0.5)" strokeWidth="1" />
              <text x="90" y="19.5" fill="#c99a5e" fontSize="9" fontFamily="monospace" textAnchor="middle">
                AI
              </text>
            </svg>
          </div>

          {/* Verdict Node */}
          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.08] w-full sm:w-48 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                Consensus Output
              </span>
              <span className="text-[10px] font-mono text-accent">CONFIRMED</span>
            </div>
            <div className="space-y-1 text-[11px] font-mono text-secondary">
              <div className="flex justify-between">
                <span>Semantic Consistency:</span>
                <span className="text-primary">0.98</span>
              </div>
              <div className="flex justify-between">
                <span>Source Centrality:</span>
                <span className="text-primary">0.94</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Specs */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/[0.06] text-[10px] font-mono text-muted">
          <span>LATENCY: &lt;42ms</span>
          <span>EMBEDDINGS: COSINE SIMILARITY</span>
          <span>PIPELINE: ASYNC FASTAPI</span>
        </div>
      </div>
    );
  }

  if (variant === 'radar') {
    // Project AURA: Security Network Packet Analysis Telemetry
    return (
      <div className="w-full h-64 sm:h-72 md:h-80 rounded-lg bg-[#0b0d11] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-5 select-none transition-transform duration-500 ease-out group-hover:scale-[1.008]">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-3 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <ShieldAlert size={13} className="text-accent" />
            <span className="text-primary font-medium tracking-wide">AURA PACKET INSPECTOR</span>
            <span className="text-muted text-[10px]">SIH 2025 GRAND FINALE</span>
          </div>
          <span className="text-muted">CAPTURE: RAW PCAP / IPDR</span>
        </div>

        {/* Middle Telemetry Grid */}
        <div className="relative z-10 my-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-muted uppercase block mb-0.5">
              Ingest Rate
            </span>
            <span className="text-base font-mono text-primary font-medium">10,000+</span>
            <span className="text-[10px] font-mono text-muted block mt-0.5">Packets / Second</span>
          </div>

          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-muted uppercase block mb-0.5">
              Anomaly Heuristic
            </span>
            <span className="text-base font-mono text-accent font-medium">Sub-second</span>
            <span className="text-[10px] font-mono text-muted block mt-0.5">Incident Dispatch</span>
          </div>

          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-muted uppercase block mb-0.5">
              Protocol Coverage
            </span>
            <span className="text-base font-mono text-primary font-medium">IPDR &amp; PCAP</span>
            <span className="text-[10px] font-mono text-muted block mt-0.5">Deep Session Parsing</span>
          </div>
        </div>

        {/* Terminal Log Snippet */}
        <div className="relative z-10 p-2.5 rounded bg-black/30 border border-white/[0.04] font-mono text-[10px] text-muted space-y-1">
          <div className="flex items-center justify-between text-secondary">
            <span>[PACKET_STREAM] Ingesting 1024 parallel chunks...</span>
            <span className="text-primary">OK</span>
          </div>
          <div className="flex items-center justify-between text-secondary">
            <span>[HEURISTIC_EVAL] Scanning port variance &amp; exfiltration entropy...</span>
            <span className="text-accent">NORMALIZED</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/[0.06] text-[10px] font-mono text-muted">
          <span>PARALLEL WORKERS: ACTIVE</span>
          <span>NCIIPC / NTRO CHALLENGE</span>
        </div>
      </div>
    );
  }

  // Reimbursement Automation: Multi-tier Workflow Ledger
  return (
    <div className="w-full h-64 sm:h-72 md:h-80 rounded-lg bg-[#0b0d11] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-5 select-none transition-transform duration-500 ease-out group-hover:scale-[1.008]">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-3 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <GitCommit size={13} className="text-accent" />
          <span className="text-primary font-medium tracking-wide">REIMBURSEMENT STATE MACHINE</span>
        </div>
        <span className="text-muted">RBAC PROTECTED</span>
      </div>

      {/* Workflow Stages */}
      <div className="relative z-10 my-auto py-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { step: '01', role: 'Faculty', status: 'Claim Lodged' },
            { step: '02', role: 'HOD', status: 'Dept Verified' },
            { step: '03', role: 'Principal', status: 'Approved' },
            { step: '04', role: 'Accounts', status: 'Disbursement' },
          ].map((stage, idx) => (
            <div
              key={idx}
              className="p-3 rounded bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-accent">{stage.step}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent/80" />
              </div>
              <div>
                <span className="text-xs font-medium text-primary block">{stage.role}</span>
                <span className="text-[10px] font-mono text-muted block mt-0.5">{stage.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Hash */}
      <div className="relative z-10 p-2.5 rounded bg-black/30 border border-white/[0.04] font-mono text-[10px] text-muted flex items-center justify-between">
        <span className="text-secondary">AUDIT HASH:</span>
        <span className="text-muted font-mono truncate max-w-[280px]">
          SHA256: 4f8b9e...2a7c
        </span>
        <span className="text-accent text-[9px] uppercase tracking-wider">Verified</span>
      </div>

      {/* Bottom Specs */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/[0.06] text-[10px] font-mono text-muted">
        <span>STACK: MERN · MONGODB · RBAC</span>
        <span>TURNAROUND: &lt;48 HOURS</span>
      </div>
    </div>
  );
};

export const Projects = () => {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const handleOpenArchitecture = (project: Project) => {
    setActiveModalProject(project);
  };

  return (
    <section id="projects" className="relative py-24 sm:py-32 px-6 sm:px-8 max-w-5xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-accent">01</span>
        <div className="w-6 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-muted">
          Selected Work
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary">
          Core engineering systems and architectures.
        </h2>
        <span className="text-xs font-mono text-muted shrink-0">
          03 Systems Documented
        </span>
      </div>

      {/* Large Editorial Project Blocks */}
      <div className="space-y-20 sm:space-y-24">
        {PORTFOLIO_DATA.projects.map((project) => (
          <article
            key={project.id}
            className="group relative pt-8 border-t border-white/[0.08]"
          >
            {/* Number & Metadata */}
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <span className="text-xs font-mono text-accent font-medium">
                {project.number}
              </span>
              <span className="text-xs font-mono text-muted">
                {project.category} · {project.date}
              </span>
            </div>

            {/* Project Name */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary group-hover:text-white transition-colors mb-2">
              {project.title}
            </h3>

            {/* Short One-Line Description */}
            <p className="text-sm sm:text-base text-secondary font-light leading-relaxed mb-3 max-w-2xl">
              {project.description}
            </p>

            {/* Technology Stack */}
            <p className="text-xs font-mono text-accent/90 mb-6 tracking-wide">
              {project.techStack}
            </p>

            {/* Problem & Solution Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 text-xs sm:text-sm text-secondary font-light leading-relaxed">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block">
                  The Problem
                </span>
                <p>{project.problem}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block">
                  What I Built
                </span>
                <p>{project.whatIBuilt}</p>
              </div>
            </div>

            {/* Large Visual Preview */}
            <div className="mb-5">
              <ProjectVisualPreview variant={project.previewVariant} />
            </div>

            {/* Tactile Bottom Links */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-5">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-accent transition-colors group/link focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
                >
                  <span className="transition-transform duration-200 group-hover/link:translate-x-1">
                    →
                  </span>
                  <span className="underline underline-offset-4 decoration-white/20 hover:decoration-accent">
                    View project repository
                  </span>
                </a>

                <button
                  onClick={() => handleOpenArchitecture(project)}
                  className="text-xs font-mono text-muted hover:text-primary transition-colors underline underline-offset-4 decoration-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
                >
                  Architecture overview
                </button>
              </div>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
                aria-label={`GitHub repository for ${project.title}`}
                title="View GitHub repository"
              >
                <Github size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
