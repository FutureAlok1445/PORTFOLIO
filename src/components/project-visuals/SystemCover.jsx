import { ArrowRight, ArrowUpRight } from "lucide-react";

// Authored geometry describes workflows, never measured product results.
function Orbit({ coding }) {
  return (
    <svg className="cover-orbit" viewBox="0 0 400 250" aria-hidden="true">
      <circle cx="200" cy="125" r="46" className="orbit-core" />
      {[0, 60, 120].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 200 125)`}>
          <ellipse cx="200" cy="125" rx="152" ry="52" />
          <rect x="43" y="119" width="12" height="12" />
          <rect x="345" y="119" width="12" height="12" />
        </g>
      ))}
      <path d="M49 125L175 110M351 125L224 139" strokeDasharray="4 6" />
      <text x="200" y="131" textAnchor="middle">
        {coding}
      </text>
    </svg>
  );
}
function Signal({ kind, cover }) {
  if (kind === "typing")
    return (
      <div className="typing-field">
        <span>{cover.heading[0]} </span>
        <em>{cover.heading[1]}</em>
        <b aria-hidden="true">|</b>
        <div>{cover.metrics.join(" · ")}</div>
      </div>
    );
  if (kind === "booking")
    return (
      <div className="ticket-field">
        <span>{cover.badge}</span>
        <strong>
          {cover.heading.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </strong>
        <div className="ticket-perforation" />
        <div className="ticket-journey">
          {cover.journey[0]}
          <ArrowRight size={14} aria-hidden="true" />
          {cover.journey[1]}
        </div>
      </div>
    );
  if (kind === "history")
    return (
      <div className="history-field">
        <span>{cover.badge}</span>
        <div className="history-line" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <strong>
          {cover.heading[0]}
          <br />
          <em>{cover.heading[1]}</em>
        </strong>
        <span>{cover.annotation}</span>
      </div>
    );
  if (kind === "fraud")
    return (
      <div className="risk-field">
        <span>{cover.badge}</span>
        <div className="risk-segments" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div>
          {cover.tiers.map((tier) => (
            <span key={tier}>{tier}</span>
          ))}
        </div>
        <strong>{cover.heading}</strong>
      </div>
    );
  return null;
}
export default function SystemCover({ project }) {
  const { cover } = project;
  const kind = cover.kind;
  const hasSignal = ["typing", "booking", "history", "fraud"].includes(kind);
  return (
    <div className="system-cover">
      <div className="cover-notation">
        <span>{project.category}</span>
        <ArrowUpRight size={14} aria-hidden="true" />
      </div>
      {kind === "orbit" ? (
        <Orbit coding={cover.coding} />
      ) : (
        <Signal kind={kind} cover={cover} />
      )}
      {!hasSignal && (
        <div
          className={"cover-pipeline" + (kind === "orbit" ? " compact" : "")}
          aria-label={project.title + " workflow illustration"}
        >
          {cover.steps.map((name, i) => (
            <div className="cover-node" key={name}>
              <span className="node-sequence">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{name}</span>
              {i < cover.steps.length - 1 && (
                <ArrowRight
                  className="cover-connector"
                  size={14}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      )}
      {cover.outcomes && (
        <div className="response-outcomes">
          {cover.outcomes.map((outcome) => (
            <span key={outcome}>{outcome}</span>
          ))}
        </div>
      )}
      {cover.annotation && !hasSignal && (
        <p className="cover-footnote">{cover.annotation}</p>
      )}
    </div>
  );
}
