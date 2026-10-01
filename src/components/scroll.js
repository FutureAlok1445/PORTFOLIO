let controller;
let scheduledFrame;
export function scheduleScrollToTarget(target) {
  cancelAnimationFrame(scheduledFrame);
  const frame = requestAnimationFrame(() => {
    scheduledFrame = undefined;
    scrollToTarget(target);
  });
  scheduledFrame = frame;
  return () => {
    cancelAnimationFrame(frame);
    if (scheduledFrame === frame) scheduledFrame = undefined;
  };
}
export function bindScroll(instance) {
  controller = instance;
  return () => {
    if (controller === instance) controller = undefined;
  };
}
export function scrollToTarget(target) {
  // A direct user action supersedes any queued route anchor.
  cancelAnimationFrame(scheduledFrame);
  scheduledFrame = undefined;
  const element =
    typeof target === "string"
      ? document.getElementById(target.replace(/^#/, ""))
      : target;
  if (typeof target !== "number" && !element) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (controller && !reduced) {
    // Keyboard focus, scrollbars and browser history can change the native offset.
    // Reset the existing controller before applying a new user navigation intent.
    controller.reset();
    controller.scrollTo(typeof target === "number" ? target : element);
  } else if (typeof target === "number")
    window.scrollTo({ top: target, behavior: "instant" });
  else element.scrollIntoView({ behavior: "instant" });
}
