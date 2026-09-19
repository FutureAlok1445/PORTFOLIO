import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const Achievements = () => {
  const { achievements, certifications } = PORTFOLIO_DATA;

  return (
    <section id="achievements" className="relative py-24 sm:py-32 px-6 sm:px-8 max-w-5xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-accent">04</span>
        <div className="w-6 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-muted">
          Achievements
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary">
          National hackathon finals and engineering recognitions.
        </h2>
        <span className="text-xs font-mono text-muted shrink-0">
          Numbered Editorial Index
        </span>
      </div>

      {/* Numbered Editorial List */}
      <div className="space-y-10 sm:space-y-12">
        {achievements.map((ach) => (
          <article
            key={ach.number}
            className="pt-8 border-t border-white/[0.08] first:border-t-0 first:pt-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-start">
              {/* Number */}
              <div className="md:col-span-1">
                <span className="text-xs font-mono text-accent font-medium">
                  {ach.number}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="md:col-span-5 space-y-1">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-primary">
                  {ach.title}
                </h3>
                <p className="text-xs font-mono text-secondary">
                  {ach.position} {ach.organization && `· ${ach.organization}`}
                </p>
                <span className="text-xs font-mono text-muted block">
                  {ach.year}
                </span>
              </div>

              {/* Factual Context */}
              <div className="md:col-span-6">
                <p className="text-xs sm:text-sm text-secondary font-light leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Verified Academic & Technical Credentials */}
      <div className="mt-20 pt-10 border-t border-white/[0.08]">
        <span className="text-xs font-mono tracking-widest uppercase text-muted block mb-6">
          Verified Technical Credentials
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
          {certifications.map((cert, cIdx) => (
            <div key={cIdx} className="space-y-1">
              <span className="text-primary font-medium block">
                {cert.name}
              </span>
              <span className="text-muted block">
                {cert.issuer} · {cert.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
