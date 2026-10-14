import { useState } from "react";
import { content } from "../data/content";
export function About() {
  const [page, setPage] = useState(0),
    p = content.profile;
  const pages = [
    { title: "Who I am", text: p.about },
    { title: "What I build", text: p.summary },
    { title: "How I think", text: p.quote },
  ];
  return (
    <section id="about" className="about container">
      <div className="about-grid">
        <h2 className="serif">{content.workshop.aboutTitle}</h2>
        <div className="personal-notebook">
          <div
            className="notebook-tabs"
            role="tablist"
            aria-label="Alok’s notebook"
          >
            {pages.map((item, index) => (
              <button
                key={item.title}
                role="tab"
                id={"notebook-tab-" + index}
                aria-selected={page === index}
                aria-controls="notebook-page"
                tabIndex={page === index ? 0 : -1}
                onClick={() => setPage(index)}
                onKeyDown={(event) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    event.preventDefault();
                    const n =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? 2
                          : (page + (event.key === "ArrowRight" ? 1 : 2)) % 3;
                    setPage(n);
                    document.getElementById("notebook-tab-" + n)?.focus();
                  }
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div
            id="notebook-page"
            role="tabpanel"
            aria-labelledby={"notebook-tab-" + page}
          >
            <span className="notebook-page-number">
              Field note / 0{page + 1}
            </span>
            <p className="about-text">{pages[page].text}</p>
            <ul className="quick-facts">
              {p.facts.map((f) => (
                <li key={f}>
                  <span className="small-dot" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="notebook-signature">Alok</p>
            <small>{p.location}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
