import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SkyDome } from '../environment/SkyDome';
import { StarField } from '../../components/hero/StarField';
import { Satellite } from '../deploy/Satellite';
import { liveTelemetry } from '../missionStore';

// Procedural Acoustic Foam / Waffle Normal Map for Fairing Interior Insulation
function getAcousticFoamNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(128, 128);
  const data = imgData.data;

  // Diamond-waffle quilted acoustic insulation blanket pattern
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const idx = (y * 128 + x) * 4;
      const gx = (x % 16) - 8;
      const gy = (y % 16) - 8;
      const dist = Math.sqrt(gx * gx + gy * gy);
      const bevel = Math.sin((dist / 8) * Math.PI * 0.5);

      data[idx] = THREE.MathUtils.clamp(128 + gx * 8 * bevel, 0, 255);
      data[idx + 1] = THREE.MathUtils.clamp(128 + gy * 8 * bevel, 0, 255);
      data[idx + 2] = 230;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 12);
  return texture;
}

export const FairingSeparationScene: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const portHingeRef = useRef<THREE.Group>(null);
  const stbdHingeRef = useRef<THREE.Group>(null);
  const secondStageRef = useRef<THREE.Group>(null);
  const vacuumPlumeRef = useRef<THREE.Mesh>(null);

  // Exterior clean white aerospace composite thermal coating
  const fairingExteriorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf0f3f8,
        roughness: 0.35,
        metalness: 0.4,
        side: THREE.DoubleSide,
      }),
    []
  );

  const acousticNormal = useMemo(() => getAcousticFoamNormalMap(), []);

  // Interior Golden-Orange Acoustic Foam Insulation Blanket (catches the dawn sun)
  const acousticInsulationMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xdf8222,
        roughness: 0.52,
        metalness: 0.75,
        normalMap: acousticNormal,
        normalScale: new THREE.Vector2(0.85, 0.85),
        side: THREE.DoubleSide,
      }),
    [acousticNormal]
  );

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

  const engineMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x181a20,
        roughness: 0.2,
        metalness: 0.94,
      }),
    []
  );

  const vacuumPlumeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x72a5ff,
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Half-cylindrical fairing clamshell shell (0 to PI)
  const fairingCylinderGeo = useMemo(() => {
    return new THREE.CylinderGeometry(1.9, 1.9, 8.5, 36, 1, true, 0, Math.PI);
  }, []);

  // Half-cone fairing nose shell (0 to PI)
  const fairingConeGeo = useMemo(() => {
    return new THREE.ConeGeometry(1.9, 4.4, 36, 1, true, 0, Math.PI);
  }, []);

  useFrame(() => {
    const prog = liveTelemetry.progress;
    // Normalized progress across FAIRING phase [0.25, 0.30]
    const t = Math.max(0, Math.min(1, (prog - 0.25) / 0.05));

    if (t < 0.15) {
      // Clamped together tight along seam line
      if (portHingeRef.current) {
        portHingeRef.current.position.set(-1.9, 57.0, 0);
        portHingeRef.current.rotation.set(0, 0, 0);
      }
      if (stbdHingeRef.current) {
        stbdHingeRef.current.position.set(1.9, 57.0, 0);
        stbdHingeRef.current.rotation.set(0, 0, 0);
      }
    } else {
      // Clamshell separation!
      const sepT = (t - 0.15) / 0.85;
      const angle = Math.pow(sepT, 1.25) * 1.35; // Hinge swings out to ~78 deg
      const driftX = sepT * 26.0;
      const fallBackY = Math.pow(sepT, 1.65) * 48.0;

      // Port Fairing Half drifts -X and rotates outward
      if (portHingeRef.current) {
        portHingeRef.current.position.set(-1.9 - driftX, 57.0 - fallBackY, 0);
        portHingeRef.current.rotation.z = angle;
        portHingeRef.current.rotation.y = sepT * 0.26;
        portHingeRef.current.rotation.x = sepT * 0.14;
      }

      // Starboard Fairing Half drifts +X and rotates outward
      if (stbdHingeRef.current) {
        stbdHingeRef.current.position.set(1.9 + driftX, 57.0 - fallBackY, 0);
        stbdHingeRef.current.rotation.z = -angle;
        stbdHingeRef.current.rotation.y = -sepT * 0.26;
        stbdHingeRef.current.rotation.x = sepT * 0.14;
      }
    }
  });

  return (
    <group name="fairing-separation-scene">
      <SkyDome />
      <StarField count={reducedMotion ? 500 : 1200} />

      {/* Earth Curved Atmospheric Horizon below at 110 km Karman altitude */}
      <mesh position={[0, -180, -70]} rotation={[0.22, 0, 0]}>
        <sphereGeometry args={[200, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.28]} />
        <meshBasicMaterial
          color="#153664"
          transparent
          opacity={0.35}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Second Stage & Revealed Satellite Stack */}
      <group ref={secondStageRef}>
        {/* Second Stage Interstage Skirt */}
        <mesh position={[0, 46.0, 0]} material={darkCompositeMat}>
          <cylinderGeometry args={[1.87, 1.87, 4.0, 36]} />
        </mesh>

        {/* Second Stage Fuel Tank */}
        <mesh position={[0, 52.5, 0]} material={whiteAlloyMat}>
          <cylinderGeometry args={[1.85, 1.85, 9.0, 36]} />
        </mesh>

        {/* Vacuum Engine Nozzle Bell */}
        <mesh position={[0, 43.2, 0]} material={engineMat}>
          <cylinderGeometry args={[0.35, 1.45, 2.6, 28]} />
        </mesh>

        {/* Conical Payload Attach Fitting (PAF) */}
        <mesh position={[0, 57.5, 0]} material={darkCompositeMat}>
          <cylinderGeometry args={[1.1, 1.85, 2.0, 36]} />
        </mesh>

        {/* Revealed Hero Satellite (Mounted atop PAF, stowed wings & dish) */}
        <group position={[0, 60.2, 0]} scale={[0.72, 0.72, 0.72]}>
          <Satellite unfoldProgress={0} dishDeployProgress={0} rcsActive={false} />
        </group>

        {/* Second Stage Vacuum Engine Plume */}
        <mesh ref={vacuumPlumeRef} position={[0, 33.5, 0]}>
          <coneGeometry args={[5.2, 17.5, 36, 1, true]} />
          <primitive object={vacuumPlumeMat} attach="material" />
        </mesh>

        <pointLight position={[0, 42.0, 0]} color="#7aaaff" intensity={3.5} distance={45} />
      </group>

      {/* 1. Port Fairing Clamshell Half (Pivoting outward from bottom port hinge [-1.9, 57.0, 0]) */}
      <group ref={portHingeRef} position={[-1.9, 57.0, 0]}>
        <group position={[1.9, 0, 0]}>
          {/* Exterior White Shell */}
          <mesh
            position={[0, 4.25, 0]}
            rotation={[0, Math.PI / 2, 0]}
            geometry={fairingCylinderGeo}
            material={fairingExteriorMat}
          />
          <mesh
            position={[0, 10.6, 0]}
            rotation={[0, Math.PI / 2, 0]}
            geometry={fairingConeGeo}
            material={fairingExteriorMat}
          />

          {/* Interior Acoustic Insulation Blanket (Warm gold glint in dawn sunlight) */}
          <mesh
            position={[0, 4.25, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            geometry={fairingCylinderGeo}
            material={acousticInsulationMat}
          />
          <mesh
            position={[0, 10.6, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            geometry={fairingConeGeo}
            material={acousticInsulationMat}
          />
        </group>
      </group>

      {/* 2. Starboard Fairing Clamshell Half (Pivoting outward from bottom stbd hinge [1.9, 57.0, 0]) */}
      <group ref={stbdHingeRef} position={[1.9, 57.0, 0]}>
        <group position={[-1.9, 0, 0]}>
          {/* Exterior White Shell */}
          <mesh
            position={[0, 4.25, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            geometry={fairingCylinderGeo}
            material={fairingExteriorMat}
          />
          <mesh
            position={[0, 10.6, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            geometry={fairingConeGeo}
            material={fairingExteriorMat}
          />

          {/* Interior Acoustic Insulation Blanket (Warm gold glint in dawn sunlight) */}
          <mesh
            position={[0, 4.25, 0]}
            rotation={[0, Math.PI / 2, 0]}
            geometry={fairingCylinderGeo}
            material={acousticInsulationMat}
          />
          <mesh
            position={[0, 10.6, 0]}
            rotation={[0, Math.PI / 2, 0]}
            geometry={fairingConeGeo}
            material={acousticInsulationMat}
          />
        </group>
      </group>
    </group>
  );
};
