import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { EarthGlobe } from '../earth/EarthGlobe';
import { DeepStarField } from '../stars/DeepStarField';
import { Satellite } from '../deploy/Satellite';
import { SHARED_SUN_DIRECTION } from '../environment/SkyDome';
import { liveTelemetry } from '../missionStore';

export const OrbitScene: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const satelliteGroupRef = useRef<THREE.Group>(null);
  const sunGlareRef = useRef<THREE.Sprite>(null);

  useFrame((state) => {
    const prog = liveTelemetry.progress;
    // Normalized progress across ORBIT phase [0.36, 0.52]
    const t = Math.max(0, Math.min(1, (prog - 0.36) / 0.16));

    // 1. Satellite Inclined Orbital Track in LEO (Slow, smooth, majestic orbital mechanics)
    if (satelliteGroupRef.current) {
      // Orbital radius around LEO
      const orbitAngle = Math.PI * 0.25 + t * Math.PI * 0.45;
      const r = 26.0;

      // 51.6° Orbital inclination path
      const satX = Math.cos(orbitAngle) * r * 0.65 + 4.0;
      const satY = 16.0 + Math.sin(orbitAngle) * 5.5;
      const satZ = Math.sin(orbitAngle) * r * 0.55 - 12.0;

      satelliteGroupRef.current.position.set(satX, satY, satZ);

      // Real orbital attitude: bus nadir-pointing to Earth with solar wings sun-facing
      satelliteGroupRef.current.rotation.y = orbitAngle + Math.PI * 0.5;
      satelliteGroupRef.current.rotation.x = 0.14;
      satelliteGroupRef.current.rotation.z = -0.08;
    }

    // 2. Sun glare / lens flare intensity when looking toward the sun vector
    if (sunGlareRef.current) {
      const cam = state.camera;
      const camDir = new THREE.Vector3();
      cam.getWorldDirection(camDir);
      const sunDir = new THREE.Vector3(SHARED_SUN_DIRECTION.x, SHARED_SUN_DIRECTION.y, SHARED_SUN_DIRECTION.z).normalize();
      const sunDot = Math.max(0, camDir.dot(sunDir));

      // Flare flares up as camera pans towards the sun
      const flareAlpha = Math.pow(sunDot, 6.0) * 0.65;
      (sunGlareRef.current.material as THREE.SpriteMaterial).opacity = flareAlpha;
    }
  });

  return (
    <group name="orbit-scene">
      {/* 1. Deep Space Starfield & Milky Way Background */}
      <DeepStarField count={reducedMotion ? 3500 : 7500} />

      {/* 2. Primary High-Fidelity Earth System */}
      {/* Inclined orbital pass, night side reveals Mumbai/Thane glowing city cluster */}
      <EarthGlobe
        radius={58}
        position={[0, -64, -20]}
        rotation={[0.36, 0, -0.12]}
        rotationSpeed={0.03}
        focusIndia={true}
      />

      {/* 3. Hero SAHOO-1 Satellite in Operational LEO Orbit */}
      <group ref={satelliteGroupRef} scale={[0.55, 0.55, 0.55]}>
        <Satellite unfoldProgress={1} dishDeployProgress={1} rcsActive={false} />
      </group>

      {/* 4. Natural Orbital Lighting Aligned with SHARED_SUN_DIRECTION */}
      <directionalLight
        position={[SHARED_SUN_DIRECTION.x * 200, SHARED_SUN_DIRECTION.y * 200, SHARED_SUN_DIRECTION.z * 200]}
        intensity={2.8}
        color="#fff4e2"
        castShadow
      />
      {/* Earth Albedo Night-Side Upwelling Fill */}
      <directionalLight position={[-10, -30, 20]} intensity={0.45} color="#5878aa" />

      {/* 5. Subtle Sun Glare Sprite along Sun Direction Vector */}
      <sprite
        ref={sunGlareRef}
        position={[SHARED_SUN_DIRECTION.x * 120, SHARED_SUN_DIRECTION.y * 120, SHARED_SUN_DIRECTION.z * 120]}
        scale={[45, 45, 1]}
      >
        <spriteMaterial
          color="#ffebc2"
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
};
