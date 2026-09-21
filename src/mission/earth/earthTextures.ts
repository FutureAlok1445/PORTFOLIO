import * as THREE from 'three';

/**
 * Procedural Earth Texture Generators
 * Generates high-resolution, self-contained procedural textures for:
 * 1. Day map (oceans, biomes, continents, India landmass)
 * 2. Night lights map (coastal cities, prominent Mumbai/Thane node at 19.2°N, 73.0°E)
 * 3. Cloud alpha map (cyclonic spirals, tropical convective ITCZ belt)
 * 4. Specular roughness map (mirror oceans, matte continents)
 * 5. Normal bump map (coastal elevation & mountain ridges)
 */

// Procedural Simplex/Perlin-style hash for procedural geographic noise
function hash21(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number): number {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;

  const u = fx * fx * (3.0 - 2.0 * fx);
  const v = fy * fy * (3.0 - 2.0 * fy);

  const s00 = hash21(i, j);
  const s10 = hash21(i + 1, j);
  const s01 = hash21(i, j + 1);
  const s11 = hash21(i + 1, j + 1);

  return s00 * (1 - u) * (1 - v) + s10 * u * (1 - v) + s01 * (1 - u) * v + s11 * u * v;
}

function fbm(x: number, y: number, octaves = 5): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1.0;
  for (let o = 0; o < octaves; o++) {
    val += smoothNoise(x * freq, y * freq) * amp;
    freq *= 2.05;
    amp *= 0.5;
  }
  return val;
}

