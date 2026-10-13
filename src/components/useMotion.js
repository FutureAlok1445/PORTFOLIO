import { useEffect } from "react";
export function useMotion(route) {
  useEffect(() => {
    let disposed = false;
    let cleanup;
    let generation = 0;
    const allowed = matchMedia(
      "(min-width:769px) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
    );
    const run = () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      document.documentElement.dataset.motionReady = allowed.matches
        ? "false"
        : "true";
      if (allowed.matches)
        import("./startMotion").then(({ startMotion }) => {
          if (!disposed && current === generation && allowed.matches)
            cleanup = startMotion();
        });
    };
    run();
    allowed.addEventListener("change", run);
    return () => {
      disposed = true;
      cleanup?.();
      allowed.removeEventListener("change", run);
    };
  }, [route]);
}
