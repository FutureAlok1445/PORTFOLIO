import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { liveTelemetry } from './missionStore';
import { MISSION_PHASES } from './telemetryKeyframes';
import { audioEngine } from './audio/audioEngine';

export const TelemetryHUD: React.FC = () => {
  const [audioActive, setAudioActive] = useState(!audioEngine.getIsMuted());
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
    let eventDisplayUntil = 0;

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

      // 6. Vertical Trajectory Dot Position (GPU transform without layout reflow)
      if (dotRef.current) {
        const p = Math.max(0, Math.min(1, liveTelemetry.progress));
        // Starts at PAD (bottom, y ~ 168px), ascends to ORB (top, y ~ 0px)
        const y = (1 - p) * 168;
        dotRef.current.style.transform = `translate3d(-50%, ${y.toFixed(1)}px, 0)`;
      }

      // 7. Event Flash Banner (guaranteed visible for at least 1.8s)
      if (eventBannerRef.current && eventTextRef.current) {
        const now = performance.now();
        if (liveTelemetry.eventFlash && liveTelemetry.eventFlash !== lastEvent) {
          lastEvent = liveTelemetry.eventFlash;
          eventDisplayUntil = now + 1800;
          eventTextRef.current.textContent = liveTelemetry.eventFlash;
          eventBannerRef.current.style.opacity = '1';
          eventBannerRef.current.style.transform = 'translateY(0)';
        } else if (now >= eventDisplayUntil && lastEvent) {
          eventBannerRef.current.style.opacity = '0';
          eventBannerRef.current.style.transform = 'translateY(6px)';
          lastEvent = null;
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
        className="fixed bottom-20 sm:bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-[#080a0f]/95 border border-[#c99a5e]/60 shadow-[0_0_24px_rgba(201,154,94,0.25)] backdrop-blur-xl transition-all duration-300 opacity-0 pointer-events-none z-50 flex items-center gap-3"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c99a5e] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c99a5e]" />
        </span>
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#f0f3f8]">
          <span className="text-[#8c919d] text-[10px]">EVENT //</span>
          <span ref={eventTextRef} className="text-[#e2b77d] font-bold uppercase tracking-wider">
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
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(201,154,94,0.8)] will-change-transform"
            style={{ transform: 'translate3d(-50%, 168px, 0)' }}
          />
        </div>
        <span className="tracking-tighter">PAD</span>
      </div>

      {/* Bottom-Right: Single Audio Telemetry Mute/Unmute Toggle (Pointer-events-auto) */}
      <div className="fixed bottom-5 right-5 sm:right-8 pointer-events-auto z-40">
        <button
          onClick={() => {
            const isUnmuted = audioEngine.toggleMute();
            setAudioActive(isUnmuted);
          }}
          data-cursor-text="AUDIO"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-mono tracking-wider uppercase transition-all duration-300 shadow-lg ${
            audioActive
              ? 'bg-[#c99a5e]/20 border-[#c99a5e] text-[#c99a5e] shadow-[0_0_16px_rgba(201,154,94,0.3)]'
              : 'bg-[#080b14]/70 backdrop-blur-md border-white/[0.1] text-[#8c919d] hover:text-white hover:border-white/20'
          }`}
          title={audioActive ? 'Mute synthesized ambient audio' : 'Unmute synthesized ambient audio'}
          aria-label={audioActive ? 'Mute ambient audio' : 'Unmute ambient audio'}
        >
          {audioActive ? (
            <>
              <Volume2 size={13} className="text-[#c99a5e] animate-pulse" />
              <span>AUDIO: LIVE</span>
              {/* Micro Equalizer Bars */}
              <div className="flex items-end gap-0.5 h-3 ml-0.5">
                <span className="w-0.5 h-2.5 bg-[#c99a5e] animate-bounce" />
                <span className="w-0.5 h-1.5 bg-[#c99a5e] animate-bounce delay-75" />
                <span className="w-0.5 h-3 bg-[#c99a5e] animate-bounce delay-150" />
              </div>
            </>
          ) : (
            <>
              <VolumeX size={13} />
              <span>AUDIO: MUTED</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
