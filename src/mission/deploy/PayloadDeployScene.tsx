import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SkyDome } from '../environment/SkyDome';
import { StarField } from '../../components/hero/StarField';
import { Satellite } from './Satellite';
import { liveTelemetry } from '../missionStore';

export const PayloadDeployScene: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const satelliteRigRef = useRef<THREE.Group>(null);
  const recedingStageRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const prog = liveTelemetry.progress;
    // Normalized progress across DEPLOY phase [0.30, 0.36]
    const t = Math.max(0, Math.min(1, (prog - 0.30) / 0.06));

    // 1. Satellite Spring Separation & Slow Majestic Attitude Spin (Microgravity physics)
    if (satelliteRigRef.current) {
      // Gentle forward spring separation displacement along Z from PAF
      const forwardZ = t * 8.0;
      const posX = 1.8;
      satelliteRigRef.current.position.set(posX, 60.2, forwardZ);

      // Slow, heavy stabilizing roll in microgravity (no snapping, space mass)
      // 3/4 beauty yaw so front decal, gold MLI, and solar wings catch the sun and look at camera
      satelliteRigRef.current.rotation.y = 0.42 + t * 0.25;
      satelliteRigRef.current.rotation.x = 0.08 + Math.sin(t * Math.PI) * 0.04;
      satelliteRigRef.current.rotation.z = -0.06;
    }

    // 2. Second Stage Receding into Deep Space Background (Selling Monumental Scale)
    if (recedingStageRef.current) {
      const recedeDist = 12.0 + t * 92.0; // Recedes by over 100m into distance
      const recedeDrop = t * 24.0;
      recedingStageRef.current.position.set(0.6, 60.2 - recedeDrop, -recedeDist);
      recedingStageRef.current.rotation.x = t * 0.12;
      recedingStageRef.current.rotation.y = -t * 0.08;
    }
  });

  return (
    <group name="payload-deploy-scene">
      <SkyDome />
      <StarField count={reducedMotion ? 600 : 1400} />

      {/* Earth Curved Atmospheric Limb in Orbital Background at 500 km LEO */}
      <mesh position={[0, -180, -70]} rotation={[0.22, 0, 0]}>
        <sphereGeometry args={[200, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.28]} />
        <meshBasicMaterial
          color="#153664"
          transparent
          opacity={0.32}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Earth Albedo Upwelling Light (Blue-white orbital reflection from planet below) */}
      <directionalLight position={[-10, -25, 30]} intensity={1.8} color="#9ec5ff" />
      <pointLight position={[3.8, 62.0, 8.0]} intensity={2.2} color="#fff2dc" distance={35} />

      {/* 1. Hero Satellite ("SAHOO-1") in Close-up Tracking View */}
      <group ref={satelliteRigRef} position={[1.8, 60.2, 0]} scale={[0.72, 0.72, 0.72]}>
        <Satellite />
      </group>

      {/* 2. Receding Upper Stage in Background (Selling Monumental Scale) */}
      <group ref={recedingStageRef} position={[0.6, 60.2, -12.0]} scale={[0.72, 0.72, 0.72]}>
        {/* Spent Second Stage Cylinder */}
        <mesh position={[0, -7.5, 0]}>
          <cylinderGeometry args={[1.85, 1.85, 9.0, 36]} />
          <meshStandardMaterial color={0xedf0f5} roughness={0.32} metalness={0.45} />
        </mesh>
        {/* Empty Conical Payload Adapter Ring (PAF) */}
        <mesh position={[0, -2.5, 0]}>
          <cylinderGeometry args={[1.1, 1.85, 2.0, 36]} />
          <meshStandardMaterial color={0x14171e} roughness={0.65} metalness={0.5} />
        </mesh>
        {/* Expended Vacuum Engine Bell (SECO: no flame) */}
        <mesh position={[0, -13.0, 0]}>
          <cylinderGeometry args={[0.35, 1.45, 2.6, 28]} />
          <meshStandardMaterial color={0x181a20} roughness={0.2} metalness={0.94} />
        </mesh>
      </group>
    </group>
  );
};
