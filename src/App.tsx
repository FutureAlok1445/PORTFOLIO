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

export function App() {
  // Subtle hairline scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen bg-[#090a0d] text-[#f4f5f6]">
      {/* Hairline Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1.5px] bg-[#c99a5e] origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Subtle Trailing Cursor */}
      <CustomCursor />

      {/* Navigation Header */}
      <Navbar />

      {/* Cinematic Aerospace Hero Sequence with GSAP Scroll Timeline */}
      <main className="relative z-10 flex flex-col">
        <RocketHero />
        <Projects />
        <Experience />
        <Skills />
        <Achievements />
        <About />
        <Contact />
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}

export default App;
