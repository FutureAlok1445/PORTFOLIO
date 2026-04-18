/* ═══════════════════════════════════════════════════════════════
   interactions.js — Custom Cursor, Magnetic Buttons, Project Tilt,
                     Konami Code, Hover Reveals, Click Ripple,
                     Dev Console, Scroll Metrics
   Neural Earth Portfolio
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════ CUSTOM CURSOR ═══════════════ */
function initCustomCursor() {
  if (isMobile()) return;

  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let cx = 0, cy = 0;
  let tx = 0, ty = 0;
  let rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function update() {
    cx = lerp(cx, tx, 0.15);
    cy = lerp(cy, ty, 0.15);
    rx = lerp(rx, tx, 0.08);
    ry = lerp(ry, ty, 0.08);

    dot.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
    ring.style.transform = `translate(${rx - 12}px, ${ry - 12}px)`;

    requestAnimationFrame(update);
  }
  update();

  /* Hover states */
  document.addEventListener('mouseenter', (e) => {
    const t = e.target;
    if (t.matches('a, button, .btn, .skill-node, .project-card, [data-magnetic], [role="button"]')) {
      dot.classList.add('hover');
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    const t = e.target;
    if (t.matches('a, button, .btn, .skill-node, .project-card, [data-magnetic], [role="button"]')) {
      dot.classList.remove('hover');
    }
  }, true);
}

/* ═══════════════ MAGNETIC BUTTONS ═══════════════ */
function initMagneticButtons() {
  if (isMobile()) return;

  const magnets = selectAll('[data-magnetic]');
  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: EASE.snappy });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: EASE.elastic });
    });
  });
}

/* ═══════════════ PROJECT TILT ═══════════════ */
function initProjectTilt() {
  if (isMobile()) return;

  const cards = selectAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = clamp(y * -10, -5, 5);
      const rotateY = clamp(x * 10, -5, 5);
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.5,
        ease: EASE.smooth,
        clearProps: 'transform'
      });
    });
  });
}

