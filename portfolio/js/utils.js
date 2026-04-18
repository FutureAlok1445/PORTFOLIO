/* ==========================================================================
   Utility Functions & Constants
   ========================================================================== */

/**
 * Easing Curves for consistent animations across the project.
 * Designed to be used with GSAP.
 */
export const EASE = {
  cinematic: "power4.inOut",
  snappy: "back.out(1.7)",
  smooth: "power2.out",
  elastic: "elastic.out(1, 0.3)",
  expo: "expo.out",
  anime: "power3.inOut", // general smooth aggressive curve
  impact: "bounce.out",
  drift: "sine.inOut"
};

/**
 * Linear interpolation
 * @param {number} start 
 * @param {number} end 
 * @param {number} amt 
 * @returns {number}
 */
export const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
};

/**
 * Map a value from one range to another
 * @param {number} value 
 * @param {number} inMin 
 * @param {number} inMax 
 * @param {number} outMin 
 * @param {number} outMax 
 * @returns {number}
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Generate a random number between min and max
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

/* ==========================================================================
   GSAP Defaults Setup
   ========================================================================== */

export const initGSAPDefaults = () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Set global ScrollTrigger defaults
    ScrollTrigger.defaults({
      start: "top 85%",
      toggleActions: "play none none reverse"
    });
  } else {
    console.warn("GSAP or ScrollTrigger is not loaded yet.");
  }
};
