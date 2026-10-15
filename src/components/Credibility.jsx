import { Code2, ArrowUpRight, GraduationCap, Briefcase } from "lucide-react";
import { content } from "../data/content";
import { experienceRecords } from "../data/workshopSelectors";
import { useEffect, useState } from "react";
import { useExperience } from "./after-hours/ExperienceContext";
import { Link } from "react-router-dom";
import { playKeyClick, playPageTurn } from "../utils/sound";

export function Skills() {
  const e = useExperience(),
    category = e.toolCategory,
    selected = e.tool;
  const projects = content.projects.filter((project) =>
    project.stack.some((tool) => tool.toLowerCase() === selected.toLowerCase()),
  );
  const groups = content.skills.filter(
    (s) => category === "All tools" || s.title === category,
  );
  return (
    <section id="skills" className="skills-band">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="mono-telemetry">03 // TACTILE KEYCAP WORKSTATION</span>
            <h2 className="serif">{content.workshop.toolkitTitle}</h2>
          </div>
          <p>{content.workshop.toolkitIntro}</p>
        </div>
        <div className="toolkit-filters" aria-label="Tool categories">
          {["All tools", ...content.skills.map((s) => s.title)].map((title, idx) => (
            <button
              key={title}
              className="physical-key"
              aria-pressed={category === title}
              onClick={() => {
                playKeyClick(0.9 + idx * 0.05);
                e.chooseTool(title);
              }}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="toolkit-reading">
          <div className="skills-grid">
            {groups.map((s) => (
              <article className={"skill-card " + s.icon} key={s.title}>
                <Code2 size={22} />
                <h3>{s.title}</h3>
                <ul className="skill-chips">
                  {s.items.map((item, i) => (
                    <li key={item}>
                      <button
                        aria-pressed={selected === item}
                        onClick={() => {
                          playKeyClick(1.0 + (i % 5) * 0.04);
                          e.chooseTool(category, selected === item ? "" : item);
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="tool-selection" role="status">
            {selected ? (
              <>
                <strong>{selected}</strong>
                <p>
                  {projects.length
                    ? `Active across ${projects.length} system build${projects.length === 1 ? "" : "s"}:`
                    : "Part of the " +
                      (content.skills
                        .find((s) => s.items.includes(selected))
                        ?.title.toLowerCase() || "core") +
                      " toolkit."}
                </p>
                {projects.map((p) => (
                  <Link key={p.slug} to={"/projects/" + p.slug}>
                    {p.title} <ArrowUpRight size={14} />
                  </Link>
                ))}
              </>
            ) : (
              <p>
                Press a category key, then choose a tool to trace every project file built with that technology.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const [active, setActive] = useState(0);
  const records = experienceRecords();
  useEffect(() => {
    const pin = (event) => setActive(event.detail.index);
    window.addEventListener("workshop:record", pin);
    return () => window.removeEventListener("workshop:record", pin);
  }, []);
  return (
    <section className="experience container" id="experience">
      <div className="experience-grid">
        <div className="experience-intro">
          <span className="mono-telemetry">
            <Briefcase size={14} /> 04 // WORKBENCH LOG ({records.length} ROLES)
          </span>
          <h2 className="serif">{content.workshop.journeyTitle}</h2>
          <p>
            Internships, production engineering contributions, and academic foundations—automatically indexed as new roles are added.
          </p>
          <a href={content.profile.resume} download className="text-link">
            The full story, in a PDF <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="journey-records">
          <div className="timeline">
            <div className="timeline-fill" />
            {records.map((entry, index) => (
              <article
                key={entry.company + "-" + index}
                className={
                  "timeline-item " + (active === index ? "record-open" : "")
                }
              >
                <div className="timeline-top">
                  <span>{entry.date}</span>
                  <span>{entry.location}</span>
                </div>
                <button
                  className="journey-pin"
                  aria-expanded={active === index}
                  aria-controls={"journey-record-" + index}
                  onClick={() => {
                    playPageTurn();
                    setActive(active === index ? -1 : index);
                  }}
                >
                  <span className="record-pin" />
                  <span>
                    <strong>{entry.role}</strong>
                    <small>{entry.company}</small>
                  </span>
                  <span aria-hidden="true">{active === index ? "−" : "+"}</span>
                </button>
                <div id={"journey-record-" + index} hidden={active !== index}>
                  <p>{entry.description}</p>
                  {entry.stack?.length > 0 && (
                    <div className="experience-stack-chips">
                      {entry.stack.map((tech) => (
                        <span key={tech} className="mono-chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {entry.url && (
                    <a
                      className="company"
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {entry.company} <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          {content.education.map((entry) => (
            <article
              className="education"
              id="education"
              key={entry.institution}
            >
              <GraduationCap size={24} />
              <span>{entry.date}</span>
              <h3>{entry.institution}</h3>
              <p>{entry.degree}</p>
              <p>{entry.record}</p>
              <small>{entry.coursework}</small>
              <small>Capstone: {entry.capstone}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
