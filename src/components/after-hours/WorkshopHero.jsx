import {
  Component,
  lazy,
  Suspense,
  useSyncExternalStore,
  useState,
} from "react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { content } from "../../data/content";
import { scrollToTarget } from "../scroll";
import PatchCat from "./PatchCat";
const DeskScene3D = lazy(() => import("./DeskScene3D"));
class DeskFallbackBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
const media = matchMedia(
  "(min-width: 1025px) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
);
const subscribe = (callback) => {
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
export default function WorkshopHero() {
  const desktop = useSyncExternalStore(subscribe, () => media.matches);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const allowed =
    desktop &&
    !navigator.connection?.saveData &&
    !(navigator.hardwareConcurrency < 4) &&
    !(navigator.deviceMemory && navigator.deviceMemory < 4);
  const p = content.profile,
    w = content.workshop;
  function jump(e, id) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    scrollToTarget(id);
  }
  return (
    <section
      className="workshop-hero hero container"
      aria-labelledby="hero-heading"
    >
      <div className="workshop-grid">
        <div className="workshop-copy">
          <h1 id="hero-heading" className="hero-title" aria-label={p.name}>
            <span className="hero-line">
              <span className="hero-line-inner">{p.firstName}</span>
            </span>
            <span className="hero-line">
              <span className="hero-line-inner">
                {p.name.split(" ").slice(1).join(" ")}
              </span>
            </span>
          </h1>
          <h2>{p.tagline}</h2>
          <p>{p.summary}</p>
          <div className="hero-actions">
            <a href="#work" className="button" onClick={(e) => jump(e, "work")}>
              Explore my work <ArrowUpRight size={18} />
            </a>
            <a href={p.resume} download className="resume-link">
              Take my resume <Download size={16} />
            </a>
          </div>
          <div className="hero-person">
            {!portraitFailed && (
              <img
                src={p.portraitSmall || p.portrait}
                alt="Alok Sahoo at a technology event"
                width="58"
                height="72"
                onError={() => setPortraitFailed(true)}
              />
            )}
            <div>
              <strong>{p.title}</strong>
              {w.portraitCaption}
            </div>
          </div>
        </div>
        <div className="workshop-environment">
          <div className="desk-stage">
            <img
              className="desk-poster"
              src="/images/after-hours/desk/desk-layer.svg"
              alt="Illustrated workshop desk with a monitor, lamp, notebook, keyboard and mug"
              width="800"
              height="560"
              fetchPriority="high"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/images/after-hours/desk/desk-poster.webp";
              }}
            />
            {allowed && (
              <DeskFallbackBoundary>
                <Suspense fallback={null}>
                  <DeskScene3D />
                </Suspense>
              </DeskFallbackBoundary>
            )}
            <PatchCat
              interactive
              label="Say hello to Patch, the workshop cat"
            />
          </div>
          <div className="desk-caption">
            <span>{w.deskCaption}</span>
            <div className="desk-hotspots">
              <a href="#work" onClick={(e) => jump(e, "work")}>
                {w.monitorLink}
              </a>
              <a href="#about" onClick={(e) => jump(e, "about")}>
                {w.notebookLink}
              </a>
              <a href="#contact" onClick={(e) => jump(e, "contact")}>
                {w.noteLink}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-rule">
        <a
          className="scroll-cue"
          href="#about"
          onClick={(e) => jump(e, "about")}
        >
          <ArrowDown size={17} />
          {w.scrollCue}
        </a>
        <span>{w.footerLine}</span>
      </div>
    </section>
  );
}
