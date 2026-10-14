import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useRef,
  useState,
} from "react";
import { useExperience } from "./ExperienceContext";
import PatchCat from "./PatchCat";
const WorkshopCanvas = lazy(() => import("../../scene/WorkshopCanvas"));
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function WorkshopStage() {
  const e = useExperience(),
    anchor = useRef(null),
    [ready, setReady] = useState(false),
    markReady = useCallback(() => setReady(true), [setReady]);
  if (!e.live) return null;
  return (
    <div
      className={"workshop-stage " + (ready ? "is-ready" : "")}
      aria-label="Living workshop scene"
      role="region"
    >
      <img
        className="world-poster"
        src="/images/after-hours/desk/workshop-desktop.webp"
        alt=""
        width="1600"
        height="900"
      />
      <SceneBoundary onFail={e.sceneFailed}>
        <Suspense fallback={null}>
          <WorkshopCanvas patchAnchor={anchor} onReady={markReady} />
        </Suspense>
      </SceneBoundary>
      <div className="world-patch-anchor" ref={anchor}>
        <PatchCat
          size={145}
          interactive
          label="Pet Patch"
          ambient={e.ambient}
          chapter={e.chapter}
          lampOn={e.lampOn}
        />
      </div>
    </div>
  );
}
