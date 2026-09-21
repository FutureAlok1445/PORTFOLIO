import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { DeepStarField } from '../stars/DeepStarField';
import { liveTelemetry } from '../missionStore';

interface ConstellationGroup {
  id: string;
  name: string;
  center: [number, number, number];
  color: string;
  stars: { name: string; offset: [number, number, number] }[];
  connections: [number, number][];
}

// 7 Skill Constellations mapped directly from Alok's skill groups
const CONSTELLATIONS_DATA: ConstellationGroup[] = [
  {
    id: 'frontend',
    name: '01 // FRONTEND ARCHITECTURE',
    center: [-24, 18, -40],
    color: '#38bdf8', // Cyan
    stars: [
      { name: 'React', offset: [0, 0, 0] },
      { name: 'TypeScript', offset: [4, 3, -2] },
      { name: 'Next.js', offset: [8, 1, 1] },
      { name: 'Tailwind CSS', offset: [5, -4, 0] },
      { name: 'Three.js / R3F', offset: [1, -5, -2] },
      { name: 'Zustand', offset: [-4, -2, 1] },
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3],
    ],
  },
  {
    id: 'backend',
    name: '02 // BACKEND SYSTEMS',
    center: [-10, 28, -60],
    color: '#c99a5e', // Amber
    stars: [
      { name: 'Node.js', offset: [0, 0, 0] },
      { name: 'Express', offset: [4, 2, 1] },
      { name: 'Python', offset: [7, -1, -2] },
      { name: 'FastAPI', offset: [4, -5, 0] },
      { name: 'REST APIs', offset: [-2, -4, 1] },
      { name: 'Flask', offset: [-5, 1, -1] },
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4],
    ],
  },
  {
    id: 'ml',
    name: '03 // MACHINE LEARNING & AI',
    center: [14, 26, -55],
    color: '#a78bfa', // Purple / Violet
    stars: [
      { name: 'PyTorch', offset: [0, 0, 0] },
      { name: 'TensorFlow', offset: [5, 3, -1] },
      { name: 'Scikit-Learn', offset: [8, -1, 1] },
      { name: 'OpenCV', offset: [4, -5, 0] },
      { name: 'Transformers', offset: [-1, -4, -2] },
      { name: 'Grad-CAM', offset: [-4, 2, 1] },
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 4],
    ],
  },
  {
    id: 'cybersecurity',
    name: '04 // CYBERSECURITY & NETWORKS',
    center: [28, 14, -45],
    color: '#ef4444', // Security Red / Coral
    stars: [
      { name: 'Packet Inspection', offset: [0, 0, 0] },
      { name: 'Scapy', offset: [4, 4, 1] },
      { name: 'Wireshark', offset: [7, 0, -1] },
      { name: 'Burp Suite', offset: [5, -4, 2] },
      { name: 'Cryptography', offset: [-1, -3, 0] },
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3],
    ],
  },
  {
    id: 'devops',
    name: '05 // SYSTEMS & DEVOPS',
    center: [-20, -6, -42],
    color: '#34d399', // Emerald
    stars: [
      { name: 'Docker', offset: [0, 0, 0] },
      { name: 'Linux / Bash', offset: [4, 3, -1] },
      { name: 'CI/CD Pipelines', offset: [6, -2, 1] },
      { name: 'Git & GitHub', offset: [2, -5, 0] },
      { name: 'Nginx', offset: [-3, -2, -1] },
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
    ],
  },
  {
    id: 'databases',
    name: '06 // DATABASES & STORAGE',
    center: [0, -10, -50],
    color: '#f59e0b', // Gold
    stars: [
      { name: 'PostgreSQL', offset: [0, 0, 0] },
      { name: 'MongoDB', offset: [4, 2, 1] },
      { name: 'MySQL', offset: [6, -2, -1] },
      { name: 'Redis', offset: [2, -5, 0] },
      { name: 'Vector DBs / Chroma', offset: [-3, -3, 1] },
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 3],
    ],
  },
  {
    id: 'core-cs',
    name: '07 // CORE COMPUTER SCIENCE',
    center: [22, -8, -48],
    color: '#60a5fa', // Sky Blue
    stars: [
      { name: 'Data Structures', offset: [0, 0, 0] },
      { name: 'Algorithms', offset: [4, 3, 0] },
      { name: 'OOP & System Design', offset: [7, -1, 1] },
      { name: 'Operating Systems', offset: [3, -4, -1] },
      { name: 'Computer Networks', offset: [-2, -2, 0] },
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 4],
    ],
  },
];

