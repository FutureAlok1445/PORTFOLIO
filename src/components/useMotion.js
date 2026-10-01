import { useEffect } from "react";
export function useMotion(route) {
  useEffect(() => {
    let disposed = false;
    let cleanup;
    let generation = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const run = () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      document.documentElement.dataset.motionReady = reduced.matches
        ? "true"
        : "false";
      if (!reduced.matches)
        import("./startMotion").then(({ startMotion }) => {
          if (!disposed && current === generation && !reduced.matches)
            cleanup = startMotion();
        });
    };
    run();
    reduced.addEventListener("change", run);
    return () => {
      disposed = true;
      cleanup?.();
      reduced.removeEventListener("change", run);
    };
  }, [route]);
}
