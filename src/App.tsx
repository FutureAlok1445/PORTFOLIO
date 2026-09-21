import { useEffect, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { CustomCursor } from './components/layout/CustomCursor';
import { RocketHero } from './components/hero/RocketHero';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Achievements } from './components/sections/Achievements';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';
import {
  MissionCanvas,
  TelemetryHUD,
  Preloader,
  initMissionTimeline,
  cleanupMissionTimeline,
  liveTelemetry,
} from './mission';

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Initialize Master Mission Timeline & Lenis smooth scroll
  useEffect(() => {
    initMissionTimeline(containerRef.current);
    return () => cleanupMissionTimeline();
  }, []);

  // Zero-overhead GPU-accelerated progress bar in lockstep with Lenis & 3D canvas
  useEffect(() => {
    let animId: number;
    const updateBar = () => {
      if (progressBarRef.current) {
        const p = Math.max(0, Math.min(1, liveTelemetry.progress));
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }
      animId = requestAnimationFrame(updateBar);
    };
    animId = requestAnimationFrame(updateBar);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-transparent text-[#f4f5f6]"
    >
      {/* Accessible Skip to Content Link for Screen Readers & Recruiters */}
      <a
        href="#skills"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[200] px-4 py-2 rounded-lg bg-[#c99a5e] text-[#050608] font-mono text-xs font-bold shadow-xl border border-white/20"
      >
        Skip to Content (Technical Skills)
      </a>

      {/* 1. T-Minus Countdown Preloader */}
      <Preloader />

      {/* 2. Exactly ONE persistent fixed R3F Canvas behind the DOM */}
      <MissionCanvas />

      {/* 3. High-Performance Zero-Re-Render Telemetry HUD */}
      <TelemetryHUD />

      {/* 4. Mission Trajectory Progress Bar (Hardware GPU Transform) */}
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-[2px] bg-gradient-to-r from-[#c99a5e] via-[#38bdf8] to-[#c99a5e] origin-left shadow-[0_0_8px_rgba(201,154,94,0.8)] will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* 5. Custom Reticle Cursor (Target Lock) */}
      <CustomCursor />

      {/* 6. Navigation Header with Lenis jump & Phase hovers */}
      <Navbar />

      {/* 7. Unified Editorial Journey: Identity -> Skills -> Projects -> Experience -> Achievements -> About -> Contact */}
      <main className="relative z-10 flex flex-col bg-transparent">
        <RocketHero />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <About />
        <Contact />
      </main>

      {/* 8. Minimal Glass Footer */}
      <Footer />
    </div>
  );
}

export default App;
