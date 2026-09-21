import { useState } from 'react';
import { Search, Sparkles, Star, Orbit } from 'lucide-react';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { CONSTELLATIONS_DATA } from '../../data/skills';

export const Skills = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredStar, setHoveredStar] = useState<{ name: string; usedIn: string; discipline: string } | null>(null);

  const filteredConstellations = CONSTELLATIONS_DATA.filter((group) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      group.discipline.toLowerCase().includes(term) ||
      group.name.toLowerCase().includes(term) ||
      group.stars.some((s) => s.name.toLowerCase().includes(term) || s.usedIn.toLowerCase().includes(term))
    );
  });

  return (
    <section id="skills" className="relative py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto z-10">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-[#c99a5e] font-bold">01 // SKILLS &amp; MINDSET</span>
        <div className="w-8 h-[1px] bg-white/[0.15]" />
        <span className="text-xs font-mono tracking-widest uppercase text-[#8c919d]">
          7 DISCIPLINES AS CONSTELLATIONS
        </span>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div>
          <AnimatedHeading
            lines={['Technical competencies as', 'navigational constellations.']}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
          />
          <p className="text-sm sm:text-base text-[#8c919d] font-light mt-2 max-w-2xl leading-relaxed">
            Hover any star to reveal its technical provenance and where I implemented it across production internships, SIH finals, and engineering systems.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c919d]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search star (e.g. Python, Docker)..."
            className="w-full bg-[#080b14]/70 border border-white/[0.1] rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-[#8c919d]/60 focus:outline-none focus:border-[#c99a5e] transition-colors"
          />
        </div>
      </div>

      {/* Floating Active Star Telemetry Inspector */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#080b14]/65 backdrop-blur-md border border-[#c99a5e]/30 shadow-[0_8px_32px_rgba(201,154,94,0.1)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c99a5e]/15 border border-[#c99a5e]/30 flex items-center justify-center shrink-0">
            <Star size={16} className="text-[#c99a5e] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#c99a5e] font-bold">
                {hoveredStar ? hoveredStar.name : 'HOVER A STAR TO INSPECT'}
              </span>
              {hoveredStar && (
                <span className="text-[10px] font-mono text-[#8c919d]">
                  // {hoveredStar.discipline}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#f4f5f6] font-light mt-0.5">
              {hoveredStar
                ? hoveredStar.usedIn
                : 'Move your targeting reticle over any constellation star below to inspect its verified resume usage.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-[10px] font-mono text-[#8c919d] self-end sm:self-center">
          <Orbit size={13} className="text-[#38bdf8]" />
          <span>7 DISCIPLINE CLUSTERS</span>
        </div>
      </div>

      {/* 7 Constellations Grid on Light Glass Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConstellations.map((group, gIdx) => (
          <div
            key={gIdx}
            data-cursor-text="CONSTELLATION"
            className="p-6 rounded-3xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-[0_12px_36px_rgba(0,0,0,0.35)] group"
          >
            <div>
              {/* Constellation Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                <div>
                  <span className="text-[9px] font-mono text-[#c99a5e] tracking-widest uppercase block">
                    {group.name}
                  </span>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase mt-0.5">
                    {group.discipline}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#8c919d] bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
                  {group.stars.length} STARS
                </span>
              </div>

              {/* Interactive Constellation SVG Map */}
              <div className="relative h-44 rounded-xl bg-black/40 border border-white/[0.05] overflow-hidden flex items-center justify-center p-2 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Constellation Connecting Lines */}
                  {group.links.map(([i1, i2], lIdx) => {
                    const s1 = group.stars[i1];
                    const s2 = group.stars[i2];
                    if (!s1 || !s2) return null;
                    return (
                      <line
                        key={lIdx}
                        x1={s1.x}
                        y1={s1.y}
                        x2={s2.x}
                        y2={s2.y}
                        stroke="rgba(201,154,94,0.35)"
                        strokeWidth="0.8"
                        strokeDasharray="2 1.5"
                      />
                    );
                  })}

                  {/* Stars as Interactive Nodes */}
                  {group.stars.map((star, sIdx) => {
                    const isHovered = hoveredStar?.name === star.name;
                    const isSearchMatch = searchTerm && star.name.toLowerCase().includes(searchTerm.toLowerCase());

                    return (
                      <g
                        key={sIdx}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredStar({ name: star.name, usedIn: star.usedIn, discipline: group.discipline })}
                        data-cursor-text={star.name}
                      >
                        {/* Glow halo */}
                        <circle
                          cx={star.x}
                          cy={star.y}
                          r={isHovered || isSearchMatch ? 7 : 3.5}
                          fill={isHovered || isSearchMatch ? 'rgba(201,154,94,0.3)' : 'rgba(255,255,255,0.06)'}
                          className="transition-all duration-200"
                        />
                        {/* Core star dot */}
                        <circle
                          cx={star.x}
                          cy={star.y}
                          r={isHovered || isSearchMatch ? 2.5 : 1.8}
                          fill={isHovered || isSearchMatch ? '#c99a5e' : '#f4f5f6'}
                          className="transition-colors duration-200"
                        />
                        {/* Star label */}
                        <text
                          x={star.x}
                          y={star.y > 60 ? star.y - 4 : star.y + 6}
                          textAnchor="middle"
                          fill={isHovered || isSearchMatch ? '#c99a5e' : '#8c919d'}
                          fontSize="3.8"
                          fontFamily="monospace"
                          fontWeight={isHovered ? 'bold' : 'normal'}
                        >
                          {star.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Star Tech Pills List */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {group.stars.map((star, sIdx) => {
                  const isHovered = hoveredStar?.name === star.name;
                  const isMatch = searchTerm && star.name.toLowerCase().includes(searchTerm.toLowerCase());
                  return (
                    <button
                      key={sIdx}
                      onMouseEnter={() => setHoveredStar({ name: star.name, usedIn: star.usedIn, discipline: group.discipline })}
                      data-cursor-text="STAR"
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 ${
                        isHovered || isMatch
                          ? 'bg-[#c99a5e] text-[#050608] font-bold shadow-[0_0_12px_rgba(201,154,94,0.6)]'
                          : 'bg-white/[0.04] text-[#f4f5f6] hover:bg-white/[0.08] hover:text-white border border-white/[0.05]'
                      }`}
                    >
                      {star.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Status */}
            <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-[#8c919d]">
              <span className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#c99a5e]" />
                <span>RESUME VERIFIED</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
