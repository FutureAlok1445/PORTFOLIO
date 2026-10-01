import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "./scroll";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame;
    const checkScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setVisible(window.scrollY > 480);
      });
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <button
      className={`back-to-top ${visible ? "visible" : ""}`}
      onClick={() => scrollToTarget(0)}
      aria-label="Scroll to top"
      data-tooltip="Scroll to top"
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={16} />
      <span>Top</span>
    </button>
  );
}
