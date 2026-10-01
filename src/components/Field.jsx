import { useEffect, useRef } from "react";
export default function Field() {
  const canvas = useRef();
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion:reduce)").matches ||
      matchMedia("(pointer:coarse)").matches ||
      navigator.hardwareConcurrency < 4
    )
      return;
    const el = canvas.current;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    let raf;
    let visible = true;
    let width = 0;
    let height = 0;
    const pointer = { x: -1000, y: -1000 };
    const resize = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = width;
      el.height = height;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const move = (e) => {
      const r = el.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let x = 20; x < width; x += 36) {
        for (let y = 20; y < height; y += 36) {
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          ctx.fillStyle =
            d < 130 ? "rgba(37,76,189,.3)" : "rgba(90,110,145,.09)";
          ctx.beginPath();
          ctx.arc(x, y, d < 130 ? 1.5 : 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(render);
    };
    const visibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && visible) render();
    };
    const intersection = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visibility();
    });
    intersection.observe(el);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    render();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return <canvas className="field-canvas" ref={canvas} aria-hidden="true" />;
}
