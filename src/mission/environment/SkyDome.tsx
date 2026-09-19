import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { liveTelemetry } from '../missionStore';

// Shared Sun Direction uniform used across Sky, Earth, Cloud decks and Rocket lighting
// Dawn golden-hour: low elevation (~12 deg), azimuth slightly south-east
export const SHARED_SUN_DIRECTION = new THREE.Vector3(120, 24, -90).normalize();
export const DAWN_SUN_COLOR = new THREE.Color(0xffe8c8);
export const DAWN_SKY_COLOR = new THREE.Color(0x0c1b36);
export const DAWN_HORIZON_COLOR = new THREE.Color(0xf69c64);

const skyVertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vRayDirection;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vRayDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = `
  uniform vec3 uSunDirection;
  uniform float uAltitudeKm;
  uniform float uTime;

  varying vec3 vWorldPosition;
  varying vec3 vRayDirection;

  void main() {
    vec3 ray = normalize(vRayDirection);
    vec3 sun = normalize(uSunDirection);

    // Height angle: 0 at horizon, 1 at zenith, -1 at nadir
    float elevation = ray.y;

    // Atmospheric density falls off exponentially with altitude (Scale height ~8.5 km)
    float atmDensity = exp(-uAltitudeKm / 8.5);

    // Dawn color palettes
    vec3 zenithDawn = vec3(0.045, 0.09, 0.21);      // Deep sapphire/indigo zenith
    vec3 horizonDawn = vec3(0.96, 0.58, 0.36);     // Warm peach/amber horizon
    vec3 horizonGlow = vec3(1.0, 0.78, 0.52);     // Golden morning sun-facing mist
    vec3 spaceBlack = vec3(0.018, 0.022, 0.03);    // Void of orbital space
    vec3 limbBlue = vec3(0.25, 0.65, 1.0);         // Planetary atmospheric limb glow

    // Sun angle calculation (Mie scattering halo around the sun)
    float cosTheta = dot(ray, sun);
    float sunHalo = pow(max(0.0, cosTheta), 8.0) * 0.55;
    float sunDisk = smoothstep(0.9992, 0.9998, cosTheta) * 6.0;

    // Gradient based on elevation angle
    float horizonMix = smoothstep(-0.02, 0.45, elevation);
    vec3 skyGroundLevel = mix(horizonDawn, zenithDawn, horizonMix);

    // Add sun forward scattering to horizon
    float sunFacing = max(0.0, cosTheta);
    skyGroundLevel += horizonGlow * pow(sunFacing, 3.0) * 0.4 * (1.0 - horizonMix);

    // Blend into space black as altitude climbs
    vec3 skyAtAltitude = mix(spaceBlack, skyGroundLevel, clamp(atmDensity, 0.0, 1.0));

    // Thin curved blue atmospheric limb appears when looking toward the horizon from high altitude
    if (uAltitudeKm > 15.0) {
      float limbFactor = smoothstep(0.0, 0.08, abs(elevation)) * (1.0 - smoothstep(0.08, 0.25, abs(elevation)));
      float limbIntensity = (1.0 - atmDensity) * 0.65;
      skyAtAltitude += limbBlue * limbFactor * limbIntensity;
    }

    // Add glowing sun disk and soft glare
    vec3 finalColor = skyAtAltitude + vec3(1.0, 0.95, 0.85) * (sunDisk + sunHalo * (0.3 + 0.7 * atmDensity));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface SkyDomeProps {
  radius?: number;
}

export const SkyDome: React.FC<SkyDomeProps> = ({ radius = 1000 }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uSunDirection: { value: SHARED_SUN_DIRECTION },
      uAltitudeKm: { value: 0.0 },
      uTime: { value: 0.0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uAltitudeKm.value = liveTelemetry.altitudeKm;
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh name="atmospheric-skydome">
      <sphereGeometry args={[radius, 32, 24]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
};
