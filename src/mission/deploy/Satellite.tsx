import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { liveTelemetry } from '../missionStore';

interface SatelliteProps {
  unfoldProgress?: number; // 0 = stowed, 1 = fully deployed (if omitted, reads liveTelemetry)
  dishDeployProgress?: number; // 0 = stowed against bus, 1 = locked to Earth
  rcsActive?: boolean;
}

// Procedural Canvas Crinkle Normal Map for Gold MLI Thermal Foil
function getMliCrinkleNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(256, 256);
  const data = imgData.data;

  // Generate faceted, multi-frequency wrinkles characteristic of spacecraft thermal insulation
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const idx = (y * 256 + x) * 4;
      const n1 = Math.sin(x * 0.18 + Math.cos(y * 0.22) * 2.5);
      const n2 = Math.cos(y * 0.19 + Math.sin(x * 0.25) * 2.2);
      const n3 = Math.sin((x + y) * 0.35) * 0.5;

      const nx = THREE.MathUtils.clamp(128 + (n1 + n3) * 52, 0, 255);
      const ny = THREE.MathUtils.clamp(128 + (n2 + n3) * 52, 0, 255);
      const nz = 225; // Forward-biased surface normal

      data[idx] = nx;
      data[idx + 1] = ny;
      data[idx + 2] = nz;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// Procedural Canvas Texture for High-Resolution Solar Cell Grid
function getSolarPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep space photovoltaic dark blue background
  ctx.fillStyle = '#0a1a36';
  ctx.fillRect(0, 0, 512, 512);

  // Solar cell wafer grid (6x12 cells)
  const cols = 6;
  const rows = 12;
  const cellW = 512 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Silicon cell body
      ctx.fillStyle = '#112b58';
      ctx.fillRect(c * cellW + 3, r * cellH + 3, cellW - 6, cellH - 6);

      // Micro grid lines
      ctx.strokeStyle = '#274b88';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(c * cellW + 3, r * cellH + 3, cellW - 6, cellH - 6);

      // Silver busbar conductor lines (procedural white grid lines)
      ctx.strokeStyle = 'rgba(235, 242, 255, 0.9)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(c * cellW + cellW / 2, r * cellH + 3);
      ctx.lineTo(c * cellW + cellW / 2, r * cellH + cellH - 3);
      ctx.stroke();

      // Transverse silver grid fingers
      ctx.strokeStyle = 'rgba(200, 220, 255, 0.4)';
      ctx.lineWidth = 0.8;
      for (let f = 1; f < 4; f++) {
        const fy = r * cellH + (cellH / 4) * f;
        ctx.beginPath();
        ctx.moveTo(c * cellW + 5, fy);
        ctx.lineTo(c * cellW + cellW - 5, fy);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Procedural Texture for Mission Decal ("SAHOO-1" + "AKS" initials badge)
function getMissionDecalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0e1117';
  ctx.fillRect(0, 0, 1024, 512);

  // Outer gold double-border frame
  ctx.strokeStyle = '#d4a259';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 984, 472);
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 960, 448);

  // Primary Decal Header: SAHOO-1
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 100px monospace';
  ctx.fillText('SAHOO-1', 60, 145);

  // Subtitle
  ctx.fillStyle = '#d4a259';
  ctx.font = '36px monospace';
  ctx.fillText('COMMUNICATION & TELEMETRY BUS', 60, 210);

  // Divider rule
  ctx.strokeStyle = 'rgba(212, 162, 89, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 250);
  ctx.lineTo(960, 250);
  ctx.stroke();

  // Personal Initials Badge (AKS)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px monospace';
  ctx.fillText('REG: AKS-2026', 60, 320);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '32px monospace';
  ctx.fillText('FLIGHT ID: LEO-MISSION // PAYLOAD OPERATOR: ALOK KUMAR SAHOO', 60, 380);

  // Corner tech markings
  ctx.fillStyle = '#d4a259';
  ctx.font = '24px monospace';
  ctx.fillText('[FLIGHT QUALIFIED // SEC-LEO-01]', 60, 435);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// power2.inOut easing function
function power2InOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Damped spring overshoot settling near deployment completion
function dampedOvershoot(t: number): number {
  return t > 0.82 ? Math.sin((t - 0.82) * Math.PI * 6.5) * 0.05 * (1.0 - t) : 0;
}

