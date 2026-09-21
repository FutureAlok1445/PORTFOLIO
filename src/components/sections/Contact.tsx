import { useState } from 'react';
import { Check, Copy, ArrowUpRight, Mail, Phone, MapPin, Send, Radio, RadioTower, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { AnimatedHeading } from '../ui/AnimatedHeading';

export const Contact = () => {
  const { social } = PORTFOLIO_DATA.profile;

  const [selectedTopic, setSelectedTopic] = useState('Software Engineering Role');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [signalAcquired, setSignalAcquired] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const topicOptions = [
    'Software Engineering Role',
    'Backend & Distributed Systems',
    'AI Forensics & Computer Vision',
    'Technical Collaboration',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsTransmitting(true);

    const mailtoSubject = encodeURIComponent(`[${selectedTopic}] Comms Transmission from ${formData.name}`);
    const mailtoBody = encodeURIComponent(
      `Sender: ${formData.name}\nEmail: ${formData.email}\nTopic: ${selectedTopic}\n\nTransmission Content:\n${formData.message}`
    );

    // Visible Antenna Pulse Simulation
    setTimeout(() => {
      setIsTransmitting(false);
      setSignalAcquired(true);
      window.location.href = `mailto:${social.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

      setTimeout(() => {
        setSignalAcquired(false);
      }, 6000);
    }, 1200);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(social.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(social.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-[#c99a5e] font-bold">06 // COMMS CHANNEL</span>
        <div className="w-8 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-[#8c919d]">
          TRANSMISSION TERMINAL · DIRECT CONTACT
        </span>
      </div>

      {/* Section Headline */}
      <div className="space-y-3 mb-16 sm:mb-20">
        <AnimatedHeading
          lines={['Establish transmission link', 'across deep space.']}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
        />
        <p className="text-sm sm:text-base text-[#8c919d] font-light max-w-2xl leading-relaxed">
          Whether you are evaluating a software engineering candidate, architecting a distributed backend, or discussing deepfake AI forensics, communication channels are active.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
        {/* Left Column: Direct Communication Channels on Light Glass Panels */}
        <div className="lg:col-span-5 space-y-4">
          {/* Email Channel Card */}
          <div
            onClick={handleCopyEmail}
            data-cursor-text="COPY"
            className="group cursor-pointer p-5 rounded-2xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] hover:border-[#c99a5e]/50 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#8c919d] mb-1.5">
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-[#c99a5e]" />
                <span>PRIMARY INBOX</span>
              </span>
              <span className="text-[11px] text-[#c99a5e] font-semibold flex items-center gap-1">
                {copiedEmail ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy email</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-sm sm:text-base font-mono font-medium text-white group-hover:text-[#c99a5e] transition-colors">
              {social.email}
            </p>
          </div>

          {/* LinkedIn Card */}
          <a
            href={social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-text="LINKEDIN"
            className="group block p-5 rounded-2xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#8c919d] mb-1.5">
              <span>PROFESSIONAL NETWORK</span>
              <ArrowUpRight size={13} className="text-[#8c919d] group-hover:text-[#c99a5e] transition-colors" />
            </div>
            <p className="text-sm sm:text-base font-mono font-medium text-white group-hover:text-[#c99a5e] transition-colors">
              linkedin.com/in/alok-kumar-sahoo1445
            </p>
          </a>

          {/* GitHub Card */}
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-text="GITHUB"
            className="group block p-5 rounded-2xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#8c919d] mb-1.5">
              <span>OPEN SOURCE &amp; REPOSITORIES</span>
              <ArrowUpRight size={13} className="text-[#8c919d] group-hover:text-[#c99a5e] transition-colors" />
            </div>
            <p className="text-sm sm:text-base font-mono font-medium text-white group-hover:text-[#c99a5e] transition-colors">
              github.com/FutureAlok1445
            </p>
          </a>

          {/* Phone & Location Metadata Card */}
          <div className="p-5 rounded-2xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] flex flex-col gap-3 text-xs font-mono text-[#8c919d] shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin size={13} className="text-[#c99a5e]" />
                <span>GROUND STATION:</span>
              </span>
              <span className="text-white">{social.location}</span>
            </div>

            <div
              onClick={handleCopyPhone}
              className="flex items-center justify-between cursor-pointer hover:text-white transition-colors pt-2 border-t border-white/[0.04]"
            >
              <span className="flex items-center gap-2">
                <Phone size={13} className="text-[#c99a5e]" />
                <span>DIRECT LINE:</span>
              </span>
              <span className="text-white font-mono flex items-center gap-1.5">
                {social.phone}
                {copiedPhone ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: "Open Comms Channel" Form on Light Glass Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.35)] relative overflow-hidden">
          {/* Visible Antenna Pulse Animation Container */}
          {isTransmitting && (
            <div className="absolute inset-0 bg-[#c99a5e]/10 backdrop-blur-sm flex flex-col items-center justify-center z-20 transition-all">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#c99a5e] animate-ping" />
                <div className="w-12 h-12 rounded-full border-2 border-[#38bdf8] animate-ping delay-150 absolute" />
                <RadioTower size={32} className="text-[#c99a5e] animate-bounce z-10" />
              </div>
              <p className="font-mono text-xs text-[#c99a5e] mt-4 tracking-widest uppercase font-bold animate-pulse">
                TRANSMITTING ANTENNA PULSE...
              </p>
            </div>
          )}

          {/* Success State: SIGNAL ACQUIRED */}
          {signalAcquired && (
            <div className="absolute inset-0 bg-[#080b14]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-400/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.5)]">
                <Radio size={28} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                SIGNAL ACQUIRED
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#b8bcc6] max-w-md">
                Telemetry link verified. Your transmission has been compiled and redirected to the primary comms receiver.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#c99a5e] flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>LINK STATUS: 100% NOMINAL</span>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] text-xs font-mono text-white">
            <div className="flex items-center gap-2">
              <Radio size={15} className="text-[#c99a5e]" />
              <span className="font-semibold uppercase tracking-wider">OPEN COMMS CHANNEL</span>
            </div>
            <span className="text-[10px] text-[#8c919d]">TERMINAL VER // 2026.4</span>
          </div>

          {/* Topic Selectors */}
          <div className="mb-6 space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8c919d]">
              Transmission Category
            </label>
            <div className="flex flex-wrap gap-2">
              {topicOptions.map((topic) => (
                <button
                  type="button"
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  data-cursor-text="TOPIC"
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedTopic === topic
                      ? 'bg-[#c99a5e] text-[#050608] font-bold shadow-sm'
                      : 'bg-white/[0.03] border border-white/[0.06] text-[#8c919d] hover:text-white'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono uppercase tracking-wider text-[#8c919d]"
                >
                  Callsign / Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Maya Lin"
                  className="w-full bg-[#080b14]/70 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#8c919d]/50 focus:outline-none focus:border-[#c99a5e] transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono uppercase tracking-wider text-[#8c919d]"
                >
                  Return Channel / Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. maya@company.com"
                  className="w-full bg-[#080b14]/70 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#8c919d]/50 focus:outline-none focus:border-[#c99a5e] transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-message"
                className="block text-xs font-mono uppercase tracking-wider text-[#8c919d]"
              >
                Transmission Details
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Details on software engineering role, backend systems architecture, or AI forensics inquiry..."
                className="w-full bg-[#080b14]/70 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#8c919d]/50 focus:outline-none focus:border-[#c99a5e] transition-colors resize-y font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isTransmitting}
              data-cursor-text="TRANSMIT"
              className="w-full sm:w-auto px-7 py-3 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase bg-white hover:bg-neutral-200 text-[#050608] transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.12)] active:scale-[0.98]"
            >
              <Send size={13} />
              <span>{isTransmitting ? 'TRANSMITTING PULSE...' : 'OPEN COMMS CHANNEL →'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
