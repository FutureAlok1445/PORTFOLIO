import React, { useRef, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useMissionStore, liveTelemetry } from './missionStore';
import { PhaseSceneManager } from './PhaseSlots';
import { PostprocessingScaffold } from './PostprocessingScaffold';
import { SHARED_SUN_DIRECTION } from './environment/SkyDome';

// Static poster camera angles for prefers-reduced-motion (6 distinct architectural shots)
const REDUCED_MOTION_POSTERS: { pos: [number, number, number]; lookAt: [number, number, number] }[] = [
  { pos: [5.5, 4.5, 21.0], lookAt: [0, 5.0, 0] },     // 0. Pad / Hero
  { pos: [3.8, 8.0, 18.0], lookAt: [0, 12.0, 0] },    // 1. Ascent / Transonic
  { pos: [0.0, 15.0, 24.0], lookAt: [0, 15.0, 0] },   // 2. Staging / Deploy
  { pos: [8.0, 20.0, 30.0], lookAt: [0, 18.0, 0] },   // 3. Orbit / Work
  { pos: [12.0, 25.0, 40.0], lookAt: [0, 20.0, 0] },  // 4. Transfer / Deep Space
  { pos: [0.0, 30.0, 55.0], lookAt: [0, 25.0, 0] },   // 5. Heliopause / Nebula
];

// Inner camera and scene controller executed per-frame without React state updates
const SceneController: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;
  const cameraLookAt = useRef(new THREE.Vector3(0, 5, 0));

  useFrame((state, delta) => {
    const progress = liveTelemetry.progress;

    // 1. Reduced Motion: discrete poster positions without continuous scrub
    if (reducedMotion) {
      const posterIdx = Math.min(
        REDUCED_MOTION_POSTERS.length - 1,
        Math.floor(progress * REDUCED_MOTION_POSTERS.length)
      );
      const poster = REDUCED_MOTION_POSTERS[posterIdx];
      camera.position.lerp(new THREE.Vector3(...poster.pos), Math.min(1, delta * 3.0));
      cameraLookAt.current.lerp(new THREE.Vector3(...poster.lookAt), Math.min(1, delta * 3.0));
      camera.lookAt(cameraLookAt.current);
      return;
    }

    // 2. Continuous scrub camera trajectory across mission phases
    let targetX = isMobile ? 1.5 : 4.2;
    let targetY = 4.0;
    let targetZ = isMobile ? 23.5 : 19.5;
    let targetLookX = 0;
    let targetLookY = 5.5;

    if (progress < 0.16) {
      // Phase: PAD & ASCENT (Liftoff & atmospheric climb)
      const t = progress / 0.16;
      targetX = THREE.MathUtils.lerp(isMobile ? 2.5 : 6.0, isMobile ? 1.5 : 4.2, t);
      targetY = THREE.MathUtils.lerp(5.5, 20.0, t);
      targetZ = THREE.MathUtils.lerp(isMobile ? 25.0 : 22.0, isMobile ? 21.0 : 18.0, t);
      targetLookY = THREE.MathUtils.lerp(5.5, 18.0, t);
    } else if (progress < 0.32) {
      // Phase: CONSTELLATIONS (Skills: Stellar navigation star network)
      const t = (progress - 0.16) / 0.16;
      targetX = THREE.MathUtils.lerp(isMobile ? 1.5 : 4.2, isMobile ? 0 : 2.0, t);
      targetY = THREE.MathUtils.lerp(20.0, 12.0, t);
      targetZ = isMobile ? 22.0 : 18.0;
      targetLookX = 0;
      targetLookY = 10.0;
    } else if (progress < 0.52) {
      // Phase: ORBIT (Projects: Earth horizon pass & SAHOO-1 in LEO)
      const t = (progress - 0.32) / 0.20;
      targetX = THREE.MathUtils.lerp(isMobile ? 0 : 2.0, isMobile ? 1.2 : 4.5, t);
      targetY = THREE.MathUtils.lerp(12.0, 18.0, t);
      targetZ = THREE.MathUtils.lerp(isMobile ? 22.0 : 18.0, isMobile ? 26.0 : 24.0, t);
      targetLookX = 0;
      targetLookY = THREE.MathUtils.lerp(10.0, 0.0, t);
    } else if (progress < 0.68) {
      // Phase: TRANSFER (Experience: Receding Earth & dotted trajectory arc)
      const t = (progress - 0.52) / 0.16;
      targetX = THREE.MathUtils.lerp(isMobile ? 1.2 : 4.5, isMobile ? 3.0 : 12.0, t);
      targetY = THREE.MathUtils.lerp(18.0, 24.0, t);
      targetZ = THREE.MathUtils.lerp(isMobile ? 26.0 : 24.0, isMobile ? 8.0 : -10.0, t);
      targetLookX = THREE.MathUtils.lerp(0, 8.0, t);
      targetLookY = THREE.MathUtils.lerp(0, 20.0, t);
    } else if (progress < 0.82) {
      // Phase: ASTEROID_BELT (Achievements: Weaving through rock corridor past 5 honors)
      const t = (progress - 0.68) / 0.14;
      targetX = THREE.MathUtils.lerp(isMobile ? -2.0 : -6.0, isMobile ? 2.0 : 6.0, Math.sin(t * Math.PI));
      targetY = THREE.MathUtils.lerp(18.0, 22.0, t);
      targetZ = THREE.MathUtils.lerp(16.0, -90.0, t);
      targetLookX = 0;
      targetLookY = 18.0;
    } else if (progress < 0.92) {
      // Phase: PALE_BLUE_DOT (About: Looking back at Earth in solar sunbeam)
      targetX = 10.0;
      targetY = 16.0;
      targetZ = -45.0;
      targetLookX = 12.0;
      targetLookY = 18.0;
    } else {
      // Phase: NEBULA (Contact: Entering volumetric amber/magenta/indigo nebula)
      const t = (progress - 0.92) / 0.08;
      targetX = THREE.MathUtils.lerp(10.0, 0.0, t);
      targetY = THREE.MathUtils.lerp(16.0, 18.0, t);
      targetZ = THREE.MathUtils.lerp(-45.0, 18.0, t);
      targetLookX = 0;
      targetLookY = 16.0;
    }

    // 3. Gentle Mouse Parallax (max 2 degrees ~ 0.035 rad, ~0.35 camera units)
    // Fades to 0 during high-intensity moments (ignition, max-q, staging, fairing sep)
    const isHighIntensity =
      (progress < 0.05 && liveTelemetry.engineThrust > 0.4) ||
      (progress >= 0.14 && progress < 0.28);
    const parallaxIntensity = isHighIntensity || isMobile ? 0 : 1.0;

    const mouseX = state.pointer.x * 0.35 * parallaxIntensity;
    const mouseY = state.pointer.y * 0.22 * parallaxIntensity;

    // 4. Subtle Handheld Camera Noise: ON GROUND & ASCENT ONLY, strictly zero in space!
    const time = state.clock.getElapsedTime();
    const isAtmospheric = progress < 0.20;
    const handheldWeight = isAtmospheric ? Math.max(0, 1.0 - progress / 0.20) : 0;
    const handheldNoiseX = handheldWeight * (Math.sin(time * 1.6) * 0.03 + Math.cos(time * 2.7) * 0.015);
    const handheldNoiseY = handheldWeight * (Math.cos(time * 1.4) * 0.03 + Math.sin(time * 2.3) * 0.015);

    // 5. Acoustic Vibration Camera Shake during High Thrust
    const shake = liveTelemetry.cameraShake;
    const shakeX = shake > 0.01 ? (Math.sin(time * 72.0) + Math.cos(time * 94.0) * 0.5) * 0.06 * shake : 0;
    const shakeY = shake > 0.01 ? (Math.cos(time * 82.0) + Math.sin(time * 110.0) * 0.5) * 0.06 * shake : 0;

    // Smooth Interpolation with Power3-style damping
    camera.position.x += (targetX + mouseX + handheldNoiseX + shakeX - camera.position.x) * Math.min(1, delta * 3.5);
    camera.position.y += (targetY - mouseY + handheldNoiseY + shakeY - camera.position.y) * Math.min(1, delta * 3.5);
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 3.0);

    cameraLookAt.current.x += (targetLookX - cameraLookAt.current.x) * Math.min(1, delta * 3.5);
    cameraLookAt.current.y += (targetLookY - cameraLookAt.current.y) * Math.min(1, delta * 4.0);
    camera.lookAt(cameraLookAt.current);
  });

  return (
    <>
      {/* Global Lighting Foundation aligned with SHARED_SUN_DIRECTION */}
      <ambientLight intensity={0.22} color="#181e2b" />
      <directionalLight
        position={[SHARED_SUN_DIRECTION.x * 250, SHARED_SUN_DIRECTION.y * 250, SHARED_SUN_DIRECTION.z * 250]}
        intensity={2.2}
        color="#fff0dc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight
        position={[-SHARED_SUN_DIRECTION.x * 100, 15, -SHARED_SUN_DIRECTION.z * 100]}
        intensity={0.4}
        color="#38bdf8"
      />

      {/* Discrete Architectural Phase Slots Manager */}
      <PhaseSceneManager reducedMotion={reducedMotion} />
    </>
  );
};

