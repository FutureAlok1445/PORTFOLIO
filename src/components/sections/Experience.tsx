import { ExternalLink, CheckCircle2, Compass, Radio } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { AnimatedHeading } from '../ui/AnimatedHeading';

export const Experience = () => {
  const { experiences } = PORTFOLIO_DATA;

  // Explicitly map into the 3 requested chronological transfer waypoints
  const waypoints = [
    {
      waypointNum: '01',
      id: 'sapphire-infocom',
      telemetry: 'ALT: 240 KM · DELTA-V: +1.4 KM/S',
      data: experiences.find((e) => e.id === 'sapphire-infocom')!,
      roleFocus: 'FULL-STACK BACKEND & SECURE AUTHENTICATION',
    },
    {
      waypointNum: '02',
      id: 'ims-learning',
      telemetry: 'ALT: 1,800 KM · DELTA-V: +2.1 KM/S',
      data: experiences.find((e) => e.id === 'ims-learning')!,
      roleFocus: 'TYPESCRIPT REST APIS & ELASTICSEARCH INDEXING',
    },
    {
      waypointNum: '03',
      id: 'techriciate',
      telemetry: 'ALT: 36,000 KM · DELTA-V: +3.2 KM/S',
      data: experiences.find((e) => e.id === 'techriciate')!,
      roleFocus: 'COMMERCIAL NEXT.JS PLATFORMS & ADMIN CATALOGS',
    },
  ];

  return (
    <section id="experience" className="relative py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-[#c99a5e] font-bold">03 // EXPERIENCE</span>
        <div className="w-8 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-[#8c919d]">
          TRANSFER TRAJECTORY · MISSION LOG
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 sm:mb-20">
        <div>
          <AnimatedHeading
            lines={['Transfer trajectory and', 'engineering mission logs.']}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
          />
          <p className="text-sm sm:text-base text-[#8c919d] font-light mt-2 max-w-2xl leading-relaxed">
            Chronological mission waypoints sliding along the transfer trajectory: production backend services, database architectures, and commercial web platforms.
          </p>
        </div>
        <span className="text-xs font-mono text-[#8c919d] shrink-0 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
          03 Waypoints Logged
        </span>
      </div>

      {/* Vertical Trajectory Line with 3 Waypoints */}
      <div className="relative pl-6 sm:pl-10 space-y-16 sm:space-y-20">
        {/* Continuous Trajectory Rail */}
        <div className="absolute left-[11px] sm:left-[19px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#c99a5e] via-[#38bdf8]/40 to-transparent" />

        {waypoints.map(({ waypointNum, telemetry, data: exp, roleFocus }) => (
          <article
            key={exp.id}
            data-cursor-text="WAYPOINT"
            className="group relative pt-2"
          >
            {/* Pulsing Trajectory Waypoint Node */}
            <div className="absolute -left-[27px] sm:-left-[35px] top-4 w-4 h-4 rounded-full bg-[#080b14] border-2 border-[#c99a5e] shadow-[0_0_12px_rgba(201,154,94,0.9)] group-hover:scale-125 transition-transform flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c99a5e] animate-ping" />
            </div>

            {/* Light Glass Card Floating Over 3D Transfer Scene */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start p-6 sm:p-8 rounded-3xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
              {/* Left Column: Waypoint ID, Period & Flight Coordinates */}
              <div className="lg:col-span-4 space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#c99a5e]/15 border border-[#c99a5e]/30 text-[#c99a5e] text-[10px] font-mono font-bold tracking-wider uppercase">
                  <Compass size={12} />
                  <span>WAYPOINT {waypointNum}</span>
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-white tracking-wider block">
                    {exp.period}
                  </span>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8c919d] mt-1">
                    <span>{exp.location}</span>
                    {exp.isRemote && (
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[#38bdf8] text-[9px] font-medium">
                        Remote
                      </span>
                    )}
                  </div>
                </div>

                {/* Telemetry Coordinate Readout */}
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04] text-[10px] font-mono text-[#8c919d]">
                  <div className="flex items-center gap-1.5 text-[#38bdf8] font-semibold mb-0.5">
                    <Radio size={11} className="animate-pulse" />
                    <span>TRAJECTORY VECTOR</span>
                  </div>
                  <span>{telemetry}</span>
                </div>

                {/* Role Focus Badge */}
                <div className="pt-1">
                  <span className="text-[9px] font-mono tracking-widest text-[#8c919d] uppercase block mb-0.5">
                    MISSION SPECIALTY
                  </span>
                  <span className="text-xs font-mono text-white/90 font-medium">
                    {roleFocus}
                  </span>
                </div>
              </div>

              {/* Right Column: Company, Role & Exact Resume Bullets */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#c99a5e] transition-colors">
                      {exp.company}
                    </h3>

                    {exp.website && (
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor-text="LINK"
                        className="inline-flex items-center gap-1 text-xs font-mono text-[#8c919d] hover:text-[#c99a5e] transition-colors"
                      >
                        <span>Official Portal</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-medium text-[#c99a5e]">
                    {exp.role}
                  </p>
                </div>

                {/* Summary narrative */}
                <p className="text-sm sm:text-base text-[#f4f5f6] font-light leading-relaxed">
                  {exp.summary}
                </p>

                {/* Exact Resume Responsibilities Bullets */}
                <ul className="space-y-2.5 pt-2">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li
                      key={rIdx}
                      className="text-xs sm:text-sm text-[#b8bcc6] font-light leading-relaxed flex items-start gap-3"
                    >
                      <CheckCircle2 size={13} className="text-[#c99a5e] mt-1 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Stack Chips */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8c919d] mr-2">
                    PAYLOAD STACK:
                  </span>
                  {exp.techStack.split(' · ').map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-white/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
