import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { CustomCursor } from './components/layout/CustomCursor';
import { RocketHero } from './components/hero/RocketHero';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';
import { Achievements } from './components/sections/Achievements';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';
import {
  MissionCanvas,
  TelemetryHUD,
  Preloader,
  initMissionTimeline,
  cleanupMissionTimeline,
} from './mission';

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Master Mission Timeline & Lenis smooth scroll
  useEffect(() => {
    initMissionTimeline(containerRef.current);
    return () => cleanupMissionTimeline();
  }, []);

  // Subtle hairline scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#050608] text-[#f4f5f6]"
    >
      {/* 1. T-Minus Countdown Preloader */}
      <Preloader />

      {/* 2. Exactly ONE persistent fixed R3F Canvas behind the DOM */}
      <MissionCanvas />

      {/* 3. High-Performance Zero-Re-Render Telemetry HUD */}
      <TelemetryHUD />

      {/* 4. Hairline Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1.5px] bg-[#c99a5e] origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* 5. Subtle Trailing Cursor (with signature red dot) */}
      <CustomCursor />

      {/* 6. Navigation Header */}
      <Navbar />

      {/* 7. DOM Editorial Flow with Transparent Backgrounds */}
      <main className="relative z-10 flex flex-col">
        <RocketHero />
        <Projects />
        <Experience />
        <Skills />
        <Achievements />
        <About />
        <Contact />
      </main>

      {/* 8. Minimal Footer */}
      <Footer />
    </div>
  );
}

export default App;
