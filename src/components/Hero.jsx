import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react";
import { content } from "../data/content";
import { scrollToTarget } from "./scroll";
export default function Hero() {
  const { profile } = content;
  const portrait = useRef();
  const [missing, setMissing] = useState(false);
  function tilt(e) {
    if (
      !matchMedia("(pointer:fine)").matches ||
      matchMedia("(prefers-reduced-motion:reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 3;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -3;
    portrait.current.style.transform = `rotate(1.5deg) rotateY(${x}deg) rotateX(${y}deg)`;
  }
  return (
    <section className="hero container" aria-labelledby="hero-heading">
      <div className="hero-topline">
        <span>
          <span className="status-dot" /> Software engineer, human first.
        </span>
        <span className="hero-location">
          <MapPin size={14} /> Thane, India
        </span>
      </div>
      <div className="hero-name">
        <h1 className="hero-title" id="hero-heading" aria-label="Alok Sahoo">
          <span className="hero-line" aria-hidden="true">
            <span className="hero-line-inner">
              {profile.firstName.toUpperCase()}
            </span>
          </span>
          <span className="hero-line" aria-hidden="true">
            <span className="hero-line-inner">
              {profile.name.split(" ").slice(1).join(" ").toUpperCase()}
              <span className="name-dot">.</span>
            </span>
          </span>
        </h1>
        <div className="hero-side">
          <span className="vertical-note">
            A little curiosity. A lot of building.
          </span>
          <figure
            className="hero-portrait"
            ref={portrait}
            onPointerMove={tilt}
            onPointerLeave={() => {
              portrait.current.style.transform = "rotate(1.5deg)";
            }}
          >
            <div className="photo-frame">
              {!missing ? (
                <img
                  src={profile.portrait}
                  srcSet={
                    profile.portraitSmall
                      ? `${profile.portraitSmall} 360w, ${profile.portrait} 540w`
                      : undefined
                  }
                  sizes="(max-width: 600px) 170px, (min-width: 1700px) 370px, 300px"
                  alt="Alok Sahoo at a technology event"
                  width="720"
                  height="1280"
                  fetchPriority="high"
                  onError={() => setMissing(true)}
                />
              ) : (
                <div className="portrait-fallback">
                  The person behind
                  <br />
                  the systems.<span>Alok Sahoo</span>
                </div>
              )}
            </div>
            <figcaption>
              <span>Outside the code editor.</span>
              <span>↗</span>
            </figcaption>
            <div className="portrait-sticker">
              Code.
              <br />
              Connect.
              <br />
              Repeat.
            </div>
          </figure>
        </div>
      </div>
      <div className="hero-bottom">
        <div className="hero-copy">
          <h2>{profile.tagline}</h2>
          <p>{profile.summary}</p>
        </div>
        <div className="hero-actions">
          <a
            href="#work"
            className="button"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              scrollToTarget("work");
            }}
          >
            Explore my work <ArrowUpRight size={18} />
          </a>
          <a className="resume-link" href={profile.resume} download>
            Take my resume <Download size={15} />
          </a>
        </div>
        <a className="scroll-cue" href="#about" aria-label="Scroll to about">
          <ArrowDown size={20} />
          <span>Scroll to connect</span>
        </a>
      </div>
      <div className="hero-rule">
        <span>Backend / Full-stack / AI</span>
        <span>{profile.portfolioTitle} / 2026</span>
      </div>
    </section>
  );
}
export function About() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const update = () =>
      setClock(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: content.profile.timeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="about" className="about container">
      <div className="section-meta">
        <span>Behind the build</span>
        <span>
          <MapPin size={14} /> Thane <time>{clock || "Local time"}</time> IST
        </span>
      </div>
      <div className="about-grid">
        <h2 className="serif reveal-title">
          Curiosity is the
          <br />
          starting point.
        </h2>
        <div>
          <p className="about-text">{content.profile.about}</p>
          <p className="pull-quote">“{content.profile.quote}”</p>
          <ul className="quick-facts">
            {content.profile.facts.map((f) => (
              <li key={f}>
                <span className="small-dot" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
