/* ═══════════════════════════════════════════════════════════════
   three-scene.js — "The Signal" Avatar, Grid Floor, Particle
                    Debris, Lighting, Mouse Parallax
   Neural Engineer Portfolio
   ═══════════════════════════════════════════════════════════════ */

function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0.5, 6);

  const clock = new THREE.Clock();
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  /* ── "THE SIGNAL" — Particle Cloud Avatar ── */
  const signalCount = isMobile() ? 800 : 2500;
  const signalGeo = new THREE.BufferGeometry();
  const signalPos = new Float32Array(signalCount * 3);
  const signalBase = new Float32Array(signalCount * 3);
  const signalFlicker = new Float32Array(signalCount);

  for (let i = 0; i < signalCount; i++) {
    /* Head + shoulders silhouette using distance field */
    let x, y, z, valid = false;
    while (!valid) {
      x = (Math.random() - 0.5) * 3;
      y = (Math.random() - 0.5) * 4;
      z = (Math.random() - 0.5) * 1.5;

      /* Head: sphere at y=1.2 */
      const headDist = Math.sqrt(x*x + (y-1.2)*(y-1.2) + z*z);
      /* Torso: ellipsoid at y=-0.3 */
      const torsoX = x / 1.2;
      const torsoY = (y + 0.3) / 1.8;
      const torsoZ = z / 0.6;
      const torsoDist = Math.sqrt(torsoX*torsoX + torsoY*torsoY + torsoZ*torsoZ);

      if (headDist < 0.8 || torsoDist < 1.0) valid = true;
    }

    signalPos[i*3] = x;
    signalPos[i*3+1] = y;
    signalPos[i*3+2] = z;
    signalBase[i*3] = x;
    signalBase[i*3+1] = y;
    signalBase[i*3+2] = z;
    signalFlicker[i] = Math.random();
  }

  signalGeo.setAttribute('position', new THREE.BufferAttribute(signalPos, 3));

  const signalMat = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const signal = new THREE.Points(signalGeo, signalMat);
  heroGroup.add(signal);

  /* ── Grid Floor ── */
  const gridGeo = new THREE.BufferGeometry();
  const gridVerts = [];
  const gridSize = 20;
  const gridSpacing = 2;
  for (let i = -gridSize; i <= gridSize; i += gridSpacing) {
    gridVerts.push(-gridSize, -3, i, gridSize, -3, i);
    gridVerts.push(i, -3, -gridSize, i, -3, gridSize);
  }
  gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridVerts, 3));
  const gridMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.06 });
  scene.add(new THREE.LineSegments(gridGeo, gridMat));

  /* ── Particle Debris ── */
  const debrisCount = isMobile() ? 50 : 200;
  const debrisGeo = new THREE.BufferGeometry();
  const debrisPos = new Float32Array(debrisCount * 3);
  for (let i = 0; i < debrisCount * 3; i++) {
    debrisPos[i] = (Math.random() - 0.5) * 30;
  }
  debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPos, 3));
  const debrisMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x1a1d2e,
    transparent: true,
    opacity: 0.5
  });
  const debris = new THREE.Points(debrisGeo, debrisMat);
  scene.add(debris);

  /* ── Ambient Dust ── */
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(50 * 3);
  for (let i = 0; i < 50 * 3; i++) {
    dustPos[i] = (Math.random() - 0.5) * 10;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.015,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  scene.add(new THREE.Points(dustGeo, dustMat));

  /* ── Lighting ── */
  scene.add(new THREE.AmbientLight(0x1a1d2e, 2));
  const keyLight = new THREE.PointLight(0x00f0ff, 1, 20);
  keyLight.position.set(3, 3, 5);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0xffaa00, 0.3, 20);
  fillLight.position.set(-3, -2, 3);
  scene.add(fillLight);

  /* ── Mouse Tracking ── */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  /* ── Visibility ── */
  let visible = true;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { visible = e.isIntersecting; });
  }, { threshold: 0 });
  const hero = document.getElementById('hero');
  if (hero) obs.observe(hero);

  /* ── Animate ── */
  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;

    const t = clock.getElapsedTime();
    mouse.x = lerp(mouse.x, mouse.tx, 0.05);
    mouse.y = lerp(mouse.y, mouse.ty, 0.05);

    /* Rotate avatar */
    heroGroup.rotation.y = t * 0.1 + mouse.x * 0.3;
    heroGroup.rotation.x = mouse.y * 0.15;

    /* Particle flicker + mouse repulsion */
    const pos = signal.geometry.attributes.position.array;
    for (let i = 0; i < signalCount; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

      /* Flicker */
      signalFlicker[i] += 0.01;
      const flick = Math.sin(signalFlicker[i] * 3 + i) > 0.95 ? 0 : 1;

      /* Mouse repulsion */
      const dx = signalBase[ix] - mouse.x * 2;
      const dy = signalBase[iy] - mouse.y * 2;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < 1.5) {
        const force = (1.5 - dist) * 0.3;
        pos[ix] = signalBase[ix] + dx * force * flick;
        pos[iy] = signalBase[iy] + dy * force * flick;
      } else {
        pos[ix] = lerp(pos[ix], signalBase[ix] * flick, 0.03);
        pos[iy] = lerp(pos[iy], signalBase[iy] * flick, 0.03);
      }
      pos[iz] = signalBase[iz];
    }
    signal.geometry.attributes.position.needsUpdate = true;

    /* Debris drift */
    debris.rotation.y = t * 0.02;

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

  window._threeScene = { signalMat, signal };
}
