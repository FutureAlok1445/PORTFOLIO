
/**
 * High-Fidelity Earth Surface Shader
 * - Blends Day map and Night lights via dot(normal, sunDir) with soft terminator
 * - Emissive night city lights with prominent illumination
 * - Ocean specular reflection glint under the sun
 * - Warm orange/amber sunrise/sunset twilight atmospheric tint at terminator
 * - Cloud shadow projection onto terrain
 */
export const EarthSurfaceShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,

  fragmentShader: `
    uniform sampler2D uDayMap;
    uniform sampler2D uNightMap;
    uniform sampler2D uCloudMap;
    uniform sampler2D uSpecularMap;
    uniform vec3 uSunDirection;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 sunDir = normalize(uSunDirection);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);

      // Cosine angle to sun
      float NdotL = dot(normal, sunDir);

      // Smooth Day/Night terminator transition (-0.12 to +0.15)
      float dayFactor = smoothstep(-0.12, 0.16, NdotL);

      // Sample Textures
      vec4 dayTex = texture2D(uDayMap, vUv);
      vec4 nightTex = texture2D(uNightMap, vUv);
      float specMask = texture2D(uSpecularMap, vUv).r;

      // Cloud shadow cast onto surface (offset slightly along sun direction)
      vec2 cloudUv = vec2(vUv.x + uTime * 0.003, vUv.y);
      float cloudAlpha = texture2D(uCloudMap, cloudUv).a;
      float cloudShadow = 1.0 - (cloudAlpha * 0.45 * dayFactor);

      // 1. Daytime surface with cloud shadows
      vec3 dayColor = dayTex.rgb * dayFactor * cloudShadow;

      // 2. Ocean Specular Sun Glint
      vec3 halfVec = normalize(sunDir + viewDir);
      float NdotH = max(0.0, dot(normal, halfVec));
      float specular = pow(NdotH, 48.0) * specMask * dayFactor * 1.8;
      vec3 specGlint = vec3(1.0, 0.96, 0.88) * specular;

      // 3. Emissive Night City Lights (brighter on dark side)
      float nightFactor = 1.0 - dayFactor;
      vec3 nightLights = nightTex.rgb * nightFactor * 2.8;

      // 4. Sunrise/Sunset Twilight Terminator Amber Tint (Atmospheric scattering at rim)
      float terminatorBand = smoothstep(0.18, 0.0, abs(NdotL));
      vec3 twilightGlow = vec3(0.92, 0.48, 0.16) * terminatorBand * 0.42;

      vec3 finalColor = dayColor + nightLights + twilightGlow + specGlint;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

/**
 * Rayleigh Atmosphere Limb & Outer Haze Shader
 * - Back-face / rim Fresnel shell with Rayleigh blue (approx 0.3, 0.6, 1.0)
 * - Thin brighter limb and faint outer haze
 * - Additive blending, bloom-friendly
 */
export const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,

  fragmentShader: `
    uniform vec3 uSunDirection;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 sunDir = normalize(uSunDirection);

      // Back-face / edge Fresnel rim
      float dotVN = dot(viewDir, normal);
      float fresnel = pow(1.0 - abs(dotVN), 3.2);

      // Sun illumination bias (atmosphere illuminates on sunlit limb)
      float sunBias = max(0.08, dot(normal, sunDir) * 0.5 + 0.5);

      // Rayleigh blue spectrum
      vec3 rayleighBlue = vec3(0.32, 0.62, 1.0);
      vec3 innerLimb = vec3(0.55, 0.85, 1.0);

      // Sharp brighter limb core with diffuse outer haze
      vec3 atmosphereColor = mix(rayleighBlue, innerLimb, pow(fresnel, 2.0));
      float alpha = fresnel * sunBias * 1.45;

      gl_FragColor = vec4(atmosphereColor, clamp(alpha, 0.0, 1.0));
    }
  `,
};
