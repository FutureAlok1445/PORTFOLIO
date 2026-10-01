import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
export default function ProjectArchitecture({ nodes }) {
  const [active, setActive] = useState(0);
  return (
    <section className="case-architecture" aria-labelledby="architecture-title">
      <div className="case-section-heading">
        <h2 id="architecture-title">Follow the system.</h2>
        <p>Select a step to inspect its role.</p>
      </div>
      <ol className="architecture-steps" aria-label="System layers">
        {nodes.map((node, i) => (
          <li key={node.name}>
            <button aria-pressed={active === i} onClick={() => setActive(i)}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {node.name}
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
      <div className="node-description architecture-description" role="status">
        <span>
          Step {String(active + 1).padStart(2, "0")} / {nodes[active].name}
        </span>
        <p>{nodes[active].text}</p>
      </div>
    </section>
  );
}
