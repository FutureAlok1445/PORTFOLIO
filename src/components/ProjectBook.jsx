import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "./TransitionLink";
import ProjectMedia from "./ProjectMedia";
export default function ProjectBook({ project, index }) {
  const surface = useRef(null);
  const pointer = useRef({ frame: 0, rect: null });
  useEffect(() => {
    const state = pointer.current;
    return () => cancelAnimationFrame(state.frame);
  }, []);
  function reset() {
    cancelAnimationFrame(pointer.current.frame);
    surface.current?.style.removeProperty("--book-rx");
    surface.current?.style.removeProperty("--book-ry");
  }
  function move(event) {
    if (
      event.pointerType !== "mouse" ||
      !matchMedia(
        "(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
      ).matches
    )
      return;
    const rect = pointer.current.rect;
    if (!rect) return;
    const x = Math.max(
      -1,
      Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
    );
    const y = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
    cancelAnimationFrame(pointer.current.frame);
    pointer.current.frame = requestAnimationFrame(() => {
      surface.current?.style.setProperty("--book-ry", `${x * 5}deg`);
      surface.current?.style.setProperty("--book-rx", `${y * -2}deg`);
    });
  }
  return (
    <article
      className="project-card book-slot"
      onPointerEnter={(e) => {
        pointer.current.rect = e.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <Link
        ref={surface}
        to={"/projects/" + project.slug}
        className="project-book-surface"
        data-cursor="view"
        aria-label={"View " + project.title + " project"}
      >
        <div className="book-masthead">
          <span className="book-index-pill">
            Project #{String(index + 1).padStart(2, "0")}
          </span>
          {project.status && (
            <span
              className={`book-status-tag ${
                project.status.toLowerCase().includes("finalist")
                  ? "status-finalist"
                  : project.live
                    ? "status-live"
                    : ""
              }`}
            >
              {project.status}
            </span>
          )}
        </div>
        <div
          className="book-cover"
          style={{ viewTransitionName: "project-" + project.slug }}
        >
          <ProjectMedia project={project} />
        </div>
        <div className="book-copy">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
        <div className="book-tags">
          {project.stack.slice(0, 3).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </Link>
      <div className="book-quick-bar">
        <Link
          to={"/projects/" + project.slug}
          className="quick-btn quick-btn-case"
          aria-label={`Read case study for ${project.title}`}
        >
          <span>Case study</span>
          <ArrowUpRight size={13} />
        </Link>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-btn quick-btn-live"
            aria-label={`Open live demo for ${project.title}`}
          >
            <span>Live Demo</span>
            <ArrowUpRight size={13} />
          </a>
        )}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-btn quick-btn-repo"
            aria-label={`View GitHub repository for ${project.title}`}
          >
            <span>GitHub</span>
            <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </article>
  );
}
