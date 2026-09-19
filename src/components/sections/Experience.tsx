import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const Experience = () => {
  const { experiences } = PORTFOLIO_DATA;

  return (
    <section id="experience" className="relative py-24 sm:py-32 px-6 sm:px-8 max-w-5xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-accent">02</span>
        <div className="w-6 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-muted">
          Experience
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary">
          Software engineering internships and production contributions.
        </h2>
        <span className="text-xs font-mono text-muted shrink-0">
          Editorial Timeline
        </span>
      </div>

      {/* Editorial Timeline: Typography & Spacing Driven */}
      <div className="space-y-16 sm:space-y-20">
        {experiences.map((exp) => (
          <article
            key={exp.id}
            className="pt-8 border-t border-white/[0.08] first:border-t-0 first:pt-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left Column: Dates & Location Metadata */}
              <div className="md:col-span-4 space-y-1.5">
                <span className="text-xs font-mono text-accent block">
                  {exp.period}
                </span>
                <span className="text-xs font-mono text-muted block">
                  {exp.location}
                  {exp.isRemote && exp.location.toLowerCase() !== 'remote' && ' · Remote'}
                </span>
              </div>

              {/* Right Column: Company, Role, Narrative, and Responsibilities */}
              <div className="md:col-span-8 space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
                    {exp.company}
                  </h3>
                  <p className="text-sm font-medium text-secondary mt-1">
                    {exp.role}
                  </p>
                </div>

                {/* Brief context summary */}
                <p className="text-secondary text-sm sm:text-base font-light leading-relaxed">
                  {exp.summary}
                </p>

                {/* Concise Responsibilities & Results */}
                <ul className="space-y-3 pt-1">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li
                      key={rIdx}
                      className="text-xs sm:text-sm text-secondary font-light leading-relaxed flex items-start gap-3"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent/80 mt-2 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Stack */}
                <div className="pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
                    Technology Stack
                  </span>
                  <p className="text-xs font-mono text-secondary">
                    {exp.techStack}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
