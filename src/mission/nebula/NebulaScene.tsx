import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { DeepStarField } from '../stars/DeepStarField';
import { Satellite } from '../deploy/Satellite';

// Procedural Organic Cloud Noise Texture for Billowing Layered Nebula
function getCloudNoiseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.35, 'rgba(230, 210, 240, 0.7)');
  grad.addColorStop(0.65, 'rgba(180, 160, 210, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export const NebulaScene: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const nebulaGroupRef = useRef<THREE.Group>(null);
  const transmissionRingsRef = useRef<THREE.Group>(null);
  const cloudTex = useMemo(() => getCloudNoiseTexture(), []);

  // Layered Volumetric Billboards with Antigravity Palette
  // (Deep Amber #c99a5e -> Magenta Crimson #b33951 -> Deep Indigo Blue #18244a)
  const nebulaLayers = useMemo(() => {
    return [
      // Deep Amber cores
      { pos: [-14, 18, -65], scale: 75, color: '#c99a5e', opacity: 0.26 },
      { pos: [10, 24, -75], scale: 85, color: '#dfb784', opacity: 0.22 },
      // Magenta-ish Crimson mid regions
      { pos: [-6, 32, -80], scale: 95, color: '#b33951', opacity: 0.28 },
      { pos: [18, 14, -85], scale: 90, color: '#9e2d45', opacity: 0.24 },
      // Deep Void Indigo Blue outer envelopes
      { pos: [0, 20, -95], scale: 130, color: '#1a2754', opacity: 0.35 },
      { pos: [-22, 10, -90], scale: 110, color: '#141d3b', opacity: 0.32 },
    ];
  }, []);

  // Young Embedded Stars
  const youngStars = useMemo(() => {
    return [
      { pos: [-12, 22, -62], color: '#ffe6b8', size: 4.5 },
      { pos: [8, 28, -70], color: '#9bc8ff', size: 5.0 },
      { pos: [15, 12, -78], color: '#ffd0c4', size: 3.8 },
      { pos: [-4, 34, -76], color: '#ffffff', size: 4.2 },
    ];
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // 1. Slow organic fluid drift of the nebula
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.z = elapsed * 0.008;
      nebulaGroupRef.current.position.y = Math.sin(elapsed * 0.25) * 1.5;
    }

    // 2. Concentric Antenna Radio Signal Wavefront Pulses (Expanding spheres every 2.4s)
    if (transmissionRingsRef.current) {
      transmissionRingsRef.current.children.forEach((child, idx) => {
        const ring = child as THREE.Mesh;
        const phaseOffset = idx * 0.8;
        const wave = ((elapsed + phaseOffset) % 2.4) / 2.4; // 0 to 1

        const currentScale = 0.5 + wave * 16.0;
        ring.scale.set(currentScale, currentScale, currentScale);

        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = (1.0 - wave) * 0.65;
      });
    }
  });

  return (
    <group name="nebula-scene">
      {/* 1. Deep Cosmic Starfield */}
      <DeepStarField count={reducedMotion ? 4000 : 8000} />

      {/* 2. Layered Billowing Nebula Clouds (Deep Amber -> Magenta -> Indigo) */}
      <group ref={nebulaGroupRef}>
        {nebulaLayers.map((layer, idx) => (
          <mesh key={`nebula-layer-${idx}`} position={layer.pos as [number, number, number]}>
            <planeGeometry args={[layer.scale, layer.scale]} />
            <meshBasicMaterial
              map={cloudTex}
              color={layer.color}
              transparent
              opacity={layer.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* 3. Embedded Young Stars */}
        {youngStars.map((star, idx) => (
          <group key={`young-star-${idx}`} position={star.pos as [number, number, number]}>
            <mesh>
              <sphereGeometry args={[0.7, 16, 16]} />
              <meshBasicMaterial color={star.color} />
            </mesh>
            <pointLight color={star.color} intensity={2.5} distance={30} />
          </group>
        ))}
      </group>

      {/* 4. SAHOO-1 Hero Satellite Transmitting from Deep Space */}
      <group position={[0, 16, -28]} scale={[0.55, 0.55, 0.55]} rotation={[0.2, 0.45, -0.05]}>
        <Satellite unfoldProgress={1} dishDeployProgress={1} rcsActive={true} />

        {/* Concentric Spherical Antenna Radio Wavefront Pulses */}
        <group ref={transmissionRingsRef} position={[0, -1.8, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
          {[0, 1, 2].map((ringIdx) => (
            <mesh key={`transmission-pulse-${ringIdx}`}>
              <ringGeometry args={[0.9, 1.0, 36]} />
              <meshBasicMaterial
                color="#c99a5e"
                transparent
                opacity={0.65}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Warm Ambient Interstellar Light */}
      <ambientLight intensity={0.25} color="#251b32" />
    </group>
  );
};
