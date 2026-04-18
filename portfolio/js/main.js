/* ═══════════════════════════════════════════════════════════════
   main.js — Entry Point, Init Orchestration
   Neural Engineer Portfolio
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /*  1 — Three.js Avatar + Grid Floor  */
  initThreeScene();

  /*  2 — Matrix Rain  */
  initMatrixRain();

  /*  3 — Boot Sequence → Hero Animations  */
  initBootSequence();

  /*  4 — Custom Cursor  */
  initCustomCursor();

  /*  5 — Magnetic Buttons  */
  initMagneticButtons();

  /*  6 — Project 3D Tilt  */
  initProjectTilt();

  /*  7 — GSAP ScrollTriggers + Lenis  */
  initScrollTriggers();

  /*  8 — HUD Overlays  */
  initHUD();

  /*  9 — Click Ripple  */
  initClickRipple();

  /* 10 — Signal Bars  */
  initSignalBars();

  /* 11 — Contact Form  */
  initContactForm();

  /* 12 — Console Easter Eggs  */
  initConsoleEasterEggs();

  /* 13 — Global Resize  */
  window.addEventListener('resize', debounce(() => {
    ScrollTrigger.refresh();
  }, 100));
});
