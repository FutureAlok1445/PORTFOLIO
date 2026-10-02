import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { content } from "../data/content";
import ProjectBook from "./ProjectBook";
export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [position, setPosition] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = useRef(null);
  const filters = [
    "All",
    ...new Set(content.projects.flatMap((p) => p.filters || [])),
  ];
  const projects = content.projects.filter(
    (p) => filter === "All" || p.filters?.includes(filter),
  );
  useEffect(() => {
    const el = track.current;
    el.scrollLeft = 0;
    let frame = 0;
    function measure() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const children = [...el.children];
        const origin = children[0]?.offsetLeft || 0;
        const nearest = children.reduce(
          (best, child, i) =>
            Math.abs(child.offsetLeft - origin - el.scrollLeft) <
            Math.abs(children[best].offsetLeft - origin - el.scrollLeft)
              ? i
              : best,
          0,
        );
        setPosition(nearest);
        const range = el.scrollWidth - el.clientWidth;
        setAtEnd(range < 2 || el.scrollLeft >= range - 2);
        setProgress(range > 0 ? el.scrollLeft / range : 1);
      });
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    window.dispatchEvent(new Event("portfolio:layout"));
    measure();
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
      cancelAnimationFrame(frame);
    };
  }, [filter]);
  function navigate(index, focus = false) {
    const el = track.current;
    const child =
      el.children[Math.max(0, Math.min(projects.length - 1, index))];
    if (!child) return;
    el.scrollTo({
      left: child.offsetLeft - el.children[0].offsetLeft,
      behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
        ? "instant"
        : "smooth",
    });
    if (focus) child.querySelector("a").focus({ preventScroll: true });
  }
  function keys(e) {
    if (!matchMedia("(min-width: 769px)").matches) return;
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const focused = [...track.current.children].findIndex((c) =>
        c.contains(document.activeElement),
      );
      const current = focused < 0 ? position : focused;
      navigate(
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? projects.length - 1
            : current + (e.key === "ArrowRight" ? 1 : -1),
        true,
      );
    }
  }
  return (
    <section id="work" className="work container project-library">
      <div className="section-heading library-heading">
        <h2 className="serif reveal-title">
          Selected Systems.
          <br />
          <em>Built with purpose.</em>
        </h2>
        <p>
          Real problems. Robust architectures.
          <br />
          Explore the systems, code, and live deployments.
        </p>
      </div>
      <div className="library-tools">
        <div className="filters" aria-label="Filter projects by domain">
          {filters.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              className={filter === f ? "selected" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="library-count" role="status">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>
      <div
        className="library-track"
        ref={track}
        onKeyDown={keys}
        data-lenis-prevent-wheel
        aria-label="Project case-study collection"
      >
        {projects.map((p) => (
          <ProjectBook
            key={p.slug}
            project={p}
            index={content.projects.indexOf(p)}
            total={content.projects.length}
          />
        ))}
      </div>
      <div className="library-navigation">
        <span className="library-position">
          {String(position + 1).padStart(2, "0")}{" "}
          <span>/ {String(projects.length).padStart(2, "0")}</span>
        </span>
        <div className="library-progress" aria-hidden="true">
          <span
            style={{
              transform: `scaleX(${Math.max(1 / projects.length, progress)})`,
            }}
          />
        </div>
        <span className="library-hint">Scroll sideways or use the arrows</span>
        <div className="library-arrows">
          <button
            onClick={() => navigate(position - 1)}
            disabled={position === 0}
            aria-label="Previous chapter"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => navigate(position + 1)}
            disabled={atEnd}
            aria-label="Next chapter"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
