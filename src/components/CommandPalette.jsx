import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { content } from "../data/content";
import { playKeyClick } from "../utils/sound";

export default function CommandPalette({
  close,
  jump,
  openProject,
  copyEmail,
  toggleTheme,
  toggleSound,
}) {
  const dialog = useRef();
  const input = useRef();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const actions = [
    ...content.navigation.map(({ label, id }) => ({
      label,
      group: "Section",
      run: () => jump(id),
    })),
    ...content.commandSections.map(({ label, id }) => ({
      label,
      group: "Section",
      run: () => jump(id),
    })),
    ...content.projects.map((p) => ({
      label: p.title + (p.featured ? " ★ Flagship" : ""),
      group: "Project",
      search: [
        p.category,
        p.summary,
        p.featured ? "flagship featured" : "archive",
        ...p.stack,
        ...(p.filters || []),
      ].join(" "),
      run: () => openProject(p.slug),
    })),
    {
      label: "Download Resume",
      group: "Document",
      url: content.profile.resume,
      download: true,
    },
    ...content.socials.map((s) => ({
      label: s.label,
      group: "Connect",
      url: s.url,
    })),
    { label: "Copy email", group: "Connect", run: copyEmail },
    { label: "Toggle color theme", group: "View", run: toggleTheme },
    ...(toggleSound
      ? [
          {
            label: "Toggle tactile workshop audio",
            group: "Atmosphere",
            search: "sound audio mute key click rain",
            run: toggleSound,
          },
        ]
      : []),
  ].filter((a) =>
    (a.label + " " + a.group + " " + (a.search || ""))
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  useEffect(() => {
    const previous = document.activeElement;
    const el = dialog.current;
    el.showModal();
    input.current.focus();
    return () => {
      el.close();
      previous?.isConnected && previous.focus();
    };
  }, []);
  useEffect(() => {
    dialog.current
      .querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [selected, query]);
  function activate(action) {
    playKeyClick(1.1);
    action.run?.();
    close();
  }
  function keys(e) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      playKeyClick(0.95);
      setSelected((i) =>
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? actions.length - 1
            : (i + (e.key === "ArrowDown" ? 1 : -1) + actions.length) %
              Math.max(actions.length, 1),
      );
      input.current.focus();
    } else if (
      e.key === "Enter" &&
      e.target === input.current &&
      actions[selected]
    ) {
      e.preventDefault();
      dialog.current.querySelector("#command-" + selected)?.click();
    }
  }
  return (
    <dialog
      ref={dialog}
      className="command-dialog"
      aria-labelledby="command-title"
      onKeyDown={keys}
      onCancel={close}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <div className="palette-head">
        <h2 id="command-title">Where to?</h2>
        <button aria-label="Close command palette" onClick={close}>
          <X size={20} />
        </button>
      </div>
      <label className="command-search">
        <Search size={18} />
        <span className="sr-only">Search portfolio commands</span>
        <input
          ref={input}
          value={query}
          placeholder="Search projects (e.g. COSMEON, AURA), stack, or actions"
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          aria-controls="command-results"
          aria-describedby="command-help"
        />
      </label>
      <div id="command-results" className="command-results">
        {actions.map((a, i) => {
          const props = {
            id: "command-" + i,
            className: "command-item",
            "data-selected": i === selected,
            onFocus: () => setSelected(i),
            onClick: () => activate(a),
          };
          const body = (
            <>
              <span>
                {a.label}
                <small>{a.group}</small>
              </span>
              <ArrowUpRight size={18} />
            </>
          );
          return a.url ? (
            <a
              {...props}
              key={a.label}
              href={a.url}
              download={a.download || undefined}
              target={a.download ? undefined : "_blank"}
              rel={a.download ? undefined : "noopener noreferrer"}
            >
              {body}
            </a>
          ) : (
            <button {...props} key={a.label}>
              {body}
            </button>
          );
        })}
        {!actions.length && (
          <p className="command-empty">
            No matches. Try a project name or section.
          </p>
        )}
      </div>
      <p id="command-help" className="command-help">
        ↑ ↓ Select · Enter Open · Tab Focus · Esc Close
      </p>
      <span className="sr-only" role="status">
        {actions.length} commands found. {actions[selected]?.label}
      </span>
    </dialog>
  );
}
