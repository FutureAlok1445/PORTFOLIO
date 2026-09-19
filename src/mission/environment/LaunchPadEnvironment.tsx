import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface LaunchPadEnvironmentProps {
  armRetract?: number; // 0 = connected, 1 = fully swung away
  sunElevation?: number; // 0 = dawn, 1 = daylight
  floodlightIntensity?: number; // 1 = on, 0 = off
}

export const LaunchPadEnvironment: React.FC<LaunchPadEnvironmentProps> = ({
  armRetract = 0,
  sunElevation = 0.2,
  floodlightIntensity = 1,
}) => {
  const serviceArmRef = useRef<THREE.Group>(null);
  const upperArmRef = useRef<THREE.Group>(null);
  const floodlight1Ref = useRef<THREE.SpotLight>(null);
  const floodlight2Ref = useRef<THREE.SpotLight>(null);
  const beaconLightRef = useRef<THREE.PointLight>(null);

  // High-performance PBR materials
  const concreteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1a1d24,
        roughness: 0.9,
        metalness: 0.15,
      }),
    []
  );

  const trenchSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x111317,
        roughness: 0.7,
        metalness: 0.8,
      }),
    []
  );

  const dirtMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x0c0e12,
        roughness: 0.96,
        metalness: 0.05,
      }),
    []
  );

  const oceanMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x071524,
        roughness: 0.22,
        metalness: 0.65,
      }),
    []
  );

  const towerTrussMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x272c36,
        roughness: 0.6,
        metalness: 0.65,
      }),
    []
  );

  const waterTankMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xd8dde4,
        roughness: 0.45,
        metalness: 0.55,
      }),
    []
  );

  const beaconMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xff2222,
      }),
    []
  );

  useFrame((state) => {
    // Dynamic swing arm rotation (swing away by up to ~75 degrees)
    const angle = armRetract * (Math.PI * 0.42);
    if (serviceArmRef.current) {
      serviceArmRef.current.rotation.y = -angle;
    }
    if (upperArmRef.current) {
      upperArmRef.current.rotation.y = -angle * 0.88;
    }

    // Flashing red obstruction beacons atop lightning masts
    if (beaconLightRef.current) {
      const flash = Math.sin(state.clock.getElapsedTime() * 4.0) > 0.3 ? 1.2 : 0.05;
      beaconLightRef.current.intensity = flash;
    }

    // Floodlight intensity fading as dawn advances
    const fl = Math.max(0, floodlightIntensity * (1.0 - sunElevation * 0.9));
    if (floodlight1Ref.current) floodlight1Ref.current.intensity = fl * 2.8;
    if (floodlight2Ref.current) floodlight2Ref.current.intensity = fl * 2.4;
  });

  return (
    <group name="launch-pad-environment" position={[0, -0.6, 0]}>
      {/* 1. Surrounding Terrain (Coastal Dirt & Gravel Flatland) */}
      <mesh position={[0, -2.6, 0]} material={dirtMat} receiveShadow>
        <cylinderGeometry args={[260, 260, 2.0, 48]} />
      </mesh>

      {/* 2. Distant Sea Horizon Water Surface */}
      <mesh position={[0, -3.1, -380]} rotation={[-Math.PI / 2, 0, 0]} material={oceanMat}>
        <planeGeometry args={[1400, 700]} />
      </mesh>

      {/* 3. Main Reinforced Concrete Launch Mount with Flame Trench Opening */}
      <group position={[0, -0.5, 0]}>
        {/* Concrete Upper Pad Deck */}
        <mesh material={concreteMat} receiveShadow>
          <boxGeometry args={[34, 3.2, 34]} />
        </mesh>

        {/* Central Launch Table Pedestal */}
        <mesh position={[0, 1.8, 0]} material={concreteMat} receiveShadow>
          <cylinderGeometry args={[5.2, 5.8, 1.0, 32]} />
        </mesh>

        {/* Steel Hold-down Launch Ring */}
        <mesh position={[0, 2.35, 0]} material={trenchSteelMat}>
          <torusGeometry args={[1.8, 0.28, 16, 32]} />
        </mesh>

        {/* 4 Hold-Down Clamps */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i * Math.PI) / 2 + Math.PI / 4;
          return (
            <mesh
              key={`clamp-${i}`}
              position={[Math.cos(a) * 1.65, 2.7, Math.sin(a) * 1.65]}
              material={trenchSteelMat}
              castShadow
            >
              <boxGeometry args={[0.3, 0.7, 0.45]} />
            </mesh>
          );
        })}

        {/* Subterranean Flame Trench (Deep canyon directed towards the sea at -Z / +Z) */}
        <group position={[0, -1.2, 10]}>
          {/* Flame Deflector Wedge (45 degree inclined double-sided blast diverter) */}
          <mesh position={[0, 0.2, -8.5]} rotation={[0.45, 0, 0]} material={trenchSteelMat}>
            <boxGeometry args={[7.2, 0.5, 12]} />
          </mesh>
          {/* Trench Concrete Channel Walls */}
          <mesh position={[-4.0, 0.0, 0]} material={concreteMat}>
            <boxGeometry args={[1.2, 4.2, 26]} />
          </mesh>
          <mesh position={[4.0, 0.0, 0]} material={concreteMat}>
            <boxGeometry args={[1.2, 4.2, 26]} />
          </mesh>
        </group>
      </group>

      {/* 4. Service Structure / Strongback Gantry Tower (~68m tall) */}
      <group position={[-5.8, 0, -0.5]}>
        {/* Main Gantry Truss Column */}
        <mesh position={[0, 30, 0]} material={towerTrussMat} castShadow receiveShadow>
          <boxGeometry args={[3.6, 62, 3.6]} />
        </mesh>

        {/* Catwalk Platforms every 10 meters */}
        {[10, 20, 30, 40, 50, 60].map((h) => (
          <mesh key={`catwalk-${h}`} position={[0.4, h, 0]} material={towerTrussMat}>
            <boxGeometry args={[4.8, 0.4, 4.8]} />
          </mesh>
        ))}

        {/* Retractable Umbilical Service Arm (Mid-booster interstage connection) */}
        <group ref={serviceArmRef} position={[1.8, 28, 0]}>
          <mesh position={[2.5, 0, 0]} material={towerTrussMat} castShadow>
            <boxGeometry args={[4.8, 0.9, 0.9]} />
          </mesh>
          {/* Interface Umbilical Plate */}
          <mesh position={[4.9, 0, 0]} material={trenchSteelMat}>
            <cylinderGeometry args={[0.35, 0.35, 0.5, 16]} />
          </mesh>
        </group>

        {/* Retractable Upper Payload / Fairing Crew Arm */}
        <group ref={upperArmRef} position={[1.8, 48, 0]}>
          <mesh position={[2.4, 0, 0]} material={towerTrussMat} castShadow>
            <boxGeometry args={[4.6, 1.2, 1.2]} />
          </mesh>
          <mesh position={[4.7, 0, 0]} material={trenchSteelMat}>
            <boxGeometry args={[0.5, 1.4, 1.4]} />
          </mesh>
        </group>

        {/* Tower Floodlight Banks */}
        <spotLight
          ref={floodlight1Ref}
          position={[2.2, 38, 2.0]}
          target-position={[0, 15, 0]}
          color="#fff5e4"
          intensity={2.8}
          angle={0.7}
          penumbra={0.5}
          distance={65}
        />
        <spotLight
          ref={floodlight2Ref}
          position={[2.2, 55, -2.0]}
          target-position={[0, 40, 0]}
          color="#fff5e4"
          intensity={2.4}
          angle={0.65}
          penumbra={0.6}
          distance={80}
        />
      </group>

      {/* 5. Water-Suppression Deluge Tower & High-Pressure Piping */}
      <group position={[28, 0, -22]}>
        {/* Steel Lattice Legs */}
        {[
          [-4, -4],
          [4, -4],
          [-4, 4],
          [4, 4],
        ].map(([x, z], idx) => (
          <mesh
            key={`leg-${idx}`}
            position={[x, 15, z]}
            material={towerTrussMat}
            castShadow
          >
            <cylinderGeometry args={[0.35, 0.45, 30, 8]} />
          </mesh>
        ))}

        {/* Elevated Spherical Water Storage Tank (~12m diameter) */}
        <mesh position={[0, 35, 0]} material={waterTankMat} castShadow>
          <sphereGeometry args={[6.5, 24, 24]} />
        </mesh>

        {/* Big Dual Water Supply Pipes leading from Tank to Launch Pad */}
        <mesh
          position={[-14, 1.2, 11]}
          rotation={[0, 0.65, 0]}
          material={trenchSteelMat}
        >
          <cylinderGeometry args={[0.7, 0.7, 36, 16]} />
        </mesh>
      </group>

      {/* 6. 4 High-Altitude Lightning Protection Masts with Warning Beacons */}
      {[
        [-38, -38],
        [38, -38],
        [-38, 38],
        [38, 38],
      ].map(([x, z], idx) => (
        <group key={`lightning-pole-${idx}`} position={[x, 0, z]}>
          {/* Tapered Lattice Mast (~55m tall) */}
          <mesh position={[0, 26, 0]} material={towerTrussMat} castShadow>
            <cylinderGeometry args={[0.18, 1.2, 54, 8]} />
          </mesh>
          {/* Sharp Copper Lightning Rod Tip */}
          <mesh position={[0, 54.5, 0]} material={trenchSteelMat}>
            <coneGeometry args={[0.1, 3.2, 8]} />
          </mesh>
          {/* Pulsating Red Aviation Warning Beacon */}
          <mesh position={[0, 53.5, 0]} material={beaconMat}>
            <sphereGeometry args={[0.35, 8, 8]} />
          </mesh>
          {idx === 0 && (
            <pointLight
              ref={beaconLightRef}
              position={[0, 53.5, 0]}
              color="#ff2222"
              intensity={0.8}
              distance={150}
            />
          )}
        </group>
      ))}

      {/* Low Ground Mist Fog Plane (Height falloff at ground level) */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[180, 180]} />
        <meshBasicMaterial
          color="#f69c64"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
