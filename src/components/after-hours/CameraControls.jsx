import { useEffect, useState } from "react";
import { Compass, ChevronDown, RotateCcw } from "lucide-react";
import { useExperience } from "./ExperienceContext";
const names = {
  guided: "Guided",
  orbit: "Look around",
  fly: "Free roam",
  top: "Top view",
};
export default function CameraControls() {
  const e = useExperience(),
    [hint, setHint] = useState(true),
    [patchView, setPatchView] = useState(false);
  useEffect(() => {
    const key = (ev) => {
      if (ev.target.closest?.("input,textarea,select,[contenteditable],dialog"))
        return;
      if (ev.key.toLowerCase() === "r") {
        e.goChapter("desk");
        setHint(true);
        setPatchView(false);
      }
      if (ev.key === "Escape" && e.cameraMode !== "guided") {
        e.setCameraMode("guided");
        e.sceneAPI.current?.invalidate();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [e]);
  return (
    <div className="camera-controls">
      <details>
        <summary aria-label="Explore camera modes">
          <Compass size={17} />
          Explore <span>{names[e.cameraMode]}</span>
          <ChevronDown size={14} />
        </summary>
        <div className="camera-menu" role="group" aria-label="Camera modes">
          {Object.entries(names).map(([id, name]) => (
            <button
              key={id}
              disabled={!e.live && id !== "top" && id !== "guided"}
              aria-pressed={e.cameraMode === id}
              onClick={(ev) => {
                e.setCameraMode(id);
                e.setLookAround(id === "orbit");
                setHint(true);
                ev.currentTarget.closest("details").open = false;
              }}
            >
              {name}
            </button>
          ))}
          <button
            disabled={!e.worldMode}
            onClick={(ev) => {
              e.goChapter("desk");
              ev.currentTarget.closest("details").open = false;
            }}
          >
            <RotateCcw size={14} />
            Reset view
          </button>
          {e.live && (
            <label className="object-focus-picker">
              Focus an object
              <select
                aria-label="Focus an object"
                value=""
                onChange={(ev) => {
                  if (ev.target.value === "patch") {
                    e.sceneAPI.current?.focusPatch();
                    e.setCameraMode("orbit");
                    setPatchView(true);
                  } else if (ev.target.value) e.openObject(ev.target.value);
                  ev.currentTarget.closest("details").open = false;
                }}
              >
                <option value="">Choose a place…</option>
                {[
                  ["monitor", "Desktop"],
                  ["notebook", "Field notebook"],
                  ["project", "Selected project"],
                  ["toolkit", "Workbench"],
                  ["journey", "Journey board"],
                  ["credentials", "Credentials"],
                  ["contact", "Writing desk"],
                  ["window", "Window"],
                  ["patch", "Meet Patch"],
                ].map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {!e.live && (
            <p>
              Orbit and Drone use a desktop pointer. Touch keeps a top-view plan
              and the complete object view.
            </p>
          )}
        </div>
      </details>
      {patchView && (
        <button
          className="patch-camera-return"
          onClick={() => {
            e.setCameraMode(e.sceneAPI.current?.returnPatch() || "guided");
            setPatchView(false);
          }}
        >
          Back to previous view
        </button>
      )}
      {e.live && e.cameraMode !== "guided" && hint && (
        <div className="camera-hint" role="status">
          <p>
            {e.cameraMode === "fly"
              ? "WASD / arrows move · Q / E rise & fall · drag to look · Shift faster"
              : e.cameraMode === "top"
                ? "Drag to pan · wheel to zoom"
                : "Drag to orbit · right-drag to pan · wheel to zoom"}
          </p>
          {e.cameraMode === "fly" && (
            <label>
              Travel speed{" "}
              <input
                aria-label="Drone travel speed"
                type="range"
                min="1"
                max="8"
                value={e.cameraSpeed}
                onChange={(ev) => e.setCameraSpeed(Number(ev.target.value))}
              />
            </label>
          )}
          <small>R resets · Esc returns to guided</small>
          <button onClick={() => setHint(false)}>Got it</button>
        </div>
      )}
    </div>
  );
}
