import { useEffect } from "react";
export function useMotion(route) {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let disposed = false;
    let cleanup;
    import("./startMotion").then(({ startMotion }) => {
      if (!disposed) cleanup = startMotion();
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [route]);
}
