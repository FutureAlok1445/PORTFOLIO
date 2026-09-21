import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { EarthGlobe } from '../earth/EarthGlobe';
import { DeepStarField } from '../stars/DeepStarField';
import { Satellite } from '../deploy/Satellite';
import { liveTelemetry } from '../missionStore';

// Waypoint data mapped 1:1 from verified internships in PORTFOLIO_DATA
const WAYPOINTS = [
  {
    id: 'ims',
    title: 'WAYPOINT 01 // IMS LEARNING RESOURCES',
    role: 'BACKEND REST APIS & ELASTICSEARCH',
    pos: [-12, 14, -28],
    color: '#38bdf8', // Cyan telemetry
  },
  {
    id: 'sapphire',
    title: 'WAYPOINT 02 // SAPPHIRE INFOCOM',
    role: 'FULL-STACK ARCHITECTURE & SECURE AUTH',
    pos: [4, 22, -62],
    color: '#c99a5e', // Amber telemetry
  },
  {
    id: 'techriciate',
    title: 'WAYPOINT 03 // TECHRICIATE TECHNOLOGIES',
    role: 'PRODUCTION WEB PLATFORMS & ADMIN CATALOGS',
    pos: [18, 30, -96],
    color: '#34d399', // Emerald telemetry
  },
];

export const TransferScene: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const earthGroupRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Group>(null);

  // 3D Spline Trajectory Curve
  const { curvePoints, curveLineGeo } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-24, 6, 8),    // Departure from LEO
      new THREE.Vector3(-12, 14, -28),  // Waypoint 1: IMS Learning
      new THREE.Vector3(4, 22, -62),    // Waypoint 2: Sapphire Infocom
      new THREE.Vector3(18, 30, -96),   // Waypoint 3: Techriciate
      new THREE.Vector3(32, 38, -145),  // Translunar injection horizon
    ]);

    const points = curve.getPoints(120);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return { curvePoints: points, curveLineGeo: geo };
  }, []);

  const trajectoryLine = useMemo(() => {
    const mat = new THREE.LineDashedMaterial({
      color: 0xc99a5e,
      dashSize: 3.5,
      gapSize: 2.0,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(curveLineGeo, mat);
    line.computeLineDistances();
    return line;
  }, [curveLineGeo]);

  useFrame(() => {
    const prog = liveTelemetry.progress;
    // Normalized progress across TRANSFER phase [0.52, 0.66]
    const t = Math.max(0, Math.min(1, (prog - 0.52) / 0.14));

    // 1. Earth Receding into Distance (Selling Translunar Departure)
    if (earthGroupRef.current) {
      const recedeDist = THREE.MathUtils.lerp(20, 220, Math.pow(t, 1.4));
      const dropY = THREE.MathUtils.lerp(64, 130, t);
      const scale = THREE.MathUtils.lerp(1.0, 0.28, t);

      earthGroupRef.current.position.set(-t * 25.0, -dropY, -recedeDist);
      earthGroupRef.current.scale.set(scale, scale, scale);
    }

    // 2. Satellite Moving along Trajectory Arc
    if (satelliteRef.current) {
      const satT = Math.min(1, t * 1.15);
      const ptIdx = Math.min(curvePoints.length - 1, Math.floor(satT * (curvePoints.length - 1)));
      const pos = curvePoints[ptIdx];

      satelliteRef.current.position.set(pos.x, pos.y, pos.z);
      satelliteRef.current.rotation.y = 0.5 + t * 0.45;
      satelliteRef.current.rotation.x = 0.18;
    }
  });

  return (
    <group name="transfer-scene">
      {/* 1. Deep Space Starfield */}
      <DeepStarField count={reducedMotion ? 4000 : 8000} />

      {/* 2. Receding Earth in Background */}
      <group ref={earthGroupRef} position={[0, -64, -20]}>
        <EarthGlobe radius={58} rotationSpeed={0.015} />
      </group>

      {/* 3. Glowing Dotted Trajectory Arc */}
      <primitive object={trajectoryLine} />

      {/* 4. Three Verified Internship Waypoint Beacons */}
      {WAYPOINTS.map((wp) => (
        <group key={wp.id} position={wp.pos as [number, number, number]}>
          {/* Central Waypoint Diamond Core */}
          <mesh rotation={[0.78, 0.78, 0]}>
            <octahedronGeometry args={[1.2, 0]} />
            <meshBasicMaterial color={wp.color} wireframe />
          </mesh>

          {/* Holographic Radar Horizon Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 2.35, 32]} />
            <meshBasicMaterial
              color={wp.color}
              transparent
              opacity={0.55}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Outer Pulsing Beacon Sphere */}
          <pointLight color={wp.color} intensity={2.2} distance={18} />
        </group>
      ))}

      {/* 5. Traveling SAHOO-1 Satellite */}
      <group ref={satelliteRef} scale={[0.48, 0.48, 0.48]}>
        <Satellite unfoldProgress={1} dishDeployProgress={1} rcsActive={false} />
      </group>

      {/* Directional Sun Light */}
      <directionalLight position={[100, 80, 100]} intensity={2.2} color="#fff2dc" />
    </group>
  );
};