export const ConstellationsScene: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const lineGroupsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const prog = liveTelemetry.progress;
    // Normalized progress across CONSTELLATIONS phase [0.66, 0.78]
    const t = Math.max(0, Math.min(1, (prog - 0.66) / 0.12));

    // Animate hairline lines drawing in on scroll
    if (lineGroupsRef.current) {
      lineGroupsRef.current.children.forEach((child, idx) => {
        const line = child as THREE.LineSegments;
        if (line && line.material) {
          // Staggered constellation reveal across the 7 groups
          const groupDelay = idx / 7.0;
          const groupProgress = Math.max(0, Math.min(1, (t - groupDelay * 0.5) / 0.5));
          (line.material as THREE.LineBasicMaterial).opacity = groupProgress * 0.75;
        }
      });
    }
  });

  return (
    <group name="constellations-scene">
      {/* 1. Deep Space Starfield */}
      <DeepStarField count={reducedMotion ? 4000 : 8000} />

      {/* 2. Constellation Lines Group (Draws in on scroll) */}
      <group ref={lineGroupsRef}>
        {CONSTELLATIONS_DATA.map((constellation) => {
          const points: THREE.Vector3[] = [];
          const [cx, cy, cz] = constellation.center;

          constellation.connections.forEach(([i1, i2]) => {
            const s1 = constellation.stars[i1];
            const s2 = constellation.stars[i2];
            points.push(
              new THREE.Vector3(cx + s1.offset[0], cy + s1.offset[1], cz + s1.offset[2]),
              new THREE.Vector3(cx + s2.offset[0], cy + s2.offset[1], cz + s2.offset[2])
            );
          });

          const geo = new THREE.BufferGeometry().setFromPoints(points);

          return (
            <lineSegments key={`lines-${constellation.id}`} geometry={geo}>
              <lineBasicMaterial
                color={constellation.color}
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </lineSegments>
          );
        })}
      </group>

      {/* 3. Interactive Constellation Star Nodes */}
      {CONSTELLATIONS_DATA.map((constellation) => {
        const [cx, cy, cz] = constellation.center;

        return (
          <group key={`nodes-${constellation.id}`}>
            {constellation.stars.map((star, idx) => {
              const pos: [number, number, number] = [
                cx + star.offset[0],
                cy + star.offset[1],
                cz + star.offset[2],
              ];
              const isHovered = hoveredTech === star.name;

              return (
                <group
                  key={`star-${constellation.id}-${idx}`}
                  position={pos}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredTech(star.name);
                  }}
                  onPointerOut={() => setHoveredTech(null)}
                >
                  {/* Glowing Core Star */}
                  <mesh>
                    <sphereGeometry args={[isHovered ? 0.75 : 0.45, 16, 16]} />
                    <meshBasicMaterial
                      color={isHovered ? '#ffffff' : constellation.color}
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>

                  {/* Pulsing Hover Telemetry Halo */}
                  {isHovered && (
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                      <ringGeometry args={[1.2, 1.35, 24]} />
                      <meshBasicMaterial
                        color={constellation.color}
                        transparent
                        opacity={0.8}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                      />
                    </mesh>
                  )}
                </group>
              );
            })}
          </group>
        );
      })}

      {/* Ambient Celestial Light */}
      <ambientLight intensity={0.15} color="#151b28" />
    </group>
  );
};
