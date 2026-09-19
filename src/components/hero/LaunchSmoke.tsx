import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getSmokeTexture } from './textures';

interface LaunchSmokeProps {
  intensity?: number; // [0, 1]
}

export const LaunchSmoke = ({ intensity = 0 }: LaunchSmokeProps) => {
  const trenchPointsRef = useRef<THREE.Points>(null);
  const cloudPointsRef = useRef<THREE.Points>(null);

  const trenchCount = 120;
  const cloudCount = 100;

  // 1. Trench directional exhaust (biased toward the flame trench +Z)
  const trenchData = useMemo(() => {
    const pos = new Float32Array(trenchCount * 3);
    const speed = new Float32Array(trenchCount);
    const rad = new Float32Array(trenchCount);

    for (let i = 0; i < trenchCount; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 0.8; // directional fan towards front/trench
      const r = 1.2 + Math.random() * 5;
      rad[i] = r;
      speed[i] = 2.5 + Math.random() * 3.5;

      pos[i * 3] = Math.sin(angle) * r;
      pos[i * 3 + 1] = -1.2 + Math.random() * 1.2; // strictly low ground level
      pos[i * 3 + 2] = Math.cos(angle) * r + 2.0; // directional towards trench
    }
    return { pos, speed, rad };
  }, [trenchCount]);

  // 2. Soft atmospheric billowing cloud (expanding outward, low opacity)
  const cloudData = useMemo(() => {
    const pos = new Float32Array(cloudCount * 3);
    const speed = new Float32Array(cloudCount);
    const dist = new Float32Array(cloudCount);

    for (let i = 0; i < cloudCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const d = 2.5 + Math.random() * 8;
      dist[i] = d;
      speed[i] = 1.0 + Math.random() * 1.8;

      pos[i * 3] = Math.cos(angle) * d;
      pos[i * 3 + 1] = -0.8 + Math.random() * 2.2; // remains below Y = 2.5
      pos[i * 3 + 2] = Math.sin(angle) * d + 1.0;
    }
    return { pos, speed, dist };
  }, [cloudCount]);

  const smokeTexture = useMemo(() => getSmokeTexture(), []);

  useFrame((_, delta) => {
    if (intensity <= 0.02) return;

    // Animate trench exhaust
    if (trenchPointsRef.current) {
      const posAttr = trenchPointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < trenchCount; i++) {
        trenchData.rad[i] += delta * trenchData.speed[i] * (1.5 + intensity * 4.0);
        if (trenchData.rad[i] > 22) {
          trenchData.rad[i] = 1.2 + Math.random() * 2.5;
        }

        const angle = (i / trenchCount - 0.5) * Math.PI * 0.8;
        array[i * 3] = Math.sin(angle) * trenchData.rad[i];
        array[i * 3 + 1] = -1.2 + Math.min(2.0, trenchData.rad[i] * 0.12);
        array[i * 3 + 2] = Math.cos(angle) * trenchData.rad[i] + 2.5;
      }
      posAttr.needsUpdate = true;
    }

    // Animate soft atmospheric cloud
    if (cloudPointsRef.current) {
      const posAttr = cloudPointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < cloudCount; i++) {
        cloudData.dist[i] += delta * cloudData.speed[i] * (1.0 + intensity * 2.0);
        if (cloudData.dist[i] > 26) {
          cloudData.dist[i] = 2.5 + Math.random() * 3.0;
        }

        const angle = (i / cloudCount) * Math.PI * 2;
        array[i * 3] = Math.cos(angle) * cloudData.dist[i];
        array[i * 3 + 1] = -0.8 + Math.min(2.8, cloudData.dist[i] * 0.15);
        array[i * 3 + 2] = Math.sin(angle) * cloudData.dist[i] + 1.0;
      }
      posAttr.needsUpdate = true;
    }
  });

  if (intensity <= 0.02) return null;

  return (
    <group>
      {/* Directional Trench Plume (Fast, Dense, Low) */}
      <points ref={trenchPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={trenchData.pos.length / 3}
            array={trenchData.pos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={4.2}
          map={smokeTexture}
          transparent
          opacity={Math.min(0.48, intensity * 0.5)}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>

      {/* Atmospheric Soft Expansion Cloud (Slow, Wide, Subtle) */}
      <points ref={cloudPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={cloudData.pos.length / 3}
            array={cloudData.pos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={7.5}
          map={smokeTexture}
          transparent
          opacity={Math.min(0.24, intensity * 0.28)}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
