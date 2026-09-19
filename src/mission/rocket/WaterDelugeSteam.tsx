import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { QualityTier } from '../types';

interface WaterDelugeSteamProps {
  intensity?: number; // 0..1
  qualityTier?: QualityTier;
}

export const WaterDelugeSteam: React.FC<WaterDelugeSteamProps> = ({
  intensity = 0,
  qualityTier = 'high',
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = useMemo(() => {
    if (qualityTier === 'low') return 300;
    if (qualityTier === 'med') return 600;
    return 1000;
  }, [qualityTier]);

  const steamData = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const life = new Float32Array(particleCount);
    const size = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      life[i] = Math.random();
      size[i] = 4.0 + Math.random() * 6.0;

      // Spawns from base of pad and trench openings
      const angle = (Math.random() - 0.5) * Math.PI * 0.9;
      const r = 2.0 + Math.random() * 6.0;
      pos[i * 3] = Math.sin(angle) * r;
      pos[i * 3 + 1] = -1.2 + Math.random() * 2.0;
      pos[i * 3 + 2] = Math.cos(angle) * r + 8.0; // Pours along the flame trench (+Z)

      vel[i * 3] = Math.sin(angle) * (6.0 + Math.random() * 12.0); // Shoots outward laterally
      vel[i * 3 + 1] = 1.0 + Math.random() * 3.5; // Slight billowing upward
      vel[i * 3 + 2] = Math.cos(angle) * (8.0 + Math.random() * 16.0);
    }
    return { pos, vel, life, size, count: particleCount };
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!pointsRef.current || intensity <= 0.01) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < steamData.count; i++) {
      steamData.life[i] += delta * (0.4 + intensity * 0.8);

      if (steamData.life[i] >= 1.0) {
        steamData.life[i] = 0;
        const angle = (Math.random() - 0.5) * Math.PI * 0.9;
        const r = 2.0 + Math.random() * 5.0;
        arr[i * 3] = Math.sin(angle) * r;
        arr[i * 3 + 1] = -1.2 + Math.random() * 1.5;
        arr[i * 3 + 2] = Math.cos(angle) * r + 6.0;
      } else {
        arr[i * 3] += steamData.vel[i * 3] * delta * intensity;
        arr[i * 3 + 1] += steamData.vel[i * 3 + 1] * delta * intensity;
        arr[i * 3 + 2] += steamData.vel[i * 3 + 2] * delta * intensity;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (intensity <= 0.01) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={steamData.count}
          array={steamData.pos}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={7.5}
        color="#fff0df" // Lit warmly by the low golden dawn sun
        transparent
        opacity={Math.min(0.42, intensity * 0.45)}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
};
