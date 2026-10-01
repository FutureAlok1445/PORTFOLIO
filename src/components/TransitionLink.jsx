import { Link } from "react-router-dom";
import { useSyncExternalStore } from "react";
const media = window.matchMedia("(prefers-reduced-motion: reduce)");
const subscribe = (callback) => {
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => media.matches);
}
export default function TransitionLink(props) {
  const reduced = useReducedMotion();
  return (
    <Link
      {...props}
      viewTransition={
        !reduced && typeof document.startViewTransition === "function"
      }
    />
  );
}
