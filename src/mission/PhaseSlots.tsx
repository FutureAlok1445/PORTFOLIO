import React from 'react';
import { MissionPhaseId } from './types';
import { MISSION_PHASES } from './telemetryKeyframes';
import { SkyDome } from './environment/SkyDome';
import { LaunchPadEnvironment } from './environment/LaunchPadEnvironment';
import { AerospaceRocket } from './rocket/AerospaceRocket';
import { EnginePlume } from './rocket/EnginePlume';
import { WaterDelugeSteam } from './rocket/WaterDelugeSteam';
import { CloudDecks } from './ascent/CloudDecks';
import { CondensationVaporCone } from './ascent/CondensationVaporCone';
import { StarField } from '../components/hero/StarField';
import { liveTelemetry, useMissionStore } from './missionStore';

// Slot Props passed to each phase scene
export interface PhaseSlotProps {
  phaseProgress: number; // 0..1 within this phase
  globalProgress: number; // 0..1 across full mission
  reducedMotion: boolean;
}

// 1. PAD Phase (Launch Complex 39A - Liftoff sequence at golden-hour dawn)
export const PadScene: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return (
    <group name="phase-PAD">
      <SkyDome />
      <StarField count={reducedMotion ? 350 : 800} />
      <LaunchPadEnvironment />
      <WaterDelugeSteam />
      <AerospaceRocket />
      <EnginePlume />
    </group>
  );
};

// 2. ASCENT Phase (Cloud punch-through, gravity turn & downrange drift)
export const AscentScene: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return (
    <group name="phase-ASCENT">
      <SkyDome />
      <StarField count={reducedMotion ? 400 : 1000} />
      <CloudDecks />
      <AerospaceRocket />
      <EnginePlume />
    </group>
  );
};

// 3. MAX_Q Phase (Transonic Mach shockwaves & Prandtl-Glauert vapor cone)
export const MaxQScene: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return (
    <group name="phase-MAX_Q">
      <SkyDome />
      <StarField count={reducedMotion ? 500 : 1200} />
      <CloudDecks />
      <AerospaceRocket />
      <CondensationVaporCone />
      <EnginePlume />
    </group>
  );
};

// 4. STAGING Phase (MECO & Stage separation)
export const StagingScene: React.FC<PhaseSlotProps> = () => {
  return <group name="phase-STAGING" />;
};

// 5. FAIRING Phase (Fairing jettison)
export const FairingScene: React.FC<PhaseSlotProps> = () => {
  return <group name="phase-FAIRING" />;
};

// 6. DEPLOY Phase (Orbital insertion)
export const DeployScene: React.FC<PhaseSlotProps> = () => {
  return <group name="phase-DEPLOY" />;
};

// 7. ORBIT Phase (Work / Projects background)
export const OrbitScene: React.FC<PhaseSlotProps> = () => {
  return <group name="phase-ORBIT" />;
};

// 8. TRANSFER Phase (Experience background)
export const TransferScene: React.FC<PhaseSlotProps> = () => {
  return <group name="phase-TRANSFER" />;
};

// 9. CONSTELLATIONS Phase (Skills background)
export const ConstellationsScene: React.FC<PhaseSlotProps> = () => {
  return <group name="phase-CONSTELLATIONS" />;
};

// 10. ASTEROID_BELT Phase (Honors background)
export const AsteroidBeltScene: React.FC<PhaseSlotProps> = () => {
  return <group name="phase-ASTEROID_BELT" />;
};

// 11. PALE_BLUE_DOT Phase (About background)
export const PaleBlueDotScene: React.FC<PhaseSlotProps> = () => {
  return <group name="phase-PALE_BLUE_DOT" />;
};

// 12. NEBULA Phase (Contact background)
export const NebulaScene: React.FC<PhaseSlotProps> = () => {
  return <group name="phase-NEBULA" />;
};

// Phase Component Registry Map
const PHASE_COMPONENTS: Record<MissionPhaseId, React.FC<PhaseSlotProps>> = {
  PAD: PadScene,
  ASCENT: AscentScene,
  MAX_Q: MaxQScene,
  STAGING: StagingScene,
  FAIRING: FairingScene,
  DEPLOY: DeployScene,
  ORBIT: OrbitScene,
  TRANSFER: TransferScene,
  CONSTELLATIONS: ConstellationsScene,
  ASTEROID_BELT: AsteroidBeltScene,
  PALE_BLUE_DOT: PaleBlueDotScene,
  NEBULA: NebulaScene,
};

// Master Phase Manager: Only mounts current phase +/- 1 so we never render everything at once
export const PhaseSceneManager: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const phaseId = useMissionStore((state) => state.phaseId);

  // Active phase index computed from store phaseId
  const activeIndex = React.useMemo(() => {
    const idx = MISSION_PHASES.findIndex((p) => p.id === phaseId);
    return idx >= 0 ? idx : 0;
  }, [phaseId]);

  // Active window: current phase +/- 1
  const minIndex = Math.max(0, activeIndex - 1);
  const maxIndex = Math.min(MISSION_PHASES.length - 1, activeIndex + 1);

  const activePhases = MISSION_PHASES.slice(minIndex, maxIndex + 1);
  const currentProgress = liveTelemetry.progress;

  return (
    <>
      {activePhases.map((phase) => {
        const Component = PHASE_COMPONENTS[phase.id];
        if (!Component) return null;

        const phaseSpan = phase.endProgress - phase.startProgress;
        const phaseProgress =
          phaseSpan > 0
            ? Math.max(0, Math.min(1, (currentProgress - phase.startProgress) / phaseSpan))
            : 0;

        return (
          <Component
            key={phase.id}
            phaseProgress={phaseProgress}
            globalProgress={currentProgress}
            reducedMotion={reducedMotion}
          />
        );
      })}
    </>
  );
};
