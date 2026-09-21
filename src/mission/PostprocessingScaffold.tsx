import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
  BrightnessContrast,
  ToneMapping,
  HueSaturation,
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
      <EffectComposer multisampling={0}>
        {/* 1. Primary Soft Atmospheric Bloom */}
        <Bloom
          intensity={0.48}
          luminanceThreshold={0.65}
          luminanceSmoothing={0.3}
          mipmapBlur
        />

        {/* 2. Anamorphic-Style High-Luminance Bloom Streak (Triggers only on extreme hot sources like engine flame & solar disk) */}
        <Bloom
          intensity={1.15}
          luminanceThreshold={1.85}
          luminanceSmoothing={0.15}
          mipmapBlur
        />

        {/* 3. Filmic Tone Mapping & Color Grading (lifted blacks + split-toning) */}
        <ToneMapping mode={THREE.ACESFilmicToneMapping} />
        <BrightnessContrast brightness={0.015} contrast={0.06} />
        <HueSaturation saturation={0.05} />

        {/* 4. Cinematic Vignette & Micro-Film Grain */}
        <Vignette eskil={false} offset={0.12} darkness={0.88} />
        <Noise opacity={0.028} />

        {/* 5. Aerodynamic Chromatic Aberration during Max-Q */}
        <ChromaticAberration
          offset={chromAbbOffsetRef.current}
          radialModulation={true}
          modulationOffset={0.3}
        />
      </EffectComposer>
    );
  }

  // Medium Tier
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.42}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.2}
        mipmapBlur
      />
      <ToneMapping mode={THREE.ACESFilmicToneMapping} />
      <BrightnessContrast brightness={0.015} contrast={0.05} />
      <Vignette eskil={false} offset={0.12} darkness={0.85} />
      <Noise opacity={0.018} />
    </EffectComposer>
  );
};
