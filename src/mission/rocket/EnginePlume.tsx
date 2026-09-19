import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { QualityTier } from '../types';

import { liveTelemetry } from '../missionStore';

interface EnginePlumeProps {
  thrust?: number; // 0..1
  altitudeKm?: number;
  qualityTier?: QualityTier;
  positionY?: number;
  pitchAngle?: number;
}

// 1. Supersonic Mach Diamonds Shader for the White-Hot Engine Core
const machDiamondVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const machDiamondFragmentShader = `
  uniform float uTime;
  uniform float uThrust;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    if (uThrust <= 0.02) {
      discard;
    }

    float y = vUv.y; // 0 at top nozzle, 1 at bottom tip

    // High frequency noise and supersonic flow speed
    float flow = fract(y * 8.0 - uTime * 22.0);

    // Periodic supersonic Mach diamond shocks (4-6 periodic shock disks)
    float diamondFreq = 16.0;
    float diamondPattern = sin(y * diamondFreq - uTime * 4.0);
    float diamondIntensity = smoothstep(0.65, 0.98, diamondPattern) * (1.0 - y * 0.7);

    // Blinding white-hot core fading to intense golden-yellow rim
    vec3 coreWhite = vec3(1.0, 1.0, 1.0);
    vec3 flameYellow = vec3(1.0, 0.82, 0.45);
    vec3 shockBlueWhite = vec3(0.85, 0.92, 1.0);

    vec3 color = mix(shockBlueWhite, coreWhite, diamondIntensity);
    color = mix(color, flameYellow, y * 0.5);

    // Translucency & glow falloff towards edges
    float alpha = (1.0 - pow(y, 1.5)) * uThrust * 0.92;
    alpha += diamondIntensity * 0.35;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

export const EnginePlume: React.FC<EnginePlumeProps> = ({
  thrust,
  altitudeKm,
  qualityTier = 'high',
  positionY,
  pitchAngle,
}) => {
  const plumeGroupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const outerPlumeRef = useRef<THREE.Mesh>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);
  const smokePointsRef = useRef<THREE.Points>(null);

  // Compute tier-scaled particle counts (low: 1800, med: 3600, high: 5500)
  const particleCount = useMemo(() => {
    if (qualityTier === 'low') return 1800;
    if (qualityTier === 'med') return 3600;
    return 5500;
  }, [qualityTier]);

  // Particle data for smoke/soot billboards
  const smokeData = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const life = new Float32Array(particleCount);
    const maxLife = new Float32Array(particleCount);
    const size = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      life[i] = Math.random();
      maxLife[i] = 1.0 + Math.random() * 1.5;
      size[i] = 2.0 + Math.random() * 3.5;

      pos[i * 3] = (Math.random() - 0.5) * 1.2;
      pos[i * 3 + 1] = -1.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

      vel[i * 3] = (Math.random() - 0.5) * 4.0;
      vel[i * 3 + 1] = -12.0 - Math.random() * 25.0; // High downward thrust velocity
      vel[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
    }
    return { pos, vel, life, maxLife, size, count: particleCount };
  }, [particleCount]);

  // Mach diamond core uniforms
  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uThrust: { value: 0 },
    }),
    []
  );

  // Outer Plume PBR material with amber/orange additive translucency
  const outerPlumeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xf59842,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((state, delta) => {
    const activeThrust = thrust !== undefined ? thrust : liveTelemetry.engineThrust;
    const activeAltKm = altitudeKm !== undefined ? altitudeKm : liveTelemetry.altitudeKm;
    const altY =
      positionY !== undefined
        ? positionY
        : liveTelemetry.altitudeKm < 0.2
        ? liveTelemetry.altitudeKm * 1000.0
        : 200.0 + (liveTelemetry.altitudeKm - 0.2) * 16.0;
    const pitch = pitchAngle !== undefined ? pitchAngle : liveTelemetry.pitchAngle;
    const driftX = liveTelemetry.downrangeKm * 12.0;

    if (plumeGroupRef.current) {
      plumeGroupRef.current.position.y = altY;
      plumeGroupRef.current.position.x = driftX;
      plumeGroupRef.current.rotation.z = -pitch;
    }

    // Altitude under-expansion: Plume widens from 1.0x at sea level to 3.8x in the vacuum of space
    const altExpansion = 1.0 + Math.min(2.8, Math.pow(Math.min(80, activeAltKm) / 35.0, 1.4) * 2.5);
    const plumeLength = Math.max(0.1, activeThrust * (22.0 + altExpansion * 4.0));
    const plumeWidth = Math.max(0.1, activeThrust * (1.8 * altExpansion));

    // Update Mach diamond core
    if (coreMeshRef.current) {
      if (activeThrust > 0.03) {
        coreMeshRef.current.visible = true;
        coreMeshRef.current.scale.set(plumeWidth * 0.45, plumeLength * 0.75, plumeWidth * 0.45);
        coreMeshRef.current.position.y = -plumeLength * 0.37;
        coreUniforms.uTime.value = state.clock.getElapsedTime();
        coreUniforms.uThrust.value = activeThrust;
      } else {
        coreMeshRef.current.visible = false;
      }
    }

    // Update Outer Expansion Plume
    if (outerPlumeRef.current) {
      if (activeThrust > 0.03) {
        outerPlumeRef.current.visible = true;
        outerPlumeRef.current.scale.set(plumeWidth, plumeLength, plumeWidth);
        outerPlumeRef.current.position.y = -plumeLength * 0.5;
        // As plume expands in thin air, it becomes more translucent
        outerPlumeMat.opacity = Math.max(0.25, (0.75 / altExpansion) * activeThrust);
      } else {
        outerPlumeRef.current.visible = false;
      }
    }

    // High-intensity flickering engine illumination
    if (engineLightRef.current) {
      if (activeThrust > 0.02) {
        const flicker = 1.0 + Math.sin(state.clock.getElapsedTime() * 55.0) * 0.08 + Math.cos(state.clock.getElapsedTime() * 85.0) * 0.04;
        engineLightRef.current.intensity = activeThrust * 6.5 * flicker;
      } else {
        engineLightRef.current.intensity = 0;
      }
    }

    // Animate GPU Smoke Billboards
    if (smokePointsRef.current && activeThrust > 0.05) {
      const posAttr = smokePointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < smokeData.count; i++) {
        smokeData.life[i] += delta;

        if (smokeData.life[i] >= smokeData.maxLife[i]) {
          // Recycle to nozzle
          smokeData.life[i] = 0;
          arr[i * 3] = (Math.random() - 0.5) * 1.4;
          arr[i * 3 + 1] = -1.2;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 1.4;

          const spread = 2.0 + altExpansion * 1.5;
          smokeData.vel[i * 3] = (Math.random() - 0.5) * spread;
          smokeData.vel[i * 3 + 1] = -15.0 - Math.random() * 30.0 * activeThrust;
          smokeData.vel[i * 3 + 2] = (Math.random() - 0.5) * spread;
        } else {
          arr[i * 3] += smokeData.vel[i * 3] * delta;
          arr[i * 3 + 1] += smokeData.vel[i * 3 + 1] * delta;
          arr[i * 3 + 2] += smokeData.vel[i * 3 + 2] * delta;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={plumeGroupRef} position={[0, positionY ?? 0, 0]}>
      {/* 1. Supersonic White-Hot Core with Repeating Mach Diamond Shocks */}
      <mesh ref={coreMeshRef} position={[0, -5, 0]} visible={false}>
        <cylinderGeometry args={[0.5, 0.1, 10, 24]} />
        <shaderMaterial
          vertexShader={machDiamondVertexShader}
          fragmentShader={machDiamondFragmentShader}
          uniforms={coreUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Outer Directional Expansion Plume Body (Orange/Amber) */}
      <mesh ref={outerPlumeRef} position={[0, -8, 0]} material={outerPlumeMat} visible={false}>
        <coneGeometry args={[1.0, 1.0, 28, 1, true]} />
      </mesh>

      {/* 3. GPU Soot & Smoke Billboards */}
      <points ref={smokePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={smokeData.count}
            array={smokeData.pos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={3.8}
          color="#cf8e4e"
          transparent
          opacity={qualityTier === 'low' ? 0.22 : 0.38}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>

      {/* 4. High-Intensity Dynamic Engine Illumination */}
      <pointLight
        ref={engineLightRef}
        position={[0, -1.8, 0]}
        color="#ffa844"
        intensity={0}
        distance={75}
        decay={1.8}
      />
    </group>
  );
};
