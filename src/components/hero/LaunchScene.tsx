import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Rocket } from './Rocket';
import { LaunchPad } from './LaunchPad';
import { LaunchSmoke } from './LaunchSmoke';
import { StarField } from './StarField';

interface LaunchSceneProps {
  progress: number;
  reducedMotion?: boolean;
}

export const LaunchScene = ({ progress, reducedMotion = false }: LaunchSceneProps) => {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;
  const cameraLookAt = useRef(new THREE.Vector3(0, 5, 0));

  // Phased launch physics from deterministic progress
  // 1. Establish: 0.00 - 0.25
  // 2. Approach:  0.25 - 0.45
  // 3. Ignite:    0.45 - 0.62
  // 4. Liftoff:   0.62 - 0.85
  // 5. Ascent:    0.85 - 1.00
  const p = reducedMotion ? 0.05 : progress;

  // Pre-ignition heat (0 -> 1 between 0.22 and 0.45)
  const engineHeat = p < 0.22 ? 0 : p < 0.45 ? (p - 0.22) / 0.23 : 1;

  // Main engine thrust (0 -> 1 between 0.38 and 0.65)
  const thrust = p < 0.38 ? 0 : p < 0.65 ? (p - 0.38) / 0.27 : 1;

  // Service arm retraction (0 -> 1 between 0.52 and 0.70)
  const armRetract = p < 0.52 ? 0 : p < 0.7 ? (p - 0.52) / 0.18 : 1;

  // Launch smoke intensity (peaks at liftoff, dissipates as rocket clears pad)
  const smokeIntensity =
    p < 0.38
      ? 0
      : p < 0.72
      ? (p - 0.38) / 0.34
      : Math.max(0, 1 - (p - 0.72) / 0.22);

  // Vertical acceleration curve (smooth quadratic curve after ignition)
  const rocketAltitude =
    p < 0.62 ? 0 : Math.pow((p - 0.62) / 0.38, 2.2) * 85;

  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.position.set(isMobile ? 1.5 : 4.5, 5, isMobile ? 24 : 20);
      camera.lookAt(0, 5.5, 0);
      return;
    }

    // Dynamic camera coordinates based on device viewport
    let camX = isMobile ? 1.5 : 4.2;
    let camY = 4.0;
    let camZ = isMobile ? 23.5 : 19.5;
    let targetLookY = 5.5;

    if (p < 0.45) {
      // 1. Establish -> Approach
      const t = p / 0.45;
      const startX = isMobile ? 2.5 : 6.5;
      const endX = isMobile ? 1.2 : 3.8;
      const startZ = isMobile ? 26.0 : 23.5;
      const endZ = isMobile ? 22.5 : 19.0;

      camX = THREE.MathUtils.lerp(startX, endX, t);
      camY = THREE.MathUtils.lerp(6.5, 3.8, t);
      camZ = THREE.MathUtils.lerp(startZ, endZ, t);
      targetLookY = THREE.MathUtils.lerp(6.5, 4.8, t);
    } else if (p < 0.65) {
      // 2. Ignite (low angle perspective on pad)
      camX = isMobile ? 1.2 : 3.6;
      camY = 3.4;
      camZ = isMobile ? 21.5 : 18.0;
      targetLookY = 4.2;
    } else {
      // 3. Launch & Follow (tracks ascending rocket with smooth damping)
      const trackProgress = (p - 0.65) / 0.35;
      camX = (isMobile ? 1.2 : 3.6) + trackProgress * 2.2;
      camY = 3.4 + rocketAltitude * 0.75;
      camZ = (isMobile ? 21.5 : 18.0) + trackProgress * 11.0;
      targetLookY = rocketAltitude + 3.0;
    }

    // Subtle pointer parallax (only on non-touch desktop)
    const mouseX = isMobile ? 0 : state.pointer.x * 0.8;
    const mouseY = isMobile ? 0 : state.pointer.y * 0.5;

    // Smooth lerp camera movement
    camera.position.x += (camX + mouseX - camera.position.x) * Math.min(1, delta * 3.5);
    camera.position.y += (camY - mouseY - camera.position.y) * Math.min(1, delta * 3.5);
    camera.position.z += (camZ - camera.position.z) * Math.min(1, delta * 3.0);

    // Smooth target look-at tracking
    cameraLookAt.current.y += (targetLookY - cameraLookAt.current.y) * Math.min(1, delta * 4.0);
    camera.lookAt(cameraLookAt.current);
  });

  return (
    <>
      {/* Ambient Fill */}
      <ambientLight intensity={0.16} color="#161922" />

      {/* Main Distant Sun / Key Rim Light */}
      <directionalLight
        position={[35, 45, 25]}
        intensity={1.75}
        color="#fffaf0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />

      {/* Earthshine & Atmospheric Horizon Bounce */}
      <directionalLight
        position={[-25, 12, -15]}
        intensity={0.45}
        color="#222b3a"
      />

      {/* Atmosphere Fog */}
      <fogExp2 attach="fog" args={['#090a0d', 0.0035]} />

      {/* Realistic Circular Starfield */}
      <StarField count={isMobile ? 700 : 1300} />

      {/* Launch Mount & Gantry Tower */}
      <LaunchPad armRetract={armRetract} />

      {/* Directional Launch Plume & Steam */}
      <LaunchSmoke intensity={smokeIntensity} />

      {/* The Rocket */}
      <Rocket
        positionY={rocketAltitude}
        engineHeat={engineHeat}
        thrust={thrust}
      />
    </>
  );
};
