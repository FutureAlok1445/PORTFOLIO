import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { liveTelemetry } from '../missionStore';

interface AerospaceRocketProps {
  positionY?: number;
  pitchAngle?: number; // Pitch-over gravity turn angle in radians
  downrangeX?: number; // Downrange lateral drift
  ventingVapor?: boolean; // Cryogenic LOX venting wisp active
}

export const AerospaceRocket: React.FC<AerospaceRocketProps> = ({
  positionY,
  pitchAngle,
  downrangeX,
  ventingVapor = true,
}) => {
  const rocketGroupRef = useRef<THREE.Group>(null);
  const ventParticlesRef = useRef<THREE.Points>(null);

  // High-fidelity aerospace PBR materials
  const whiteAlloyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xedf0f5,
        roughness: 0.32,
        metalness: 0.45,
      }),
    []
  );

  const graphiteCompositeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x14171e,
        roughness: 0.58,
        metalness: 0.5,
      }),
    []
  );

  const engineAlloyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x181b22,
        roughness: 0.18,
        metalness: 0.94,
      }),
    []
  );

  const frostMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.92,
        metalness: 0.05,
        transparent: true,
        opacity: 0.55,
      }),
    []
  );

  // Aerodynamic Payload Fairing Ogive Geometry (~13m height, 3.8m base diameter)
  const fairingGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const radius = 1.9 * Math.pow(t, 0.72);
      const y = 13.0 * (1 - t) + 57.0;
      pts.push(new THREE.Vector2(radius, y));
    }
    return new THREE.LatheGeometry(pts, 40);
  }, []);

  // Cryogenic LOX Vent Vapor Particle System
  const ventData = useMemo(() => {
    const count = 45;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      lifetimes[i] = Math.random();
      positions[i * 3] = 1.95; // Vent nozzle exit at edge of interstage
      positions[i * 3 + 1] = 55.0;
      positions[i * 3 + 2] = 0.0;

      velocities[i * 3] = 0.8 + Math.random() * 1.2; // Blow laterally +X
      velocities[i * 3 + 1] = -0.2 - Math.random() * 0.4; // Drift down slowly
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return { positions, velocities, lifetimes, count };
  }, []);

  useFrame((_, delta) => {
    if (rocketGroupRef.current) {
      const altY =
        positionY !== undefined
          ? positionY
          : liveTelemetry.altitudeKm < 0.2
          ? liveTelemetry.altitudeKm * 1000.0
          : 200.0 + (liveTelemetry.altitudeKm - 0.2) * 16.0;
      const pitch = pitchAngle !== undefined ? pitchAngle : liveTelemetry.pitchAngle;
      const driftX = downrangeX !== undefined ? downrangeX : liveTelemetry.downrangeKm * 12.0;

      rocketGroupRef.current.position.y = altY;
      rocketGroupRef.current.position.x = driftX;
      rocketGroupRef.current.rotation.z = -pitch;
    }

    // Animate cryogenic cold gas venting wisps
    if (ventParticlesRef.current && ventingVapor) {
      const posAttr = ventParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < ventData.count; i++) {
        ventData.lifetimes[i] += delta * 0.85;
        if (ventData.lifetimes[i] > 1.0) {
          ventData.lifetimes[i] = 0.0;
          arr[i * 3] = 1.95;
          arr[i * 3 + 1] = 55.0;
          arr[i * 3 + 2] = 0.0;
        } else {
          arr[i * 3] += ventData.velocities[i * 3] * delta;
          arr[i * 3 + 1] += ventData.velocities[i * 3 + 1] * delta;
          arr[i * 3 + 2] += ventData.velocities[i * 3 + 2] * delta;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={rocketGroupRef} position={[0, positionY ?? 0, 0]}>
      {/* 1. Payload Fairing Section (Y = 57m to 70m) */}
      <mesh geometry={fairingGeometry} material={whiteAlloyMat} castShadow />

      {/* Payload Fairing Vertical Split Seam & Decals */}
      <mesh position={[0, 60.5, 1.91]} material={graphiteCompositeMat}>
        <boxGeometry args={[0.04, 7.0, 0.02]} />
      </mesh>

      {/* 2. Upper Stage (Cryogenic LOX Tank) (Y = 48m to 57m) */}
      <mesh position={[0, 52.5, 0]} material={whiteAlloyMat} castShadow>
        <cylinderGeometry args={[1.85, 1.85, 9.0, 40]} />
      </mesh>

      {/* Cryogenic Frost / Condensation Streaks on Upper Tank */}
      <mesh position={[0, 53.0, 0]} material={frostMat}>
        <cylinderGeometry args={[1.86, 1.86, 6.5, 40]} />
      </mesh>

      {/* Cryogenic Vent Relief Port */}
      <mesh position={[1.88, 55.0, 0]} rotation={[0, 0, -Math.PI / 2]} material={graphiteCompositeMat}>
        <cylinderGeometry args={[0.08, 0.12, 0.25, 12]} />
      </mesh>

      {/* Cryogenic Vapor Venting Particles */}
      {ventingVapor && (
        <points ref={ventParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={ventData.count}
              array={ventData.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1.6}
            color="#ffffff"
            transparent
            opacity={0.35}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* 3. Interstage Section (Carbon composite) (Y = 43.5m to 48m) */}
      <mesh position={[0, 45.75, 0]} material={graphiteCompositeMat} castShadow>
        <cylinderGeometry args={[1.87, 1.87, 4.5, 40]} />
      </mesh>

      {/* Roll Pattern Decals (Telemetry Quadrant Markings on Interstage) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        const isBlack = i % 2 === 0;
        return (
          <mesh
            key={`roll-decal-${i}`}
            position={[Math.cos(angle) * 1.88, 45.75, Math.sin(angle) * 1.88]}
            rotation={[0, -angle, 0]}
            material={isBlack ? graphiteCompositeMat : whiteAlloyMat}
          >
            <boxGeometry args={[0.02, 2.2, 0.8]} />
          </mesh>
        );
      })}

      {/* 4 Titanium Hypersonic Grid Fins (at Y = 46.5m) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <group
            key={`grid-fin-${i}`}
            position={[Math.cos(angle) * 2.05, 46.5, Math.sin(angle) * 2.05]}
            rotation={[0, -angle, 0]}
          >
            {/* Fin Body Frame */}
            <mesh material={graphiteCompositeMat} castShadow>
              <boxGeometry args={[0.12, 1.8, 1.4]} />
            </mesh>
            {/* Aerodynamic Fin Axle */}
            <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={engineAlloyMat}>
              <cylinderGeometry args={[0.12, 0.12, 0.45, 12]} />
            </mesh>
          </group>
        );
      })}

      {/* 4. Booster Core Stage Tank (Y = 3.5m to 43.5m, 40 meters tall) */}
      <mesh position={[0, 23.5, 0]} material={whiteAlloyMat} castShadow receiveShadow>
        <cylinderGeometry args={[1.85, 1.85, 40.0, 40]} />
      </mesh>

      {/* Longitudinal Systems Cable Raceway Cover Along the Booster */}
      <mesh position={[1.88, 23.5, 0]} material={whiteAlloyMat}>
        <boxGeometry args={[0.1, 40.0, 0.35]} />
      </mesh>

      {/* 5. Four Folded Carbon Fiber Landing Legs (Y = 1.5m to 16m) */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        return (
          <group key={`landing-leg-${i}`} position={[Math.cos(angle) * 1.82, 8.5, Math.sin(angle) * 1.82]}>
            {/* Main Leg Strut */}
            <mesh rotation={[0.08 * Math.sin(angle), 0, 0.08 * Math.cos(angle)]} material={graphiteCompositeMat} castShadow>
              <boxGeometry args={[0.18, 14.5, 0.38]} />
            </mesh>
          </group>
        );
      })}

      {/* 6. Aft Engine Skirt / Octaweb Heat Shield (Y = 0 to 3.5m) */}
      <mesh position={[0, 1.75, 0]} material={graphiteCompositeMat} castShadow>
        <cylinderGeometry args={[1.85, 1.95, 3.5, 40]} />
      </mesh>

      {/* Heat Shield Base Cap */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.96, 1.96, 0.25, 40]} />
        <meshStandardMaterial color={0x121418} roughness={0.88} metalness={0.2} />
      </mesh>

      {/* 7. Engine Cluster (1 Center Bell + 8 Circumferential Bells) */}
      <group position={[0, -0.6, 0]}>
        {/* Center Engine Nozzle */}
        <mesh position={[0, 0, 0]} material={engineAlloyMat}>
          <cylinderGeometry args={[0.26, 0.72, 1.4, 24]} />
        </mesh>

        {/* 8 Outer Engine Nozzles */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * Math.PI) / 4;
          return (
            <mesh
              key={`nozzle-${i}`}
              position={[Math.cos(angle) * 1.15, 0, Math.sin(angle) * 1.15]}
              material={engineAlloyMat}
            >
              <cylinderGeometry args={[0.24, 0.65, 1.35, 20]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
