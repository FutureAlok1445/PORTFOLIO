import { PhaseConfig, MissionTelemetry, QualityTier } from './types';

export const MISSION_PHASES: PhaseConfig[] = [
  {
    id: 'PAD',
    index: 0,
    label: 'LAUNCH COMPLEX 39A',
    sectionId: 'hero',
    startProgress: 0.0,
    endProgress: 0.08,
    stageName: 'STAGE 1',
  },
  {
    id: 'ASCENT',
    index: 1,
    label: 'ATMOSPHERIC ASCENT',
    startProgress: 0.08,
    endProgress: 0.14,
    stageName: 'STAGE 1 (BOOST)',
  },
  {
    id: 'MAX_Q',
    index: 2,
    label: 'MAX DYNAMIC PRESSURE',
    startProgress: 0.14,
    endProgress: 0.20,
    stageName: 'STAGE 1 (MAX-Q)',
    defaultEvent: 'MAX-Q',
  },
  {
    id: 'STAGING',
    index: 3,
    label: 'MECO & STAGE SEPARATION',
    startProgress: 0.20,
    endProgress: 0.25,
    stageName: 'STAGE SEP',
    defaultEvent: 'STAGE SEP',
  },
  {
    id: 'FAIRING',
    index: 4,
    label: 'PAYLOAD FAIRING JETTISON',
    startProgress: 0.25,
    endProgress: 0.30,
    stageName: 'STAGE 2',
    defaultEvent: 'FAIRING SEP',
  },
  {
    id: 'DEPLOY',
    index: 5,
    label: 'ORBITAL INSERTION / SECO',
    startProgress: 0.30,
    endProgress: 0.36,
    stageName: 'STAGE 2',
    defaultEvent: 'PAYLOAD DEPLOY',
  },
  {
    id: 'ORBIT',
    index: 6,
    label: 'LOW EARTH ORBIT',
    sectionId: 'projects',
    startProgress: 0.36,
    endProgress: 0.52,
    stageName: 'ORBITAL',
  },
  {
    id: 'TRANSFER',
    index: 7,
    label: 'TRANSLUNAR INJECTION',
    sectionId: 'experience',
    startProgress: 0.52,
    endProgress: 0.66,
    stageName: 'TRANSFER',
  },
  {
    id: 'CONSTELLATIONS',
    index: 8,
    label: 'STELLAR NAVIGATION',
    sectionId: 'skills',
    startProgress: 0.66,
    endProgress: 0.78,
    stageName: 'DEEP SPACE',
  },
  {
    id: 'ASTEROID_BELT',
    index: 9,
    label: 'INTERPLANETARY BELT',
    sectionId: 'achievements',
    startProgress: 0.78,
    endProgress: 0.88,
    stageName: 'DEEP SPACE',
  },
  {
    id: 'PALE_BLUE_DOT',
    index: 10,
    label: 'SOLAR SYSTEM LIMB',
    sectionId: 'about',
    startProgress: 0.88,
    endProgress: 0.95,
    stageName: 'HELIOPAUSE',
  },
  {
    id: 'NEBULA',
    index: 11,
    label: 'INTERSTELLAR TERMINAL',
    sectionId: 'contact',
    startProgress: 0.95,
    endProgress: 1.0,
    stageName: 'INTERSTELLAR',
  },
];

interface TelemetryKeyframe {
  progress: number;
  timeSec: number;
  altKm: number;
  velKms: number;
  stage: string;
  event: string | null;
}

