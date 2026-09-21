import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { DeepStarField } from '../stars/DeepStarField';

export const PaleBlueDotScene: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const dotRef = useRef<THREE.Mesh>(null);
  const sunbeamRef = useRef<THREE.Mesh>(null);

  // Soft glow sprite texture for the Pale Blue Dot
  const dotSprite = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.15, 'rgba(142, 197, 252, 0.9)');
    grad.addColorStop(0.4, 'rgba(90, 150, 230, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    // Subtle breathing pulse for the distant pale blue focal point
    if (dotRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 2.0) * 0.08;
      dotRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group name="pale-blue-dot-scene">
      {/* 1. Deep Space Cosmic Starfield */}
      <DeepStarField count={reducedMotion ? 4000 : 8000} />

      {/* 2. Scattered Solar Ray Beam (Voyager 1 Narrow-Angle Camera Sunbeam) */}
      <mesh
        ref={sunbeamRef}
        position={[8, 16, -110]}
        rotation={[0, 0, 0.62]}
      >
        <planeGeometry args={[14, 180]} />
        <meshBasicMaterial
          color="#fff2d0"
          transparent
          opacity={0.065}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. The Singular Pale Blue Dot (Earth at the Limb of the Solar System) */}
      <group position={[12, 18, -95]}>
        {/* Physical Dot Sphere */}
        <mesh ref={dotRef}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshBasicMaterial color="#99ccff" />
        </mesh>

        {/* Luminous Atmospheric Glow Halo */}
        <sprite scale={[5.5, 5.5, 1]}>
          <spriteMaterial
            map={dotSprite}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>

        {/* Delicate Targeting Reticle Corners */}
        <group>
          {/* Square wireframe bounding frame */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(2.4, 2.4, 0.1)]} />
            <lineBasicMaterial color="#7dd3fc" transparent opacity={0.4} />
          </lineSegments>

          {/* Coordinate Pointer Line */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, -1.2, 0, 0, -4.5, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#7dd3fc" transparent opacity={0.35} />
          </line>
        </group>

        {/* Point Light Radiance */}
        <pointLight color="#7dd3fc" intensity={1.8} distance={15} />
      </group>
    </group>
  );
};
