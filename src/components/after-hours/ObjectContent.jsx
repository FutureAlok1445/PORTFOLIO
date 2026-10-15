import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  FolderOpen,
  Mail,
  Network,
  NotebookPen,
} from "lucide-react";
import { content } from "../../data/content";
import { useExperience } from "./ExperienceContext";
import ProjectArchitecture from "../ProjectArchitecture";
import { Contact } from "../Closing";
import { projectArtFor } from "../../data/projectArt";
import CredentialDrawer from "./CredentialDrawer";
import { playPageTurn } from "../../utils/sound";

export function ProjectLinks({ project }) {
  return (
    <div className="object-links">
      <Link to={"/projects/" + project.slug}>
        Full case study <ArrowUpRight size={16} />
      </Link>
      {project.repo && (
        <a href={project.repo} target="_blank" rel="noopener noreferrer">
          Source repository <ArrowUpRight size={16} />
        </a>
      )}
      {project.live && (
        <a href={project.live} target="_blank" rel="noopener noreferrer">
          Live project <ArrowUpRight size={16} />
        </a>
      )}
    </div>
  );
}
export function MonitorApps() {
  const e = useExperience(),
    [app, setApp] = useState(e.subroute),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All");
  const project = content.projects[e.selected];
  const tabs = [
    ["work", "Explorer", FolderOpen],
    ["trace", "Architecture", Network],
    ["about", "About", BookOpen],
    ["log", "Build notes", NotebookPen],
    ["contact", "Contact", Mail],
  ];
  const projects = content.projects.filter(
    (p) =>
      (filter === "All" || p.filters.includes(filter)) &&
      (p.title + " " + p.stack.join(" "))
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="monitor-apps">
      <nav className="desktop-app-tabs" aria-label="Monitor applications">
        {tabs.map(([id, label, Icon]) => (
          <button key={id} aria-pressed={app === id} onClick={() => setApp(id)}>
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>
      {app === "work" && (
        <div className="explorer-layout">
          <aside className="explorer-files">
            <label htmlFor="file-search">Find a project</label>
            <input
              id="file-search"
              type="search"
              value={query}
              onChange={(ev) => setQuery(ev.target.value)}
              placeholder="Title or technology"
            />
            <label htmlFor="file-filter">Domain</label>
            <select
              id="file-filter"
              value={filter}
              onChange={(ev) => setFilter(ev.target.value)}
            >
              {[
                "All",
                ...new Set(content.projects.flatMap((p) => p.filters)),
              ].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <div className="file-list" aria-label="Project files">
              {projects.map((p) => (
                <button
                  key={p.slug}
                  aria-pressed={p.slug === project.slug}
                  onClick={() => e.select(content.projects.indexOf(p))}
                >
                  <FolderOpen size={18} />
                  <span>
                    {p.title}
                    <small>{p.category}</small>
                  </span>
                </button>
              ))}
            </div>
            {!projects.length && (
              <p role="status">
                No matching files. Try another title or technology.
              </p>
            )}
          </aside>
          <article className="explorer-document" key={project.slug}>
            <img
              src={projectArtFor(project).cover}
              alt={project.title + " conceptual system illustration"}
            />
            <small>{project.status}</small>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <h4>The problem</h4>
            <p>{project.problem}</p>
            <p>{project.solution}</p>
            <ProjectLinks project={project} />
            <button
              className="object-primary"
              onClick={() => e.openObject("project")}
            >
              Bring artifact to the inspection station
            </button>
          </article>
        </div>
      )}
      {app === "trace" && (
        <div className="object-reading">
          <label htmlFor="trace-project">System to explore</label>
          <select
            id="trace-project"
            value={e.selected}
            onChange={(ev) => e.select(Number(ev.target.value))}
          >
            {content.projects.map((p, i) => (
              <option key={p.slug} value={i}>
                {p.title}
              </option>
            ))}
          </select>
          <ProjectArchitecture key={project.slug} nodes={project.nodes} project={project} />
          <ProjectLinks project={project} />
        </div>
      )}
      {app === "about" && (
        <div className="object-reading monitor-about">
          <img
            src={content.profile.portraitSmall}
            alt="Alok Sahoo at a technology event"
          />
          <div>
            <h3>{content.profile.name}</h3>
            <p>
              {content.profile.title} · {content.profile.location}
            </p>
            <p>{content.profile.about}</p>
            <button onClick={() => e.openObject("notebook")}>
              Open the field notebook
            </button>
            <a href={content.profile.resume} download>
              Download resume
            </a>
          </div>
        </div>
      )}
      {app === "log" && (
        <div className="object-reading">
          <h3>Notes from real builds</h3>
          <p>Documented choices, with their project context.</p>
          {content.projects
            .filter((p) => p.decisions.length)
            .slice(0, 5)
            .map((p) => (
              <article className="build-note" key={p.slug}>
                <h4>{p.title}</h4>
                <p>{p.decisions[0]}</p>
                <Link to={"/projects/" + p.slug}>
                  Read the engineering context
                </Link>
              </article>
            ))}
        </div>
      )}
      {app === "contact" && (
        <div className="object-reading">
          <h3>Leave a note at the window desk.</h3>
          <p>{content.workshop.contactIntro}</p>
          <button
            className="object-primary"
            onClick={() => e.openObject("contact")}
          >
            Open the writing surface
          </button>
          <a href={"mailto:" + content.profile.email}>
            {content.profile.email}
          </a>
        </div>
      )}
    </div>
  );
}
export function NotebookPages() {
  const e = useExperience(),
    [page, setPage] = useState(0),
    [direction, setDirection] = useState(1),
    touch = useRef(null),
    turnTimer = useRef(null),
    turning = useRef(false),
    [sheet, setSheet] = useState(null);
  useEffect(() => () => clearTimeout(turnTimer.current), []);
  const titles = [
    "About Alok",
    "How I build",
    "Education & current focus",
    "Quick links",
  ];
  function turn(next) {
    next = Math.max(0, Math.min(3, next));
    if (next === page || turning.current) return;
    const dir = next > page ? 1 : -1;
    setDirection(next > page ? 1 : -1);
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
      setPage(next);
      return;
    }
    turning.current = true;
    setSheet({ from: page, to: next, direction: dir });
    playPageTurn();
    e.issue("page", { direction: dir });
    clearTimeout(turnTimer.current);
    turnTimer.current = setTimeout(() => {
      setPage(next);
      setSheet(null);
      turning.current = false;
    }, 650);
  }
  return (
    <div
      className={"notebook-open" + (sheet ? " is-turning" : "")}
      onPointerDown={(ev) => {
        if (ev.pointerType === "touch")
          touch.current = { x: ev.clientX, y: ev.clientY };
      }}
      onPointerUp={(ev) => {
        const start = touch.current;
        touch.current = null;
        if (
          start &&
          Math.abs(ev.clientX - start.x) > 65 &&
          Math.abs(ev.clientY - start.y) < 40
        )
          turn(page + (ev.clientX < start.x ? 1 : -1));
      }}
      onKeyDown={(ev) => {
        if (ev.target.closest("input,textarea,select")) return;
        if (["ArrowRight", "ArrowLeft"].includes(ev.key)) {
          ev.preventDefault();
          turn(page + (ev.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <aside className="notebook-flyleaf">
        {page === 0 ? (
          <>
            <img src={content.profile.portraitSmall} alt="Alok Sahoo" />
            <p>{content.profile.name}</p>
            <small>{content.profile.location}</small>
            <blockquote>{content.profile.quote}</blockquote>
          </>
        ) : (
          <div className="notebook-previous">
            <small>Previous note · {page} / 4</small>
            <h3>{titles[page - 1]}</h3>
            <p>
              {page === 1
                ? content.profile.about
                : page === 2
                  ? content.profile.summary
                  : content.education[0].institution}
            </p>
            <p>{content.profile.quote}</p>
          </div>
        )}
        <span className="book-binding" aria-hidden="true" />
      </aside>
      <div className="notebook-leaf" key={page} data-turn={direction}>
        <h3>{titles[page]}</h3>
        <div className="notebook-print" tabIndex={0} aria-label="Page content">
          {page === 0 && (
            <>
              <p>{content.profile.about}</p>
              <ul>
                {content.profile.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="notebook-signature">Alok</p>
            </>
          )}
          {page === 1 && (
            <>
              <p>{content.profile.summary}</p>
              <p>{content.profile.quote}</p>
              {content.projects.slice(1, 3).map((p) => (
                <section key={p.slug}>
                  <h4>{p.title}</h4>
                  <p>{p.decisions[0]}</p>
                  <Link to={"/projects/" + p.slug}>Read this build</Link>
                </section>
              ))}
            </>
          )}
          {page === 2 && (
            <>
              {content.education.map((en) => (
                <section key={en.institution}>
                  <h4>{en.institution}</h4>
                  <p>{en.degree}</p>
                  <p>
                    {en.date} · {en.record}
                  </p>
                  <p>{en.coursework}</p>
                  <p>Capstone: {en.capstone}</p>
                </section>
              ))}
              <p>{content.profile.summary}</p>
            </>
          )}
          {page === 3 && (
            <div className="notebook-link-index">
              {[
                ["monitor", "Open desktop"],
                ["project", "Inspect selected project"],
                ["toolkit", "Use the workbench"],
                ["journey", "Read the journey board"],
                ["credentials", "Open the record drawer"],
                ["contact", "Leave a note"],
              ].map(([id, label]) => (
                <button key={id} onClick={() => e.openObject(id)}>
                  {label}
                  <ArrowUpRight size={16} />
                </button>
              ))}
              <a href={content.profile.resume} download>
                Take my resume
              </a>
            </div>
          )}
        </div>
        <nav className="page-turn-controls" aria-label="Notebook pages">
          <button disabled={page === 0} onClick={() => turn(page - 1)}>
            Previous page
          </button>
          <span aria-live="polite">{page + 1} / 4</span>
          <button disabled={page === 3} onClick={() => turn(page + 1)}>
            Next page
          </button>
        </nav>
      </div>
      {sheet && (
        <div
          className={
            "notebook-turn-layer " +
            (sheet.direction < 0 ? "turn-backward" : "turn-forward")
          }
          aria-hidden="true"
        >
          <div className="turning-sheet">
            <div className="sheet-face sheet-front">
              <h3>{titles[sheet.from]}</h3>
              <p>
                {sheet.from === 0
                  ? content.profile.about
                  : sheet.from === 1
                    ? content.profile.summary
                    : sheet.from === 2
                      ? content.education[0].degree
                      : "A few things within reach."}
              </p>
              <span className="sheet-curl" />
            </div>
            <div className="sheet-face sheet-back">
              <h3>{titles[sheet.to]}</h3>
              <p>
                {sheet.to === 0
                  ? content.profile.about
                  : sheet.to === 1
                    ? content.profile.summary
                    : sheet.to === 2
                      ? content.education[0].degree
                      : "A few things within reach."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export function ProjectSurface() {
  const e = useExperience(),
    p = content.projects[e.selected],
    [view, setView] = useState("brief");
  return (
    <div className={"project-station station-" + p.visual}>
      <div className="artifact-document-header">
        <img
          src={projectArtFor(p).cover}
          alt={p.title + " conceptual system illustration"}
        />
        <div>
          <small>
            {p.category} · {p.status}
          </small>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      </div>
      <nav className="document-tabs" aria-label="Artifact information">
        {["brief", "flow", "evidence"].map((id) => (
          <button
            key={id}
            aria-pressed={view === id}
            onClick={() => setView(id)}
          >
            {id === "brief"
              ? "Case brief"
              : id === "flow"
                ? "System flow"
                : "Scope & evidence"}
          </button>
        ))}
      </nav>
      <div className="object-reading">
        {view === "brief" && (
          <>
            <h4>The problem</h4>
            <p>{p.problem}</p>
            <h4>The build</h4>
            <p>{p.solution}</p>
            {p.role && <p>Contribution: {p.role}</p>}
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="technology-line">{p.stack.join(" · ")}</p>
          </>
        )}
        {view === "flow" && <ProjectArchitecture nodes={p.nodes} />}
        {view === "evidence" && (
          <>
            <h4>What this file establishes</h4>
            <ul>
              {(p.scopeNotes || content.projectBoundaries[p.slug] || []).map(
                (t) => (
                  <li key={t}>{t}</li>
                ),
              )}
            </ul>
            {(p.sources || []).map((s) => (
              <a
                className="source-file"
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
            {!p.sources?.length && (
              <p>
                This record is supported by the supplied resume. No public
                source repository is available for inspection.
              </p>
            )}
          </>
        )}
        <ProjectLinks project={p} />
      </div>
    </div>
  );
}
export function ToolkitDisplay() {
  const e = useExperience();
  const groups = content.skills.filter(
    (s) => e.toolCategory === "All tools" || s.title === e.toolCategory,
  );
  return (
    <div className="toolkit-terminal">
      <nav className="terminal-key-row" aria-label="Workbench category keys">
        {["All tools", ...content.skills.map((s) => s.title)].map((t) => (
          <button
            className="physical-key"
            key={t}
            aria-pressed={e.toolCategory === t}
            onClick={() => e.chooseTool(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <div className="terminal-output" aria-live="polite">
        <h3>{e.toolCategory}</h3>
        {groups.map((g) => (
          <section key={g.title}>
            <h4>{g.title}</h4>
            <div className="tool-values">
              {g.items.map((t) => (
                <button
                  aria-pressed={e.tool === t}
                  key={t}
                  onClick={() => e.chooseTool(e.toolCategory, t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>
        ))}
        {e.tool && (
          <section>
            <h4>{e.tool}</h4>
            {content.projects
              .filter((p) =>
                p.stack.some((t) => t.toLowerCase() === e.tool.toLowerCase()),
              )
              .map((p) => (
                <Link
                  className="source-file"
                  key={p.slug}
                  to={"/projects/" + p.slug}
                >
                  {p.title}
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            <p>
              Project evidence appears where the documented technology matches
              this tool.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
export function JourneyBoard() {
  const e = useExperience(),
    [active, setActive] = useState(() =>
      Math.max(
        0,
        Math.min(content.experience.length - 1, Number(e.subroute) || 0),
      ),
    );
  const en = content.experience[active];
  return (
    <div className="reading-pinboard">
      <nav aria-label="Journey records">
        {content.experience.map((r, i) => (
          <button
            key={r.company}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            <span className="paper-pin" />
            {r.date}
            <strong>{r.company}</strong>
          </button>
        ))}
      </nav>
      <article className="pinned-reading-note" key={en.company}>
        <span className="paper-pin" />
        <small>
          {en.date} · {en.location}
        </small>
        <h3>{en.role}</h3>
        <h4>{en.company}</h4>
        <p>{en.description}</p>
        {en.url && (
          <a href={en.url} target="_blank" rel="noopener noreferrer">
            Organization <ArrowUpRight size={16} />
          </a>
        )}
        <a href={content.profile.resume} download>
          Read the full resume
        </a>
      </article>
    </div>
  );
}
function WindowView() {
  const e = useExperience();
  return (
    <div className="window-reading">
      {!e.live && (
        <svg
          className="touch-window-art"
          viewBox="0 0 600 450"
          aria-hidden="true"
        >
          <rect
            width="600"
            height="450"
            fill={e.timeOfDay === "day" ? "#c5d6d4" : "#233855"}
          />
          <circle
            cx={e.timeOfDay === "day" ? 130 : 450}
            cy="100"
            r="35"
            fill={e.timeOfDay === "day" ? "#f2c477" : "#f5e9c7"}
          />
          {e.timeOfDay === "night" &&
            Array.from({ length: 20 }, (_, i) => (
              <circle
                key={i}
                cx={(i * 137) % 590}
                cy={(i * 43) % 240}
                r="1.5"
                fill="#dbe6ec"
              />
            ))}
          <path
            d="M0 280h40v-35h35v40h50v-65h40v60h40v-25h55v-30h35v55h60v-60h40v60h35v-40h40v45h50v-20h45v25h40v-65h45v65h45v170H0z"
            fill="#334550"
          />
        </svg>
      )}
      <h3>A little change of light.</h3>
      <p>
        The workshop’s sky is an authored mood. Take a moment, then return to
        the build.
      </p>
      <div>
        <button
          aria-pressed={e.timeOfDay === "night"}
          onClick={() => e.setTimeOfDay("night")}
        >
          After hours
        </button>
        <button
          aria-pressed={e.timeOfDay === "day"}
          onClick={() => e.setTimeOfDay("day")}
        >
          Morning light
        </button>
      </div>
      <small>Scene setting · not live weather</small>
    </div>
  );
}
export function ObjectContent({ id, copyEmail, notify }) {
  if (id === "window") return <WindowView />;
  if (id === "monitor") return <MonitorApps />;
  if (id === "notebook") return <NotebookPages />;
  if (id === "project") return <ProjectSurface />;
  if (id === "toolkit") return <ToolkitDisplay />;
  if (id === "journey") return <JourneyBoard />;
  if (id === "credentials") return <CredentialDrawer />;
  return <Contact inObject copyEmail={copyEmail} notify={notify} />;
}
