import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#080b14]/40 backdrop-blur-md py-14 px-6 sm:px-8 z-10 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        {/* Left Column: Identity & Mission Status */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#c99a5e] shadow-[0_0_8px_rgba(201,154,94,0.9)]" />
            <span className="text-sm font-bold text-white tracking-tight">
              Alok Kumar Sahoo
            </span>
            <span className="text-[10px] font-mono text-[#8c919d] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
              MISSION SAHOO-1
            </span>
          </div>
          <p className="text-xs text-[#8c919d] font-mono">
            B.E. Information Technology · A.P. Shah Institute of Technology, Thane
          </p>
          {/* Requested Exact Mission Status in Footer */}
          <div className="text-[11px] text-[#8c919d] font-mono flex items-center gap-2 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">
              Mission status: available for Software Engineering roles
            </span>
          </div>
        </div>

        {/* Right Column: Social Channels & Back to Top */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <a
            href={PORTFOLIO_DATA.profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-text="GITHUB"
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#8c919d] hover:text-white hover:border-white/20 transition-all"
            aria-label="GitHub Profile"
          >
            <Github size={15} />
          </a>

          <a
            href={PORTFOLIO_DATA.profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-text="LINKEDIN"
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#8c919d] hover:text-white hover:border-white/20 transition-all"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={15} />
          </a>

          <a
            href={`mailto:${PORTFOLIO_DATA.profile.social.email}`}
            data-cursor-text="EMAIL"
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#8c919d] hover:text-[#c99a5e] hover:border-[#c99a5e]/40 transition-all"
            aria-label="Send Email"
          >
            <Mail size={15} />
          </a>

          <div className="w-[1px] h-6 bg-white/[0.1] mx-1" />

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            data-cursor-text="TOP"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#8c919d] hover:text-white hover:border-white/20 transition-all"
            title="Return to launch pad"
            aria-label="Scroll to top"
          >
            <span>LAUNCH PAD</span>
            <ArrowUp size={13} className="text-[#c99a5e]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
