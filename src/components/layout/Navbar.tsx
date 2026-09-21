import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, FastForward, FileDown } from 'lucide-react';
import { useMissionStore } from '../../mission/missionStore';
import { getLenis } from '../../mission/timeline';

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const phaseId = useMissionStore((state) => state.phaseId);
  const setReducedMotion = useMissionStore((state) => state.setReducedMotion);

  const navLinks = [
    { id: 'skills', label: 'Stack', phase: 'CONSTELLATIONS · 7 DISCIPLINES' },
    { id: 'projects', label: 'Work', phase: 'ORBIT · 5 PAYLOADS' },
    { id: 'experience', label: 'Experience', phase: 'TRANSFER · MISSION LOG' },
    { id: 'achievements', label: 'Honors', phase: 'ASTEROID BELT · MILESTONES' },
    { id: 'about', label: 'Dossier', phase: 'PALE BLUE DOT · IDENTITY' },
  ];

  // Live flight clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTimeStr(`${now.toLocaleTimeString('en-GB', options)} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Performance-optimized active section spy with IntersectionObserver (zero forced reflows)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 25;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver for section detection without querying layout geometry on scroll
    const sectionIds = ['hero', 'skills', 'projects', 'experience', 'achievements', 'about', 'contact'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(element, { offset: -70, duration: 1.2 });
      } else {
        const yOffset = -70;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleSkipCinematic = () => {
    setReducedMotion(true);
    handleNavClick('projects');
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080b14]/75 backdrop-blur-xl border-b border-white/[0.08] py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo with Live Mission Status */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="flex items-center gap-3 text-sm font-semibold tracking-tight text-white hover:text-[#c99a5e] transition-colors rounded group"
            data-cursor-text="ALOK"
          >
            <div className="w-2 h-2 rounded-full bg-[#c99a5e] shadow-[0_0_8px_rgba(201,154,94,0.8)] animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="leading-none text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-[#c99a5e] transition-colors">
                ALOK KUMAR SAHOO
              </span>
              <span className="font-mono text-[9px] text-[#8c919d] tracking-widest uppercase mt-0.5">
                MISSION SAHOO-1 · {phaseId}
              </span>
            </div>
          </a>

          {/* Center: Desktop Nav Links with Phase Tooltip on Hover */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-[#080b14]/60 border border-white/[0.08] rounded-full px-4 py-1.5 backdrop-blur-md relative"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => setHoveredPhase(link.phase)}
                  onMouseLeave={() => setHoveredPhase(null)}
                >
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`relative text-xs tracking-normal font-mono px-3 py-1 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/[0.12] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
                        : 'text-[#8c919d] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.label}
                  </button>

                  {/* Hover Phase Tooltip */}
                  {hoveredPhase === link.phase && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded bg-[#080b14]/95 border border-[#c99a5e]/40 text-[9px] font-mono text-[#c99a5e] tracking-wider uppercase whitespace-nowrap shadow-xl pointer-events-none z-30">
                      {link.phase}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Actions: Skip to Content Link + Live Clock + Transmit CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Persistent Skip to Content Link for Recruiters */}
            <button
              onClick={handleSkipCinematic}
              data-cursor-text="STATIC"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono text-[#8c919d] hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
              title="Skip 3D animations and view portfolio content directly"
            >
              <FastForward size={11} className="text-[#c99a5e]" />
              <span className="hidden md:inline">Skip to content</span>
              <span className="md:hidden">Static</span>
            </button>

            {/* Downloadable Verified Resume Link */}
            <a
              href="/resume.pdf"
              download="Alok_Kumar_Sahoo_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="RESUME"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono text-[#f4f5f6] hover:text-[#c99a5e] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
              title="Download verified resume PDF"
            >
              <FileDown size={11} className="text-[#c99a5e]" />
              <span className="hidden sm:inline">Resume</span>
            </a>

            {/* Live IST Clock */}
            {timeStr && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#8c919d] bg-white/[0.02] border border-white/[0.05] px-2.5 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{timeStr}</span>
              </div>
            )}

            {/* Direct Comms CTA */}
            <button
              onClick={() => handleNavClick('contact')}
              data-cursor-text="TRANSMIT"
              className="px-3.5 py-1.5 rounded-md text-xs font-mono font-medium tracking-wider uppercase border border-[#c99a5e]/40 text-[#c99a5e] hover:bg-[#c99a5e] hover:text-[#050608] active:scale-[0.98] transition-all shadow-[0_0_12px_rgba(201,154,94,0.15)]"
            >
              TRANSMIT
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#8c919d] hover:text-white transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c99a5e]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-[#080b14]/95 backdrop-blur-2xl p-6 pt-24 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#8c919d]">
              <span>ACTIVE MISSION STATUS</span>
              <span className="text-[#c99a5e] font-semibold">{phaseId}</span>
            </div>

            <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-semibold'
                        : 'text-[#8c919d] hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className="text-base font-sans">{link.label}</span>
                    <span className="text-xs font-mono text-[#c99a5e]">{link.phase}</span>
                  </button>
                );
              })}

              <button
                onClick={() => handleNavClick('contact')}
                className={`flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                  activeSection === 'contact'
                    ? 'bg-white/[0.08] text-white font-semibold'
                    : 'text-[#8c919d] hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span className="text-base font-sans">Open comms channel</span>
                <span className="text-xs font-mono text-[#c99a5e]">NEBULA // TRANSMIT</span>
              </button>
            </nav>
          </div>

          <div className="pt-8 border-t border-white/[0.08] flex flex-col gap-3 text-xs font-mono text-[#8c919d]">
            <button
              onClick={handleSkipCinematic}
              className="text-left text-[#38bdf8] flex items-center gap-1.5 py-1"
            >
              <FastForward size={13} />
              <span>Switch to Static / Recruiter Mode</span>
            </button>
            <a
              href="/resume.pdf"
              download="Alok_Kumar_Sahoo_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left text-[#c99a5e] flex items-center gap-1.5 py-1"
            >
              <FileDown size={13} />
              <span>Download Resume PDF</span>
            </a>
            <div className="flex items-center justify-between">
              <span>LOCATION:</span>
              <span className="text-white">Thane, Maharashtra, India</span>
            </div>
            <div className="flex items-center justify-between">
              <span>DIRECT INQUIRIES:</span>
              <a href="mailto:aloknsahoo@gmail.com" className="text-[#c99a5e] hover:underline flex items-center gap-1">
                aloknsahoo@gmail.com
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
