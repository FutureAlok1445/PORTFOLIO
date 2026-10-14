import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useExperience } from "./ExperienceContext";
import { ObjectContent } from "./ObjectContent";
const titles = {
  window: "Workshop window",
  monitor: "Alok's desktop",
  notebook: "Field notebook",
  project: "Artifact inspection",
  toolkit: "Workbench terminal",
  journey: "Journey pinboard",
  credentials: "Credential drawer",
  contact: "Writing desk",
};
export default function ObjectSurface({ copyEmail, notify }) {
  const e = useExperience(),
    dialog = useRef(null),
    surface = useRef(null);
  const { bindSurface } = e;
  useEffect(() => {
    bindSurface(surface.current);
    return () => bindSurface(null);
  }, [bindSurface, e.focusedObject]);
  useEffect(() => {
    if (!e.focusedObject) return;
    const previous = document.activeElement,
      scroll = scrollY;
    dialog.current.showModal();
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
      window.scrollTo({ top: scroll, behavior: "instant" });
      requestAnimationFrame(
        () => previous?.isConnected && previous.focus({ preventScroll: true }),
      );
    };
  }, [e.focusedObject]);
  if (!e.focusedObject || !titles[e.focusedObject]) return null;
  return (
    <dialog
      ref={dialog}
      className="object-focus-dialog"
      aria-labelledby="object-surface-title"
      onCancel={(ev) => {
        ev.preventDefault();
        e.closeObject();
      }}
    >
      <div
        ref={surface}
        className={
          "object-owned-surface surface-" +
          e.focusedObject +
          (!e.live ? " surface-handoff" : "")
        }
        data-object={e.focusedObject}
      >
      <div className="object-surface-chrome">
          <h2 id="object-surface-title">{titles[e.focusedObject]}</h2>
          <div className="surface-exit-actions">
            <button onClick={() => e.chooseMode("quick")}>Quick View</button>
            <button
              autoFocus
              aria-label={"Close " + titles[e.focusedObject]}
              onClick={e.closeObject}
            >
              <X size={20} />
              <span>Back to room</span>
            </button>
          </div>
      </div>
        <div className="object-surface-content">
          <ObjectContent
            key={e.focusedObject}
            id={e.focusedObject}
            copyEmail={copyEmail}
            notify={notify}
          />
        </div>
      </div>
    </dialog>
  );
}
