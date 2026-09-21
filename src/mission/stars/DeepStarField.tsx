import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// High-Definition Circular Gaussian Alpha Sprite for Stars (Zero square boxes)
function getStarSpriteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.2, 'rgba(240, 245, 255, 0.85)');
  grad.addColorStop(0.5, 'rgba(200, 220, 255, 0.35)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural Milky Way Equirectangular Galactic Dust Lane Texture
function getMilkyWayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#010204';
  ctx.fillRect(0, 0, 1024, 512);

  // Diagonal Galactic Plane Dust Band
  ctx.save();
  ctx.translate(512, 256);
  ctx.rotate(-0.35); // 20-deg galactic inclination

  const grad = ctx.createLinearGradient(0, -140, 0, 140);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.3, 'rgba(20, 30, 55, 0.12)');
  grad.addColorStop(0.45, 'rgba(65, 45, 75, 0.28)');
  grad.addColorStop(0.5, 'rgba(95, 70, 90, 0.35)'); // Galactic core
  grad.addColorStop(0.55, 'rgba(65, 45, 75, 0.28)');
  grad.addColorStop(0.7, 'rgba(20, 30, 55, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(-700, -140, 1400, 280);

  // Soft Galactic Core Central Bulge
  const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 120);
  coreGrad.addColorStop(0, 'rgba(145, 115, 100, 0.38)');
  coreGrad.addColorStop(0.4, 'rgba(90, 65, 95, 0.22)');
  coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 220, 90, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

interface DeepStarFieldProps {
  count?: number;
  radius?: number;
  subtleParallax?: boolean;
}

export const DeepStarField: React.FC<DeepStarFieldProps> = ({
  count = 7500,
  radius = 420,
  subtleParallax = true,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const milkyWayRef = useRef<THREE.Mesh>(null);

  const starTexture = useMemo(() => getStarSpriteTexture(), []);
  const milkyWayTexture = useMemo(() => getMilkyWayTexture(), []);

  // Magnitude-based star data & B-V color temperatures
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    // Color Temperature Spectrum Palette
    const spectralColors = [
      new THREE.Color(0x9db4ff), // O/B: Blue-white hot stars (15%)
      new THREE.Color(0xf0f4ff), // A: Pure brilliant white (35%)
      new THREE.Color(0xfff6e8), // F/G: Sun-like yellow-white (30%)
      new THREE.Color(0xffd2a1), // K: Orange stars (12%)
      new THREE.Color(0xff9e6b), // M: Red giants (8%)
    ];

    for (let i = 0; i < count; i++) {
      // Uniform distribution on sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius + (Math.random() - 0.5) * 60.0;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Magnitude distribution: power-law (vast majority faint, few brilliant anchors)
      const magRand = Math.random();
      const isAnchor = magRand > 0.985;
      const isMid = magRand > 0.85;

      if (isAnchor) {
        sz[i] = 3.6 + Math.random() * 1.8;
      } else if (isMid) {
        sz[i] = 2.0 + Math.random() * 1.2;
      } else {
        sz[i] = 1.0 + Math.random() * 0.8;
      }

      // Pick spectral class based on frequency distribution
      const colorRoll = Math.random();
      let chosenColor = spectralColors[1];
      if (colorRoll < 0.15) chosenColor = spectralColors[0];
      else if (colorRoll < 0.50) chosenColor = spectralColors[1];
      else if (colorRoll < 0.80) chosenColor = spectralColors[2];
      else if (colorRoll < 0.92) chosenColor = spectralColors[3];
      else chosenColor = spectralColors[4];

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [count, radius]);

  useFrame((state) => {
    // In deep space, stars do NOT twinkle.
    // Only subtle camera parallax based on desktop pointer
    if (subtleParallax && pointsRef.current) {
      pointsRef.current.rotation.y = state.pointer.x * 0.012;
      pointsRef.current.rotation.x = -state.pointer.y * 0.008;
    }
  });

  return (
    <group name="deep-starfield">
      {/* 1. Milky Way Galactic Plane Celestial Sphere */}
      <mesh ref={milkyWayRef}>
        <sphereGeometry args={[radius * 1.1, 32, 24]} />
        <meshBasicMaterial
          map={milkyWayTexture}
          side={THREE.BackSide}
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Non-Twinkling Physical Magnitude Stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          sizeAttenuation
          vertexColors
          map={starTexture}
          transparent
          alphaTest={0.01}
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
