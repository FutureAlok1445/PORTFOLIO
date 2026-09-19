import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MISSION_PHASES } from './telemetryKeyframes';
import { updateLiveTelemetry, useMissionStore } from './missionStore';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let masterTimeline: gsap.core.Timeline | null = null;
let scrollTriggerInstance: ScrollTrigger | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function initMissionTimeline(containerElement: HTMLElement | null = null) {
  // Teardown previous instances if any
  cleanupMissionTimeline();

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useMissionStore.getState().setReducedMotion(isReducedMotion);

  // 1. Initialize Lenis smooth scrolling (disabled if prefers-reduced-motion)
  if (!isReducedMotion) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    // Wire Lenis to GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    tickerCallback = (time: number) => {
      lenisInstance?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
  }

  // 2. Create Master GSAP ScrollTrigger & Timeline across the whole document
  const triggerTarget = containerElement || document.body;

  masterTimeline = gsap.timeline({
    paused: true,
  });

  // Add labels for all 12 mission phases
  MISSION_PHASES.forEach((phase) => {
    masterTimeline?.addLabel(phase.id, phase.startProgress);
  });

  scrollTriggerInstance = ScrollTrigger.create({
    trigger: triggerTarget,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.8,
    animation: masterTimeline,
    onUpdate: (self) => {
      updateLiveTelemetry(self.progress);
    },
  });

  // Immediate initial sync
  updateLiveTelemetry(0);

  return {
    lenis: lenisInstance,
    timeline: masterTimeline,
    scrollTrigger: scrollTriggerInstance,
  };
}

export function cleanupMissionTimeline() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }
  if (masterTimeline) {
    masterTimeline.kill();
    masterTimeline = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function getLenis() {
  return lenisInstance;
}
