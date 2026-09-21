import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getStarTexture } from './textures';

interface StarFieldProps {
  count?: number;
}

export const StarField = ({ count = 900 }: StarFieldProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const starTexture = useMemo(() => getStarTexture(), []);

  // Subtle organic rotation of the stellar sphere
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.003;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.0015) * 0.02;
    }
  });

  // 1. Faint deep background celestial stars
  const bgStars = useMemo(() => {
    const bgCount = Math.floor(count * 0.85);
    const pos = new Float32Array(bgCount * 3);
    const col = new Float32Array(bgCount * 3);

    for (let i = 0; i < bgCount; i++) {
      // True distant celestial radius: 260 to 600 units away from origin
      const radius = 260 + Math.random() * 340;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.85); // Hemispherical dome above horizon

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.max(30, radius * Math.cos(phi)); // High above launchpad
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 100;

      // Realistic stellar spectra
      const temp = Math.random();
      const lum = 0.55 + Math.random() * 0.45;
      if (temp < 0.15) {
        // Subtle warm
        col[i * 3] = 0.98 * lum;
        col[i * 3 + 1] = 0.84 * lum;
        col[i * 3 + 2] = 0.68 * lum;
      } else if (temp < 0.8) {
        // Natural ivory white
        col[i * 3] = 0.94 * lum;
        col[i * 3 + 1] = 0.95 * lum;
        col[i * 3 + 2] = 0.97 * lum;
      } else {
        // Crisp faint blue-white
        col[i * 3] = 0.85 * lum;
        col[i * 3 + 1] = 0.9 * lum;
        col[i * 3 + 2] = 1.0 * lum;
      }
    }
    return { pos, col, count: bgCount };
  }, [count]);

  // 2. Sparse brighter focal stars
  const focalStars = useMemo(() => {
    const fCount = Math.floor(count * 0.15);
    const pos = new Float32Array(fCount * 3);
    const col = new Float32Array(fCount * 3);

    for (let i = 0; i < fCount; i++) {
      const radius = 300 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.85);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.max(35, radius * Math.cos(phi));
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 100;

      const lum = 0.85 + Math.random() * 0.15;
      col[i * 3] = 0.96 * lum;
      col[i * 3 + 1] = 0.97 * lum;
      col[i * 3 + 2] = 1.0 * lum;
    }
    return { pos, col, count: fCount };
  }, [count]);

  return (
    <group ref={groupRef}>
      {/* Background celestial stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={bgStars.count}
            array={bgStars.pos}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={bgStars.count}
            array={bgStars.col}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.1}
          map={starTexture}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Prominent celestial focal stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={focalStars.count}
            array={focalStars.pos}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={focalStars.count}
            array={focalStars.col}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.7}
          map={starTexture}
          vertexColors
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
