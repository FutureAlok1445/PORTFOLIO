/* ═══════════════════════════════════════════════════════════════
   utils.js — Math Helpers, Easing, DOM Utilities
   Neural Earth Portfolio
   ═══════════════════════════════════════════════════════════════ */

const EASE = {
  cinematic: "power3.inOut",
  snappy: "power2.out",
  smooth: "power1.out",
  elastic: "elastic.out(1, 0.5)",
  expo: "expo.inOut",
  impact: "back.out(1.4)",
  drift: "sine.inOut"
};

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobile() {
  return window.innerWidth < 768;
}

function selectAll(query) {
  return document.querySelectorAll(query);
}

function select(query) {
  return document.querySelector(query);
}

function on(event, element, callback) {
  if (typeof element === 'string') element = document.querySelector(element);
  if (element) element.addEventListener(event, callback);
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