export const Satellite: React.FC<SatelliteProps> = ({
  unfoldProgress,
  dishDeployProgress,
  rcsActive,
}) => {
  // Articulated 3-segment wings: Root, Mid, Tip hinges
  const portSeg1Ref = useRef<THREE.Group>(null);
  const portSeg2Ref = useRef<THREE.Group>(null);
  const portSeg3Ref = useRef<THREE.Group>(null);

  const stbdSeg1Ref = useRef<THREE.Group>(null);
  const stbdSeg2Ref = useRef<THREE.Group>(null);
  const stbdSeg3Ref = useRef<THREE.Group>(null);

  const dishBoomRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const rcsPuffRef = useRef<THREE.Group>(null);

  const crinkleNormal = useMemo(() => getMliCrinkleNormalMap(), []);

  // Gold Multi-Layer Insulation (MLI) Thermal Foil Material
  const goldMliMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xedab3b,
        roughness: 0.26,
        metalness: 0.98,
        normalMap: crinkleNormal,
        normalScale: new THREE.Vector2(0.75, 0.75),
      }),
    [crinkleNormal]
  );

  const silverRadiatorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xdfe4ec,
        roughness: 0.2,
        metalness: 0.95,
      }),
    []
  );

  const darkHardwareMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x14161c,
        roughness: 0.6,
        metalness: 0.8,
      }),
    []
  );

  const solarCellTexture = useMemo(() => getSolarPanelTexture(), []);
  const decalTexture = useMemo(() => getMissionDecalTexture(), []);

  const solarPanelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: solarCellTexture,
        roughness: 0.15,
        metalness: 0.85,
      }),
    [solarCellTexture]
  );

  const decalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: decalTexture,
        roughness: 0.25,
        metalness: 0.3,
        bumpScale: 0.02,
      }),
    [decalTexture]
  );

  useFrame((state) => {
    // Determine target progress: either from props or continuously from liveTelemetry
    let p = unfoldProgress ?? 1;
    let dP = dishDeployProgress ?? 1;
    let isRcsFiring = rcsActive ?? false;

    if (unfoldProgress === undefined) {
      const prog = liveTelemetry.progress;
      // DEPLOY phase span [0.30, 0.36]
      const t = Math.max(0, Math.min(1, (prog - 0.30) / 0.06));
      p = t < 0.22 ? 0 : Math.min(1.0, (t - 0.22) / 0.50);
      dP = t < 0.62 ? 0 : Math.min(1.0, (t - 0.62) / 0.34);
      isRcsFiring = (t > 0.18 && t < 0.28) || (t > 0.66 && t < 0.78);
    }

    // 1. Sequential Wing Unfolding (3 segments rotate one after another with power2.inOut + damped overshoot)
    // Segment 1 (Root hinge): p in [0.0, 0.45]
    const t1 = Math.max(0, Math.min(1, p / 0.45));
    const ease1 = power2InOut(t1) + dampedOvershoot(t1);
    const angle1 = (1.0 - ease1) * (Math.PI * 0.5); // 90 deg folded flush to bus -> 0 deg deployed

    // Segment 2 (Mid hinge): p in [0.30, 0.75]
    const t2 = Math.max(0, Math.min(1, (p - 0.30) / 0.45));
    const ease2 = power2InOut(t2) + dampedOvershoot(t2);
    const angle2 = (1.0 - ease2) * Math.PI; // 180 deg folded accordion -> 0 deg flat

    // Segment 3 (Tip hinge): p in [0.60, 1.00]
    const t3 = Math.max(0, Math.min(1, (p - 0.60) / 0.40));
    const ease3 = power2InOut(t3) + dampedOvershoot(t3);
    const angle3 = (1.0 - ease3) * -Math.PI; // -180 deg folded accordion -> 0 deg flat

    // Port Wing Segments
    if (portSeg1Ref.current) portSeg1Ref.current.rotation.y = angle1;
    if (portSeg2Ref.current) portSeg2Ref.current.rotation.y = angle2;
    if (portSeg3Ref.current) portSeg3Ref.current.rotation.y = angle3;

    // Starboard Wing Segments
    if (stbdSeg1Ref.current) stbdSeg1Ref.current.rotation.y = -angle1;
    if (stbdSeg2Ref.current) stbdSeg2Ref.current.rotation.y = -angle2;
    if (stbdSeg3Ref.current) stbdSeg3Ref.current.rotation.y = -angle3;

    // 2. Parabolic Dish Boom Extension & Earth Lock Gimbal
    const dPClamped = Math.max(0, Math.min(1, dP));
    const dishEase = power2InOut(dPClamped);
    if (dishBoomRef.current) {
      dishBoomRef.current.rotation.x = dishEase * (Math.PI * 0.45);
    }
    if (dishRef.current) {
      dishRef.current.rotation.y = dishEase * (Math.PI * 0.3);
    }

    // 3. RCS Cold-Gas Thruster Puffs
    if (rcsPuffRef.current) {
      const puffPulse = isRcsFiring || Math.sin(state.clock.getElapsedTime() * 14.0) > 0.88;
      rcsPuffRef.current.visible = puffPulse;
    }
  });

  return (
    <group name="hero-satellite-sahoo-1">
      {/* 1. Primary Satellite Bus (Gold MLI thermal foil with crinkle normal map) */}
      <mesh material={goldMliMat} castShadow>
        <boxGeometry args={[1.6, 2.7, 1.6]} />
      </mesh>

      {/* Silver Radiator Panel (Earth-facing side) */}
      <mesh position={[0, 0, 0.81]} material={silverRadiatorMat}>
        <boxGeometry args={[1.45, 2.5, 0.02]} />
      </mesh>

      {/* Hero Mission Decal Plate ("SAHOO-1" + "AKS") - Forward Face */}
      <mesh position={[0, 0.45, 0.82]} material={decalMat}>
        <planeGeometry args={[1.3, 0.65]} />
      </mesh>

      {/* Hero Mission Decal Plate ("SAHOO-1" + "AKS") - Sunward Lateral Face */}
      <mesh position={[0.82, 0.45, 0]} rotation={[0, Math.PI / 2, 0]} material={decalMat}>
        <planeGeometry args={[1.3, 0.65]} />
      </mesh>

      {/* 2. Star Tracker Sensor Baffles (Apex) */}
      <group position={[0, 1.4, 0]}>
        <mesh position={[-0.3, 0.22, 0.2]} rotation={[0.3, 0.2, 0]} material={darkHardwareMat}>
          <cylinderGeometry args={[0.08, 0.13, 0.45, 16]} />
        </mesh>
        <mesh position={[0.3, 0.22, -0.2]} rotation={[-0.3, -0.2, 0]} material={darkHardwareMat}>
          <cylinderGeometry args={[0.08, 0.13, 0.45, 16]} />
        </mesh>
      </group>

      {/* 3. Four Corner Cold-Gas / Hydrazine RCS Thruster Quad Blocks */}
      {[
        [-0.82, 1.15, -0.82],
        [0.82, 1.15, -0.82],
        [-0.82, -1.15, 0.82],
        [0.82, -1.15, 0.82],
      ].map(([x, y, z], idx) => (
        <group key={`rcs-block-${idx}`} position={[x, y, z]}>
          <mesh material={darkHardwareMat}>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
          </mesh>
          <mesh position={[0.09, 0, 0]} rotation={[0, 0, -Math.PI / 2]} material={darkHardwareMat}>
            <coneGeometry args={[0.035, 0.1, 8]} />
          </mesh>
        </group>
      ))}

      {/* Active RCS Cold-Gas Puff Cones */}
      <group ref={rcsPuffRef} visible={false}>
        <mesh position={[0.96, 1.15, -0.82]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.4, 8, 1, true]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[-0.96, -1.15, 0.82]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.4, 8, 1, true]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 4. High-Gain Parabolic Dish Antenna with Articulated Boom */}
      <group position={[0, -1.4, 0]}>
        {/* Boom Base Hinge */}
        <mesh material={darkHardwareMat}>
          <boxGeometry args={[0.26, 0.16, 0.26]} />
        </mesh>

        {/* Articulated Extension Boom */}
        <group ref={dishBoomRef}>
          <mesh position={[0, -0.65, 0]} material={darkHardwareMat}>
            <cylinderGeometry args={[0.045, 0.045, 1.3, 12]} />
          </mesh>

          {/* Gimbaled Parabolic Reflector Assembly */}
          <group ref={dishRef} position={[0, -1.35, 0]}>
            {/* Parabolic Dish Dish Shell (~1.4m diameter) */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={silverRadiatorMat}>
              <sphereGeometry args={[0.72, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3]} />
            </mesh>
            {/* Gold Central Feed Horn & Struts */}
            <mesh position={[0, 0, -0.4]} material={goldMliMat}>
              <coneGeometry args={[0.07, 0.28, 8]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* 5. Dual Articulated Multi-Segment Solar Array Wings */}
      {/* Port Solar Wing (3 Segments with Articulated Hinges) */}
      <group position={[-0.8, 0, 0]}>
        {/* Root Hinge (Segment 1) */}
        <group ref={portSeg1Ref}>
          <mesh position={[-1.1, 0, 0]} material={solarPanelMat} castShadow>
            <boxGeometry args={[2.2, 1.25, 0.04]} />
          </mesh>

          {/* Mid Hinge (Segment 2) */}
          <group ref={portSeg2Ref} position={[-2.2, 0, 0]}>
            <mesh position={[-1.1, 0, 0]} material={solarPanelMat} castShadow>
              <boxGeometry args={[2.2, 1.25, 0.04]} />
            </mesh>

            {/* Tip Hinge (Segment 3) */}
            <group ref={portSeg3Ref} position={[-2.2, 0, 0]}>
              <mesh position={[-1.1, 0, 0]} material={solarPanelMat} castShadow>
                <boxGeometry args={[2.2, 1.25, 0.04]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Starboard Solar Wing (3 Segments with Articulated Hinges) */}
      <group position={[0.8, 0, 0]}>
        {/* Root Hinge (Segment 1) */}
        <group ref={stbdSeg1Ref}>
          <mesh position={[1.1, 0, 0]} material={solarPanelMat} castShadow>
            <boxGeometry args={[2.2, 1.25, 0.04]} />
          </mesh>

          {/* Mid Hinge (Segment 2) */}
          <group ref={stbdSeg2Ref} position={[2.2, 0, 0]}>
            <mesh position={[1.1, 0, 0]} material={solarPanelMat} castShadow>
              <boxGeometry args={[2.2, 1.25, 0.04]} />
            </mesh>

            {/* Tip Hinge (Segment 3) */}
            <group ref={stbdSeg3Ref} position={[2.2, 0, 0]}>
              <mesh position={[1.1, 0, 0]} material={solarPanelMat} castShadow>
                <boxGeometry args={[2.2, 1.25, 0.04]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

