import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#090a0d] py-14 px-6 sm:px-8 z-10">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left Column */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-sm font-medium text-primary tracking-tight">
              Alok Kumar Sahoo
            </span>
          </div>
          <p className="text-xs text-muted font-mono">
            B.E. Information Technology · A.P. Shah Institute of Technology
          </p>
          <p className="text-[11px] text-muted">
            Available for Software Engineering &amp; Distributed Systems Roles
          </p>
        </div>

        {/* Right Column / Socials */}
        <div className="flex items-center gap-4">
          <a
            href={PORTFOLIO_DATA.profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded p-1"
            aria-label="GitHub Profile"
          >
            <Github size={16} />
          </a>
          <a
            href={PORTFOLIO_DATA.profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded p-1"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={`mailto:${PORTFOLIO_DATA.profile.social.email}`}
            className="text-muted hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded p-1"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>

          <div className="w-[1px] h-4 bg-white/[0.1] mx-1" />

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-1.5 rounded text-muted hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            title="Return to top"
            aria-label="Scroll to top"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
};
