import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LaunchScene } from './LaunchScene';
import { ArrowDown } from 'lucide-react';

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

export const RocketHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    if (mediaQuery.matches) return;

    if (!containerRef.current) return;

    // Build deterministic GSAP ScrollTrigger timeline
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          setScrollProgress(self.progress);

          // Fade out hero UI overlay during launch liftoff phase
          if (textRef.current) {
            const opacity = Math.max(0, 1 - self.progress * 2.2);
            textRef.current.style.opacity = opacity.toString();
            textRef.current.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
            textRef.current.style.transform = `translateY(${-self.progress * 40}px)`;
          }
        },
      });
    }, containerRef);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      ctx.revert();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${reducedMotion ? 'min-h-screen' : 'h-[260vh]'}`}
    >
      {/* Pinned Viewport Container */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-[#090a0d]"
      >
        {/* React Three Fiber 3D Launch Scene */}
        <div className="absolute inset-0 z-0">
          <Canvas
            shadows
            camera={{ position: [5.5, 5, 22], fov: 50 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            dpr={[1, 1.8]}
          >
            <Suspense fallback={null}>
              <LaunchScene progress={scrollProgress} reducedMotion={reducedMotion} />
            </Suspense>
          </Canvas>
        </div>

        {/* Minimal Hero UI Overlay */}
        <div className="relative z-10 w-full h-full max-w-5xl mx-auto px-6 sm:px-8 flex items-start pt-28 sm:items-center sm:pt-0 pointer-events-none">
          <div
            ref={textRef}
            className="max-w-lg flex flex-col items-start text-left pointer-events-auto transition-opacity duration-200"
          >
            {/* Small Eyebrow */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="w-2 h-[1px] bg-accent" />
              <span className="text-xs font-mono tracking-widest uppercase text-accent font-medium">
                Software Engineer
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary leading-[1.12] mb-4 sm:mb-6">
              Building software <br />
              that moves ideas forward.
            </h1>

            {/* Supporting Sentence */}
            <p className="text-sm sm:text-base text-secondary font-light leading-relaxed mb-6 sm:mb-8 max-w-md">
              B.E. Information Technology engineer specializing in distributed systems, high-throughput backend architecture, and security telemetry.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-5 py-2.5 rounded text-xs font-semibold tracking-wide bg-white text-[#090a0d] hover:bg-neutral-200 active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                View my work
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="px-5 py-2.5 rounded text-xs font-medium tracking-wide border border-white/20 text-white hover:border-white/40 hover:bg-white/[0.04] active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                Get in touch
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Seamless Gradient Fade into Page Content */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#090a0d] via-[#090a0d]/60 to-transparent z-10" />

        {/* Subtle Scroll Hint */}
        {!reducedMotion && scrollProgress < 0.08 && (
          <div
            onClick={() => {
              if (containerRef.current) {
                window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
              }
            }}
            className="absolute bottom-6 left-6 sm:left-8 z-20 flex items-center gap-2 text-muted hover:text-secondary cursor-pointer transition-colors"
          >
            <span className="text-[11px] font-mono tracking-widest uppercase">
              Scroll to Launch
            </span>
            <ArrowDown size={13} className="animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );
};
