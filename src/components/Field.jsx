import { useEffect, useRef } from "react";
const labels = ["API", "AI", "DB", "SYS"];
export default function Field() {
  const canvas = useRef();
  useEffect(() => {
    const el = canvas.current;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const allowed = matchMedia(
      "(min-width: 769px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const lowPower =
      navigator.hardwareConcurrency < 4 ||
      (navigator.deviceMemory && navigator.deviceMemory < 4) ||
      navigator.connection?.saveData;
    let frame,
      last = 0,
      time = 0,
      visible = false,
      width = 0,
      height = 0,
      bounds;
    const pointer = { x: -2000, y: -2000 };
    const nodes = Array.from({ length: 28 }, (_, i) => ({
      u: 0.04 + (((i * 13) % 29) / 29) * 0.92,
      v: 0.04 + (((i * 17) % 31) / 31) * 0.92,
      phase: i * 1.7,
      x: 0,
      y: 0,
    }));
    const links = [];
    nodes.forEach((a, i) =>
      nodes.forEach((b, j) => {
        if (j > i && Math.hypot(a.u - b.u, a.v - b.v) < 0.23)
          links.push([a, b]);
      }),
    );
    el.dataset.nodeCount = String(nodes.length);
    const render = (timestamp) => {
      frame = requestAnimationFrame(render);
      if (timestamp - last < 1000 / 30) return;
      time += Math.min((timestamp - (last || timestamp)) / 1000, 0.08);
      last = timestamp;
      ctx.clearRect(0, 0, width, height);
      for (const n of nodes) {
        const x = n.u * width + Math.sin(time * 0.16 + n.phase) * 8;
        const y = n.v * height + Math.cos(time * 0.12 + n.phase) * 6;
        const dx = pointer.x - x,
          dy = pointer.y - y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / 160) * 3;
        n.x = x + (dx / Math.max(distance, 1)) * influence;
        n.y = y + (dy / Math.max(distance, 1)) * influence;
      }
      ctx.strokeStyle = "rgba(112,133,160,.10)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      for (const [a, b] of links) {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle =
          i % 7 === 0 ? "rgba(237,107,54,.18)" : "rgba(112,133,160,.16)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, i % 7 === 0 ? 2 : 1.4, 0, Math.PI * 2);
        ctx.fill();
        if (i % 7 === 0) {
          ctx.font = "12px Space, sans-serif";
          ctx.fillStyle = "rgba(112,133,160,.14)";
          ctx.fillText(labels[i / 7], n.x + 8, n.y - 7);
        }
      }
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      const active =
        visible && !document.hidden && allowed.matches && !lowPower;
      el.dataset.animationActive = String(active);
      if (active) frame = requestAnimationFrame(render);
      else if (!allowed.matches || lowPower) ctx.clearRect(0, 0, width, height);
    };
    const resize = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      bounds = el.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e) => {
      if (bounds) {
        pointer.x = e.clientX - bounds.left;
        pointer.y = e.clientY - bounds.top;
      }
    };
    const scroll = () => {
      if (visible) bounds = el.getBoundingClientRect();
    };
    const leave = () => {
      pointer.x = pointer.y = -2000;
    };
    resize();
    const sizing = new ResizeObserver(resize);
    sizing.observe(el);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    allowed.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("blur", leave);
    return () => {
      cancelAnimationFrame(frame);
      sizing.disconnect();
      observer.disconnect();
      allowed.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("blur", leave);
    };
  }, []);
  return (
    <canvas
      className="field-canvas"
      ref={canvas}
      aria-hidden="true"
      data-animation-active="false"
    />
  );
}
