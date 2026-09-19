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
}
