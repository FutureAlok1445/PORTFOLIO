import { ArrowUpRight } from "lucide-react";
import Link from "../TransitionLink";
import ProjectMedia from "../ProjectMedia";
export default function ProjectArtifact({ project: p }) {
  return (
    <article className="project-card">
      <Link
        className="artifact-link"
        to={"/projects/" + p.slug}
        aria-label={"View " + p.title + " project"}
      >
        <div
          className="artifact-visual"
          style={{ viewTransitionName: "project-" + p.slug }}
        >
          <ProjectMedia project={p} />
        </div>
        <div className="artifact-heading">
          <h3>{p.title}</h3>
          <ArrowUpRight size={19} />
        </div>
        <span className="artifact-status">{p.status}</span>
        <p>{p.description}</p>
        <div className="artifact-stack">
          {p.stack.slice(0, 4).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </Link>
      <div className="artifact-quick">
        <Link
          to={"/projects/" + p.slug}
          aria-label={"Read case study for " + p.title}
        >
          Open case file <ArrowUpRight size={14} />
        </Link>
        {p.repo && (
          <a
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={"View GitHub repository for " + p.title}
          >
            GitHub <ArrowUpRight size={14} />
          </a>
        )}
        {p.live && (
          <a
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={"Open live demo for " + p.title}
          >
            Live project <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
