import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { useMissionStore } from './missionStore';

export const Preloader: React.FC = () => {
  const { active, progress } = useProgress();
  const setIsPreloaded = useMissionStore((state) => state.setIsPreloaded);

  const [dismissed, setDismissed] = useState(false);
  const [fading, setFading] = useState(false);

  // Map 0..100 load progress to T-10s down to T-0s
  const currentTMinus = Math.max(0, Math.ceil(10 - (progress / 100) * 10));

  const handleFinish = () => {
    setFading(true);
    setTimeout(() => {
      setDismissed(true);
      setIsPreloaded(true);
    }, 600);
  };

  useEffect(() => {
    // When assets finish loading
    if (!active && progress >= 100) {
      const timer = setTimeout(handleFinish, 400);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] bg-[#050608] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-700 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        {/* Aerospace Mission Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>MISSION TELEMETRY PREFLIGHT CHECK</span>
        </div>

        {/* Large Monospace Countdown */}
        <div className="space-y-1">
          <div className="text-4xl sm:text-6xl font-mono font-bold tracking-wider text-primary">
            T-00:{String(currentTMinus).padStart(2, '0')}
          </div>
          <p className="text-xs font-mono text-secondary">
            CALIBRATING FLIGHT SENSORS · {Math.round(progress)}%
          </p>
        </div>

        {/* Hairline Progress Meter */}
        <div className="w-48 sm:w-64 h-[2px] bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-200 ease-out"
            style={{ width: `${Math.max(6, progress)}%` }}
          />
        </div>

        {/* Skip Action */}
        <button
          onClick={handleFinish}
          className="text-xs font-mono text-muted hover:text-primary transition-colors underline underline-offset-4 decoration-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded px-2 py-1"
        >
          Skip intro →
        </button>
      </div>
    </div>
  );
};
