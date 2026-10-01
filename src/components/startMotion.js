import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { bindScroll } from "./scroll";
gsap.registerPlugin(ScrollTrigger);
const motion = { entrance: 1.2, reveal: 0.65, ease: "power3.out" };
export function startMotion() {
  let disposed = false;
  const lenis = new Lenis({
    duration: 0.95,
    smoothWheel: true,
    anchors: { offset: -96 },
    prevent: (node) => node.tagName === "DIALOG",
  });
  const unbind = bindScroll(lenis);
  const tick = (time) => lenis.raf(time * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    const heading = document.querySelector(".hero-title");
    if (heading) {
      // Stable line wrappers: no font-load re-split and no opacity-hidden letters.
      const entrance = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          document.documentElement.dataset.motionReady = "true";
        },
      });
      entrance.from(
        ".hero-line-inner",
        { yPercent: 34, duration: motion.entrance, stagger: 0.12 },
        0,
      );
      entrance.from(
        ".hero-portrait",
        { y: 16, scale: 0.98, duration: 1.2 },
        0.08,
      );
      entrance.from(".hero-copy,.hero-actions", { y: 12, duration: 0.8 }, 0.15);
      // Fast scrolling finishes the entrance once; the name never reconstructs.
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        onLeave: () => entrance.progress(1),
      });
    } else document.documentElement.dataset.motionReady = "true";
    document.querySelectorAll(".reveal-title").forEach((el) =>
      gsap.from(el, {
        y: 18,
        duration: motion.reveal,
        ease: motion.ease,
        scrollTrigger: { trigger: el, start: "top 93%", once: true },
      }),
    );
    if (document.querySelector(".timeline-fill"))
      gsap.to(".timeline-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 70%",
          end: "bottom 70%",
          scrub: true,
        },
      });
    document.querySelectorAll(".timeline-item").forEach((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        toggleClass: "reached",
      }),
    );
  });
  mm.add("(min-width: 1025px) and (pointer: fine)", () => {
    if (document.querySelector(".hero-side"))
      gsap.to(".hero-side", {
        y: 24,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    if (document.querySelector(".experience-intro"))
      ScrollTrigger.create({
        trigger: ".experience-intro",
        start: "top 112px",
        endTrigger: ".experience-grid",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      });
  });
  const refresh = () => {
    if (!disposed) ScrollTrigger.refresh();
  };
  const timer = setTimeout(refresh, 180);
  window.addEventListener("portfolio:layout", refresh);
  document.fonts.ready.then(refresh);
  return () => {
    disposed = true;
    clearTimeout(timer);
    window.removeEventListener("portfolio:layout", refresh);
    mm.revert();
    ctx.revert();
    unbind();
    lenis.destroy();
    gsap.ticker.remove(tick);
    document.documentElement.dataset.motionReady = "true";
  };
}
