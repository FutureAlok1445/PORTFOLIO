import { useEffect } from 'react';
import { X, Github, ExternalLink } from 'lucide-react';
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
        className="fixed inset-0 bg-[#090a0d]/85 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto surface rounded-xl border-white/15 p-6 sm:p-8 shadow-2xl z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded text-muted hover:text-primary transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Category & Date */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted mb-2">
          <span className="text-accent font-medium">{project.number}</span>
          <span>·</span>
          <span>{project.category}</span>
          <span>·</span>
          <span>{project.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-primary mb-1">
          {project.title}
        </h3>
        <p className="text-xs font-mono text-secondary mb-6">
          {project.subtitle}
        </p>

        {/* Problem Statement */}
        <div className="mb-6 space-y-2">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-muted">
            The Problem
          </h4>
          <p className="text-secondary text-sm font-light leading-relaxed">
            {project.problem}
          </p>
        </div>

        {/* What I Built */}
        <div className="mb-6 space-y-2">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-muted">
            What I Built
          </h4>
          <p className="text-secondary text-sm font-light leading-relaxed">
            {project.whatIBuilt}
          </p>
        </div>

        {/* Architectural Highlights */}
        <div className="mb-6 space-y-2.5">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-muted">
            Key Architecture &amp; Deliverables
          </h4>
          <ul className="space-y-2">
            {project.keyDetails.map((detail, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-secondary font-light leading-relaxed flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/70 mt-1.5 shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="mb-8 space-y-2">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-muted">
            Technology Stack
          </h4>
          <p className="text-xs font-mono text-secondary">
            {project.techStack}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-medium bg-primary text-bg hover:bg-white transition-colors"
          >
            <Github size={14} />
            <span>View Source Code</span>
          </a>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-white/10 text-xs font-medium text-primary hover:border-white/20 transition-colors"
            >
              <span>Live Environment</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
