import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CondensationVaporConeProps {
  intensity?: number; // 0..1 based on dynamic pressure near Max-Q
  positionY?: number;
}

export const CondensationVaporCone: React.FC<CondensationVaporConeProps> = ({
  intensity = 0,
  positionY = 0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Translucent aerodynamic vapor cone geometry wrapping the payload fairing shoulder
  const coneMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = positionY + 58.0; // Centered at the fairing shoulder expansion

      // Fluttering transonic condensation density
      if (intensity > 0.05) {
        meshRef.current.visible = true;
        const flutter = 1.0 + Math.sin(state.clock.getElapsedTime() * 45.0) * 0.12;
        coneMaterial.opacity = intensity * 0.45 * flutter;
        meshRef.current.scale.set(1.0 + flutter * 0.03, 1.0, 1.0 + flutter * 0.03);
      } else {
        meshRef.current.visible = false;
      }
    }
  });

  return (
    <mesh ref={meshRef} material={coneMaterial} visible={false}>
      {/* Expanding Mach shock cone geometry */}
      <coneGeometry args={[3.2, 7.5, 32, 1, true]} />
    </mesh>
  );
};
