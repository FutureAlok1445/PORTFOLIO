import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { QualityTier } from './types';
import { liveTelemetry } from './missionStore';

interface PostprocessingScaffoldProps {
  qualityTier: QualityTier;
}

export const PostprocessingScaffold: React.FC<PostprocessingScaffoldProps> = ({
  qualityTier,
}) => {
  const chromAbbOffsetRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));

  useFrame(() => {
    // Only apply chromatic aberration during MAX_Q phase (progress ~0.14 - 0.20)
    const isMaxQ = liveTelemetry.phaseId === 'MAX_Q';
    if (isMaxQ) {
      const shake = Math.sin(Date.now() * 0.05) * 0.0025;
      chromAbbOffsetRef.current.set(shake, shake * 0.5);
    } else {
      chromAbbOffsetRef.current.set(0, 0);
    }
  });

  // Skip postprocessing on low tier for maximum performance
  if (qualityTier === 'low') {
    return null;
  }

  const isHighTier = qualityTier === 'high';

  if (isHighTier) {
    return (
      <EffectComposer multisampling={4}>
        <Bloom
          intensity={0.65}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.2}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.12} darkness={0.88} />
        <Noise opacity={0.032} />
        <ChromaticAberration
          offset={chromAbbOffsetRef.current}
          radialModulation={true}
          modulationOffset={0.3}
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.45}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.2}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.12} darkness={0.88} />
      <Noise opacity={0.02} />
    </EffectComposer>
  );
};
