import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 26, stiffness: 380, mass: 0.45 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Disable completely on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor-text]') as HTMLElement | null;
      if (cursorTarget) {
        setCursorText(cursorTarget.getAttribute('data-cursor-text'));
        setIsHovered(true);
        return;
      }

      setCursorText(null);
      const interactive = target.closest('a, button, input, textarea, [role="button"], .clickable');
      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleElementHover, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleElementHover);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden select-none">
      {/* Precision center crosshair dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      >
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${isHovered ? 'bg-[#c99a5e] shadow-[0_0_10px_#c99a5e]' : 'bg-[#c99a5e]'}`} />
      </motion.div>

      {/* Targeting Reticle & Target Lock Visualizer */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 ${
          cursorText
            ? 'px-3 py-1.5 rounded-full bg-[#c99a5e]/90 text-[#050608] font-mono text-[10px] font-bold tracking-widest uppercase shadow-[0_0_24px_rgba(201,154,94,0.5)] border border-[#dfb784]'
            : isHovered
            ? 'w-9 h-9'
            : 'w-6 h-6'
        }`}
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        {cursorText ? (
          <span>{cursorText}</span>
        ) : isHovered ? (
          /* Targeting Reticle with 4 Corner Brackets and Target Lock indicator */
          <div className="relative w-full h-full">
            {/* Top-Left Bracket */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#c99a5e]" />
            {/* Top-Right Bracket */}
            <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#c99a5e]" />
            {/* Bottom-Left Bracket */}
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#c99a5e]" />
            {/* Bottom-Right Bracket */}
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#c99a5e]" />

            {/* Subtle Crosshairs */}
            <span className="absolute left-1/2 -top-1 -translate-x-1/2 w-[1px] h-1.5 bg-[#c99a5e]/60" />
            <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-[1px] h-1.5 bg-[#c99a5e]/60" />
            <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-[1px] w-1.5 bg-[#c99a5e]/60" />
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-[1px] w-1.5 bg-[#c99a5e]/60" />

            {/* Micro Lock Status Label */}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-mono tracking-widest text-[#c99a5e] whitespace-nowrap uppercase font-bold">
              LOCK
            </span>
          </div>
        ) : (
          /* Neutral resting circle */
          <div className="w-full h-full rounded-full border border-white/25 transition-all" />
        )}
      </motion.div>
    </div>
  );
};
