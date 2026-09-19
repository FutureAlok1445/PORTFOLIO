import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const About = () => {
  const { education, aboutNarrative } = PORTFOLIO_DATA.profile;

  return (
    <section id="about" className="relative py-24 sm:py-32 px-6 sm:px-8 max-w-5xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-accent">05</span>
        <div className="w-6 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-muted">
          About
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary">
          Engineering identity, technical focus, and foundation.
        </h2>
        <span className="text-xs font-mono text-muted shrink-0">
          Human Profile
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 items-start pt-8 border-t border-white/[0.08]">
        {/* Left Column: Narrative answering Who, What kind of engineer, What he likes building */}
        <div className="md:col-span-7 space-y-6 text-sm sm:text-base text-secondary font-light leading-relaxed">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted block mb-2">
              Who I Am
            </span>
            <p className="text-primary">
              {aboutNarrative.intro}
            </p>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted block mb-2">
              Engineering Focus
            </span>
            <p>
              {aboutNarrative.engineerType}
            </p>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted block mb-2">
              What I Like Building
            </span>
            <p>
              {aboutNarrative.whatIBuild}
            </p>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted block mb-2">
              Technical Disciplines
            </span>
            <p>
              {aboutNarrative.technicalFocus}
            </p>
          </div>
        </div>

        {/* Right Column: Factual Academic Foundation */}
        <div className="md:col-span-5 space-y-8 pt-2 md:border-l md:border-white/[0.08] md:pl-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent block mb-2">
              Academic Background
            </span>
            <h3 className="text-lg font-semibold text-primary">
              {education.degree}
            </h3>
            <p className="text-xs font-mono text-secondary mt-1">
              {education.institution}
            </p>
            <p className="text-xs font-mono text-muted mt-0.5">
              {education.location} · {education.period}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-muted block">
              Cumulative Academic Record
            </span>
            <div className="flex items-baseline gap-4 text-xs font-mono">
              <span className="text-muted">CGPA:</span>
              <span className="text-primary font-medium">{education.cgpa}</span>
            </div>
            <div className="flex items-baseline gap-4 text-xs font-mono">
              <span className="text-muted">Standing:</span>
              <span className="text-primary font-medium">{education.status}</span>
            </div>
            <div className="flex items-baseline gap-4 text-xs font-mono">
              <span className="text-muted">Senior Capstone:</span>
              <span className="text-primary font-medium">TrustNet-AI</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-muted block mb-2">
              Undergraduate Coursework
            </span>
            <div className="space-y-1 text-xs font-mono text-secondary">
              {education.coursework.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent/60" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
