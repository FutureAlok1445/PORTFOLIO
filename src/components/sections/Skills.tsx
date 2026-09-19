import { Fragment } from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

export const Skills = () => {
  const { skillGroups } = PORTFOLIO_DATA;

  return (
    <section id="skills" className="relative py-24 sm:py-32 px-6 sm:px-8 max-w-5xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-accent">03</span>
        <div className="w-6 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-muted">
          Technical Competencies
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary">
          Core technical competencies and systems tools.
        </h2>
        <span className="text-xs font-mono text-muted shrink-0">
          07 Technical Disciplines
        </span>
      </div>

      {/* Editorial Technical Matrix: Dot-separated Typography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 pt-8 border-t border-white/[0.08]">
        {skillGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-xs font-mono tracking-widest uppercase text-accent font-medium">
              {group.category}
            </h3>
            <p className="text-sm sm:text-base text-secondary font-light leading-relaxed">
              {group.skills.map((skill, sIdx) => (
                <Fragment key={sIdx}>
                  <span className="text-primary hover:text-white transition-colors">
                    {skill}
                  </span>
                  {sIdx < group.skills.length - 1 && (
                    <span className="text-muted/40 mx-2 select-none">·</span>
                  )}
                </Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
