let controller;
export function bindScroll(instance) {
  controller = instance;
  return () => {
    if (controller === instance) controller = undefined;
  };
}
export function scrollToTarget(target) {
  const element =
    typeof target === "string"
      ? document.getElementById(target.replace(/^#/, ""))
      : target;
  if (typeof target !== "number" && !element) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (controller && !reduced) {
    controller.scrollTo(typeof target === "number" ? target : element, {
      offset: typeof target === "number" ? 0 : -96,
    });
  } else if (typeof target === "number")
    window.scrollTo({ top: target, behavior: reduced ? "instant" : "smooth" });
  else element.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
}
