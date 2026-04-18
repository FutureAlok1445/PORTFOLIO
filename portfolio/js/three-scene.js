/* ═══════════════════════════════════════════════════════════════
   three-scene.js — WebGL Scene, Shader Background, Wireframe
                    Icosahedron, Particles, Lighting, Parallax
   Neural Earth Portfolio
   ═══════════════════════════════════════════════════════════════ */

function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  const clock = new THREE.Clock();

  /* ── Shader Background ── */
  const bgUniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColor1: { value: new THREE.Color(0x0a0a0f) },
    uColor2: { value: new THREE.Color(0x121428) },
    uColor3: { value: new THREE.Color(0x2d6b6b) }
  };

  const bgVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const bgFragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

    // Simplex-style noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for(int i = 0; i < 5; i++) {
        value += amplitude * snoise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 p = vUv * 3.0;
      float t = uTime * 0.15;
      float n = fbm(p + vec2(t, t * 0.7));
      float mouseInfluence = length(vUv - uMouse) * 0.3;
      n += mouseInfluence * 0.2;

      vec3 col = mix(uColor1, uColor2, smoothstep(-0.5, 0.5, n));
      col = mix(col, uColor3, smoothstep(0.2, 0.8, n) * 0.3);

      // Subtle center glow
      float glow = 1.0 - length(vUv - vec2(0.5)) * 1.2;
      col += uColor3 * glow * 0.08;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const bgMaterial = new THREE.ShaderMaterial({
    uniforms: bgUniforms,
    vertexShader: bgVertexShader,
    fragmentShader: bgFragmentShader
  });
  const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), bgMaterial);
  bgMesh.position.z = -2;
  scene.add(bgMesh);

  /* ── Wireframe Icosahedron ── */
  const icoGeometry = new THREE.IcosahedronGeometry(1.8, 1);
  const icoMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d6b6b,
    emissive: 0x121428,
    emissiveIntensity: 0.5,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
    roughness: 0.3,
    metalness: 0.9
  });
  const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
  heroGroup.add(icosahedron);

  /* ── Inner Core ── */
  const coreGeometry = new THREE.IcosahedronGeometry(1.2, 0);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x121428,
    emissive: 0x2d6b6b,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.8
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  heroGroup.add(core);

  /* ── Particles ── */
  const particleCount = isMobile() ? 100 : 300;
  const pGeometry = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    pPositions[i] = (Math.random() - 0.5) * 15;
  }
  pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xe0f2f1,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(pGeometry, pMaterial);
  scene.add(particles);

  /* ── Lighting ── */
  scene.add(new THREE.AmbientLight(0x2d6b6b, 1));
  const warmLight = new THREE.PointLight(0xff6b35, 1.5, 20);
  warmLight.position.set(5, 5, 5);
  scene.add(warmLight);
  const coolLight = new THREE.PointLight(0x00d4ff, 1, 20);
  coolLight.position.set(-5, -5, 5);
  scene.add(coolLight);

  /* ── Mouse Tracking ── */
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  /* ── Pause off-screen ── */
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { isVisible = entry.isIntersecting; });
  }, { threshold: 0 });
  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);

  /* ── Animation Loop ── */
  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const time = clock.getElapsedTime();

    bgUniforms.uTime.value = time;
    mouse.x = lerp(mouse.x, mouse.targetX, 0.05);
    mouse.y = lerp(mouse.y, mouse.targetY, 0.05);
    bgUniforms.uMouse.value.set(
      (mouse.x + 1) * 0.5,
      (mouse.y + 1) * 0.5
    );

    heroGroup.rotation.x = lerp(heroGroup.rotation.x, mouse.y * 0.3, 0.05);
    heroGroup.rotation.y = lerp(heroGroup.rotation.y, mouse.x * 0.3, 0.05);

    icosahedron.rotation.x = time * 0.2;
    icosahedron.rotation.y = time * 0.3;
    const s = 1 + Math.sin(time * 2) * 0.02;
    icosahedron.scale.set(s, s, s);

    core.rotation.x = time * 0.15;
    core.rotation.y = time * 0.25;

    particles.rotation.y = time * 0.05;

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion()) {
    renderer.render(scene, camera);
  } else {
    animate();
  }

  /* ── Resize ── */
  window.addEventListener('resize', debounce(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 100));

  /* expose for Konami code */
  window._threeScene = { icoMaterial, coreMaterial, pMaterial };
}
