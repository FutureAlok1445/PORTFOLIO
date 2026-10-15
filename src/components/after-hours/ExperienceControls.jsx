import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LampDesk,
  Pause,
  Play,
  X,
} from "lucide-react";
import CameraControls from "./CameraControls";
import { content } from "../../data/content";
import { useExperience } from "./ExperienceContext";
import { sceneChapters } from "../../scene/SceneTimeline";
export default function ExperienceControls() {
  const e = useExperience(),
    [help, setHelp] = useState(false),
    dialog = useRef(null),
    previous = useRef(null),
    roomSettingsRef = useRef(null);
  const index = Math.max(
    0,
    sceneChapters.findIndex((c) => c.id === e.chapter),
  );
  useEffect(() => {
    const onPointerDown = (ev) => {
      if (
        roomSettingsRef.current?.open &&
        !roomSettingsRef.current.contains(ev.target)
      ) {
        roomSettingsRef.current.open = false;
      }
    };
    const key = (event) => {
      if (
        event.key === "?" &&
        !event.target.closest("input,textarea,[contenteditable]")
      )
        setHelp(true);
      if (event.key === "Escape" && roomSettingsRef.current?.open) {
        roomSettingsRef.current.open = false;
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", key);
    };
  }, []);
  useEffect(() => {
    if (help) {
      previous.current = document.activeElement;
      dialog.current.showModal();
    } else if (dialog.current?.open) {
      dialog.current.close();
      previous.current?.focus();
    }
  }, [help]);

  const handleToggle = (ev) => {
    if (ev.target.open) {
      document
        .querySelectorAll(".experience-controls details[open]")
        .forEach((d) => {
          if (d !== ev.target) d.open = false;
        });
    }
  };

  return (
    <>
      <div
        className="experience-controls"
        role="region"
        aria-label="Workshop settings"
      >
        {e.worldMode && <CameraControls />}
        <details
          ref={roomSettingsRef}
          className="room-settings"
          open={e.failed || undefined}
          onToggle={handleToggle}
        >
          <summary>Room settings</summary>
          <div className="room-settings-tray">
            <div className="mode-switch" role="group" aria-label="Portfolio view">
              <button
                aria-pressed={e.worldMode}
                disabled={!e.capable}
                onClick={() => e.chooseMode("explore")}
                title={
                  !e.capable
                    ? "Quick View respects reduced motion and limited hardware."
                    : e.failed
                      ? "Retry the 3D scene. Quick View keeps all content available."
                      : undefined
                }
              >
                Explore workshop
              </button>
              <button
                aria-pressed={!e.worldMode}
                onClick={() => e.chooseMode("quick")}
              >
                Quick View
              </button>
            </div>
            <button
              className="lamp-control"
              aria-label={e.lampOn ? "Turn desk lamp off" : "Turn desk lamp on"}
              aria-pressed={e.lampOn}
              onClick={e.toggleLamp}
            >
              <LampDesk size={17} />
              <span>
                {e.lampOn
                  ? content.workshop.interface.lightOn
                  : content.workshop.interface.lightOff}
              </span>
            </button>
            <button
              aria-label={
                e.ambient ? "Pause ambient motion" : "Resume ambient motion"
              }
              title={
                e.ambient
                  ? content.workshop.interface.ambientOn
                  : content.workshop.interface.ambientOff
              }
              aria-pressed={!e.ambient}
              onClick={() => e.setAmbient(!e.ambient)}
            >
              {e.ambient ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button aria-label="Workshop help" onClick={() => setHelp(true)}>
              <HelpCircle size={18} />
            </button>
            <button
              onClick={() =>
                e.setTimeOfDay(e.timeOfDay === "night" ? "day" : "night")
              }
              aria-label="Change time of day"
            >
              {e.timeOfDay === "night" ? "Morning light" : "After hours"}
            </button>
            {e.failed && (
              <span className="scene-failure-note" role="status">
                Scene unavailable. Quick View is active.
              </span>
            )}
          </div>
        </details>
      </div>
      {!e.worldMode && (
        <nav className="chapter-navigator" aria-label="Workshop chapters">
          {sceneChapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              title={chapter.label}
              aria-label={chapter.label}
              to={"/#" + chapter.targetId}
              aria-current={e.chapter === chapter.id ? "location" : undefined}
            >
              <span className="chapter-dot" />
              <span className="chapter-number">0{index + 1}</span>
            </Link>
          ))}
        </nav>
      )}
      {!e.worldMode && (
        <nav className="chapter-mobile" aria-label="Chapter shortcuts">
          <Link
            aria-label="Previous workshop chapter"
            to={"/#" + sceneChapters[Math.max(0, index - 1)].targetId}
          >
            <ChevronLeft size={18} />
          </Link>
          <span>{sceneChapters[index].label}</span>
          <Link
            aria-label="Next workshop chapter"
            to={
              "/#" +
              sceneChapters[Math.min(sceneChapters.length - 1, index + 1)]
                .targetId
            }
          >
            <ChevronRight size={18} />
          </Link>
        </nav>
      )}
      <dialog
        ref={dialog}
        className="workshop-help command-dialog"
        aria-labelledby="workshop-help-title"
        onCancel={() => setHelp(false)}
      >
        <div className="palette-head">
          <h2 id="workshop-help-title">A few things within reach.</h2>
          <button
            aria-label="Close workshop help"
            onClick={() => setHelp(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="help-content">
          <p>
            Scroll or choose a chapter to move through the workshop. You can
            interrupt a camera move at any time.
          </p>
          <ul>
            <li>
              Explore offers a full orbit, Drone travel, Top View and Reset. In
              Guided view, drag the archive. In Orbit, drag the room.
            </li>
            <li>
              Drone: WASD or arrows to move, Q/E to rise/fall, drag to look. R
              resets; Escape exits. Typing keeps its normal keys.
            </li>
            <li>The lamp changes the room’s light.</li>
            <li>Pet Patch; a resting cat wakes gently.</li>
            <li>
              Drag the archive, use arrows, or press Home / End to choose a
              file. Inspect it, then open its case study.
            </li>
            <li>
              Press a tool key, turn a notebook page, or open a journey pin.
            </li>
          </ul>
          <p>
            Quick View keeps the same content and routes with a quiet HTML
            layout. Keyboard and touch controls work without the scene.
          </p>
          <button className="button" onClick={() => setHelp(false)}>
            Back to the workshop
          </button>
        </div>
      </dialog>
    </>
  );
}
