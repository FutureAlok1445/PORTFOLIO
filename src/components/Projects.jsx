import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { content } from "../data/content";
import ProjectArt from "./ProjectArt";
function ProjectImage({ project }) {
  const [failed, setFailed] = useState(false);
  return project.image && !failed ? (
    <img
      src={project.image}
      alt={project.title + " project preview"}
      loading="lazy"
      width="1000"
      height="650"
      onError={() => setFailed(true)}
    />
  ) : (
    <div aria-hidden="true">
      <ProjectArt project={project} />
    </div>
  );
}
export default function Projects() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "React", "Python", "MongoDB"];
  const projects = content.projects.filter(
    (p) => filter === "All" || p.stack.includes(filter),
  );
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      window.dispatchEvent(new Event("portfolio:layout")),
    );
    return () => cancelAnimationFrame(frame);
  }, [filter]);
  return (
    <section id="work" className="work container">
      <div className="section-meta">
        <span>Selected work</span>
        <span>Ideas made tangible</span>
      </div>
      <div className="section-heading">
        <h2 className="serif reveal-title">
          A few things
          <br />
          I’ve put together.
        </h2>
        <div>
          <p>Different challenges. A look at how I approach them.</p>
          <div className="filters" aria-label="Filter projects by stack">
            {filters.map((f) => (
              <button
                aria-pressed={filter === f}
                className={filter === f ? "selected" : ""}
                key={f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="project-grid">
        {projects.map((p) => (
          <article className="project-card" key={p.slug}>
            <Link
              to={"/projects/" + p.slug}
              data-cursor="view"
              className="project-media"
              aria-label={"View " + p.title + " project"}
            >
              <ProjectImage project={p} />
              <span className="project-open">
                <ArrowUpRight size={21} />
              </span>
            </Link>
            <div className="project-caption">
              <div>
                <span className="project-index">
                  <span className="small-dot" />{" "}
                  {String(content.projects.indexOf(p) + 1).padStart(2, "0")} /{" "}
                  {String(content.projects.length).padStart(2, "0")}
                </span>
                <span className="project-category">
                  {p.category}
                  {p.year ? " / " + p.year : ""}
                </span>
                <h3>
                  <Link to={"/projects/" + p.slug}>{p.title}</Link>
                </h3>
                <p>{p.description}</p>
                {p.role && <p className="project-role">{p.role}</p>}
              </div>
              <span className="project-status">{p.status}</span>
            </div>
            <div className="project-stack">
              {p.stack.slice(0, 4).map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      {projects.length === 0 && (
        <p>No projects use this stack yet. Try another filter.</p>
      )}
    </section>
  );
}
