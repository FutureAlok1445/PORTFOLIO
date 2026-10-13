import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { content } from "../data/content";
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
      <div className="about-grid">
        <h2 className="serif reveal-title">{content.workshop.aboutTitle}</h2>
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
          <p className="notebook-clock">
            <MapPin size={14} /> {content.profile.location}{" "}
            <time>{clock || "Local time"}</time> IST
          </p>
        </div>
      </div>
    </section>
  );
}