/* ═══════════════ KONAMI CODE ═══════════════ */
function initKonamiCode() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    background:var(--circuit-gray); color:var(--matrix-green);
    font-family:'Space Mono',monospace; padding:20px;
    border:1px solid var(--ocean-teal); z-index:10000;
    opacity:0; pointer-events:none; white-space:pre-line;
  `;
  document.body.appendChild(overlay);

  window.addEventListener('keydown', (e) => {
    if (e.key === code[idx] || e.key.toLowerCase() === code[idx].toLowerCase()) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        activateKonami();
      }
    } else {
      idx = 0;
    }
  });

  function activateKonami() {
    console.log('%c👾 You found it. Welcome to the matrix.', 'color:#00e5ff;font-weight:bold;');

    document.body.style.transition = 'filter 0s';
    document.body.style.filter = 'invert(1)';

    setTimeout(() => {
      document.body.style.transition = 'filter 0.3s';
      document.body.style.filter = 'none';

      overlay.textContent = '> Cheat code activated.\n> Rendering in wireframe...';
      gsap.to(overlay, { opacity: 1, duration: 0.3 });

      /* Switch Three.js to wireframe */
      const mats = window._threeScene;
      if (mats) {
        if (mats.icoMaterial) mats.icoMaterial.wireframe = true;
        if (mats.coreMaterial) { mats.coreMaterial.wireframe = true; mats.coreMaterial.opacity = 0.5; }
      }

      setTimeout(() => {
        overlay.textContent += '\n> Resuming high-fidelity mode.';
        if (mats) {
          if (mats.icoMaterial) mats.icoMaterial.wireframe = true; /* already wireframe */
          if (mats.coreMaterial) { mats.coreMaterial.wireframe = false; mats.coreMaterial.opacity = 0.3; }
        }
        setTimeout(() => {
          gsap.to(overlay, { opacity: 0, duration: 0.5 });
        }, 1000);
      }, 5000);
    }, 150);
  }
}

/* ═══════════════ ALT+HOVER CODE REVEALS ═══════════════ */
function initHoverCodeReveals() {
  const tip = document.createElement('div');
  tip.className = 'tooltip';
  tip.style.position = 'fixed';
  tip.style.zIndex = '99999';
  document.body.appendChild(tip);

  window.addEventListener('mousemove', (e) => {
    if (!e.altKey) {
      if (tip.style.opacity !== '0') tip.style.opacity = '0';
      return;
    }

    const skill = e.target.closest('.skill-node');
    const proj = e.target.closest('.project-card');

    if (skill) {
      const name = skill.querySelector('.skill-name')?.textContent || 'module';
      tip.textContent = `> npm install ${name.toLowerCase()}\n> added 142 packages in 3.2s\n> WARN deprecated legacy-peer-deps`;
      tip.style.left = e.clientX + 15 + 'px';
      tip.style.top = e.clientY + 15 + 'px';
      tip.style.opacity = '1';
    } else if (proj) {
      tip.textContent = `* e4f6d3a (HEAD) fast-forward merge\n* a1b2c3d critical bug patch\n* 9x8y7z6 deploy production bundle`;
      tip.style.left = e.clientX + 15 + 'px';
      tip.style.top = e.clientY + 15 + 'px';
      tip.style.opacity = '1';
    } else {
      tip.style.opacity = '0';
    }
  });
}

/* ═══════════════ CLICK RIPPLE ═══════════════ */
function initClickRipple() {
  const canvas = document.createElement('canvas');
  canvas.className = 'ripple-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let ripples = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', debounce(resize, 100));

  window.addEventListener('click', (e) => {
    const r = { x: e.clientX, y: e.clientY, radius: 0, opacity: 0.3 };
    ripples.push(r);
    gsap.to(r, {
      radius: 60, opacity: 0,
      duration: 0.5, ease: EASE.snappy,
      onComplete: () => { ripples = ripples.filter(rp => rp !== r); }
    });
  });

  const tealColor = '#2d6b6b';
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ripples.forEach(r => {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = tealColor;
      ctx.globalAlpha = r.opacity;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════ SCROLL METRICS (Alt+M) ═══════════════ */
function initScrollMetrics() {
  const panel = document.createElement('div');
  panel.style.cssText = `
    position:fixed; bottom:10px; right:10px;
    font-family:'Space Mono',monospace; font-size:0.75rem;
    opacity:0; pointer-events:none; z-index:9999;
    color:var(--soft-glow); background:rgba(10,10,15,0.8);
    padding:8px 12px; border:1px solid var(--muted-indigo);
    transition:opacity 0.3s;
  `;
  document.body.appendChild(panel);

  let active = false;
  let frames = 0, lastTime = performance.now(), fps = 0;
  let section = 'hero';

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) section = e.target.id || 'unknown'; });
  }, { threshold: 0.3 });
  selectAll('section').forEach(s => secObs.observe(s));

  function tick() {
    requestAnimationFrame(tick);
    if (!active) return;
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fps = Math.round((frames * 1000) / (now - lastTime));
      frames = 0;
      lastTime = now;
    }
    panel.textContent = `scrollY: ${Math.round(window.scrollY)}px | section: "${section}" | fps: ${fps} | renderer: "WebGL"`;
  }
  tick();

  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'm') {
      active = !active;
      panel.style.opacity = active ? '0.35' : '0';
    }
  });
}

/* ═══════════════ CONSOLE EASTER EGGS ═══════════════ */
function initConsoleEasterEggs() {
  console.log('%c Hello, fellow developer. ', 'background:#ff6b35;color:#0a0a0f;font-size:20px;font-weight:bold;padding:8px;');
  console.log('%cSource is clean. The soul is not.', 'color:#00e5ff;font-family:monospace;font-size:14px;');
  console.log('→ Connect: ' + CONFIG.email);
}

/* ═══════════════ CONTACT FORM ═══════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    if (btn) {
      btn.textContent = '> transmission sent.';
      btn.style.borderColor = 'var(--matrix-green)';
      btn.style.color = 'var(--matrix-green)';
    }
    setTimeout(() => {
      if (btn) {
        btn.textContent = '[ transmit ]';
        btn.style.borderColor = '';
        btn.style.color = '';
      }
      form.reset();
    }, 3000);
  });
}
