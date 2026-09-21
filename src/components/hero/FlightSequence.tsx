import React from 'react';
import { ShieldCheck, Radio, Satellite as SatelliteIcon, Activity } from 'lucide-react';
import { useMissionStore } from '../../mission/missionStore';

export const FlightSequence: React.FC = () => {
  const reducedMotion = useMissionStore((state) => state.reducedMotion);

  if (reducedMotion) {
    return (
      <section className="py-16 px-6 max-w-5xl mx-auto border-y border-white/[0.08] my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
          <div className="p-4 rounded-lg bg-surface/50 border border-white/[0.08]">
            <div className="text-accent font-semibold mb-1">STAGE 1 // MECO &amp; SEP</div>
            <p className="text-secondary leading-relaxed">
              Main engine cutoff confirmed at T+02:30. Pneumatic pushers cleanly separate the booster into recovery trajectory.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-surface/50 border border-white/[0.08]">
            <div className="text-accent font-semibold mb-1">FAIRING // 110 KM JETTISON</div>
            <p className="text-secondary leading-relaxed">
              Clamshell fairings rotate open along hinges at 110 km, exposing the SAHOO-1 bus to the space vacuum.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-surface/50 border border-white/[0.08]">
            <div className="text-accent font-semibold mb-1">SAHOO-1 // ORBITAL DEPLOY</div>
            <p className="text-secondary leading-relaxed">
              Autonomous spring release, sequential solar wing articulation, and parabolic antenna Earth acquisition at 500 km LEO.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="mission-flight-corridor"
      aria-label="Aerospace Flight Corridor: Staging, Fairing & Deployment"
      className="relative w-full h-[280vh] pointer-events-none"
    >
      {/* Pinned Telemetry Annotation Corridor */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-24 px-6 sm:px-12 pointer-events-none z-20">
        {/* Top Header Rail */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-[11px] font-mono tracking-widest text-[#8c919d]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-white font-medium">TRAJECTORY CORRIDOR</span>
            <span className="text-muted/60">// LEO INSERTION SEQUENCE</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-muted/70">
            <span>AZIMUTH: 093° ENE</span>
            <span>INCLINATION: 28.5°</span>
            <span className="text-accent">TARGET: 500 KM SUN-SYNC</span>
          </div>
        </div>

        {/* Center Dynamic Telemetry Annotations (Crossfades synchronized with 3D Canvas via CSS / scroll) */}
        <div className="max-w-xl mx-auto w-full my-auto space-y-6">
          {/* Phase 03: MECO & Staging Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  T+02:30 // MECO &amp; STAGE SEPARATION
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent">
                ALT 65 KM
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#b8bcc6] leading-relaxed font-sans mb-3 font-light">
              Main engine cutoff verified. Pneumatic separation pushers release the first stage booster,
              which tumbles with deployed titanium grid fins toward recovery, while the second stage
              vacuum engine ignites with an ethereal violet plume in microgravity.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-muted">
              <span>PUSHERS: PNEUMATIC</span>
              <span>•</span>
              <span>BOOSTER: SLOW TUMBLE</span>
              <span>•</span>
              <span className="text-white">ENGINE: VACUUM EXPANSION</span>
            </div>
          </div>

          {/* Phase 04: Fairing Jettison Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#080b14]/55 backdrop-blur-md border border-white/[0.08] shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  T+03:30 // PAYLOAD FAIRING JETTISON
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent">
                ALT 110 KM
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#b8bcc6] leading-relaxed font-sans mb-3 font-light">
              Exosphere boundary cleared. Twin clamshell fairing halves unlatch and rotate outward along base
              hinges. Solar dawn rays glint across the golden-orange acoustic thermal blankets, revealing the
              primary payload <strong className="text-white font-medium">SAHOO-1</strong> mounted to the PAF.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-muted">
              <span>LATCHES: PYRO-RELEASE</span>
              <span>•</span>
              <span>HINGE: OUTWARD ARC</span>
              <span>•</span>
              <span className="text-white">PAYLOAD: SAHOO-1 REVEALED</span>
            </div>
          </div>

          {/* Phase 05: Satellite Deployment Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#080b14]/55 backdrop-blur-md border border-accent/40 shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SatelliteIcon className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  T+10:00 // SAHOO-1 DEPLOYMENT &amp; LOCK
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#34d399]/15 border border-[#34d399]/40 text-[#34d399]">
                500 KM LEO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#b8bcc6] leading-relaxed font-sans mb-3 font-light">
              Separation springs push the gold MLI-foil satellite bus into autonomous orbit. Dual 3-segment
              solar wings unfold sequentially with micro-damped settling, cold-gas RCS jets pulse for attitude
              hold, and the high-gain parabolic antenna establishes ground station lock.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-muted">
              <span className="text-[#34d399]">ARRAYS: 100% UNSTOWED</span>
              <span>•</span>
              <span>MLI: GOLD FOIL</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-white">
                <Radio className="w-3 h-3 text-accent animate-pulse" />
                TELEMETRY LINK: ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="flex items-center justify-between border-t border-white/[0.08] pt-3 text-[10px] font-mono text-muted">
          <span>SCROLL TO ADVANCE MISSION TRAJECTORY</span>
          <span className="text-accent">PHASE TRANSITION // 02 ORBIT AHEAD ↓</span>
        </div>
      </div>
    </section>
  );
};
