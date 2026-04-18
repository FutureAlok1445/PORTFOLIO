/* ═══════════════════════════════════════════════════════════════
   anime-effects.js — Sakura Particles, Speed Lines, Ghost Trails
   Neural Earth Portfolio
   ═══════════════════════════════════════════════════════════════ */

class SakuraSystem {
  constructor(canvasEl, petalCount) {
    this.canvas = canvasEl;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.petalCount = isMobile() ? Math.min(petalCount, 10) : petalCount;
    this.paused = false;
    this.animId = null;

    this.resize();
    window.addEventListener('resize', debounce(() => this.resize(), 100));

    for (let i = 0; i < this.petalCount; i++) {
      this.petals.push(this.createPetal(true));
    }

    /* Pause off-screen */
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { this.paused = !e.isIntersecting; });
    }, { threshold: 0 });
    obs.observe(this.canvas);

    if (!prefersReducedMotion()) {
      this.animate();
    }
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  createPetal(randomY) {
    return {
      x: random(0, this.canvas.width),
      y: randomY ? random(-this.canvas.height, this.canvas.height) : random(-50, -10),
      size: random(3, 8),
      speedY: random(0.5, 1.5),
      speedX: random(-1, 1),
      rotation: random(0, Math.PI * 2),
      rotationSpeed: random(-0.02, 0.02),
      opacity: random(0.1, 0.3),
      sway: random(0.01, 0.03),
      swayOffset: random(0, Math.PI * 2)
    };
  }

  update(petal) {
    petal.y += petal.speedY;
    petal.x += Math.sin(petal.y * petal.sway + petal.swayOffset) * petal.speedX * 0.3;
    petal.rotation += petal.rotationSpeed;
    if (petal.y > this.canvas.height + 10) {
      Object.assign(petal, this.createPetal(false));
    }
  }

  draw(petal) {
    this.ctx.save();
    this.ctx.translate(petal.x, petal.y);
    this.ctx.rotate(petal.rotation);
    this.ctx.globalAlpha = petal.opacity;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffb7d5';
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    if (this.paused) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const petal of this.petals) {
      this.update(petal);
      this.draw(petal);
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

function initSakura() {
  const heroCanvas = document.getElementById('sakura-hero');
  if (heroCanvas) new SakuraSystem(heroCanvas, 25);

  const contactCanvas = document.getElementById('sakura-contact');
  if (contactCanvas) new SakuraSystem(contactCanvas, 8);
}

function triggerSpeedLines(targetElement) {
  if (prefersReducedMotion()) return;
  const rect = targetElement.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'speed-lines-container');
  svg.style.position = 'fixed';
  svg.style.inset = '0';
  svg.style.width = '100vw';
  svg.style.height = '100vh';
  svg.style.pointerEvents = 'none';
  svg.style.zIndex = '9990';

  const lineCount = 16;
  for (let i = 0; i < lineCount; i++) {
    const angle = (Math.PI * 2 / lineCount) * i;
    const len = Math.max(window.innerWidth, window.innerHeight) * 0.6;
    const x2 = cx + Math.cos(angle) * len;
    const y2 = cy + Math.sin(angle) * len;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#e0f2f1');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('opacity', '0.1');
    line.setAttribute('stroke-dasharray', len);
    line.setAttribute('stroke-dashoffset', len);
    svg.appendChild(line);

    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 0.3,
      delay: i * 0.01,
      ease: EASE.snappy
    });
  }

  document.body.appendChild(svg);
  gsap.to(svg, { opacity: 0, duration: 0.3, delay: 0.3, onComplete: () => svg.remove() });
}

function initGhostTrails() {
  if (isMobile() || prefersReducedMotion()) return;

  let lastX = 0, lastY = 0;
  window.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) < 20) return;
    lastX = e.clientX;
    lastY = e.clientY;

    const ghost = document.createElement('div');
    ghost.className = 'ghost-trail';
    ghost.style.left = e.clientX + 'px';
    ghost.style.top = e.clientY + 'px';
    document.body.appendChild(ghost);

    gsap.to(ghost, {
      opacity: 0.3,
      duration: 0.1,
      onComplete: () => {
        gsap.to(ghost, {
          opacity: 0,
          scale: 2,
          duration: 0.3,
          onComplete: () => ghost.remove()
        });
      }
    });
  });
}
