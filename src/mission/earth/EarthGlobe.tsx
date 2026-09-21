import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  createEarthDayTexture,
  createEarthNightTexture,
  createEarthCloudTexture,
  createEarthSpecularTexture,
} from './earthTextures';
import { EarthSurfaceShader, AtmosphereShader } from './EarthShaders';
import { SHARED_SUN_DIRECTION } from '../environment/SkyDome';
import { useMissionStore } from '../missionStore';

interface EarthGlobeProps {
  radius?: number;
  rotationSpeed?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  focusIndia?: boolean;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  radius = 60,
  rotationSpeed = 0.02,
  position = [0, -68, -15],
  rotation = [0.38, 0, 0], // Inclined Earth axial tilt (~23.5 deg + orbital inclination)
  focusIndia = false,
}) => {
  const globeGroupRef = useRef<THREE.Group>(null);
  const cloudMeshRef = useRef<THREE.Mesh>(null);
  const surfaceMatRef = useRef<THREE.ShaderMaterial>(null);
  const atmosphereMatRef = useRef<THREE.ShaderMaterial>(null);

  const qualityTier = useMissionStore((state) => state.qualityTier);

  // Resolution based on hardware quality tier
  const texRes = useMemo(() => {
    if (qualityTier === 'low') return { w: 512, h: 256, seg: 32 };
    if (qualityTier === 'med') return { w: 1024, h: 512, seg: 48 };
    return { w: 2048, h: 1024, seg: 64 };
  }, [qualityTier]);

  // Generate procedural textures
  const dayTex = useMemo(() => createEarthDayTexture(texRes.w, texRes.h), [texRes]);
  const nightTex = useMemo(() => createEarthNightTexture(texRes.w, texRes.h), [texRes]);
  const cloudTex = useMemo(() => createEarthCloudTexture(texRes.w, texRes.h), [texRes]);
  const specTex = useMemo(() => createEarthSpecularTexture(texRes.w / 2, texRes.h / 2), [texRes]);

  // Sun direction uniform vector
  const sunDirVec = useMemo(
    () => new THREE.Vector3(SHARED_SUN_DIRECTION.x, SHARED_SUN_DIRECTION.y, SHARED_SUN_DIRECTION.z).normalize(),
    []
  );

  // Surface shader uniforms
  const surfaceUniforms = useMemo(
    () => ({
      uDayMap: { value: dayTex },
      uNightMap: { value: nightTex },
      uCloudMap: { value: cloudTex },
      uSpecularMap: { value: specTex },
      uSunDirection: { value: sunDirVec },
      uTime: { value: 0 },
    }),
    [dayTex, nightTex, cloudTex, specTex, sunDirVec]
  );

  // Atmosphere shader uniforms
  const atmosphereUniforms = useMemo(
    () => ({
      uSunDirection: { value: sunDirVec },
    }),
    [sunDirVec]
  );

  // Cloud material
  const cloudMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.82,
        blending: THREE.NormalBlending,
        roughness: 0.9,
        metalness: 0.05,
      }),
    [cloudTex]
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // 1. Earth Globe Axial Rotation
    if (globeGroupRef.current) {
      // If focusIndia is true, orient towards Indian subcontinent (lon ~73°E, lat ~19°N)
      const baseRotation = focusIndia ? Math.PI * 0.72 : Math.PI * 0.35;
      globeGroupRef.current.rotation.y = baseRotation + elapsed * (rotationSpeed * 0.3);
    }

    // 2. Separate Cloud Shell (Rotates slightly faster than surface)
    if (cloudMeshRef.current) {
      cloudMeshRef.current.rotation.y = elapsed * (rotationSpeed * 0.45);
    }

    // 3. Update surface shader time
    if (surfaceMatRef.current) {
      surfaceMatRef.current.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <group ref={globeGroupRef}>
        {/* 1. Primary Earth Surface Sphere */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[radius, texRes.seg, texRes.seg]} />
          <shaderMaterial
            ref={surfaceMatRef}
            vertexShader={EarthSurfaceShader.vertexShader}
            fragmentShader={EarthSurfaceShader.fragmentShader}
            uniforms={surfaceUniforms}
          />
        </mesh>

        {/* 2. Separate Cloud Shell (Slightly larger, rotating faster) */}
        <mesh ref={cloudMeshRef}>
          <sphereGeometry args={[radius * 1.012, texRes.seg, texRes.seg]} />
          <primitive object={cloudMat} attach="material" />
        </mesh>
      </group>

      {/* 3. Rayleigh Atmosphere Shell (Back-face Fresnel with vibrant cyan-blue limb) */}
      <mesh>
        <sphereGeometry args={[radius * 1.036, texRes.seg, texRes.seg]} />
        <shaderMaterial
          ref={atmosphereMatRef}
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          uniforms={atmosphereUniforms}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
