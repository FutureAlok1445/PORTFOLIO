import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, ShieldAlert, Award, Cpu, Rocket } from 'lucide-react';
import { useMissionStore } from '../../mission/missionStore';
import { getLenis } from '../../mission/timeline';

gsap.registerPlugin(ScrollTrigger);

export const RocketHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useMissionStore((state) => state.reducedMotion);
  const phaseId = useMissionStore((state) => state.phaseId);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isIgniting, setIsIgniting] = useState(false);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    // Fade out hero UI overlay during launch liftoff phase
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          if (textRef.current) {
            const opacity = Math.max(0, 1 - self.progress * 2.2);
            textRef.current.style.opacity = opacity.toString();
            textRef.current.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
            textRef.current.style.transform = `translateY(${-self.progress * 48}px)`;
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Begin Ascent action (Lenis smooth scroll into ascent corridor)
  const handleBeginAscent = () => {
    const target = document.getElementById('mission-flight-corridor') || document.getElementById('projects');
    if (target) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: -40, duration: 1.5 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Physical ignition sequence triggered by Launch Control
  const handleLaunchControl = () => {
    if (isIgniting) return;
    setIsIgniting(true);
    setCountdown(10);

    // Trigger store ignition
    useMissionStore.getState().startLaunchSequence();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          // Auto initiate ascent scroll
          setTimeout(() => {
            handleBeginAscent();
            setIsIgniting(false);
            setCountdown(null);
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 450);
  };

  return (
    <div
      ref={containerRef}
      id="hero"
      className={`relative w-full ${reducedMotion ? 'min-h-screen' : 'h-[175vh]'}`}
    >
      {/* Pinned Viewport Container */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-transparent"
      >
        {/* Editorial Hero Layout Floating Inside 3D Scene on Light Glass Panel */}
        <div className="relative z-10 w-full h-full max-w-6xl mx-auto px-6 sm:px-8 flex flex-col justify-center pointer-events-none pt-16 sm:pt-0">
          <div
            ref={textRef}
            className="max-w-2xl flex flex-col items-start text-left pointer-events-auto transition-opacity duration-300 p-6 sm:p-8 rounded-3xl bg-[#080b14]/50 backdrop-blur-md border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
          >
            {/* Live Mission Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-4">
              <span className="w-2 h-2 rounded-full bg-[#c99a5e] shadow-[0_0_8px_rgba(201,154,94,0.9)] animate-ping" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#f4f5f6]">
                MISSION SAHOO-1 · T-00:10
              </span>
              <span className="text-[10px] font-mono text-[#8c919d] hidden sm:inline">
                // LC-39A PAD
              </span>
            </div>

            {/* Signature Headline: ALOK KUMAR SAHOO */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white leading-[1.04] mb-3">
              ALOK KUMAR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f4f5f6] to-[#8c919d]">
                SAHOO
              </span>
            </h1>

            {/* Role & Engineering Discipline */}
            <p className="text-base sm:text-xl font-medium tracking-tight text-[#c99a5e] mb-3">
              Software Engineer · Distributed Backends, AI Forensics &amp; Telemetry
            </p>

            {/* Factual Core Narrative */}
            <p className="text-xs sm:text-sm md:text-base text-[#b8bcc6] font-light leading-relaxed mb-6 max-w-xl">
              Final-year B.E. Information Technology student at A. P. Shah Institute of Technology.
              I architect high-throughput network inspection interfaces, explainable deepfake forensics backbones, and institutional state machines.
            </p>

            {/* Verified Achievement Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-7 text-[11px] font-mono">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[#f4f5f6]">
                <ShieldAlert size={12} className="text-[#c99a5e]" />
                <span>SIH 2025 National Finalist</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[#f4f5f6]">
                <Award size={12} className="text-[#c99a5e]" />
                <span>4× Hackathon Winner</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[#f4f5f6]">
                <Cpu size={12} className="text-[#38bdf8]" />
                <span>Capstone: TrustNet-AI</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* "Begin ascent" Button */}
              <button
                onClick={handleBeginAscent}
                data-cursor-text="ASCENT"
                className="px-6 py-3 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase bg-white text-[#050608] hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-[0_4px_24px_rgba(255,255,255,0.15)] flex items-center gap-2"
              >
                <span>BEGIN ASCENT</span>
                <span className="text-sm">↑</span>
              </button>

              {/* Launch Control that triggers ignition sequence */}
              {!reducedMotion && (
                <button
                  onClick={handleLaunchControl}
                  disabled={isIgniting}
                  data-cursor-text="IGNITION"
                  className={`px-5 py-3 rounded-lg text-xs font-mono tracking-wider uppercase border transition-all flex items-center gap-2.5 ${
                    isIgniting
                      ? 'bg-[#c99a5e] text-[#050608] border-[#c99a5e] font-bold shadow-[0_0_24px_rgba(201,154,94,0.6)] animate-pulse'
                      : 'bg-[#c99a5e]/15 border-[#c99a5e]/40 text-[#c99a5e] hover:bg-[#c99a5e] hover:text-[#050608] shadow-[0_0_16px_rgba(201,154,94,0.2)]'
                  }`}
                >
                  <Flame size={14} className={isIgniting ? 'animate-bounce' : 'animate-pulse'} />
                  <span>
                    {isIgniting
                      ? countdown === 0
                        ? 'IGNITION & LIFTOFF!'
                        : `LAUNCH CONTROL // T-${countdown?.toString().padStart(2, '0')}`
                      : 'LAUNCH CONTROL [IGNITE]'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Interactive Launch Control Cue */}
        {!reducedMotion && phaseId === 'PAD' && (
          <div
            onClick={handleLaunchControl}
            data-cursor-text="IGNITE"
            className="absolute bottom-6 left-6 sm:left-8 z-20 flex items-center gap-2 text-[#8c919d] hover:text-white cursor-pointer transition-colors select-none px-3 py-1.5 rounded-lg bg-[#080b14]/60 backdrop-blur-md border border-white/[0.08]"
          >
            <Rocket size={13} className="text-[#c99a5e] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-white">
              LAUNCH CONTROL: CLICK TO IGNITE OR SCROLL TO ASCEND
            </span>
          </div>
        )}

        {/* Mission Timeline Stage Rail at Bottom Right */}
        <div className="hidden md:flex items-center gap-3 absolute bottom-6 right-8 z-20 font-mono text-[10px] text-[#8c919d] px-3 py-1.5 rounded-lg bg-[#080b14]/60 backdrop-blur-md border border-white/[0.08]">
          <span className="text-[#c99a5e] font-semibold">STAGE 01</span>
          <span>//</span>
          <span>LAUNCH PAD 39A</span>
          <span>//</span>
          <span>T-00:10 COUNTDOWN</span>
        </div>
      </div>
    </div>
  );
};
