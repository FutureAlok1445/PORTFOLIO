import { useEffect } from 'react';
import { X, Github, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Project } from '../../data/portfolioData';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#050608]/90 backdrop-blur-md transition-opacity"
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#080b14]/90 backdrop-blur-xl rounded-3xl border border-white/[0.12] p-6 sm:p-10 shadow-[0_24px_72px_rgba(0,0,0,0.8)] z-10 font-sans">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg text-[#8c919d] hover:text-white hover:bg-white/[0.05] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c99a5e]"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Category & Date */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#8c919d] mb-3">
          <span className="text-[#c99a5e] font-bold">{project.number}</span>
          <span>·</span>
          <span className="uppercase tracking-wider">{project.category}</span>
          <span>·</span>
          <span className="text-white/60">{project.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm font-mono text-[#c99a5e] mb-6">
          {project.subtitle}
        </p>

        {/* Verified Metrics Strip */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-white/[0.02] border border-[#c99a5e]/20 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c99a5e] font-semibold block">
              Verified Project Outcomes &amp; Distinctions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.metrics.map((m, mIdx) => (
                <div key={mIdx} className="flex items-start gap-2 text-xs font-mono text-[#f4f5f6]">
                  <CheckCircle2 size={13} className="text-[#c99a5e] mt-0.5 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Problem Statement */}
        <div className="mb-6 space-y-2">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-[#8c919d]">
            The Engineering Challenge &amp; Problem
          </h4>
          <p className="text-[#8c919d] text-sm sm:text-base font-light leading-relaxed">
            {project.problem}
          </p>
        </div>

        {/* What I Built */}
        <div className="mb-6 space-y-2">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-[#c99a5e]">
            Architectural Solution &amp; Scope
          </h4>
          <p className="text-white text-sm sm:text-base font-light leading-relaxed">
            {project.whatIBuilt}
          </p>
        </div>

        {/* Key Details */}
        <div className="mb-8 space-y-3">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-[#8c919d]">
            Technical Deliverables &amp; Pipelines
          </h4>
          <ul className="space-y-2.5">
            {project.keyDetails.map((detail, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-[#8c919d] font-light leading-relaxed flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c99a5e] mt-2 shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="mb-8 space-y-2">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-[#8c919d]">
            Technical Architecture Stack
          </h4>
          <p className="text-xs font-mono text-[#c99a5e]">
            {project.techStack}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/[0.08]">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-white text-[#050608] hover:bg-neutral-200 transition-colors"
          >
            <Github size={14} />
            <span>View Source Repository</span>
          </a>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-xs font-mono text-white hover:border-[#c99a5e] transition-colors"
            >
              <span>Live Deployment</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
