/* ═══════════════════════════════════════════════════════════════
   interactions.js — Custom Cursor, Magnetic Buttons, 3D Tilt,
                     Click Ripple, Signal Bars, Form Handling
   Neural Engineer Portfolio
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════ CUSTOM CURSOR ═══════════════ */
function initCustomCursor() {
  if (isMobile()) return;

  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let cx = 0, cy = 0, rx = 0, ry = 0, tx = 0, ty = 0;

  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });

  function tick() {
    cx = lerp(cx, tx, 0.15);
    cy = lerp(cy, ty, 0.15);
    rx = lerp(rx, tx, 0.08);
    ry = lerp(ry, ty, 0.08);
    dot.style.transform = `translate(${cx - 3}px, ${cy - 3}px)`;
    ring.style.transform = `translate(${rx - 14}px, ${ry - 14}px)`;
    requestAnimationFrame(tick);
  }
  tick();

  document.addEventListener('mouseenter', (e) => {
    if (e.target.matches('a, button, .btn, .skill-slot, .project-card, .relay-link, [data-magnetic], [role="button"]'))
      dot.classList.add('hover');
  }, true);
  document.addEventListener('mouseleave', (e) => {
    if (e.target.matches('a, button, .btn, .skill-slot, .project-card, .relay-link, [data-magnetic], [role="button"]'))
      dot.classList.remove('hover');
  }, true);
}

/* ═══════════════ MAGNETIC BUTTONS ═══════════════ */
function initMagneticButtons() {
  if (isMobile()) return;
  selectAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.3;
      const dy = (e.clientY - r.top - r.height / 2) * 0.3;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: EASE.snap });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: EASE.elastic });
    });
  });
}

/* ═══════════════ PROJECT 3D TILT ═══════════════ */
function initProjectTilt() {
  if (isMobile()) return;
  selectAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const rx = clamp(((e.clientY - r.top) / r.height - 0.5) * -8, -4, 4);
      const ry = clamp(((e.clientX - r.left) / r.width - 0.5) * 8, -4, 4);
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: EASE.smooth, clearProps: 'transform' });
    });
  });
}

/* ═══════════════ CLICK RIPPLE ═══════════════ */
function initClickRipple() {
  const canvas = document.createElement('canvas');
  canvas.className = 'ripple-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let ripples = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', debounce(resize, 100));

  window.addEventListener('click', (e) => {
    const r = { x: e.clientX, y: e.clientY, radius: 0, opacity: 0.3 };
    ripples.push(r);
    gsap.to(r, {
      radius: 50, opacity: 0, duration: 0.4, ease: EASE.snap,
      onComplete: () => { ripples = ripples.filter(rp => rp !== r); }
    });
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ripples.forEach(r => {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#00f0ff';
      ctx.globalAlpha = r.opacity;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════ SIGNAL BARS ANIMATION ═══════════════ */
function initSignalBars() {
  const bars = selectAll('.signal-bar');
  if (!bars.length || prefersReducedMotion()) return;

  function pulse() {
    bars.forEach(bar => {
      const h = parseInt(bar.dataset.maxHeight) || 20;
      const r = random(h * 0.3, h);
      gsap.to(bar, { height: r, duration: 0.5, ease: EASE.snap });
    });
    setTimeout(pulse, 800 + random(0, 400));
  }
  pulse();
}

/* ═══════════════ CONTACT FORM ═══════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-hazard');
    if (btn) {
      btn.textContent = '> SIGNAL TRANSMITTED';
      btn.style.borderColor = 'var(--phosphor-teal)';
      btn.style.color = 'var(--phosphor-teal)';
    }
    setTimeout(() => {
      if (btn) {
        btn.textContent = 'TRANSMIT';
        btn.style.borderColor = '';
        btn.style.color = '';
      }
      form.reset();
    }, 3000);
  });
}

/* ═══════════════ CONSOLE EASTER EGGS ═══════════════ */
function initConsoleEasterEggs() {
  console.log('%c NEURAL ENGINEER OS v4.2 ', 'background:#00f0ff;color:#050507;font-size:16px;font-weight:bold;padding:6px 12px;');
  console.log('%cSystems nominal. All green.', 'color:#00f0ff;font-family:monospace;font-size:12px;');
  console.log('%c→ Coordinates: ' + CONFIG.email, 'color:#7a8299;font-family:monospace;');
}
