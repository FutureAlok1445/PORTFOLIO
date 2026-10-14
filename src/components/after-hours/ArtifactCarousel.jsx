import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { content } from "../../data/content";
import ProjectArt from "../ProjectArt";
import { useExperience } from "./ExperienceContext";
export default function ArtifactCarousel() {
  const e = useExperience(),
    start = useRef(null),
    swiped = useRef(false),
    inspectButton = useRef(null),
    p = content.projects[e.selected];
  const inspect = e.inspect;
  function keys(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    e.select(
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? content.projects.length-1
          : e.selected + (event.key === "ArrowRight" ? 1 : -1),
    );
  }
  function close() {
    e.inspect(false);
    inspectButton.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    let frame;
    const key = (event) => {
      if (
        event.key === "Escape" &&
        !document.querySelector("dialog[open]") &&
        document.querySelector(".artifact-inspection")
      ) {
        inspect(false);
        frame = requestAnimationFrame(() =>
          inspectButton.current?.focus({ preventScroll: true }),
        );
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", key);
    };
  }, [inspect]);
  return (
    <div className="archive-browser" onKeyDown={keys}>
      {!e.live && (
        <div
          className="curved-archive"
          onDragStart={(event) => event.preventDefault()}
          onPointerMove={(event) => {
            const s = start.current;
            if (
              s &&
              Math.abs(event.clientX - s.x) > 24 &&
              Math.abs(event.clientX - s.x) > Math.abs(event.clientY - s.y)
            )
              event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerDown={(event) => {
            swiped.current = false;
            start.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            const s = start.current;
            if (
              s &&
              Math.abs(event.clientX - s.x) > 45 &&
              Math.abs(event.clientX - s.x) > Math.abs(event.clientY - s.y)
            ) {
              swiped.current = true;
              e.select(e.selected + (event.clientX < s.x ? 1 : -1));
            }
            start.current = null;
          }}
          onPointerCancel={() => {
            start.current = null;
          }}
          onClickCapture={(event) => {
            if (swiped.current) {
              event.preventDefault();
              event.stopPropagation();
              swiped.current = false;
            }
          }}
        >
          {content.projects.map((project, index) => {
            const delta = ((index - e.selected + 18) % 12) - 6;
            return (
              Math.abs(delta) <= 2 && (
                <button
                  className="archive-file"
                  key={project.slug}
                  style={{ "--offset": delta }}
                  onClick={() => e.select(index)}
                  aria-label={"Select " + project.title}
                  aria-pressed={index === e.selected}
                >
                  <ProjectArt
                    project={project}
                    priority={index === e.selected}
                  />
                </button>
              )
            );
          })}
        </div>
      )}
      <div className="archive-detail">
        <p className="sr-only" role="status">
          {p.title}, project {e.selected + 1} of {content.projects.length}.
        </p>
        <div className="archive-pagination">
          <button
            onClick={() => e.select(e.selected - 1)}
            aria-label="Previous project"
          >
            <ArrowLeft size={19} />
          </button>
          <span>{String(e.selected + 1).padStart(2, "0")} / 12</span>
          <button
            onClick={() => e.select(e.selected + 1)}
            aria-label="Next project"
          >
            <ArrowRight size={19} />
          </button>
        </div>
        <p className="eyebrow">
          {p.category} · {p.status}
        </p>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <div className="archive-actions">
          <button
            ref={inspectButton}
            className="text-link"
            onClick={() => e.inspect(!e.inspecting)}
            aria-expanded={e.inspecting}
          >
            Inspect artifact <ArrowUpRight size={17} />
          </button>
          <Link className="button" to={"/projects/" + p.slug}>
            Read case study <ArrowUpRight size={17} />
          </Link>
        </div>
        {e.inspecting && (
          <div className="artifact-inspection">
            <button onClick={close} aria-label="Close artifact inspection">
              <X size={18} />
            </button>
            <ProjectArt project={p} priority />
            <p>Authored system illustration · {p.stack.join(" / ")}</p>
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noopener noreferrer">
                View source ↗
              </a>
            )}
            {p.live && (
              <a href={p.live} target="_blank" rel="noopener noreferrer">
                Live project ↗
              </a>
            )}
          </div>
        )}
        <div className="archive-index" aria-label="Choose a project">
          {content.projects.map((project, index) => (
            <button
              key={project.slug}
              onClick={() => e.select(index)}
              aria-pressed={index === e.selected}
              title={project.title}
              aria-label={"Select " + project.title}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <Link className="text-link" to="/projects">
          Browse all twelve projects <ArrowUpRight size={17} />
        </Link>
        <p className="archive-hint">
          Drag the archive or use ← →. Home and End jump to the first and last
          file.
        </p>
      </div>
    </div>
  );
}
