import { Trophy, Medal, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { AnimatedHeading } from '../ui/AnimatedHeading';

export const Achievements = () => {
  const { achievements, certifications } = PORTFOLIO_DATA;

  const sihAchievement = achievements.find((a) => a.number === '01');
  const otherAchievements = achievements.filter((a) => a.number !== '01');

  const asteroidMetadata = [
    { num: '02', asteroidName: 'ASTEROID 02 // VESTA', metric: '1ST PRIZE WINNER' },
    { num: '03', asteroidName: 'ASTEROID 03 // PALLAS', metric: '1ST RANK CHAMPION' },
    { num: '04', asteroidName: 'ASTEROID 04 // HYGIEA', metric: '1ST PLACE (TY)' },
    { num: '05', asteroidName: 'ASTEROID 05 // INTERAMNIA', metric: '2ND PRIZE (GENAI)' },
  ];

  return (
    <section id="achievements" className="relative py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-[#c99a5e] font-bold">04 // HONORS &amp; MILESTONES</span>
        <div className="w-8 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-[#8c919d]">
          COMPETITIVE ACHIEVEMENTS
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 sm:mb-20">
        <div>
          <AnimatedHeading
            lines={['Competitive honors engraved as', 'asteroid mission patches.']}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
          />
          <p className="text-sm sm:text-base text-[#8c919d] font-light mt-2 max-w-2xl leading-relaxed">
            Five competitive milestones anchored to hero asteroids traversing deep space, led by national evaluation at the Smart India Hackathon Grand Finale.
          </p>
        </div>
        <span className="text-xs font-mono text-[#8c919d] shrink-0 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
          05 Mission Patches
        </span>
      </div>

      {/* Hero Master Asteroid Plate: Smart India Hackathon 2025 National Grand Finale (Largest) */}
      {sihAchievement && (
        <div
          data-cursor-text="SIH2025"
          className="relative p-7 sm:p-12 rounded-3xl bg-[#080b14]/65 backdrop-blur-md border-2 border-[#c99a5e]/60 shadow-[0_20px_60px_rgba(201,154,94,0.18)] mb-10 transition-all hover:border-[#c99a5e] group"
        >
          {/* Metallic Corner Rivets for Aerospace Mission Patch Plate */}
          <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#c99a5e]/50" />
          <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#c99a5e]/50" />
          <span className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-[#c99a5e]/50" />
          <span className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#c99a5e]/50" />

          {/* Top Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full bg-[#c99a5e] text-[#050608] font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-md">
                <Trophy size={14} />
                <span>HERO ASTEROID 01 // CERES MASTER PATCH</span>
              </span>
              <span className="text-xs font-mono text-[#8c919d]">
                {sihAchievement.year}
              </span>
            </div>
            <span className="text-xs font-mono text-[#c99a5e] bg-white/[0.04] border border-[#c99a5e]/30 px-3 py-1 rounded-md">
              {sihAchievement.organization}
            </span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2 group-hover:text-[#c99a5e] transition-colors">
            {sihAchievement.title}
          </h3>

          <p className="text-sm sm:text-base font-mono text-[#38bdf8] mb-4">
            Position: {sihAchievement.position} (National Grand Finale)
          </p>

          <p className="text-sm sm:text-base text-[#f4f5f6] font-light leading-relaxed max-w-4xl">
            {sihAchievement.description}
          </p>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8c919d]">
            <div className="flex items-center gap-3">
              <span className="text-white">PROJECT AURA</span>
              <span>·</span>
              <span>CYBERSECURITY &amp; NETWORK TELEMETRY</span>
            </div>
            <span className="text-[#c99a5e] font-semibold">NATIONAL LEVEL EVALUATION</span>
          </div>
        </div>
      )}

      {/* Grid of the Other 4 Companion Asteroid Mission Patches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {otherAchievements.map((ach) => {
          const meta = asteroidMetadata.find((m) => m.num === ach.number);
          return (
            <article
              key={ach.number}
              data-cursor-text="PATCH"
              className="relative p-6 sm:p-8 rounded-3xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-[0_12px_36px_rgba(0,0,0,0.35)] group"
            >
              {/* Corner Rivet */}
              <span className="absolute top-3 right-3 w-1 h-1 rounded-full bg-white/30" />

              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Medal size={15} className="text-[#c99a5e]" />
                    <span className="text-[11px] font-mono font-bold text-[#c99a5e] tracking-wider">
                      {meta?.asteroidName || `ASTEROID ${ach.number}`}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#8c919d]">
                    {ach.year}
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-1 group-hover:text-[#c99a5e] transition-colors">
                  {ach.title}
                </h4>

                <p className="text-xs font-mono text-[#38bdf8] mb-3">
                  {ach.position} {ach.organization && `· ${ach.organization}`}
                </p>

                <p className="text-xs sm:text-sm text-[#b8bcc6] font-light leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#8c919d]">
                <span>ASTEROID BELT MILESTONE</span>
                <span className="text-[#c99a5e] font-semibold">{meta?.metric}</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Verified Academic & Technical Credentials */}
      <div className="pt-12 border-t border-white/[0.08]">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-[#c99a5e] block mb-1">
              MISSION TELEMETRY MANIFEST
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Official Certifications &amp; Credentials
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8c919d] hidden sm:inline">
            7 Verified Credentials
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, cIdx) => (
            <div
              key={cIdx}
              className="p-4 rounded-2xl bg-[#080b14]/50 backdrop-blur-md border border-white/[0.06] hover:border-white/15 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8c919d] mb-1.5">
                  <span className="text-[#c99a5e] font-semibold">{cert.issuer}</span>
                  <span>{cert.year}</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  {cert.name}
                </h4>
                <p className="text-xs text-[#8c919d] font-light">
                  {cert.detail}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-mono text-[#8c919d]">
                <span>VERIFIED CREDENTIAL</span>
                <ShieldCheck size={12} className="text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
