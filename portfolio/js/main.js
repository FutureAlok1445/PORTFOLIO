/* ═══════════════════════════════════════════════════════════════
   main.js — Entry Point, CONFIG, Init Orchestration
   Neural Earth Portfolio
   ═══════════════════════════════════════════════════════════════ */

/* ── EDIT THIS CONFIG ── */
const CONFIG = {
  name: "Alok",
  tagline: "Full-stack · Machine Learning · Frontend Architecture",
  terminalLine: 'location: "Earth" | stack: ["React", "Three.js", "PyTorch"] | status: "Available"',
  email: "hello@yourdomain.com",
  github: "https://github.com/yourname",
  linkedin: "https://linkedin.com/in/yourname"
};

document.addEventListener('DOMContentLoaded', () => {
  /* 1 — Three.js Scene */
  initThreeScene();

  /* 2 — Boot Sequence → Hero Animations */
  initBootSequence();

  /* 3 — Custom Cursor */
  initCustomCursor();

  /* 4 — Magnetic Buttons */
  initMagneticButtons();

  /* 5 — Project Card Tilt */
  initProjectTilt();

  /* 6 — GSAP ScrollTriggers + Lenis */
  initScrollTriggers();

  /* 7 — Sakura Particle System */
  initSakura();

  /* 8 — Ghost Trails */
  initGhostTrails();

  /* 9 — Konami Code */
  initKonamiCode();

  /* 10 — Hover Code Reveals */
  initHoverCodeReveals();

  /* 11 — Hero Interactions */
  initHeroInteractions();

  /* 12 — Click Ripple */
  initClickRipple();

  /* 13 — Scroll Metrics */
  initScrollMetrics();

  /* 14 — Contact Form */
  initContactForm();

  /* 15 — Console Easter Eggs */
  initConsoleEasterEggs();

  /* 16 — Global Resize Handler */
  window.addEventListener('resize', debounce(() => {
    ScrollTrigger.refresh();
  }, 100));
});
