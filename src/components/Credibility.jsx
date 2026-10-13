import {
  Code2,
  Layers,
  Database,
  ScanFace,
  ShieldCheck,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import { content } from "../data/content";
import { useState } from "react";
const icons = {
  code: Code2,
  layers: Layers,
  database: Database,
  scan: ScanFace,
  shield: ShieldCheck,
};
export function Skills() {
  const [category, setCategory] = useState("All tools");
  const [selected, setSelected] = useState("");
  const projects = content.projects.filter((project) =>
    project.stack.some((tool) => tool.toLowerCase() === selected.toLowerCase()),
  );
  return (
    <section id="skills" className="skills-band">
      <div className="container">
        <div className="section-heading">
          <h2 className="serif">{content.workshop.toolkitTitle}</h2>
          <p>{content.workshop.toolkitIntro}</p>
        </div>
        <div className="toolkit-filters" aria-label="Tool categories">
          {["All tools", ...content.skills.map((skill) => skill.title)].map(
            (title) => (
              <button
                key={title}
                aria-pressed={category === title}
                onClick={() => {
                  setCategory(title);
                  setSelected("");
                }}
              >
                {title}
              </button>
            ),
          )}
        </div>
        <div className="skills-grid">
          {content.skills
            .filter(
              (skill) => category === "All tools" || skill.title === category,
            )
            .map((s) => {
              const Icon = icons[s.icon] || Code2;
              return (
                <article className={"skill-card " + s.icon} key={s.title}>
                  <Icon size={26} strokeWidth={1.5} />
                  <h3>{s.title}</h3>
                  <ul className="skill-chips">
                    {s.items.map((item) => (
                      <li key={item}>
                        <button
                          aria-pressed={selected === item}
                          onClick={() =>
                            setSelected(selected === item ? "" : item)
                          }
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
        </div>
        <div className="tool-selection" role="status">
          {selected && (
            <>
              <strong>{selected}</strong>
              <p>
                {projects.length
                  ? "In the project files: " +
                    projects.map((project) => project.title).join(", ")
                  : "Part of the " +
                    content.skills
                      .find((skill) => skill.items.includes(selected))
                      .title.toLowerCase() +
                    " toolkit."}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
export function Experience() {
  return (
    <section className="experience container" id="experience">
      <div className="experience-grid">
        <div className="experience-intro">
          <h2 className="serif reveal-title">
            {content.workshop.journeyTitle}
          </h2>
          <p>
            Internships, independent contributions, and a degree in progress.
            Each one adds another layer.
          </p>
          <a href={content.profile.resume} download className="text-link">
            The full story, in a PDF <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="journey-records">
          <div className="timeline">
            <div className="timeline-fill" />
            {content.experience.map((e) => (
              <article key={e.company} className="timeline-item">
                <div className="timeline-top">
                  <span>{e.date}</span>
                  <span>{e.location}</span>
                </div>
                <h3>{e.role}</h3>
                {e.url ? (
                  <a
                    className="company"
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {e.company} <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <p className="company">{e.company}</p>
                )}
                <p>{e.description}</p>
              </article>
            ))}
          </div>
          {content.education.map((e) => (
            <article className="education" id="education" key={e.institution}>
              <GraduationCap size={24} />
              <span>{e.date}</span>
              <h3>{e.institution}</h3>
              <p>{e.degree}</p>
              <p>{e.record}</p>
              <small>{e.coursework}</small>
              <small>Capstone: {e.capstone}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
