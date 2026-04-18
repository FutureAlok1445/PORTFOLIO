/* ═══════════════════════════════════════════════════════════════
   utils.js — Math Helpers, Easing, DOM Utilities
   Neural Engineer Portfolio
   ═══════════════════════════════════════════════════════════════ */

const EASE = {
  snap: "power2.out",
  cinematic: "power3.inOut",
  expo: "expo.inOut",
  impact: "back.out(1.4)",
  smooth: "power1.out",
  elastic: "elastic.out(1, 0.5)"
};

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function random(min, max) { return Math.random() * (max - min) + min; }
function mapRange(v, a, b, c, d) { return c + ((v - a) / (b - a)) * (d - c); }

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobile() { return window.innerWidth < 768; }

function select(q) { return document.querySelector(q); }
function selectAll(q) { return document.querySelectorAll(q); }

function debounce(fn, delay) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}
