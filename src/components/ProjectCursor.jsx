import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
export default function ProjectCursor() {
  const ref = useRef();
  useEffect(() => {
    const cursor = ref.current;
    const pointer = (e) => {
      const available =
        matchMedia("(pointer: fine)").matches &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches;
      const artwork = available && e.target.closest?.('[data-cursor="view"]');
      cursor.classList.toggle("on", !!artwork);
      if (artwork) {
        cursor.style.translate = `${e.clientX}px ${e.clientY}px`;
        cursor.dataset.state = e.buttons ? "drag" : "view";
      }
    };
    const hide = () => cursor.classList.remove("on");
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("scroll", hide);
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
