import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface LaunchPadProps {
  armRetract?: number; // [0, 1] 0 = connected, 1 = fully retracted
}

export const LaunchPad = ({ armRetract = 0 }: LaunchPadProps) => {
  const serviceArmRef = useRef<THREE.Group>(null);
  const upperArmRef = useRef<THREE.Group>(null);

  const steelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x22262e,
        roughness: 0.65,
        metalness: 0.55,
      }),
    []
  );

  const trussMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x363b46,
        roughness: 0.5,
        metalness: 0.7,
      }),
    []
  );

  const concreteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x0f1115,
        roughness: 0.95,
        metalness: 0.1,
      }),
    []
  );

  useFrame(() => {
    // Retract service arms upon liftoff command
    const retractAngle = armRetract * (Math.PI * 0.45);
    if (serviceArmRef.current) {
      serviceArmRef.current.rotation.y = -retractAngle;
    }
    if (upperArmRef.current) {
      upperArmRef.current.rotation.y = -retractAngle * 0.85;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* Ground Foundation Slab */}
      <mesh position={[0, -2.5, 0]} material={concreteMat} receiveShadow>
        <cylinderGeometry args={[22, 25, 4, 32]} />
      </mesh>

      {/* Main Elevated Launch Mount Platform */}
      <mesh position={[0, -0.4, 0]} material={steelMat} receiveShadow>
        <cylinderGeometry args={[5.2, 5.8, 1.2, 32]} />
      </mesh>

      {/* Launch Mount Ring Support */}
      <mesh position={[0, 0.25, 0]} material={trussMat}>
        <torusGeometry args={[2.6, 0.22, 8, 32]} />
      </mesh>

      {/* Flame Trench Opening */}
      <mesh position={[0, -1.8, 4]}>
        <boxGeometry args={[3.2, 2.5, 12]} />
        <meshStandardMaterial color={0x08090c} roughness={0.98} metalness={0.05} />
      </mesh>

      {/* Flame Deflector Wedge */}
      <mesh position={[0, -0.9, 1.8]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[3.4, 0.4, 3.2]} />
        <meshStandardMaterial color={0x2a2016} roughness={0.8} metalness={0.4} />
      </mesh>

      {/* Launch Umbilical Tower (LUT) Structure */}
      <group position={[-4.5, 0, -1.5]}>
        {/* Tower Truss Tiers (7 stacked box truss sections) */}
        {[0, 1, 2, 3, 4, 5, 6].map((tier) => {
          const y = tier * 2.8 + 1.4;
          return (
            <group key={`tier-${tier}`} position={[0, y, 0]}>
              {/* Solid structural inner core */}
              <mesh material={trussMat}>
                <boxGeometry args={[1.8, 2.7, 1.8]} />
              </mesh>
              {/* Perimeter framing line cage */}
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(1.85, 2.75, 1.85)]} />
                <lineBasicMaterial color={0x656d7a} transparent opacity={0.35} />
              </lineSegments>
            </group>
          );
        })}

        {/* Crane Arm at Tower Top */}
        <mesh position={[2.2, 20.2, 0]} material={trussMat}>
          <boxGeometry args={[4.8, 0.35, 0.45]} />
        </mesh>

        {/* Lower Service Arm (Retractable) */}
        <group ref={serviceArmRef} position={[0.9, 5.2, 0]}>
          <mesh position={[1.8, 0, 0]} material={trussMat}>
            <boxGeometry args={[3.4, 0.28, 0.35]} />
          </mesh>
          <mesh position={[3.3, 0, 0]} material={steelMat}>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 12]} />
          </mesh>
        </group>

        {/* Upper Crew/Service Access Arm (Retractable) */}
        <group ref={upperArmRef} position={[0.9, 12.8, 0]}>
          <mesh position={[1.8, 0, 0]} material={trussMat}>
            <boxGeometry args={[3.4, 0.28, 0.35]} />
          </mesh>
        </group>

        {/* Red Tower Aviation Warning Beacon */}
        <mesh position={[0, 21.2, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color={0xee4444} />
        </mesh>
      </group>

      {/* Practical Launch Pad Floodlights */}
      {[0, 1, 2, 3, 4, 5].map((idx) => {
        const angle = (idx * Math.PI * 2) / 6;
        const x = Math.cos(angle) * 11;
        const z = Math.sin(angle) * 11;
        return (
          <group key={`pole-${idx}`} position={[x, 0, z]}>
            {/* Pole */}
            <mesh position={[0, 3.2, 0]} material={trussMat}>
              <cylinderGeometry args={[0.08, 0.12, 6.4, 8]} />
            </mesh>
            {/* Floodlight Fixture */}
            <mesh position={[0, 6.5, 0]}>
              <boxGeometry args={[0.35, 0.25, 0.25]} />
              <meshStandardMaterial color={0x444b55} />
            </mesh>
            {/* Targeted floodlight aiming back at launch mount */}
            <pointLight
              position={[0, 6.4, 0]}
              color={0xe6eef8}
              intensity={0.6}
              distance={28}
              decay={2}
            />
          </group>
        );
      })}
    </group>
  );
};
