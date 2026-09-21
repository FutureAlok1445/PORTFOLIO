import { create } from 'zustand';
import { MissionPhaseId, QualityTier, MissionTelemetry } from './types';
import { interpolateTelemetry } from './telemetryKeyframes';
import { audioEngine } from './audio/audioEngine';

// Auto-detect default quality tier with query parameter override (?quality=low|med|high)
function getInitialQualityTier(): QualityTier {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('quality');
    if (q === 'low' || q === 'med' || q === 'high') {
      return q;
    }
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const cores = navigator.hardwareConcurrency || 4;
    if (isMobile || cores <= 4) {
      return 'low';
    }
  }
  return 'high';
}

export interface MissionState extends MissionTelemetry {
  isPreloaded: boolean;
  reducedMotion: boolean;
  activePhaseIndex: number;
  // Actions
  startLaunchSequence: () => void;
  setProgress: (progress: number) => void;
  setQualityTier: (tier: QualityTier) => void;
  setReducedMotion: (reduced: boolean) => void;
  setIsPreloaded: (loaded: boolean) => void;
  resetToPhase: (phaseId: MissionPhaseId) => void;
}

// Initial state at T-10s pad
const initialTelemetry = interpolateTelemetry(0, getInitialQualityTier());

export const useMissionStore = create<MissionState>((set, get) => ({
  ...initialTelemetry,
  isPreloaded: false,
  reducedMotion: false,
  activePhaseIndex: 0,

  startLaunchSequence: () => {
    startPhysicalIgnition();
  },

  setProgress: (progress: number) => {
    const currentTier = get().qualityTier;
    const telemetry = interpolateTelemetry(progress, currentTier);

    // Only update Zustand React state when discrete phase or milestone changes,
    // protecting React 60fps rendering performance while liveTelemetry handles continuous scrub
    const prev = get();
    if (
      prev.phaseId !== telemetry.phaseId ||
      prev.eventFlash !== telemetry.eventFlash ||
      prev.stage !== telemetry.stage
    ) {
      set({
        ...telemetry,
      });
    }
  },

  setQualityTier: (tier: QualityTier) => {
    set({ qualityTier: tier });
  },

  setReducedMotion: (reduced: boolean) => {
    set({ reducedMotion: reduced });
  },

  setIsPreloaded: (loaded: boolean) => {
    set({ isPreloaded: loaded });
  },

  resetToPhase: (phaseId: MissionPhaseId) => {
    set({ phaseId });
  },
}));

// Fast imperatively accessible telemetry cache for useFrame / 60fps HUD RAF loop
export const liveTelemetry = {
  ...initialTelemetry,
};

let ignitionAnimId: number | null = null;

