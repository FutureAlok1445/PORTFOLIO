import React, { useEffect, useRef } from 'react';
import { liveTelemetry } from './missionStore';
import { MISSION_PHASES } from './telemetryKeyframes';

export const TelemetryHUD: React.FC = () => {
  // Direct DOM refs for 60fps updates with ZERO React re-renders
  const timeRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const velRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const eventBannerRef = useRef<HTMLDivElement>(null);
  const eventTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animId: number;
    let lastEvent: string | null = null;

    const updateHUD = () => {
      // 1. Mission Time
      if (timeRef.current) {
        timeRef.current.textContent = liveTelemetry.formattedTime;
      }

      // 2. Altitude (km)
      if (altRef.current) {
        const alt = liveTelemetry.altitudeKm;
        altRef.current.textContent =
          alt < 1
            ? (alt * 1000).toFixed(0) + ' M'
            : alt < 100
            ? alt.toFixed(1) + ' KM'
            : Math.round(alt).toLocaleString() + ' KM';
      }

      // 3. Velocity (km/s)
      if (velRef.current) {
        velRef.current.textContent = liveTelemetry.velocityKms.toFixed(2) + ' KM/S';
      }

      // 4. Active Rocket Stage
      if (stageRef.current) {
        stageRef.current.textContent = liveTelemetry.stage;
      }

      // 5. Active Mission Phase Label
      if (phaseRef.current) {
        const phase = MISSION_PHASES.find((p) => p.id === liveTelemetry.phaseId);
        phaseRef.current.textContent = phase ? phase.label : liveTelemetry.phaseId;
      }

      // 6. Vertical Trajectory Dot Position (starts at PAD at bottom, ascends to ORB at top)
      if (dotRef.current) {
        dotRef.current.style.bottom = `${(liveTelemetry.progress * 100).toFixed(2)}%`;
      }

      // 7. Event Flash Banner
      if (eventBannerRef.current && eventTextRef.current) {
        if (liveTelemetry.eventFlash) {
          eventTextRef.current.textContent = liveTelemetry.eventFlash;
          eventBannerRef.current.style.opacity = '1';
          eventBannerRef.current.style.transform = 'translateY(0)';
          lastEvent = liveTelemetry.eventFlash;
        } else if (lastEvent) {
          eventBannerRef.current.style.opacity = '0';
          eventBannerRef.current.style.transform = 'translateY(6px)';
        }
      }

      animId = requestAnimationFrame(updateHUD);
    };

    animId = requestAnimationFrame(updateHUD);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <aside
      aria-label="Mission Flight Telemetry"
      className="pointer-events-none fixed inset-0 z-30 select-none font-mono"
    >
      {/* Event Flash Banner (Center-Bottom, just above nav/telemetry) */}
      <div
        ref={eventBannerRef}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-[#111318]/90 border border-accent/40 backdrop-blur-md transition-all duration-300 opacity-0 pointer-events-none"
      >
        <div className="flex items-center gap-2 text-xs text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span ref={eventTextRef} className="tracking-widest font-semibold uppercase">
            STAGE SEP
          </span>
        </div>
      </div>

      {/* Bottom-Left: Live Flight Metrics Cluster */}
      <div className="fixed bottom-5 left-5 sm:left-8 flex flex-col gap-1 text-[11px] leading-tight text-secondary">
        {/* Phase Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span ref={phaseRef} className="text-white font-medium tracking-wide">
            LAUNCH COMPLEX 39A
          </span>
        </div>

        {/* Telemetry Readouts Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-muted">
          <div>
            <span className="text-muted/70">TIME: </span>
            <span ref={timeRef} className="text-primary font-semibold">
              T-00:10
            </span>
          </div>
          <div>
            <span className="text-muted/70">STAGE: </span>
            <span ref={stageRef} className="text-primary">
              STAGE 1
            </span>
          </div>
          <div>
            <span className="text-muted/70">ALT: </span>
            <span ref={altRef} className="text-primary font-medium">
              0 M
            </span>
          </div>
          <div>
            <span className="text-muted/70">VEL: </span>
            <span ref={velRef} className="text-primary font-medium">
              0.00 KM/S
            </span>
          </div>
        </div>
      </div>

      {/* Right Edge: Vertical Trajectory Profile Gauge */}
      <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 h-44 sm:h-52 w-4 flex flex-col items-center justify-between text-[9px] text-muted">
        <span className="tracking-tighter">ORB</span>
        {/* Trajectory track rail */}
        <div className="relative w-[1.5px] h-full bg-white/[0.1] rounded-full overflow-hidden my-1">
          {/* Moving Trajectory indicator dot */}
          <div
            ref={dotRef}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(201,154,94,0.8)] transition-[bottom] duration-75"
            style={{ bottom: '0%' }}
          />
        </div>
        <span className="tracking-tighter">PAD</span>
      </div>
    </aside>
  );
};
