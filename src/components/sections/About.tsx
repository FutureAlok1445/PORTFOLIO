import { GraduationCap, UserCheck, Globe } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { AnimatedHeading } from '../ui/AnimatedHeading';

export const About = () => {
  const { education, aboutNarrative, fullName } = PORTFOLIO_DATA.profile;

  return (
    <section id="about" className="relative py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-[#c99a5e] font-bold">05 // DOSSIER</span>
        <div className="w-8 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-[#8c919d]">
          ENGINEERING IDENTITY &amp; ACADEMICS
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 sm:mb-20">
        <div>
          <AnimatedHeading
            lines={['Engineering identity, origins,', 'and academic flight school.']}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
          />
          <p className="text-sm sm:text-base text-[#8c919d] font-light mt-2 max-w-2xl leading-relaxed">
            Looking back across the heliopause at our pale blue dot—grounded in rigorous software systems, computer networks, and full-stack architecture.
          </p>
        </div>
        <span className="text-xs font-mono text-[#8c919d] shrink-0 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
          Dossier AKS-01445
        </span>
      </div>

      {/* Subtle "You are here: Thane, Maharashtra" Callout Line pointing at the Pale Blue Dot */}
      <div className="mb-10 p-4 rounded-2xl bg-[#080b14]/60 backdrop-blur-md border border-[#38bdf8]/30 shadow-[0_8px_32px_rgba(56,189,248,0.08)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8] animate-ping" />
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#38bdf8] font-bold tracking-wider uppercase">
              YOU ARE HERE:
            </span>
            <span className="text-white font-medium">Thane, Maharashtra, India</span>
            <span className="text-[#8c919d] hidden sm:inline">(19.2183° N, 72.9781° E)</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono text-[#8c919d]">
          <span className="hidden md:inline">DISTANCE: ~6.4 BILLION KM</span>
          <span className="text-[#c99a5e] flex items-center gap-1">
            <Globe size={11} />
            <span>PALE BLUE DOT PERSPECTIVE</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
        {/* Left Column: Human Engineering Narrative Floating on Light Glass Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.35)] space-y-7 text-sm sm:text-base text-[#8c919d] font-light leading-relaxed">
          {/* Dossier Header Strip */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <UserCheck size={14} className="text-[#c99a5e]" />
              <span className="text-white font-semibold">{fullName}</span>
            </div>
            <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AVAILABLE FOR ENGINEERING ROLES
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c99a5e] block font-semibold">
              Who I Am
            </span>
            <p className="text-white font-normal text-base sm:text-lg leading-relaxed">
              {aboutNarrative.intro}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-white/80 block font-semibold">
              Engineering Mindset &amp; Philosophy
            </span>
            <p className="text-[#b8bcc6]">
              {aboutNarrative.engineerType}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-white/80 block font-semibold">
              Systems I Build
            </span>
            <p className="text-[#b8bcc6]">
              {aboutNarrative.whatIBuild}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c99a5e] block font-semibold">
              Core Technical Focus
            </span>
            <p className="text-[#b8bcc6]">
              {aboutNarrative.technicalFocus}
            </p>
          </div>
        </div>

        {/* Right Column: Verified Academic Dossier & Flight School Coursework */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.35)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-[#c99a5e]" />
              <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                ACADEMIC FOUNDATION
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8c919d]">B.E. IT</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {education.degree}
            </h3>
            <p className="text-xs font-mono text-[#c99a5e] mt-1 font-semibold">
              {education.institution}
            </p>
            <p className="text-xs font-mono text-[#8c919d] mt-0.5">
              {education.location} · {education.period}
            </p>
          </div>

          {/* Scorecard Strip */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-[#8c919d] block">
                Cumulative CGPA
              </span>
              <span className="text-xl font-mono font-bold text-white mt-0.5 block">
                {education.cgpa}
              </span>
              <span className="text-[9px] font-mono text-emerald-400">Scale 10.0 (Verified)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-[#8c919d] block">
                Academic Standing
              </span>
              <span className="text-xs font-mono font-bold text-[#c99a5e] mt-1.5 block">
                Final Year Undergraduate
              </span>
              <span className="text-[9px] font-mono text-[#8c919d]">Class of 2027</span>
            </div>
          </div>

          {/* Senior Capstone Spotlight */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#c99a5e]/30">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c99a5e] block mb-1 font-bold">
              Senior Capstone Project
            </span>
            <p className="text-xs font-mono text-white font-medium">
              {education.seniorCapstone}
            </p>
          </div>

          {/* Coursework List as "Flight School" Mono List */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c99a5e] block mb-2.5 font-bold">
              FLIGHT SCHOOL // CORE CS CURRICULUM
            </span>
            <div className="space-y-2 text-xs font-mono">
              {education.coursework.map((course, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c99a5e]" />
                    <span className="text-white/95">{course}</span>
                  </div>
                  <span className="text-[9px] text-[#8c919d] uppercase">COMPLETED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
