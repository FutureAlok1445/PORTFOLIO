import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Link from "../components/TransitionLink";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { content } from "../data/content";
import ProjectMedia from "../components/ProjectMedia";
import ProjectArchitecture from "../components/ProjectArchitecture";
import NotFound from "./NotFound";
import { useMotion } from "../components/useMotion";
export default function Project() {
  const { slug } = useParams();
  useMotion(slug);
  const project = content.projects.find((p) => p.slug === slug);
  useEffect(() => {
    document.title = project
      ? project.title + " — Alok Sahoo"
      : "Page not found — Alok Sahoo";
    const description = document.querySelector('meta[name="description"]');
    const original = description?.content;
    if (description && project) description.content = project.summary;
    return () => {
      document.title = "Alok Sahoo — Software Engineer";
      if (description) description.content = original;
    };
  }, [project]);
  if (!project) return <NotFound />;
  const index = content.projects.indexOf(project);
  const previous =
    content.projects[
      (index + content.projects.length - 1) % content.projects.length
    ];
  const next = content.projects[(index + 1) % content.projects.length];
  return (
    <main id="main" className="case-study container">
      <div className="case-wayfinding">
        <Link to="/#work" className="text-link">
          <ArrowLeft size={17} /> Project library
        </Link>
        <span>
          Project {String(index + 1).padStart(2, "0")} /{" "}
          {String(content.projects.length).padStart(2, "0")}
        </span>
      </div>
      <header className="detail-heading case-hero">
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <div className="case-meta">
          <span>{project.category}</span>
          <span>{project.status}</span>
          {project.role && <span>{project.role}</span>}
          {project.year && <span>{project.year}</span>}
        </div>
        <div className="case-links">
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer">
              View repository <ArrowUpRight size={17} />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer">
              Open live project <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </header>
      <div
        className="case-visual"
        style={{ viewTransitionName: "project-" + slug }}
      >
        <ProjectMedia key={slug} project={project} priority />
      </div>
      <div className="case-introduction">
        <section>
          <h2>Why it exists.</h2>
          <p>{project.problem}</p>
        </section>
        <section>
          <h2>What the system does.</h2>
          <p>{project.solution || project.details.join(" ")}</p>
        </section>
      </div>
      {project.nodes.length > 0 && (
        <ProjectArchitecture key={slug} nodes={project.nodes} />
      )}
      <section className="case-features">
        <div className="case-section-heading">
          <h2>Inside the build.</h2>
          <p>Core engineering modules and operational workflows.</p>
        </div>
        <ul>
          {(project.features || []).map((f) => (
            <li key={f}>
              <h3>{f}</h3>
            </li>
          ))}
        </ul>
      </section>
      <div className="case-engineering">
        <section>
          <h2>Engineering decisions.</h2>
          <ul className="decision-list">
            {project.decisions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
        <section className="case-stack">
          <h2>Technology.</h2>
          {Object.entries(project.techGroups || {}).map(([group, values]) => (
            <div key={group}>
              <h3>{group}</h3>
              <p>{values.join(" · ")}</p>
            </div>
          ))}
        </section>
      </div>
      <section className="case-status">
        <div>
          <h2>Impact & Architecture Scope.</h2>
          <p>{project.outcome}</p>
        </div>
      </section>
      {(project.live || project.repo) && (
        <section className="case-cta-banner">
          <div className="case-cta-text">
            <h2>Ready to inspect the build?</h2>
            <p>
              Experience the deployed application or review the complete codebase on GitHub.
            </p>
          </div>
          <div className="case-cta-actions">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="case-btn-primary"
              >
                Open Live Application <ArrowUpRight size={17} />
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="case-btn-secondary"
              >
                Browse GitHub Code <ArrowUpRight size={17} />
              </a>
            )}
          </div>
        </section>
      )}
      <nav
        className="project-pagination case-pagination"
        aria-label="More projects"
      >
        <Link to={"/projects/" + previous.slug}>
          <ArrowLeft size={20} />
          <div>
            <small>Previous project</small>
            <span>{previous.title}</span>
          </div>
        </Link>
        <Link to={"/projects/" + next.slug}>
          <div>
            <small>Next project</small>
            <span>{next.title}</span>
          </div>
          <ArrowRight size={20} />
        </Link>
      </nav>
    </main>
  );
}
