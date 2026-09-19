export type MissionPhaseId =
  | 'PAD'
  | 'ASCENT'
  | 'MAX_Q'
  | 'STAGING'
  | 'FAIRING'
  | 'DEPLOY'
  | 'ORBIT'
  | 'TRANSFER'
  | 'CONSTELLATIONS'
  | 'ASTEROID_BELT'
  | 'PALE_BLUE_DOT'
  | 'NEBULA';

export type QualityTier = 'low' | 'med' | 'high';

export interface PhaseConfig {
  id: MissionPhaseId;
  index: number;
  label: string;
  sectionId?: string; // Associated DOM section anchor
  startProgress: number;
  endProgress: number;
  stageName: string;
  defaultEvent?: string;
}

export type IgnitionStage =
  | 'IDLE'
  | 'COUNTDOWN'
  | 'DELUGE'
  | 'IGNITION'
  | 'LIFTOFF'
  | 'COMPLETED';

export interface MissionTelemetry {
  progress: number;
  phaseId: MissionPhaseId;
  altitudeKm: number;
  velocityKms: number;
  missionTimeSec: number;
  formattedTime: string; // "T-00:08", "T+01:10", etc.
  stage: string;
  eventFlash: string | null;
  qualityTier: QualityTier;
  ignitionStage: IgnitionStage;
  engineThrust: number; // 0..1
  armRetract: number; // 0..1
  delugeIntensity: number; // 0..1
  cameraShake: number; // 0..1
  pitchAngle: number; // radians
  downrangeKm: number;
}
