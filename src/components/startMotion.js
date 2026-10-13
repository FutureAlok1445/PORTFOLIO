import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { bindScroll } from "./scroll";
gsap.registerPlugin(ScrollTrigger);
export function startMotion() {
  let disposed = false;
  const lenis = new Lenis({
    duration: 0.85,
    smoothWheel: true,
    anchors: false,
    prevent: (node) => node.tagName === "DIALOG",
  });
  const unbind = bindScroll(lenis);
  const tick = (time) => lenis.raf(time * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  const ctx = gsap.context(() => {
    if (document.querySelector(".workshop-hero")) {
      gsap.from(".workshop-copy", { y: 12, duration: 0.8, ease: "expo.out" });
      gsap.from(".workshop-environment", {
        y: 8,
        duration: 1,
        ease: "expo.out",
      });
    }
    if (document.querySelector(".timeline-fill"))
      gsap.to(".timeline-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 75%",
          end: "bottom 75%",
          scrub: true,
        },
      });
  });
  document.documentElement.dataset.motionReady = "true";
  const refresh = () => {
    if (!disposed) {
      ScrollTrigger.refresh();
      document.documentElement.dataset.motionTriggers = String(
        ScrollTrigger.getAll().length,
      );
    }
  };
  const timer = setTimeout(refresh, 180);
  window.addEventListener("portfolio:layout", refresh);
  document.fonts.ready.then(refresh);
  return () => {
    disposed = true;
    clearTimeout(timer);
    window.removeEventListener("portfolio:layout", refresh);
    ctx.revert();
    unbind();
    lenis.destroy();
    gsap.ticker.remove(tick);
    document.documentElement.dataset.motionReady = "true";
    document.documentElement.dataset.motionTriggers = String(
      ScrollTrigger.getAll().length,
    );
  };
}
