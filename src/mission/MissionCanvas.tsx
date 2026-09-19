import React, { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useMissionStore, liveTelemetry } from './missionStore';
import { PhaseSceneManager } from './PhaseSlots';
import { PostprocessingScaffold } from './PostprocessingScaffold';

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
    let targetLookY = 5.5;

    if (progress < 0.14) {
      // Phase: PAD liftoff
      const t = progress / 0.14;
      targetX = THREE.MathUtils.lerp(isMobile ? 2.5 : 6.0, isMobile ? 1.2 : 3.8, t);
      targetY = THREE.MathUtils.lerp(5.5, 3.8, t);
      targetZ = THREE.MathUtils.lerp(isMobile ? 25.0 : 22.0, isMobile ? 21.0 : 18.0, t);
      targetLookY = THREE.MathUtils.lerp(5.5, 4.5, t);
    } else if (progress < 0.36) {
      // Phase: ASCENT -> STAGING -> DEPLOY (ascending through atmosphere)
      const t = (progress - 0.14) / 0.22;
      targetX = THREE.MathUtils.lerp(isMobile ? 1.2 : 3.8, isMobile ? 2.0 : 5.5, t);
      targetY = THREE.MathUtils.lerp(3.8, 25.0, t);
      targetZ = THREE.MathUtils.lerp(isMobile ? 21.0 : 18.0, isMobile ? 26.0 : 24.0, t);
      targetLookY = THREE.MathUtils.lerp(4.5, 28.0, t);
    } else {
      // Phase: ORBIT -> TRANSFER -> DEEP SPACE (orbital & translunar space vista)
      const t = (progress - 0.36) / 0.64;
      targetX = THREE.MathUtils.lerp(isMobile ? 2.0 : 5.5, 0.0, t);
      targetY = THREE.MathUtils.lerp(25.0, 35.0, t);
      targetZ = THREE.MathUtils.lerp(isMobile ? 26.0 : 24.0, isMobile ? 32.0 : 38.0, t);
      targetLookY = THREE.MathUtils.lerp(28.0, 32.0, t);
    }

    // Gentle cursor parallax on desktop
    const mouseX = isMobile ? 0 : state.pointer.x * 0.7;
    const mouseY = isMobile ? 0 : state.pointer.y * 0.4;

    camera.position.x += (targetX + mouseX - camera.position.x) * Math.min(1, delta * 3.5);
    camera.position.y += (targetY - mouseY - camera.position.y) * Math.min(1, delta * 3.5);
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 3.0);

    cameraLookAt.current.y += (targetLookY - cameraLookAt.current.y) * Math.min(1, delta * 4.0);
    camera.lookAt(cameraLookAt.current);
  });

  return (
    <>
      {/* Global Lighting Foundation */}
      <ambientLight intensity={0.18} color="#151922" />
      <directionalLight
        position={[40, 50, 30]}
        intensity={1.8}
        color="#fffaf0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight
        position={[-30, 10, -20]}
        intensity={0.4}
        color="#1f2838"
      />
      <fogExp2 attach="fog" args={['#050608', 0.003]} />

      {/* Dynamic Phase Scenes (Current Phase +/- 1) */}
      <PhaseSceneManager reducedMotion={reducedMotion} />
    </>
  );
};

export const MissionCanvas: React.FC = () => {
  const qualityTier = useMissionStore((state) => state.qualityTier);
  const setQualityTier = useMissionStore((state) => state.setQualityTier);
  const reducedMotion = useMissionStore((state) => state.reducedMotion);

  // High tier: dpr [1, 1.75]; Low/Med: [1, 1.25]
  const dprRange: [number, number] = qualityTier === 'high' ? [1, 1.75] : [1, 1.25];

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
        gl={{
          antialias: true,
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
