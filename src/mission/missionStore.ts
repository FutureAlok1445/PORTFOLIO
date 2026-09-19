import { create } from 'zustand';
import { MissionPhaseId, QualityTier, MissionTelemetry } from './types';
import { interpolateTelemetry } from './telemetryKeyframes';

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
      return 'med';
    }
  }
  return 'high';
}

export interface MissionState extends MissionTelemetry {
  isPreloaded: boolean;
  reducedMotion: boolean;
  activePhaseIndex: number;
  // Actions
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

  setProgress: (progress: number) => {
    const currentTier = get().qualityTier;
    const telemetry = interpolateTelemetry(progress, currentTier);

    // Only update zustand state if values changed meaningfully or phase crossed
    // to protect React rendering performance
    const prev = get();
    if (
      prev.phaseId !== telemetry.phaseId ||
      prev.eventFlash !== telemetry.eventFlash ||
      Math.abs(prev.progress - progress) > 0.005
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

// Global telemetry updater callable at 60fps from GSAP scrub or RAF without React re-render overhead
export function updateLiveTelemetry(progress: number) {
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

  // Sync with store
  useMissionStore.getState().setProgress(progress);
}
