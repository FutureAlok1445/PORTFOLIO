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
    sectionId: 'hero',
    startProgress: 0.08,
    endProgress: 0.16,
    stageName: 'STAGE 1 (BOOST)',
    defaultEvent: 'LIFTOFF',
  },
  {
    id: 'CONSTELLATIONS',
    index: 2,
    label: 'STELLAR NAVIGATION',
    sectionId: 'skills',
    startProgress: 0.16,
    endProgress: 0.32,
    stageName: 'CONSTELLATION',
    defaultEvent: 'STELLAR CONSTELLATIONS',
  },
  {
    id: 'ORBIT',
    index: 3,
    label: 'LOW EARTH ORBIT',
    sectionId: 'projects',
    startProgress: 0.32,
    endProgress: 0.52,
    stageName: 'ORBITAL',
    defaultEvent: 'PAYLOAD DEPLOY',
  },
  {
    id: 'TRANSFER',
    index: 4,
    label: 'TRANSLUNAR INJECTION',
    sectionId: 'experience',
    startProgress: 0.52,
    endProgress: 0.68,
    stageName: 'TRANSFER',
    defaultEvent: 'TRAJECTORY WAYPOINTS',
  },
  {
    id: 'ASTEROID_BELT',
    index: 5,
    label: 'INTERPLANETARY BELT',
    sectionId: 'achievements',
    startProgress: 0.68,
    endProgress: 0.82,
    stageName: 'DEEP SPACE',
    defaultEvent: 'ASTEROID BELT TRANSIT',
  },
  {
    id: 'PALE_BLUE_DOT',
    index: 6,
    label: 'SOLAR SYSTEM LIMB',
    sectionId: 'about',
    startProgress: 0.82,
    endProgress: 0.92,
    stageName: 'HELIOPAUSE',
    defaultEvent: 'PALE BLUE DOT // HOME',
  },
  {
    id: 'NEBULA',
    index: 7,
    label: 'INTERSTELLAR TERMINAL',
    sectionId: 'contact',
    startProgress: 0.92,
    endProgress: 1.0,
    stageName: 'INTERSTELLAR',
    defaultEvent: 'TERMINAL REACHED',
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
  { progress: 0.16, timeSec: 80, altKm: 18.0, velKms: 0.85, stage: 'CONSTELLATION', event: 'STELLAR CONSTELLATIONS' },
  { progress: 0.28, timeSec: 220, altKm: 120.0, velKms: 3.50, stage: 'CONSTELLATION', event: null },
  { progress: 0.32, timeSec: 550, altKm: 500.0, velKms: 7.60, stage: 'ORBITAL', event: 'PAYLOAD DEPLOY' },
  { progress: 0.42, timeSec: 720, altKm: 520.0, velKms: 7.58, stage: 'ORBITAL', event: null },
  { progress: 0.52, timeSec: 1300, altKm: 750.0, velKms: 10.85, stage: 'TRANSFER', event: 'TRANS-INJECTION BURN' },
  { progress: 0.60, timeSec: 1800, altKm: 2500.0, velKms: 10.60, stage: 'TRANSFER', event: 'TRAJECTORY WAYPOINTS' },
  { progress: 0.68, timeSec: 3600, altKm: 25000.0, velKms: 9.90, stage: 'DEEP SPACE', event: 'ASTEROID BELT TRANSIT' },
  { progress: 0.82, timeSec: 10800, altKm: 420000.0, velKms: 8.80, stage: 'HELIOPAUSE', event: 'PALE BLUE DOT // HOME' },
  { progress: 0.92, timeSec: 24000, altKm: 2500000.0, velKms: 12.5, stage: 'INTERSTELLAR', event: 'TERMINAL REACHED' },
  { progress: 1.0, timeSec: 36000, altKm: 5000000.0, velKms: 14.5, stage: 'INTERSTELLAR', event: 'COMMUNICATIONS LIVE' },
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

  // Gravity turn pitch angle: 0 rad until tower cleared (0.2 km), then arches downrange to ~42 deg
  let pitchAngle = 0;
  if (altitudeKm > 0.2) {
    pitchAngle = Math.min(0.72, Math.pow((altitudeKm - 0.2) / 80.0, 0.6) * 0.72);
  }

  // Downrange drift
  const downrangeKm = altitudeKm > 0.2 ? Math.pow(altitudeKm, 1.15) * 0.35 : 0;

  // Camera shake amplitude profile: max at ignition and Max-Q, ZERO after MECO (~65km)
  let cameraShake = 0;
  if (clamped < 0.08) {
    // Ignition & Liftoff acoustic rumble
    cameraShake = Math.min(0.85, clamped * 12.0);
  } else if (clamped >= 0.14 && clamped <= 0.22) {
    // Max-Q transonic buffeting
    const maxQDist = Math.abs(clamped - 0.18);
    cameraShake = Math.max(0, 1.0 - maxQDist / 0.04) * 0.95;
  } else if (clamped > 0.24) {
    // Post-MECO: Space is completely calm and smooth
    cameraShake = 0;
  }

  // Engine thrust profile across mission phases
  let engineThrust = 1.0;
  if (clamped < 0.02) {
    engineThrust = clamped / 0.02;
  } else if (clamped >= 0.22 && clamped <= 0.25) {
    // Staging / MECO coast
    engineThrust = 0;
  } else if (clamped > 0.36) {
    // Orbit / Engine cutoff
    engineThrust = 0;
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
    ignitionStage: clamped > 0.06 ? 'COMPLETED' : 'IDLE',
    engineThrust,
    armRetract: clamped > 0.03 ? 1.0 : 0.0,
    delugeIntensity: clamped < 0.06 ? Math.max(0, 1.0 - clamped / 0.06) : 0,
    cameraShake,
    pitchAngle,
    downrangeKm,
  };
}