// Time-based physical ignition sequence execution
export function startPhysicalIgnition() {
  if (liveTelemetry.ignitionStage !== 'IDLE') return;

  const startTime = performance.now();
  liveTelemetry.ignitionStage = 'COUNTDOWN';

  function step() {
    const elapsedSec = (performance.now() - startTime) / 1000;

    if (elapsedSec < 3.0) {
      // Phase 1: T-10 to T-7 Countdown
      liveTelemetry.ignitionStage = 'COUNTDOWN';
      liveTelemetry.missionTimeSec = -10 + elapsedSec;
      liveTelemetry.formattedTime = `T-00:${String(Math.ceil(10 - elapsedSec)).padStart(2, '0')}`;
      liveTelemetry.delugeIntensity = 0;
      liveTelemetry.engineThrust = 0;
      liveTelemetry.armRetract = 0;
      liveTelemetry.cameraShake = 0;
    } else if (elapsedSec < 7.0) {
      // Phase 2: T-7 to T-3 Water Deluge starts (billowing white steam sideways from trench)
      liveTelemetry.ignitionStage = 'DELUGE';
      liveTelemetry.missionTimeSec = -10 + elapsedSec;
      liveTelemetry.formattedTime = `T-00:${String(Math.ceil(10 - elapsedSec)).padStart(2, '0')}`;
      liveTelemetry.delugeIntensity = Math.min(1.0, (elapsedSec - 3.0) / 1.8);
      liveTelemetry.engineThrust = 0;
      liveTelemetry.armRetract = (elapsedSec - 3.0) / 4.0;
      liveTelemetry.cameraShake = 0.08;
    } else if (elapsedSec < 10.0) {
      // Phase 3: T-3 to T-0 Engines Ignite! (flash, ground-bounce flicker, micro-shake, clamped)
      liveTelemetry.ignitionStage = 'IGNITION';
      liveTelemetry.missionTimeSec = -10 + elapsedSec;
      liveTelemetry.formattedTime = `T-00:${String(Math.ceil(10 - elapsedSec)).padStart(2, '0')}`;
      liveTelemetry.delugeIntensity = 1.0;
      liveTelemetry.engineThrust = Math.min(1.0, (elapsedSec - 7.0) / 1.0);
      liveTelemetry.armRetract = 1.0;
      liveTelemetry.cameraShake = 0.65;
      liveTelemetry.eventFlash = 'IGNITION';
    } else if (elapsedSec < 14.0) {
      // Phase 4: T-0 Hold-down release & Slow Liftoff accelerating strongly past tower
      liveTelemetry.ignitionStage = 'LIFTOFF';
      const flightTime = elapsedSec - 10.0;
      liveTelemetry.missionTimeSec = flightTime;
      liveTelemetry.formattedTime = `T+00:${String(Math.floor(flightTime)).padStart(2, '0')}`;
      liveTelemetry.delugeIntensity = Math.max(0, 1.0 - flightTime / 4.0);
      liveTelemetry.engineThrust = 1.0;
      liveTelemetry.cameraShake = 0.85;

      // Heavy liftoff quadratic acceleration curve
      const altMeters = Math.pow(flightTime / 4.0, 2.2) * 85.0;
      liveTelemetry.altitudeKm = altMeters / 1000.0;
      liveTelemetry.velocityKms = (flightTime * 0.015);
      liveTelemetry.progress = (altMeters / 85.0) * 0.08;
      liveTelemetry.eventFlash = flightTime < 1.5 ? 'LIFTOFF' : 'TOWER CLEARED';
    } else {
      // Phase 5: Hand control back to scroll for ascent
      liveTelemetry.ignitionStage = 'COMPLETED';
      liveTelemetry.eventFlash = null;
      if (ignitionAnimId) cancelAnimationFrame(ignitionAnimId);
      ignitionAnimId = null;
      return;
    }

    ignitionAnimId = requestAnimationFrame(step);
  }

  ignitionAnimId = requestAnimationFrame(step);
}

// Global telemetry updater callable at 60fps from GSAP scrub or RAF without React re-render overhead
export function updateLiveTelemetry(progress: number) {
  // If user starts scrolling before ignition completes, trigger the ignition sequence
  if (liveTelemetry.ignitionStage === 'IDLE' && progress > 0.03) {
    startPhysicalIgnition();
    return;
  }

  // If ignition is running its time-based physical sequence, let it drive the initial liftoff
  if (liveTelemetry.ignitionStage !== 'IDLE' && liveTelemetry.ignitionStage !== 'COMPLETED') {
    return;
  }

  const currentTier = useMissionStore.getState().qualityTier;
  const t = interpolateTelemetry(progress, currentTier);
  liveTelemetry.progress = t.progress;
  liveTelemetry.phaseId = t.phaseId;
  liveTelemetry.altitudeKm = t.altitudeKm;
  liveTelemetry.velocityKms = t.velocityKms;
  liveTelemetry.missionTimeSec = t.missionTimeSec;
  liveTelemetry.formattedTime = t.formattedTime;
  liveTelemetry.stage = t.stage;
  liveTelemetry.eventFlash = t.eventFlash;
  liveTelemetry.qualityTier = t.qualityTier;
  liveTelemetry.engineThrust = t.engineThrust;
  liveTelemetry.armRetract = t.armRetract;
  liveTelemetry.delugeIntensity = t.delugeIntensity;
  liveTelemetry.cameraShake = t.cameraShake;
  liveTelemetry.pitchAngle = t.pitchAngle;
  liveTelemetry.downrangeKm = t.downrangeKm;

  // Sync with store
  useMissionStore.getState().setProgress(progress);

  // Sync with synthesized audio engine
  audioEngine.updateTelemetry(progress);
}
