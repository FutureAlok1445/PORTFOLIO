import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getFlameTexture } from './textures';

interface RocketProps {
  positionY?: number;
  engineHeat?: number;      // [0, 1] pre-ignition glow
  thrust?: number;          // [0, 1] main engine burn intensity
}

export const Rocket = ({
  positionY = 0,
  engineHeat = 0,
  thrust = 0,
}: RocketProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreFlameRef = useRef<THREE.Mesh>(null);
  const outerPlumeRef = useRef<THREE.Mesh>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);

  // Physically grounded aerospace materials
  const alloyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xccd0d8,
        metalness: 0.85,
        roughness: 0.28,
      }),
    []
  );

  const darkTileMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x14171d,
        metalness: 0.65,
        roughness: 0.48,
      }),
    []
  );

  const engineAlloyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x181a20,
        metalness: 0.92,
        roughness: 0.2,
      }),
    []
  );

  const flameTexture = useMemo(() => getFlameTexture(), []);

  // Nose cone ogive curve
  const noseGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const segments = 24;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const radius = 0.9 * Math.pow(t, 0.72);
      const y = 3.2 * (1 - t) + 11.2;
      pts.push(new THREE.Vector2(radius, y));
    }
    return new THREE.LatheGeometry(pts, 32);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Subtle atmospheric vibration during high thrust
      const jitter = thrust > 0.25 ? (Math.random() - 0.5) * 0.015 * thrust : 0;
      groupRef.current.position.y = positionY + jitter;
    }

    // Engine flame dynamics: inner core + outer expansion plume
    if (thrust > 0.04) {
      const flicker = 1 + Math.sin(Date.now() * 0.04) * 0.08 + Math.cos(Date.now() * 0.09) * 0.04;
      const plumeLength = (2.2 + thrust * 7.5) * flicker;
      const plumeWidth = (0.6 + thrust * 0.85) * (1 + (flicker - 1) * 0.5);

      if (coreFlameRef.current) {
        coreFlameRef.current.visible = true;
        coreFlameRef.current.scale.set(plumeWidth * 0.45, plumeLength * 0.7, plumeWidth * 0.45);
        coreFlameRef.current.position.y = -plumeLength * 0.35;
      }

      if (outerPlumeRef.current) {
        outerPlumeRef.current.visible = true;
        outerPlumeRef.current.scale.set(plumeWidth, plumeLength, plumeWidth);
        outerPlumeRef.current.position.y = -plumeLength * 0.48;
      }
    } else {
      if (coreFlameRef.current) coreFlameRef.current.visible = false;
      if (outerPlumeRef.current) outerPlumeRef.current.visible = false;
    }

    // Ground & pad illumination from rocket engine
    if (engineLightRef.current) {
      const targetIntensity = (engineHeat * 0.6 + thrust * 3.8) * (1 + Math.sin(Date.now() * 0.04) * 0.06);
      engineLightRef.current.intensity = targetIntensity;
    }
  });

  return (
    <group ref={groupRef} position={[0, positionY, 0]}>
      {/* Nose Cone */}
      <mesh geometry={noseGeometry} material={alloyMaterial} castShadow receiveShadow />

      {/* Payload Fairing Section */}
      <mesh position={[0, 9.6, 0]} material={alloyMaterial} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 3.2, 32]} />
      </mesh>

      {/* Upper Interstage Band */}
      <mesh position={[0, 7.8, 0]} material={darkTileMaterial}>
        <cylinderGeometry args={[0.91, 0.91, 0.38, 32]} />
      </mesh>

      {/* Core Stage Fuselage */}
      <mesh position={[0, 4.4, 0]} material={alloyMaterial} castShadow>
        <cylinderGeometry args={[0.9, 0.92, 6.4, 32]} />
      </mesh>

      {/* Grid Fins (4 titanium steering fins near top of core stage) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.02, 7.2, Math.sin(angle) * 1.02]}
            rotation={[0, -angle, 0]}
            material={darkTileMaterial}
          >
            <boxGeometry args={[0.06, 0.85, 0.65]} />
          </mesh>
        );
      })}

      {/* Lower Interstage Band */}
      <mesh position={[0, 1.4, 0]} material={darkTileMaterial}>
        <cylinderGeometry args={[0.92, 0.92, 0.38, 32]} />
      </mesh>

      {/* Aft Engine Skirt */}
      <mesh position={[0, 0.6, 0]} material={darkTileMaterial}>
        <cylinderGeometry args={[0.92, 0.98, 1.2, 32]} />
      </mesh>

      {/* Base Heat Shield */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.1, 32]} />
        <meshStandardMaterial color={0x181512} roughness={0.75} metalness={0.3} />
      </mesh>

      {/* Folded Landing Struts (4) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        return (
          <group key={`leg-${i}`} position={[Math.cos(angle) * 0.88, 1.8, Math.sin(angle) * 0.88]}>
            <mesh rotation={[0.1 * Math.sin(angle), 0, 0.1 * Math.cos(angle)]} material={darkTileMaterial}>
              <cylinderGeometry args={[0.035, 0.045, 3.2, 8]} />
            </mesh>
          </group>
        );
      })}

      {/* Rocket Engine Bells: Center + 4 Radial Nozzles */}
      <group position={[0, -0.3, 0]}>
        {/* Center Bell */}
        <mesh position={[0, 0, 0]} material={engineAlloyMaterial}>
          <cylinderGeometry args={[0.14, 0.36, 0.65, 20]} />
        </mesh>
        {/* 4 Radial Bells */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2;
          return (
            <mesh
              key={`bell-${i}`}
              position={[Math.cos(angle) * 0.42, 0, Math.sin(angle) * 0.42]}
              material={engineAlloyMaterial}
            >
              <cylinderGeometry args={[0.12, 0.3, 0.6, 16]} />
            </mesh>
          );
        })}
      </group>

      {/* Pre-Ignition Chamber Glow */}
      <mesh position={[0, -0.45, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial
          color={0xc99a5e}
          transparent
          opacity={Math.max(0, engineHeat * 0.7)}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 1. Inner Intense Core Flame */}
      <mesh ref={coreFlameRef} position={[0, -1.8, 0]} visible={false}>
        <cylinderGeometry args={[0.3, 0.05, 3.5, 16]} />
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Outer Directional Expansion Plume */}
      <mesh ref={outerPlumeRef} position={[0, -2.5, 0]} visible={false}>
        <coneGeometry args={[1.0, 5, 24, 1, true]} />
        <meshBasicMaterial
          map={flameTexture}
          color={0xf4be7e}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Downward Engine Light casting onto Pad & Ground */}
      <pointLight
        ref={engineLightRef}
        position={[0, -0.6, 0]}
        color={0xd49b56}
        intensity={0}
        distance={28}
        decay={2}
      />
    </group>
  );
};
