import * as THREE from 'three';

let cachedStarTexture: THREE.CanvasTexture | null = null;
let cachedSmokeTexture: THREE.CanvasTexture | null = null;
let cachedFlameTexture: THREE.CanvasTexture | null = null;

export const getStarTexture = (): THREE.CanvasTexture => {
  if (cachedStarTexture) return cachedStarTexture;
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
  grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.15)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  cachedStarTexture = new THREE.CanvasTexture(c);
  return cachedStarTexture;
};

export const getSmokeTexture = (): THREE.CanvasTexture => {
  if (cachedSmokeTexture) return cachedSmokeTexture;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(210, 215, 225, 0.8)');
  grad.addColorStop(0.25, 'rgba(180, 185, 195, 0.4)');
  grad.addColorStop(0.6, 'rgba(120, 125, 135, 0.08)');
  grad.addColorStop(1, 'rgba(30, 32, 38, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  cachedSmokeTexture = new THREE.CanvasTexture(c);
  return cachedSmokeTexture;
};

export const getFlameTexture = (): THREE.CanvasTexture => {
  if (cachedFlameTexture) return cachedFlameTexture;
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 128, 128);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.15, 'rgba(255, 210, 130, 0.9)');
  grad.addColorStop(0.4, 'rgba(201, 154, 94, 0.5)');
  grad.addColorStop(0.7, 'rgba(160, 90, 30, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);
  cachedFlameTexture = new THREE.CanvasTexture(c);
  return cachedFlameTexture;
};
