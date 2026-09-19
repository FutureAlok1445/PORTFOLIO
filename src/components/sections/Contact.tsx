import { useState } from 'react';
import { Check, Copy, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const Contact = () => {
  const { social } = PORTFOLIO_DATA.profile;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    const mailtoSubject = encodeURIComponent(`Engineering Inquiry from ${formData.name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );

    setTimeout(() => {
      window.location.href = `mailto:${social.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }, 300);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(social.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-6 sm:px-8 max-w-5xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-accent">06</span>
        <div className="w-6 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-muted">
          Contact
        </span>
      </div>

      {/* Visually Quiet Headline */}
      <div className="space-y-3 mb-16 sm:mb-20">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-primary">
          Let's build something useful.
        </h2>
        <p className="text-sm sm:text-base text-secondary font-light max-w-2xl leading-relaxed">
          Whether you are exploring a software engineering role, discussing distributed backend systems, or inquiring about my work, my inbox is open.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 pt-8 border-t border-white/[0.08]">
        {/* Left Column: Direct Ingestion Channels */}
        <div className="md:col-span-5 space-y-6">
          {/* Email Click-to-Copy */}
          <div
            onClick={handleCopyEmail}
            className="group cursor-pointer space-y-1 pb-4 border-b border-white/[0.06]"
          >
            <div className="flex items-center justify-between text-xs font-mono text-muted">
              <span>EMAIL</span>
              <span className="text-[11px] text-accent flex items-center gap-1">
                {copiedEmail ? (
                  <>
                    <Check size={12} />
                    <span>Copied to clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Click to copy</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-sm font-mono text-primary group-hover:text-accent transition-colors">
              {social.email}
            </p>
          </div>

          {/* LinkedIn */}
          <div className="space-y-1 pb-4 border-b border-white/[0.06]">
            <span className="text-xs font-mono text-muted block">LINKEDIN</span>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:text-accent transition-colors"
            >
              <span>alok-kumar-sahoo1445</span>
              <ArrowUpRight size={13} className="text-muted" />
            </a>
          </div>

          {/* GitHub */}
          <div className="space-y-1 pb-4 border-b border-white/[0.06]">
            <span className="text-xs font-mono text-muted block">GITHUB</span>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:text-accent transition-colors"
            >
              <span>FutureAlok1445</span>
              <ArrowUpRight size={13} className="text-muted" />
            </a>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <span className="text-xs font-mono text-muted block">LOCATION</span>
            <span className="text-sm font-mono text-secondary block">
              {social.location}
            </span>
          </div>
        </div>

        {/* Right Column: Quiet Direct Message Form */}
        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono uppercase tracking-wider text-muted"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-[#0c0e12] border border-white/[0.08] rounded px-3.5 py-2 text-sm text-primary placeholder-muted/60 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono uppercase tracking-wider text-muted"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-[#0c0e12] border border-white/[0.08] rounded px-3.5 py-2 text-sm text-primary placeholder-muted/60 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="contact-message"
                className="block text-xs font-mono uppercase tracking-wider text-muted"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Details on engineering role, project, or inquiry..."
                className="w-full bg-[#0c0e12] border border-white/[0.08] rounded px-3.5 py-2 text-sm text-primary placeholder-muted/60 focus:outline-none focus:border-accent transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className="px-5 py-2 rounded text-xs font-mono tracking-wide uppercase bg-white/[0.08] hover:bg-white text-primary hover:text-black border border-white/[0.12] transition-all"
            >
              {submitted ? 'Opening Mail Client...' : isSubmitting ? 'Preparing...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
