import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Download, Code2, Mail } from "lucide-react";
import { content } from "../../data/content";
import { useExperience } from "./ExperienceContext";
import PatchCat from "./PatchCat";
export default function WorkshopHero() {
  const e = useExperience(),
    [missing, setMissing] = useState(false),
    p = content.profile;
  const github = content.socials.find((s) => s.label === "GitHub");
  return (
    <section id="desk" className="workshop-hero hero container">
      <div className="workshop-grid">
        <div className="workshop-copy chapter-copy">
          <h1 id="hero-heading" className="hero-title" aria-label={p.name}>
            <span className="hero-line">
              <span className="hero-line-inner">{p.firstName}</span>
            </span>
            <span className="hero-line">
              <span className="hero-line-inner">
                {p.name.split(" ").slice(1).join(" ")}
              </span>
            </span>
          </h1>
          <p className="hero-role">{p.title}</p>
          <h2>{p.tagline}</h2>
          <p>{p.summary}</p>
          <div className="hero-actions">
            <Link to="/#work" className="button">
              Explore my work <ArrowUpRight size={18} />
            </Link>
            <a href={p.resume} download className="resume-link">
              Take my resume <Download size={16} />
            </a>
          </div>
          <div className="hero-connect">
            {github && (
              <a href={github.url} target="_blank" rel="noopener noreferrer">
                <Code2 size={17} /> GitHub
              </a>
            )}
            <a
              href="#contact"
              onClick={(ev) => {
                ev.preventDefault();
                if (e.live && e.openObject) {
                  e.openObject("contact");
                } else {
                  const target = document.getElementById("contact");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                      const msg = document.getElementById("message");
                      if (msg) msg.focus();
                    }, 400);
                  }
                }
              }}
            >
              <Mail size={17} /> Writing desk
            </a>
          </div>
          <div className="hero-person">
            {!missing && (
              <img
                src={p.portraitSmall || p.portrait}
                alt="Alok Sahoo at a technology event"
                width="82"
                height="100"
                onError={() => setMissing(true)}
              />
            )}
            <div>
              <strong>{p.location}</strong>
              {content.workshop.portraitCaption}
            </div>
          </div>
        </div>
        {!e.live && (
          <div className="workshop-environment">
            <div
              className={
                "desk-stage quick-desk " + (!e.lampOn ? "lamp-dim" : "")
              }
            >
              <picture>
                <source
                  media="(max-width:1024px)"
                  srcSet="/images/after-hours/desk/workshop-mobile.webp"
                />
                <img
                  className="desk-poster"
                  src="/images/after-hours/desk/workshop-desktop.webp"
                  alt="Original workshop scene with monitor, lamp, notebook and mechanical keyboard"
                  width="1600"
                  height="900"
                  fetchPriority="high"
                />
              </picture>
              <PatchCat
                size={144}
                interactive
                label="Pet Patch"
                ambient={e.ambient}
                lampOn={e.lampOn}
              />
            </div>
            <div className="desk-caption">
              <span>Every object has a purpose.</span>
              <div className="desk-hotspots">
                <Link to="/#work">The work</Link>
                <Link to="/#about">Field notes</Link>
                <Link to="/#contact">Leave a note</Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="hero-rule">
        <Link className="scroll-cue" to="/#about">
          <ArrowDown size={17} />
          Step into the workshop
        </Link>
        <span>{content.workshop.footerLine}</span>
      </div>
    </section>
  );
}
