import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SkyDome } from '../environment/SkyDome';
import { StarField } from '../../components/hero/StarField';
import { liveTelemetry } from '../missionStore';

// Vacuum Engine Pale Blue/Violet Under-Expanded Plume Shader (Zero smoke trail, wide envelope)
const vacuumPlumeVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const vacuumPlumeFragmentShader = `
  uniform float uTime;
  uniform float uThrust;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    if (uThrust <= 0.02) discard;

    float y = vUv.y;

    // Supersonic expansion flow waves
    float flow = fract(y * 3.5 - uTime * 12.0);

    // Pale blue / electric cyan core to soft vacuum violet boundary
    vec3 vacuumCore = vec3(0.65, 0.85, 1.0);     // Electric pale cyan
    vec3 vacuumEdge = vec3(0.58, 0.44, 0.92);    // Ethereal violet
    vec3 col = mix(vacuumCore, vacuumEdge, y * 0.85);

    // Wide under-expanded vacuum envelope: diffuse, translucent, zero smoke
    float alpha = (1.0 - pow(y, 1.15)) * 0.38 * uThrust;
    alpha *= (0.85 + 0.15 * sin(uTime * 28.0));

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

export const StageSeparationScene: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const boosterRef = useRef<THREE.Group>(null);
  const upperStageRef = useRef<THREE.Group>(null);
  const vacuumPlumeRef = useRef<THREE.Mesh>(null);
  const vacuumLightRef = useRef<THREE.PointLight>(null);
  const rcsPuffsRef = useRef<THREE.Points>(null);
  const pushersRef = useRef<THREE.Group>(null);

  // Aerospace PBR Materials
  const whiteAlloyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xedf0f5,
        roughness: 0.32,
        metalness: 0.45,
      }),
    []
  );

  const darkCompositeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x14171e,
        roughness: 0.6,
        metalness: 0.5,
      }),
    []
  );

  const titaniumFinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x222630,
        roughness: 0.35,
        metalness: 0.88,
      }),
    []
  );

  const engineMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x181a20,
        roughness: 0.2,
        metalness: 0.94,
      }),
    []
  );

  const vacuumPlumeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uThrust: { value: 0 },
    }),
    []
  );

  // Cold-gas separation puff particle base configuration
  const puffData = useMemo(() => {
    const count = 48;
    const basePos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      basePos[i * 3] = Math.cos(angle) * 1.9;
      basePos[i * 3 + 1] = 46.2; // At interstage separation ring
      basePos[i * 3 + 2] = Math.sin(angle) * 1.9;

      vel[i * 3] = Math.cos(angle) * 7.5;
      vel[i * 3 + 1] = -1.8;
      vel[i * 3 + 2] = Math.sin(angle) * 7.5;
    }
    return { basePos, vel, count };
  }, []);

  useFrame((state) => {
    const prog = liveTelemetry.progress;
    // Normalized progress across STAGING phase [0.20, 0.25]
    const t = Math.max(0, Math.min(1, (prog - 0.20) / 0.05));

    // 1. MECO & First Stage Separation (t < 0.15 = coast silence, t >= 0.15 = separation)
    if (boosterRef.current) {
      if (t < 0.15) {
        // MECO beat: engines cut off, connected, zero plume
        boosterRef.current.position.set(0, 0, 0);
        boosterRef.current.rotation.set(0, 0, 0);
      } else {
        // Stage separation! Pneumatic pushers fire; booster recedes backwards
        const sepT = (t - 0.15) / 0.85;
        const fallDistance = Math.pow(sepT, 1.85) * 95.0; // Recedes by 95m down into blue haze
        const lateralDrift = sepT * 9.5;

        boosterRef.current.position.y = -fallDistance;
        boosterRef.current.position.x = -lateralDrift;

        // Realistic slow physical tumble (angular velocity small, not cartoonish)
        boosterRef.current.rotation.x = sepT * 0.36;
        boosterRef.current.rotation.z = sepT * 0.19;
        boosterRef.current.rotation.y = sepT * 0.12;
      }
    }

    // 2. Pneumatic Separation Pusher Extension (visible during sep initiation)
    if (pushersRef.current) {
      if (t >= 0.15 && t < 0.35) {
        pushersRef.current.visible = true;
        const stroke = Math.min(1.0, (t - 0.15) / 0.08);
        pushersRef.current.scale.set(1, 1 + stroke * 1.8, 1);
      } else {
        pushersRef.current.visible = false;
      }
    }

    // 3. Deterministic Cold Gas Puff Jets (t in [0.15, 0.36])
    if (rcsPuffsRef.current) {
      if (t >= 0.15 && t <= 0.36) {
        rcsPuffsRef.current.visible = true;
        const puffT = (t - 0.15) / 0.21;
        const posAttr = rcsPuffsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;

        for (let i = 0; i < puffData.count; i++) {
          arr[i * 3] = puffData.basePos[i * 3] + puffData.vel[i * 3] * puffT;
          arr[i * 3 + 1] = puffData.basePos[i * 3 + 1] + puffData.vel[i * 3 + 1] * puffT;
          arr[i * 3 + 2] = puffData.basePos[i * 3 + 2] + puffData.vel[i * 3 + 2] * puffT;
        }
        posAttr.needsUpdate = true;
      } else {
        rcsPuffsRef.current.visible = false;
      }
    }

    // 4. Second Stage Vacuum Engine Ignition (~7s later, t >= 0.46)
    const isS2Ignited = t >= 0.46;
    const s2Thrust = isS2Ignited ? Math.min(1.0, (t - 0.46) / 0.14) : 0;

    if (vacuumPlumeRef.current) {
      if (s2Thrust > 0.02) {
        vacuumPlumeRef.current.visible = true;
        vacuumPlumeUniforms.uTime.value = state.clock.getElapsedTime();
        vacuumPlumeUniforms.uThrust.value = s2Thrust;
      } else {
        vacuumPlumeRef.current.visible = false;
      }
    }

    if (vacuumLightRef.current) {
      vacuumLightRef.current.intensity = s2Thrust * 4.0;
    }
  });

  return (
    <group name="stage-separation-scene">
      <SkyDome />
      <StarField count={reducedMotion ? 400 : 1000} />

      {/* Earth Curved Atmospheric Limb in Background (Booster dwindles into blue haze below) */}
      <mesh position={[0, -180, -70]} rotation={[0.22, 0, 0]}>
        <sphereGeometry args={[200, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.28]} />
        <meshBasicMaterial
          color="#153664"
          transparent
          opacity={0.42}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 1. Receding & Slowly Tumbling First Stage Booster */}
      <group ref={boosterRef}>
        {/* Core Booster Tank (40m height, 3.7m diameter) */}
        <mesh position={[0, 23.5, 0]} material={whiteAlloyMat} castShadow>
          <cylinderGeometry args={[1.85, 1.85, 40.0, 36]} />
        </mesh>

        {/* 4 Titanium Grid Fins at Top of Booster (Deployed & visible during slow physical tumble) */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2;
          return (
            <mesh
              key={`grid-fin-${i}`}
              position={[Math.cos(angle) * 2.1, 43.5, Math.sin(angle) * 2.1]}
              rotation={[0, -angle, 0]}
              material={titaniumFinMat}
            >
              <boxGeometry args={[0.12, 1.8, 1.4]} />
            </mesh>
          );
        })}

        {/* 4 Folded Carbon Landing Legs at Base */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2 + Math.PI / 4;
          return (
            <mesh
              key={`leg-${i}`}
              position={[Math.cos(angle) * 1.84, 8.5, Math.sin(angle) * 1.84]}
              rotation={[0.08 * Math.sin(angle), 0, 0.08 * Math.cos(angle)]}
              material={darkCompositeMat}
            >
              <boxGeometry args={[0.16, 14.5, 0.36]} />
            </mesh>
          );
        })}

        {/* Octaweb Engine Cluster (Cutoff, zero plume, dark engine bells) */}
        <mesh position={[0, 1.75, 0]} material={darkCompositeMat}>
          <cylinderGeometry args={[1.85, 1.95, 3.5, 36]} />
        </mesh>
      </group>

      {/* Pneumatic Separation Pushers at Interstage Plane */}
      <group ref={pushersRef} visible={false}>
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2 + Math.PI / 4;
          return (
            <mesh
              key={`pusher-${i}`}
              position={[Math.cos(angle) * 1.6, 45.8, Math.sin(angle) * 1.6]}
              material={engineMat}
            >
              <cylinderGeometry args={[0.08, 0.08, 0.8, 12]} />
            </mesh>
          );
        })}
      </group>

      {/* Cold Gas Separation Puff Particles (Deterministic on scroll) */}
      <points ref={rcsPuffsRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={puffData.count}
            array={new Float32Array(puffData.basePos)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          color="#ffffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Continuing Second Stage & Vacuum Engine */}
      <group ref={upperStageRef}>
        {/* Interstage Skirt (Carbon fiber composite structure) */}
        <mesh position={[0, 46.0, 0]} material={darkCompositeMat}>
          <cylinderGeometry args={[1.87, 1.87, 4.0, 36]} />
        </mesh>

        {/* Second Stage Liquid Oxygen / Kerosene Fuel Tank */}
        <mesh position={[0, 52.5, 0]} material={whiteAlloyMat}>
          <cylinderGeometry args={[1.85, 1.85, 9.0, 36]} />
        </mesh>

        {/* Payload Fairing Housing (Intact during Staging phase) */}
        <mesh position={[0, 61.5, 0]} material={whiteAlloyMat}>
          <cylinderGeometry args={[1.9, 1.9, 9.0, 36]} />
        </mesh>
        <mesh position={[0, 67.5, 0]} material={whiteAlloyMat}>
          <coneGeometry args={[1.9, 4.0, 36]} />
        </mesh>

        {/* Vacuum Engine Nozzle Bell (Large expansion ratio for space vacuum) */}
        <mesh position={[0, 43.2, 0]} material={engineMat}>
          <cylinderGeometry args={[0.35, 1.45, 2.6, 28]} />
        </mesh>

        {/* Second Stage Vacuum Engine Plume (Pale blue / violet, very wide under-expanded cone, no smoke) */}
        <mesh ref={vacuumPlumeRef} position={[0, 33.5, 0]} visible={false}>
          <coneGeometry args={[5.2, 17.5, 36, 1, true]} />
          <shaderMaterial
            vertexShader={vacuumPlumeVertexShader}
            fragmentShader={vacuumPlumeFragmentShader}
            uniforms={vacuumPlumeUniforms}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Pale Blue Engine Ambient Light */}
        <pointLight
          ref={vacuumLightRef}
          position={[0, 42.0, 0]}
          color="#7aaaff"
          intensity={0}
          distance={45}
        />
      </group>
    </group>
  );
};
