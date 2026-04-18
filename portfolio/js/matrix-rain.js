/* ═══════════════════════════════════════════════════════════════
   matrix-rain.js — Canvas 2D Code Fall System
   Neural Engineer Portfolio
   ═══════════════════════════════════════════════════════════════ */

function initMatrixRain() {
  if (prefersReducedMotion()) return;

  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const chars = '01<>{}/()|=;ABCDEFabcdef.:_';
  const fontSize = 12;
  let columns, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.floor(random(-50, 0)));
  }

  resize();
  window.addEventListener('resize', debounce(resize, 100));

  /* Active sections: only Hero and Contact */
  let isActive = false;
  const heroEl = document.getElementById('hero');
  const contactEl = document.getElementById('contact');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) isActive = true;
    });
    /* Check if at least one target section is visible */
    isActive = entries.some(e => e.isIntersecting);
  }, { threshold: 0.1 });

  if (heroEl) obs.observe(heroEl);
  if (contactEl) obs.observe(contactEl);

  const colors = ['#00f0ff', '#ffaa00', '#7a8299'];
  let lastFrame = 0;
  const frameDuration = 1000 / 30; /* throttle to 30fps */

  function draw(timestamp) {
    requestAnimationFrame(draw);

    if (!isActive) return;
    if (timestamp - lastFrame < frameDuration) return;
    lastFrame = timestamp;

    ctx.fillStyle = 'rgba(5, 5, 7, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < columns; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      /* Head character (bright) */
      const colorIdx = Math.floor(Math.random() * colors.length);
      ctx.fillStyle = colors[colorIdx];
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      ctx.globalAlpha = 0.6;
      ctx.fillText(char, x, y);

      /* Trail characters (dimmer) done via the fade-out fillRect above */
      ctx.globalAlpha = 1;

      drops[i]++;

      if (y > canvas.height && Math.random() > 0.98) {
        drops[i] = 0;
      }
    }
  }

  requestAnimationFrame(draw);
}
