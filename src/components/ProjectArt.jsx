import {
  Scan,
  Shield,
  Check,
  ArrowRight,
  FileText,
  Layers,
} from "lucide-react";
export default function ProjectArt({ project }) {
  return (
    <div
      className={"project-art " + project.visual}
      aria-label={project.title + " conceptual system diagram"}
    >
      <div className="art-top">
        <span>
          {project.visual === "forensics"
            ? "Image forensics / model attention"
            : project.visual === "network"
              ? "Network / threat topology"
              : project.visual === "workflow"
                ? "Expense / approval flow"
                : "Project study"}
        </span>
        <span className="art-dot" />
      </div>
      {project.visual === "forensics" && (
        <div className="forensics-diagram">
          <div className="scan-matrix">
            <Scan size={100} strokeWidth={0.6} />
            {Array.from({ length: 64 }, (_, i) => (
              <span key={i} style={{ opacity: 0.15 + ((i * 17) % 8) / 10 }} />
            ))}
          </div>
          <div className="analysis-label">
            <span>Spatial features</span>
            <div className="data-bars">
              {[42, 78, 56, 90, 65, 38, 72, 48].map((n, i) => (
                <span key={i} style={{ height: n + "%" }} />
              ))}
            </div>
            <span>Forensic signals + explanation</span>
          </div>
          <div className="scan-cross cross-a" />
          <div className="scan-cross cross-b" />
        </div>
      )}
      {project.visual === "network" && (
        <div className="network-diagram">
          <svg viewBox="0 0 500 240" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M250 120 90 45M250 120 70 170M250 120 180 210M250 120 370 40M250 120 440 110M250 120 380 200M90 45 370 40M70 170 180 210M370 40 440 110M440 110 380 200" />
            </g>
            {[
              [90, 45],
              [70, 170],
              [180, 210],
              [370, 40],
              [440, 110],
              [380, 200],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="22" fill="#1e3964" stroke="#819cca" />
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={i === 4 ? "#f6a476" : "#a3bbed"}
                />
              </g>
            ))}
            <circle cx="250" cy="120" r="46" fill="#254cbd" stroke="#a3bbed" />
            <circle
              cx="250"
              cy="120"
              r="60"
              fill="none"
              stroke="#819cca"
              strokeDasharray="3 8"
            />
          </svg>
          <Shield className="network-shield" size={30} strokeWidth={1} />
          <span className="network-caption">Observe. Inspect. Understand.</span>
        </div>
      )}
      {project.visual === "workflow" && (
        <div className="workflow-diagram">
          <div className="expense-ticket">
            <FileText size={22} />
            <span>Academic expense</span>
            <div className="ticket-lines">
              <i />
              <i />
              <i />
            </div>
            <span className="ticket-check">
              <Check size={14} /> Role-based review
            </span>
          </div>
          <div className="approval-flow">
            {["Student", "Faculty", "HOD", "Principal"].map((name, i) => (
              <div key={name}>
                <span className={"flow-node node-" + i}>
                  {i === 0 ? <FileText size={14} /> : <Check size={14} />}{" "}
                  {name}
                </span>
                {i < 3 && <ArrowRight size={16} />}
              </div>
            ))}
          </div>
        </div>
      )}
      {!["forensics", "network", "workflow"].includes(project.visual) && (
        <div className="generic-diagram">
          <Layers size={64} strokeWidth={1} />
          <strong>{project.title}</strong>
          <small>Project preview to follow</small>
        </div>
      )}
      <div className="art-bottom">
        <span>{project.artLabel || "Architecture illustration"}</span>
        <span>{project.title}</span>
      </div>
    </div>
  );
}