// Falcon-9-class reference keyframes interpolated over document scroll
const TELEMETRY_KEYFRAMES: TelemetryKeyframe[] = [
  { progress: 0.0, timeSec: -10, altKm: 0, velKms: 0, stage: 'STAGE 1', event: null },
  { progress: 0.04, timeSec: 0, altKm: 0.02, velKms: 0.05, stage: 'STAGE 1', event: 'LIFTOFF' },
  { progress: 0.08, timeSec: 8, altKm: 0.15, velKms: 0.09, stage: 'STAGE 1', event: 'TOWER CLEARED' },
  { progress: 0.14, timeSec: 50, altKm: 8.5, velKms: 0.32, stage: 'STAGE 1', event: null },
  { progress: 0.18, timeSec: 70, altKm: 13.0, velKms: 0.45, stage: 'STAGE 1', event: 'MAX-Q' },
  { progress: 0.22, timeSec: 150, altKm: 65.0, velKms: 2.3, stage: 'STAGE 1', event: 'MECO' },
  { progress: 0.24, timeSec: 153, altKm: 68.0, velKms: 2.32, stage: 'STAGE SEP', event: 'STAGE SEP' },
  { progress: 0.27, timeSec: 160, altKm: 75.0, velKms: 2.45, stage: 'STAGE 2', event: 'SES-1' },
  { progress: 0.30, timeSec: 210, altKm: 110.0, velKms: 3.0, stage: 'STAGE 2', event: 'FAIRING SEP' },
  { progress: 0.35, timeSec: 520, altKm: 250.0, velKms: 7.7, stage: 'STAGE 2', event: 'SECO-1' },
  { progress: 0.40, timeSec: 600, altKm: 500.0, velKms: 7.6, stage: 'ORBITAL', event: 'PAYLOAD DEPLOY' },
  { progress: 0.52, timeSec: 1200, altKm: 650.0, velKms: 7.55, stage: 'ORBITAL', event: null },
  { progress: 0.66, timeSec: 2400, altKm: 1800.0, velKms: 10.8, stage: 'TRANSFER', event: 'TLI BURN' },
  { progress: 0.78, timeSec: 4800, altKm: 35000.0, velKms: 9.8, stage: 'DEEP SPACE', event: null },
  { progress: 0.88, timeSec: 9600, altKm: 384000.0, velKms: 8.4, stage: 'DEEP SPACE', event: null },
  { progress: 0.95, timeSec: 18000, altKm: 1200000.0, velKms: 11.2, stage: 'HELIOPAUSE', event: null },
  { progress: 1.0, timeSec: 36000, altKm: 5000000.0, velKms: 14.5, stage: 'INTERSTELLAR', event: 'TERMINAL' },
];

export function formatMissionTime(seconds: number): string {
  const isNegative = seconds < 0;
  const absSec = Math.abs(seconds);
  const mins = Math.floor(absSec / 60);
  const secs = Math.floor(absSec % 60);
  const sign = isNegative ? 'T-' : 'T+';
  return `${sign}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function interpolateTelemetry(
  progress: number,
  qualityTier: QualityTier = 'high'
): MissionTelemetry {
  const clamped = Math.max(0, Math.min(1, progress));

  // Determine current active phase
  let currentPhase = MISSION_PHASES[0];
  for (let i = MISSION_PHASES.length - 1; i >= 0; i--) {
    if (clamped >= MISSION_PHASES[i].startProgress) {
      currentPhase = MISSION_PHASES[i];
      break;
    }
  }

  // Find surrounding keyframes
  let lower = TELEMETRY_KEYFRAMES[0];
  let upper = TELEMETRY_KEYFRAMES[TELEMETRY_KEYFRAMES.length - 1];

  for (let i = 0; i < TELEMETRY_KEYFRAMES.length - 1; i++) {
    if (clamped >= TELEMETRY_KEYFRAMES[i].progress && clamped <= TELEMETRY_KEYFRAMES[i + 1].progress) {
      lower = TELEMETRY_KEYFRAMES[i];
      upper = TELEMETRY_KEYFRAMES[i + 1];
      break;
    }
  }

  const range = upper.progress - lower.progress;
  const t = range > 0 ? (clamped - lower.progress) / range : 0;

  const altitudeKm = lower.altKm + (upper.altKm - lower.altKm) * t;
  const velocityKms = lower.velKms + (upper.velKms - lower.velKms) * t;
  const missionTimeSec = lower.timeSec + (upper.timeSec - lower.timeSec) * t;

  // Flash events around keyframe points (+/- 0.015 progress window)
  let eventFlash: string | null = null;
  for (const kf of TELEMETRY_KEYFRAMES) {
    if (kf.event && Math.abs(clamped - kf.progress) < 0.018) {
      eventFlash = kf.event;
      break;
    }
  }

  return {
    progress: clamped,
    phaseId: currentPhase.id,
    altitudeKm,
    velocityKms,
    missionTimeSec,
    formattedTime: formatMissionTime(missionTimeSec),
    stage: currentPhase.stageName || lower.stage,
    eventFlash,
    qualityTier,
  };
}