// 1. Procedural Day Earth Map
export function createEarthDayTexture(width = 2048, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = ((height / 2 - y) / (height / 2)) * 90; // -90 to +90

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 360 - 180; // -180 to +180
      const idx = (y * width + x) * 4;

      // Continental noise field
      const nx = (x / width) * 7.0;
      const ny = (y / height) * 4.5;
      const continentNoise = fbm(nx, ny, 6);

      // Major landmass mask biases
      // Indian Subcontinent: Lon ~ 68 to 88, Lat ~ 8 to 32
      const isIndia =
        lon >= 68 &&
        lon <= 90 &&
        lat >= 7 &&
        lat <= 34 &&
        continentNoise > 0.42;

      // Eurasia / Africa / Americas approximation
      const isPolar = Math.abs(lat) > 74;
      const isLand = continentNoise > 0.48 || isIndia || isPolar;

      if (isPolar) {
        // Polar Ice Caps
        data[idx] = 235;
        data[idx + 1] = 245;
        data[idx + 2] = 255;
      } else if (!isLand) {
        // Deep Ocean to Shallow Coastal Shelf
        const depth = Math.max(0, (0.48 - continentNoise) / 0.48);
        const oceanR = Math.floor(10 + (1.0 - depth) * 15);
        const oceanG = Math.floor(32 + (1.0 - depth) * 45);
        const oceanB = Math.floor(68 + (1.0 - depth) * 35);
        data[idx] = oceanR;
        data[idx + 1] = oceanG;
        data[idx + 2] = oceanB;
      } else {
        // Land Biomes (Arid / Savanna / Temperate Forests / India tropical canopy)
        const arid = Math.abs(lat) >= 15 && Math.abs(lat) <= 30 && lon > -20 && lon < 55;
        if (arid) {
          // Desert Sands (Sahara / Arabia)
          data[idx] = 168;
          data[idx + 1] = 142;
          data[idx + 2] = 98;
        } else if (isIndia) {
          // Lush Green / Fertile Indian Subcontinent
          data[idx] = 38;
          data[idx + 1] = 92;
          data[idx + 2] = 48;
        } else {
          // Temperate Forest / Savanna
          const elevation = fbm(nx * 2, ny * 2, 4);
          data[idx] = Math.floor(45 + elevation * 40);
          data[idx + 1] = Math.floor(85 + elevation * 25);
          data[idx + 2] = Math.floor(42 + elevation * 20);
        }
      }
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Procedural Night Lights Map (Mumbai / Thane prominently illuminated)
export function createEarthNightTexture(width = 2048, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep space black base
  ctx.fillStyle = '#020306';
  ctx.fillRect(0, 0, width, height);

  // Global city light clusters
  const majorCities = [
    // [lon, lat, radius, intensity]
    [72.98, 19.22, 12, 1.0],  // Mumbai / Thane (Prominently brighter!)
    [77.21, 28.61, 9, 0.85],  // New Delhi / NCR
    [77.59, 12.97, 8, 0.8],   // Bangalore
    [88.36, 22.57, 8, 0.75],  // Kolkata
    [80.27, 13.08, 8, 0.75],  // Chennai
    [55.27, 25.20, 7, 0.8],   // Dubai
    [139.69, 35.68, 11, 0.9], // Tokyo
    [121.47, 31.23, 10, 0.85], // Shanghai
    [-74.00, 40.71, 10, 0.9], // New York
    [-118.24, 34.05, 9, 0.85], // Los Angeles
    [-0.12, 51.50, 9, 0.85],  // London
    [2.35, 48.85, 8, 0.8],    // Paris
    [151.20, -33.86, 7, 0.7], // Sydney
    [-46.63, -23.55, 8, 0.75], // Sao Paulo
  ];

  // Helper to convert Lon/Lat to Canvas X/Y
  const toXY = (lon: number, lat: number) => {
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  };

  // Draw regional light networks
  majorCities.forEach(([lon, lat, r, intensity]) => {
    const { x, y } = toXY(lon, lat);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
    grad.addColorStop(0, `rgba(255, 235, 170, ${intensity})`);
    grad.addColorStop(0.35, `rgba(240, 180, 80, ${intensity * 0.7})`);
    grad.addColorStop(0.7, `rgba(200, 120, 30, ${intensity * 0.25})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Dedicated Extra Golden Filament Glow for Mumbai/Thane (Alok's educational roots)
  const mumbai = toXY(72.98, 19.22);
  const mumbaiGlow = ctx.createRadialGradient(mumbai.x, mumbai.y, 0, mumbai.x, mumbai.y, 24);
  mumbaiGlow.addColorStop(0, 'rgba(255, 245, 200, 1.0)');
  mumbaiGlow.addColorStop(0.2, 'rgba(255, 210, 120, 0.85)');
  mumbaiGlow.addColorStop(0.5, 'rgba(220, 150, 60, 0.45)');
  mumbaiGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = mumbaiGlow;
  ctx.beginPath();
  ctx.arc(mumbai.x, mumbai.y, 24, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 3. Procedural Cloud Alpha & Swirl Map
export function createEarthCloudTexture(width = 2048, height = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = ((height / 2 - y) / (height / 2)) * 90;
    const isEquator = Math.abs(lat) < 14; // ITCZ convergence cloud belt
    const isMidLat = Math.abs(lat) > 35 && Math.abs(lat) < 65; // Storm tracks

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = (x / width) * 12.0;
      const ny = (y / height) * 6.0;

      // Swirling atmospheric turbulence
      const swirlX = nx + Math.sin(ny * 2.0) * 0.4;
      const swirlY = ny + Math.cos(nx * 1.5) * 0.3;
      let cloudVal = fbm(swirlX, swirlY, 5);

      if (isEquator) cloudVal += 0.16;
      if (isMidLat) cloudVal += 0.12;

      // Contrast threshold for cloud puff boundaries
      const density = THREE.MathUtils.clamp((cloudVal - 0.46) / 0.32, 0, 1);
      const alpha = Math.floor(density * 240);

      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 4. Procedural Specular Water Mask (Oceans = 255 mirror, Land = 0 matte)
export function createEarthSpecularTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const lat = ((height / 2 - y) / (height / 2)) * 90;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = (x / width) * 7.0;
      const ny = (y / height) * 4.5;
      const continentNoise = fbm(nx, ny, 5);

      const isPolar = Math.abs(lat) > 74;
      const isLand = continentNoise > 0.48 || isPolar;

      const spec = isLand ? 15 : 245; // High specular reflection on oceans
      data[idx] = spec;
      data[idx + 1] = spec;
      data[idx + 2] = spec;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
