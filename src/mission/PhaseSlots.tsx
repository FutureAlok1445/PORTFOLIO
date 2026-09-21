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
import { StageSeparationScene } from './staging/StageSeparationScene';
import { FairingSeparationScene } from './staging/FairingSeparationScene';
import { PayloadDeployScene } from './deploy/PayloadDeployScene';
import { OrbitScene } from './orbit/OrbitScene';
import { TransferScene } from './transfer/TransferScene';
import { ConstellationsScene } from './constellations/ConstellationsScene';
import { AsteroidBeltScene } from './asteroids/AsteroidBeltScene';
import { PaleBlueDotScene } from './palebluedot/PaleBlueDotScene';
import { NebulaScene } from './nebula/NebulaScene';
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
export const StagingScene: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return <StageSeparationScene reducedMotion={reducedMotion} />;
};

// 5. FAIRING Phase (Fairing jettison & Satellite reveal)
export const FairingScene: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return <FairingSeparationScene reducedMotion={reducedMotion} />;
};

// 6. DEPLOY Phase (Orbital insertion & SAHOO-1 Satellite deployment)
export const DeployScene: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return <PayloadDeployScene reducedMotion={reducedMotion} />;
};

// 7. ORBIT Phase (Work / Projects background: Earth with Mumbai/Thane night pass & SAHOO-1 in LEO)
export const OrbitPhaseSlot: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return <OrbitScene reducedMotion={reducedMotion} />;
};

// 8. TRANSFER Phase (Experience background: Receding Earth, dotted trajectory arc, 3 internship waypoints)
export const TransferPhaseSlot: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return <TransferScene reducedMotion={reducedMotion} />;
};

// 9. CONSTELLATIONS Phase (Skills background: 7 skill constellations, scroll line draw, interactive hover)
export const ConstellationsPhaseSlot: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return <ConstellationsScene reducedMotion={reducedMotion} />;
};

// 10. ASTEROID_BELT Phase (Honors background: 1000 instanced rocks, harsh space lighting, 5 hero honor asteroids)
export const AsteroidBeltPhaseSlot: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return <AsteroidBeltScene reducedMotion={reducedMotion} />;
};

// 11. PALE_BLUE_DOT Phase (About background: Camera looks back at luminous pale blue dot in cosmic sunbeam)
export const PaleBlueDotPhaseSlot: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return <PaleBlueDotScene reducedMotion={reducedMotion} />;
};

// 12. NEBULA Phase (Contact background: Volumetric amber/magenta/indigo nebula with pulsing antenna radio waves)
export const NebulaPhaseSlot: React.FC<PhaseSlotProps> = ({ reducedMotion }) => {
  return <NebulaScene reducedMotion={reducedMotion} />;
};

// Phase Component Registry Map
const PHASE_COMPONENTS: Record<MissionPhaseId, React.FC<PhaseSlotProps>> = {
  PAD: PadScene,
  ASCENT: AscentScene,
  MAX_Q: MaxQScene,
  STAGING: StagingScene,
  FAIRING: FairingScene,
  DEPLOY: DeployScene,
  ORBIT: OrbitPhaseSlot,
  TRANSFER: TransferPhaseSlot,
  CONSTELLATIONS: ConstellationsPhaseSlot,
  ASTEROID_BELT: AsteroidBeltPhaseSlot,
  PALE_BLUE_DOT: PaleBlueDotPhaseSlot,
  NEBULA: NebulaPhaseSlot,
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
          <group key={phase.id} visible={phase.id === phaseId}>
            <Component
              phaseProgress={phaseProgress}
              globalProgress={currentProgress}
              reducedMotion={reducedMotion}
            />
          </group>
        );
      })}
    </>
  );
};
