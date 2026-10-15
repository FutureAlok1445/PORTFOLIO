import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Search, Sparkles, TableProperties } from "lucide-react";
import { content } from "../data/content";
import { featuredProjects } from "../data/workshopSelectors";
import ProjectArtifact from "./after-hours/ProjectArtifact";
import ArtifactCarousel from "./after-hours/ArtifactCarousel";
import { playKeyClick } from "../utils/sound";

export function ArchiveLedger({ items }) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((p) =>
    (p.title + " " + p.category + " " + p.stack.join(" ") + " " + p.summary)
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="archive-ledger-block" aria-label="Interactive project archive table">
      <div className="ledger-header">
        <div>
          <span className="mono-telemetry">
            <TableProperties size={14} /> COMPLETE ENGINEERING LEDGER ({filtered.length} / {items.length})
          </span>
          <h3>Full Build Index &amp; Technical Specifications</h3>
        </div>
        <label className="ledger-search">
          <Search size={16} />
          <span className="sr-only">Filter archive by stack, domain, or title</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by stack (e.g. FastAPI, PyTorch, Docker)..."
          />
        </label>
      </div>
      <div className="ledger-table-wrap">
        <table className="ledger-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">System</th>
              <th scope="col">Domain</th>
              <th scope="col">Architecture Stack</th>
              <th scope="col">Status</th>
              <th scope="col">Blueprint / Links</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={p.slug} className={p.featured ? "is-flagship-row" : ""}>
                <td className="mono-cell">{String(idx + 1).padStart(2, "0")}</td>
                <td>
                  <Link
                    to={"/projects/" + p.slug}
                    className="ledger-title-link"
                    onClick={() => playKeyClick(1.05)}
                  >
                    <strong>{p.title}</strong>
                    {p.featured && <span className="flagship-tag">★ Flagship</span>}
                  </Link>
                  <small className="ledger-sub">{p.description}</small>
                </td>
                <td>{p.category}</td>
                <td>
                  <div className="ledger-chips">
                    {p.stack.slice(0, 5).map((s) => (
                      <span key={s} className="mono-chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className="status-tag">{p.status}</span>
                </td>
                <td className="ledger-actions-cell">
                  <Link to={"/projects/" + p.slug} className="ledger-link">
                    Case study <ArrowUpRight size={14} />
                  </Link>
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" className="ledger-link">
                      GitHub <ArrowUpRight size={14} />
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="ledger-link">
                      Live <ArrowUpRight size={14} />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProjectCollection() {
  const [filter, setFilter] = useState("All");
  const filters = [
    "All",
    "Flagship",
    ...new Set(content.projects.flatMap((p) => p.filters || [])),
  ];
  const projects = content.projects.filter((p) =>
    filter === "All"
      ? true
      : filter === "Flagship"
        ? p.featured
        : p.filters?.includes(filter),
  );
  function keys(e) {
    if (
      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key) ||
      e.target.closest(".artifact-quick")
    )
      return;
    const links = [...e.currentTarget.querySelectorAll(".artifact-link")];
    const current = links.indexOf(document.activeElement);
    if (current < 0) return;
    e.preventDefault();
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? links.length - 1
          : Math.max(
              0,
              Math.min(
                links.length - 1,
                current + (e.key === "ArrowRight" ? 1 : -1),
              ),
            );
    links[next].focus();
  }
  return (
    <section className="work container project-library all-projects">
      <div className="section-heading library-heading">
        <h1 className="serif">{content.workshop.workTitle}</h1>
        <p>{content.workshop.workIntro}</p>
      </div>
      <div className="library-tools">
        <div className="filters" aria-label="Filter projects by domain">
          {filters.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              className={filter === f ? "selected" : ""}
              onClick={() => {
                playKeyClick(0.95);
                setFilter(f);
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <span role="status" className="library-count">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>
      <h2 className="sr-only">Project case files</h2>
      <div
        className="artifact-shelf"
        onKeyDown={keys}
        aria-label="Project case-study collection"
      >
        {projects.map((p) => (
          <ProjectArtifact key={p.slug} project={p} />
        ))}
      </div>
      <ArchiveLedger items={content.projects} />
    </section>
  );
}

export default function Projects() {
  const [showLedger, setShowLedger] = useState(false);
  const flagships = featuredProjects();
  return (
    <section id="work" className="work container project-library">
      <div className="section-heading library-heading">
        <div>
          <span className="mono-telemetry">
            <Sparkles size={14} /> CURATED SYSTEMS ({flagships.length} FLAGSHIP · {content.projects.length} TOTAL)
          </span>
          <h2 className="serif">{content.workshop.workTitle}</h2>
        </div>
        <p>{content.workshop.workIntro}</p>
      </div>
      <ArtifactCarousel />
      <div className="ledger-toggle-bar">
        <button
          type="button"
          className="ledger-toggle-btn"
          aria-expanded={showLedger}
          onClick={() => {
            playKeyClick(1.08);
            setShowLedger((v) => !v);
          }}
        >
          <TableProperties size={16} />
          {showLedger
            ? "Hide full engineering index table"
            : `Open interactive engineering ledger (${content.projects.length} builds)`}
        </button>
      </div>
      {showLedger && <ArchiveLedger items={content.projects} />}
    </section>
  );
}
