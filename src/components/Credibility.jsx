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
const icons = {
  code: Code2,
  layers: Layers,
  database: Database,
  scan: ScanFace,
  shield: ShieldCheck,
};
export function Skills() {
  return (
    <section id="skills" className="skills-band">
      <div className="container">
        <div className="section-meta">
          <span>The toolkit</span>
          <span>Different tools. One connected system.</span>
        </div>
        <div className="section-heading">
          <h2 className="serif reveal-title">Built on solid foundations.</h2>
          <p>From the first request to the final render.</p>
        </div>
        <div className="skills-grid">
          {content.skills.map((s) => {
            const Icon = icons[s.icon] || Code2;
            return (
              <article className={"skill-card " + s.icon} key={s.title}>
                <Icon size={26} strokeWidth={1.5} />
                <h3>{s.title}</h3>
                <div className="skill-chips">
                  {s.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function Experience() {
  return (
    <section className="experience container" id="experience">
      <div className="section-meta">
        <span>Learning by building</span>
        <span>Work & education</span>
      </div>
      <div className="experience-grid">
        <div className="experience-intro">
          <h2 className="serif reveal-title">
            Real problems.
            <br />
            Real practice.
          </h2>
          <p>
            Internships, independent contributions, and a degree in progress.
            Each one adds another layer.
          </p>
          <a href={content.profile.resume} download className="text-link">
            The full story, in a PDF <ArrowUpRight size={17} />
          </a>
        </div>
        <div>
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
            <article className="education" key={e.institution}>
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
