import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "./TransitionLink";
import ProjectMedia from "./ProjectMedia";
export default function ProjectBook({ project, index, total }) {
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
          <span>Chapter {String(index + 1).padStart(2, "0")}</span>
          <span>{String(total).padStart(2, "0")}</span>
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
        <span className="book-explore">
          Explore case study <ArrowUpRight size={18} />
        </span>
      </Link>
    </article>
  );
}
