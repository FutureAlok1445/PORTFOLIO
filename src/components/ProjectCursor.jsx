import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
export default function ProjectCursor() {
  const ref = useRef();
  useEffect(() => {
    const cursor = ref.current;
    const fine = matchMedia("(pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    const position = { x: -1000, y: -1000, buttons: 0 };
    const update = (target) => {
      const artwork =
        fine.matches &&
        !reduced.matches &&
        target?.closest?.('[data-cursor="view"]');
      cursor.classList.toggle("on", !!artwork);
      if (artwork) {
        cursor.style.translate = `${position.x}px ${position.y}px`;
        cursor.dataset.state = position.buttons ? "drag" : "view";
      }
    };
    const pointer = (e) => {
      position.x = e.clientX;
      position.y = e.clientY;
      position.buttons = e.buttons;
      update(e.target);
    };
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        update(document.elementFromPoint(position.x, position.y)),
      );
    };
    const hide = () => cursor.classList.remove("on");
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointerdown", hide);
    fine.addEventListener("change", hide);
    reduced.addEventListener("change", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("mouseleave", hide);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pointerdown", hide);
      fine.removeEventListener("change", hide);
      reduced.removeEventListener("change", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("mouseleave", hide);
    };
  }, []);
  return (
    <div className="view-cursor" ref={ref} aria-hidden="true">
      View <ArrowUpRight size={18} />
    </div>
  );
}
