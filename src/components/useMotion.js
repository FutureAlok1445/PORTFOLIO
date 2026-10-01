import { useEffect } from "react";
export function useMotion(route) {
  useEffect(() => {
    let disposed = false;
    let cleanup;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const run = () => {
      cleanup?.();
      cleanup = undefined;
      document.documentElement.dataset.motionReady = reduced.matches
        ? "true"
        : "false";
      if (!reduced.matches)
        import("./startMotion").then(({ startMotion }) => {
          if (!disposed && !reduced.matches) cleanup = startMotion();
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
