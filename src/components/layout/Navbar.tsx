import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'projects', label: 'Work' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Honors' },
    { id: 'about', label: 'About' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const allIds = ['hero', ...navLinks.map((l) => l.id), 'contact'];
      const sections = allIds.map((id) => document.getElementById(id));
      const scrollPos = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(allIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -75;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090a0d]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="flex items-center gap-2.5 text-sm font-medium text-primary hover:text-white transition-colors tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-medium tracking-normal text-white">Alok Kumar Sahoo</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-xs tracking-normal transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-1 py-0.5 ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Tactile Direct Contact Action */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-3.5 py-1.5 rounded border border-white/15 text-xs font-medium text-primary hover:border-accent hover:text-accent active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Contact
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-secondary hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[56px] z-40 md:hidden bg-[#090a0d]/95 backdrop-blur-xl border-b border-white/[0.08] p-6 shadow-2xl">
          <nav className="flex flex-col gap-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between py-2 text-sm text-left transition-colors ${
                    isActive ? 'text-white font-semibold' : 'text-secondary hover:text-primary'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </button>
              );
            })}

            <button
              onClick={() => handleNavClick('contact')}
              className={`flex items-center justify-between py-2 text-sm text-left transition-colors ${
                activeSection === 'contact' ? 'text-white font-semibold' : 'text-secondary hover:text-primary'
              }`}
            >
              <span>Contact</span>
              {activeSection === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          </nav>
        </div>
      )}
    </>
  );
};
