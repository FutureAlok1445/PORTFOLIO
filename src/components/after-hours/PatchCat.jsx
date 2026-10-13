import { useEffect, useRef, useState } from "react";
import manifest from "../../../public/images/after-hours/patch/patch-manifest.json";
export default function PatchCat({
  variant = "idle",
  interactive = false,
  label = "Say hello to Patch",
  size = 96,
  direction = "right",
}) {
  const [reaction, setReaction] = useState(null);
  const host = useRef(null);
  const timer = useRef(null);
  const count = useRef(0);
  const state = reaction || { sit: "idle", curl: "sleep" }[variant] || variant;
  const animation = manifest.animations[state] || manifest.animations.idle;
  useEffect(() => {
    const el = host.current;
    const reduced = matchMedia("(prefers-reduced-motion:reduce)");
    let inView = false;
    function sync() {
      el.classList.toggle(
        "patch-visible",
        inView && !document.hidden && !reduced.matches,
      );
      el.classList.toggle("patch-static", reduced.matches);
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      clearTimeout(timer.current);
    };
  }, []);
  function hello() {
    clearTimeout(timer.current);
    const next = ["paw", "blink", "tail", "peek", "walk"][count.current++ % 5];
    setReaction(next);
    timer.current = setTimeout(
      () => setReaction(null),
      next === "walk" ? 1900 : 1500,
    );
  }
  const props = {
    ref: host,
    className: `patch-button patch-${state}`,
    style: { width: size, height: size },
    ...(interactive
      ? { onClick: hello, "aria-label": label, title: label }
      : { "aria-hidden": true }),
  };
  const sprite = (
    <span
      key={state}
      className="patch-sprite"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(/images/after-hours/patch/${animation.file})`,
        "--sheet-width": `${size * animation.frames}px`,
        "--frames": animation.frames,
        "--duration": `${animation.frames / animation.fps}s`,
        "--iterations": animation.loop ? "infinite" : 1,
        scale: direction === "left" ? "-1 1" : undefined,
      }}
    />
  );
  return interactive ? (
    <button type="button" {...props}>
      {sprite}
    </button>
  ) : (
    <span {...props}>{sprite}</span>
  );
}
