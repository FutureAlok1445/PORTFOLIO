import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { QualityTier } from '../types';

interface CloudDecksProps {
  altitudeKm?: number;
  qualityTier?: QualityTier;
}

export const CloudDecks: React.FC<CloudDecksProps> = ({
  qualityTier = 'high',
}) => {
  const { camera } = useThree();
  const dropletsRef = useRef<THREE.Points>(null);
  const deck1Ref = useRef<THREE.Group>(null);
  const deck2Ref = useRef<THREE.Group>(null);

  // Deck 1: Lower Cumulus layer (Alt ~2.5 - 4.5 km -> 3D Y ~140m)
  // Deck 2: Cirrus / Altostratus layer (Alt ~8.5 - 12 km -> 3D Y ~380m)
  const deck1Height = 140;
  const deck2Height = 380;

  // Tier-scaled cloud cluster density
  const cloudCount = useMemo(() => {
    if (qualityTier === 'low') return 30;
    if (qualityTier === 'med') return 60;
    return 100;
  }, [qualityTier]);

  // Cloud puff instanced coordinates
  const cloudPoints = useMemo(() => {
    const pts: { x: number; y: number; z: number; scale: number }[] = [];
    for (let i = 0; i < cloudCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 260;
      pts.push({
        x: Math.cos(angle) * dist,
        y: (Math.random() - 0.5) * 25,
        z: Math.sin(angle) * dist,
        scale: 25 + Math.random() * 45,
      });
    }
    return pts;
  }, [cloudCount]);

  // High-speed water droplet streaks on the lens when punching through clouds
  const dropletCount = 60;
  const dropletData = useMemo(() => {
    const pos = new Float32Array(dropletCount * 3);
    const speed = new Float32Array(dropletCount);

    for (let i = 0; i < dropletCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.0;
      pos[i * 3 + 2] = -2.0 - Math.random() * 1.5; // Right in front of camera lens
      speed[i] = 12.0 + Math.random() * 20.0;
    }
    return { pos, speed, count: dropletCount };
  }, [dropletCount]);

  // Golden-hour cloud top materials (warm amber on sunlit side, soft violet-grey in shadow)
  const cloudMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffeed8,
        roughness: 0.95,
        metalness: 0.05,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
      }),
    []
  );

  const seaOfCloudsMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffddb8, // Golden cloud carpet lit from side
        roughness: 0.88,
        metalness: 0.08,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, delta) => {
    const camY = camera.position.y;

    // Check proximity to Cloud Deck 1 or Deck 2
    const distDeck1 = Math.abs(camY - deck1Height);
    const distDeck2 = Math.abs(camY - deck2Height);
    const isPassingClouds = distDeck1 < 22 || distDeck2 < 28;

    // Animate high-speed droplet streaks on the lens during cloud punch-through
    if (dropletsRef.current) {
      if (isPassingClouds) {
        dropletsRef.current.visible = true;
        const posAttr = dropletsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;

        for (let i = 0; i < dropletCount; i++) {
          arr[i * 3 + 1] -= dropletData.speed[i] * delta;
          if (arr[i * 3 + 1] < -2.5) {
            arr[i * 3 + 1] = 2.5;
            arr[i * 3] = (Math.random() - 0.5) * 8.0;
          }
        }
        posAttr.needsUpdate = true;
      } else {
        dropletsRef.current.visible = false;
      }
    }
  });

  return (
    <group name="cloud-decks">
      {/* 1. Lower Cumulus Deck 1 (Altitude ~2.5 - 4.5 km) */}
      <group ref={deck1Ref} position={[0, deck1Height, 0]}>
        {/* Continuous Cloud Sea Floor (Infinite carpet seen after punching through) */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={seaOfCloudsMaterial}>
          <planeGeometry args={[1200, 1200]} />
        </mesh>

        {/* 3D Volumetric Cloud Billows */}
        {cloudPoints.map((pt, idx) => (
          <mesh
            key={`deck1-puff-${idx}`}
            position={[pt.x, pt.y, pt.z]}
            material={cloudMaterial}
          >
            <sphereGeometry args={[pt.scale, 16, 12]} />
          </mesh>
        ))}
      </group>

      {/* 2. Higher Cirrus Deck 2 (Altitude ~8.5 - 12 km) */}
      <group ref={deck2Ref} position={[0, deck2Height, 0]}>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={cloudMaterial}>
          <planeGeometry args={[1400, 1400]} />
        </mesh>
      </group>

      {/* 3. Camera Lens Water Droplets during Cloud Immersion */}
      <points ref={dropletsRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dropletData.count}
            array={dropletData.pos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#ffffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
