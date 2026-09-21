import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { DeepStarField } from '../stars/DeepStarField';

// 3D Simplex Noise for Procedural Asteroid Deformation
function pseudoNoise3D(x: number, y: number, z: number): number {
  const p = Math.sin(x * 1.7 + y * 2.3 + z * 3.1) * 43758.5453;
  return p - Math.floor(p);
}

// Procedural Craggy Regolith Rock Normal Map
function getAsteroidNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(128, 128);
  const data = imgData.data;

  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const idx = (y * 128 + x) * 4;
      const nx = (Math.sin(x * 0.35) + Math.cos(y * 0.42)) * 35;
      const ny = (Math.cos(x * 0.38) + Math.sin(y * 0.28)) * 35;
      data[idx] = THREE.MathUtils.clamp(128 + nx, 0, 255);
      data[idx + 1] = THREE.MathUtils.clamp(128 + ny, 0, 255);
      data[idx + 2] = 230;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Procedural Mission Patch Texture for Hero Asteroids
function createMissionPatchTexture(title: string, subtitle: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#080a0f';
  ctx.fillRect(0, 0, 512, 256);

  // Gold Double-Border Frame
  ctx.strokeStyle = '#c99a5e';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 492, 236);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(18, 18, 476, 220);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px monospace';
  ctx.fillText(title, 32, 85);

  // Subtitle
  ctx.fillStyle = '#c99a5e';
  ctx.font = '20px monospace';
  ctx.fillText(subtitle, 32, 140);

  // Mission ID
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '16px monospace';
  ctx.fillText('FLIGHT LOG // VERIFIED CITATION', 32, 195);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 5 Verified Honors from Alok's portfolio
const HERO_HONORS = [
  {
    title: 'SMART INDIA HACKATHON 2025',
    sub: 'NATIONAL GRAND FINALE FINALIST',
    pos: [-8, 18, -35],
    scale: 3.8,
  },
  {
    title: 'VCET HACKATHON 2024',
    sub: 'WINNER - 1ST PLACE // TRUSTNET-AI',
    pos: [12, 24, -65],
    scale: 4.2,
  },
  {
    title: 'CONVEX HACKATHON',
    sub: 'BEST HARDWARE / AI INTEGRATION',
    pos: [-14, 12, -95],
    scale: 3.5,
  },
  {
    title: 'INNOVATION CUP 2024',
    sub: 'OUTSTANDING TECHNICAL DESIGN',
    pos: [10, 28, -125],
    scale: 3.9,
  },
  {
    title: 'APSIT CODE RED',
    sub: '1ST RUNNER-UP // ALGORITHMIC DEV',
    pos: [-6, 16, -155],
    scale: 3.6,
  },
];

export const AsteroidBeltScene: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const dustRef = useRef<THREE.Points>(null);
  const rockCount = reducedMotion ? 450 : 1000;

  const normalMap = useMemo(() => getAsteroidNormalMap(), []);

  // PBR Regolith Rock Material (Hard harsh shadows with 1 sun light)
  const rockMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x484b54,
        roughness: 0.88,
        metalness: 0.12,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.65, 0.65),
      }),
    [normalMap]
  );

  // Deformed cratered asteroid geometry
  const asteroidGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.0, 2);
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      const disp =
        pseudoNoise3D(v.x * 1.5, v.y * 1.5, v.z * 1.5) * 0.28 +
        pseudoNoise3D(v.x * 4.0, v.y * 4.0, v.z * 4.0) * 0.12;
      v.multiplyScalar(1.0 + disp);
      posAttr.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Matrix and rotation data for 1000 instanced rocks
  const instanceData = useMemo(() => {
    const data: { dummy: THREE.Object3D; rotSpeed: [number, number, number] }[] = [];
    for (let i = 0; i < rockCount; i++) {
      const dummy = new THREE.Object3D();

      // Toroidal spatial distribution
      const u = Math.random();
      const radius = 18.0 + Math.random() * 45.0;
      const angle = u * Math.PI * 2;

      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 18.0;
      const y = (Math.random() - 0.5) * 35.0 + 15.0;
      const z = -Math.random() * 160.0;

      // Power-law size distribution: vast majority small pebbles, few large boulders
      const sizePower = Math.pow(Math.random(), 3.5);
      const scale = 0.35 + sizePower * 3.2;

      dummy.position.set(x, y, z);
      dummy.scale.set(scale, scale * (0.8 + Math.random() * 0.4), scale);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      data.push({
        dummy,
        rotSpeed: [
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.15,
        ],
      });
    }
    return data;
  }, [rockCount]);

  // Initial matrix population
  useMemo(() => {
    if (!instancedRef.current) return;
    instanceData.forEach((item, idx) => {
      item.dummy.updateMatrix();
      instancedRef.current?.setMatrixAt(idx, item.dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [instanceData]);

  // Drifting microscopic cosmic dust particles for depth parallax
  const dustData = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40.0 + 15.0;
      pos[i * 3 + 2] = -Math.random() * 160.0;
    }
    return { pos, count };
  }, []);

  useFrame((state, delta) => {
    // 1. Slow physical tumble for all 1000 instanced rocks
    if (instancedRef.current) {
      instanceData.forEach((item, idx) => {
        item.dummy.rotation.x += item.rotSpeed[0] * delta;
        item.dummy.rotation.y += item.rotSpeed[1] * delta;
        item.dummy.rotation.z += item.rotSpeed[2] * delta;
        item.dummy.updateMatrix();
        instancedRef.current?.setMatrixAt(idx, item.dummy.matrix);
      });
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Slow subtle drift for dust particles
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.getElapsedTime() * 0.008;
    }
  });

  return (
    <group name="asteroid-belt-scene">
      {/* 1. Deep Space Starfield */}
      <DeepStarField count={reducedMotion ? 4000 : 8000} />

      {/* 2. Harsh Unidirectional Real Space Sunlight (Zero ambient fill, pitch black shadows) */}
      <directionalLight position={[180, 70, 120]} intensity={3.0} color="#fff6e8" castShadow />
      <ambientLight intensity={0.03} color="#0d1017" />

      {/* 3. 1,000 Instanced Asteroids with Power-Law Sizing */}
      <instancedMesh
        ref={instancedRef}
        args={[asteroidGeo, rockMaterial, rockCount]}
        castShadow
        receiveShadow
      />

      {/* 4. Five Hero Asteroids with Mission Patch Plates */}
      {HERO_HONORS.map((hero, idx) => {
        const patchTex = createMissionPatchTexture(hero.title, hero.sub);
        return (
          <group key={`hero-asteroid-${idx}`} position={hero.pos as [number, number, number]}>
            {/* Primary Deformed Hero Rock */}
            <mesh geometry={asteroidGeo} material={rockMaterial} scale={hero.scale} castShadow receiveShadow />

            {/* Illuminated Titanium Mission Patch Plate */}
            <mesh position={[0, 0, hero.scale * 1.05]} rotation={[0, 0, 0]}>
              <planeGeometry args={[hero.scale * 1.1, hero.scale * 0.55]} />
              <meshStandardMaterial
                map={patchTex}
                roughness={0.25}
                metalness={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Subtle Local Glow Beacon */}
            <pointLight position={[0, 0, hero.scale * 1.2]} color="#c99a5e" intensity={1.4} distance={12} />
          </group>
        );
      })}

      {/* 5. Drifting Cosmic Dust Points */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={dustData.count} array={dustData.pos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={1.2} color="#8a94a6" transparent opacity={0.45} depthWrite={false} />
      </points>
    </group>
  );
};
