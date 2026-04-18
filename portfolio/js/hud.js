/* ═══════════════════════════════════════════════════════════════
   hud.js — Viewport HUD Corners, Scroll Progress, FPS Counter,
            Section Tracker, UTC Clock
   Neural Engineer Portfolio
   ═══════════════════════════════════════════════════════════════ */

function initHUD() {
  /* ── Top-Left: Callsign + Sector ── */
  const hudTL = select('.hud-tl');
  /* ── Top-Right: Status + UTC ── */
  const hudTR = select('.hud-tr');
  /* ── Bottom-Right: FPS + Render ── */
  const hudBR = select('.hud-br');
  /* ── Scroll Progress Bar ── */
  const progressFill = select('.scroll-progress-fill');

  if (!hudTL && !hudTR && !hudBR && !progressFill) return;

  /* Section tracking */
  let currentSection = 'HERO';
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        currentSection = (e.target.id || 'UNKNOWN').toUpperCase();
      }
    });
  }, { threshold: 0.3 });
  selectAll('section').forEach(s => sectionObs.observe(s));

  /* FPS counter */
  let frames = 0, lastTime = performance.now(), fps = 60;

  /* UTC clock */
  function getUTC() {
    const d = new Date();
    return d.getUTCHours().toString().padStart(2,'0') + ':' +
           d.getUTCMinutes().toString().padStart(2,'0') + ':' +
           d.getUTCSeconds().toString().padStart(2,'0') + ' UTC';
  }

  function update() {
    requestAnimationFrame(update);
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fps = Math.round((frames * 1000) / (now - lastTime));
      frames = 0;
      lastTime = now;
    }

    if (hudTL) hudTL.textContent = `CALLSIGN: ${CONFIG.name} | SECTOR: ${currentSection}`;
    if (hudTR) hudTR.textContent = `SYS.STATUS: ONLINE | ${getUTC()}`;
    if (hudBR) hudBR.textContent = `FPS: ${fps} | RENDER: WEBGL`;

    /* Scroll progress */
    if (progressFill) {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      progressFill.style.height = clamp(scrollPct, 0, 100) + '%';
    }
  }

  update();
}
