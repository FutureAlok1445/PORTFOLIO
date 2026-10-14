import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Play } from "lucide-react";
export default function ProjectArchitecture({ nodes }) {
  const [active, setActive] = useState(0),
    [tracing, setTracing] = useState(false),
    [started, setStarted] = useState(false),
    timer = useRef(null);
  useEffect(() => {
    if (!tracing) return;
    timer.current = setTimeout(() => {
      if (active < nodes.length - 1) setActive(active + 1);
      else setTracing(false);
    }, 1400);
    return () => clearTimeout(timer.current);
  }, [tracing, active, nodes.length]);
  function select(index) {
    setTracing(false);
    setStarted(true);
    setActive(index);
  }
  return (
    <section
      className={"case-architecture " + (started ? "trace-started" : "")}
      aria-labelledby="architecture-title"
    >
      <div className="case-section-heading">
        <h2 id="architecture-title">Trace this build.</h2>
        <p>
          Follow the documented system layers. This walkthrough explains the
          build; it does not execute the external project.
        </p>
      </div>
      <div className="trace-controls">
        <button
          onClick={() => {
            setActive(0);
            setStarted(true);
            setTracing(true);
          }}
          disabled={tracing}
        >
          <Play size={16} /> Trace the flow
        </button>
        <button
          onClick={() => select(Math.max(0, active - 1))}
          disabled={active === 0}
        >
          <ArrowLeft size={16} /> Previous
        </button>
        <button
          onClick={() => select(Math.min(nodes.length - 1, active + 1))}
          disabled={active === nodes.length - 1}
        >
          Next <ArrowRight size={16} />
        </button>
        <button
          onClick={() => {
            setTracing(false);
            setStarted(false);
            setActive(0);
          }}
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <ol className="architecture-steps" aria-label="System layers">
        {nodes.map((node, index) => (
          <li
            key={node.name}
            className={started && index < active ? "trace-passed" : ""}
          >
            <button
              aria-pressed={active === index}
              onClick={() => select(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {node.name}
              <span className="trace-signal" aria-hidden="true" />
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
      <div className="trace-progress" aria-hidden="true">
        <span style={{ width: ((active + 1) / nodes.length) * 100 + "%" }} />
      </div>
    </section>
  );
}
