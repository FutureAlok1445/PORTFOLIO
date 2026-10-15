import { useEffect, useRef, useState } from "react";

/**
 * Custom atelier magnetic reticle cursor.
 * Disabled on touch/coarse devices and reduced motion.
 */
export default function CustomReticle() {
  const reticleRef = useRef(null);
  const [tag, setTag] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return isFine && !reducedMotion;
  });

  useEffect(() => {
    if (!enabled) return;

    const el = reticleRef.current;
    if (!el) return;

    let visible = false;

    const onMouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      el.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      if (!visible) {
        visible = true;
        setIsVisible(true);
      }

      // Check target under cursor for tags/interactivity
      const target = e.target;
      if (!target) return;

      const interactive = target.closest(
        "a, button, input, textarea, select, [data-tooltip], .object-owned-surface, .interactive-sandbox button"
      );

      if (interactive) {
        setIsActive(true);
        const tooltip = interactive.getAttribute("data-tooltip");
        const aria = interactive.getAttribute("aria-label");
        const text = interactive.innerText?.trim();
        const displayTag = tooltip || aria || (text && text.length <= 20 ? text : "");
        setTag(displayTag || "");
      } else {
        setIsActive(false);
        setTag("");
      }
    };

    const onMouseDown = (e) => {
      const target = e.target;
      if (
        target?.closest(".living-room-canvas, canvas, .object-owned-surface, .orbital-node-card")
      ) {
        setIsDragging(true);
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    const onMouseLeave = () => {
      visible = false;
      setIsVisible(false);
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={reticleRef}
      className={`atelier-reticle ${isActive ? "is-active" : ""} ${
        isDragging ? "is-dragging" : ""
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      <div className="reticle-dot" />
      {tag && <span className="reticle-tag">{tag}</span>}
    </div>
  );
}