export const MissionCanvas: React.FC = () => {
  const qualityTier = useMissionStore((state) => state.qualityTier);
  const setQualityTier = useMissionStore((state) => state.setQualityTier);
  const reducedMotion = useMissionStore((state) => state.reducedMotion);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Tab Visibility API: pause rendering completely when document is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Strict DPR Capping per Tier
  // High: [1, 1.6]; Med: [1, 1.25]; Low / Mobile: [1, 1.0]
  const dprRange: [number, number] =
    qualityTier === 'high' ? [1, 1.6] : qualityTier === 'med' ? [1, 1.25] : [1, 1];

  // Frameloop: pause when tab hidden, demand for reducedMotion/static mode, always for live scrub
  const frameloopMode = !isTabVisible ? 'never' : reducedMotion ? 'demand' : 'always';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        shadows={qualityTier === 'high'}
        camera={{ position: [5.5, 5, 22], fov: 50 }}
        frameloop={frameloopMode}
        gl={{
          antialias: qualityTier !== 'low',
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={dprRange}
      >
        {/* Performance Monitor for Dynamic Quality Tier Downgrade */}
        <PerformanceMonitor
          onDecline={() => {
            if (qualityTier === 'high') setQualityTier('med');
            else if (qualityTier === 'med') setQualityTier('low');
          }}
        />

        <Suspense fallback={null}>
          <SceneController reducedMotion={reducedMotion} />
          {/* Postprocessing Scaffold (Tier-gated) */}
          <PostprocessingScaffold qualityTier={qualityTier} />
        </Suspense>
      </Canvas>
    </div>
  );
};
