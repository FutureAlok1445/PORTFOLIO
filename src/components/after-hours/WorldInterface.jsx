import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Monitor,
  BookOpen,
  Archive,
  Keyboard,
  PanelsTopLeft,
  Mail,
  Files,
  Sunrise,
} from "lucide-react";
import { content } from "../../data/content";
import { sceneChapters } from "../../scene/SceneTimeline";
import { useExperience } from "./ExperienceContext";
import ObjectSurface from "./ObjectSurface";
import PatchCat from "./PatchCat";
import { projectArtFor } from "../../data/projectArt";
const objects = [
  ["window", "Look through the window", Sunrise, "desk"],
  ["monitor", "Open desktop", Monitor, "desk"],
  ["notebook", "Read field notes", BookOpen, "about"],
  ["project", "Inspect selected artifact", Archive, "work"],
  ["toolkit", "Use the keycap workstation", Keyboard, "skills"],
  ["journey", "Read journey records", PanelsTopLeft, "experience"],
  ["credentials", "Open credential drawer", Files, "experience"],
  ["contact", "Leave a note", Mail, "contact"],
];
export default function WorldInterface({ copyEmail, notify }) {
  const e = useExperience(),
    wheelAt = useRef(0),
    actions = useRef(null);
  const swipe = useRef(null),
    dragged = useRef(false);
  const { bindActions } = e;
  const { worldMode, focusedObject, chapter, goChapter } = e;
  useEffect(() => {
    bindActions(actions.current);
    return () => bindActions(null);
  }, [bindActions]);
  useEffect(() => {
    if (!worldMode) return;
    const wheel = (ev) => {
      if (
        focusedObject ||
        e.cameraMode !== "guided" ||
        ev.target.closest("dialog,input,select,textarea") ||
        Math.abs(ev.deltaY) < 20
      )
        return;
      ev.preventDefault();
      if (performance.now() - wheelAt.current < 1000) return;
      wheelAt.current = performance.now();
      const index = sceneChapters.findIndex((c) => c.id === chapter),
        next = Math.max(
          0,
          Math.min(sceneChapters.length - 1, index + Math.sign(ev.deltaY)),
        );
      if (index !== next) goChapter(sceneChapters[next].id);
    };
    window.addEventListener("wheel", wheel, { passive: false });
    return () => window.removeEventListener("wheel", wheel);
  }, [worldMode, focusedObject, chapter, goChapter, e.cameraMode]);
  if (!e.worldMode) return null;
  const project = content.projects[e.selected];
  return (
    <>
      <main id="main" className="world-room" data-room-chapter={e.chapter}>
        <div className="room-identity">
          <h1>{content.profile.name}</h1>
          <p>{content.profile.title}</p>
          <span>{content.profile.tagline}</span>
          <div>
            <button onClick={() => e.goChapter("work")}>
              Explore my work <ArrowUpRight size={16} />
            </button>
            <a href={content.profile.resume} download>
              Resume
            </a>
            <a href={"mailto:" + content.profile.email}>Email</a>
          </div>
        </div>
        {!e.live && (
          <div className="touch-room">
            {e.chapter === "work" && e.cameraMode !== "top" ? (
              <div
                className="touch-archive-rack"
                aria-label="Swipe project inspection rack"
                onPointerDown={(ev) => {
                  swipe.current = { x: ev.clientX, y: ev.clientY };
                  dragged.current = false;
                }}
                onPointerUp={(ev) => {
                  const start = swipe.current;
                  swipe.current = null;
                  if (
                    start &&
                    Math.abs(ev.clientX - start.x) > 45 &&
                    Math.abs(ev.clientY - start.y) < 50
                  ) {
                    dragged.current = true;
                    e.select(e.selected + (ev.clientX < start.x ? 1 : -1));
                  }
                }}
                onPointerCancel={() => {
                  swipe.current = null;
                }}
              >
                {[-1, 0, 1].map((offset) => {
                  const index =
                      (e.selected + offset + content.projects.length) %
                      content.projects.length,
                    p = content.projects[index];
                  return (
                    <button
                      className={offset === 0 ? "rack-selected" : ""}
                      key={p.slug}
                      aria-label={
                        offset === 0
                          ? "Inspect " + p.title
                          : "Select " + p.title
                      }
                      onClick={() => {
                        if (dragged.current) {
                          dragged.current = false;
                          return;
                        }
                        if (offset === 0) e.openObject("project");
                        else e.select(index);
                      }}
                    >
                      <img
                        draggable="false"
                        src={projectArtFor(p).cover}
                        alt={p.title + " conceptual artifact"}
                      />
                      {offset === 0 && <strong>{p.title}</strong>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                <img
                  src={
                    "/images/after-hours/desk/workshop-" +
                    (e.cameraMode === "top" ? "top" : "mobile") +
                    (e.timeOfDay === "day" ? "-day" : "") +
                    ".webp"
                  }
                  width={780}
                  height={700}
                  alt={
                    e.cameraMode === "top"
                      ? "Overhead plan of Alok’s workshop: separate desk, workbench, drawer and circular archive"
                      : "Alok's workshop: monitor, field notebook, lamp and keyboard"
                  }
                />
                <div className="touch-companion">
                  <PatchCat
                    size={120}
                    interactive
                    label="Pet Patch"
                    ambient={e.ambient}
                    chapter={e.chapter}
                    lampOn={e.lampOn}
                  />
                </div>
              </>
            )}
            <p>Choose an object to open its reading surface.</p>
          </div>
        )}
        <div
          className="world-object-actions"
          role="group"
          ref={actions}
          aria-label="Workshop objects"
        >
          {objects
            .filter(
              (o) =>
                !e.live ||
                o[3] === e.chapter ||
                (e.chapter === "desk" && o[0] === "notebook"),
            )
            .map(([id, label, Icon]) => (
              <button
                key={id}
                aria-label={label}
                data-world-object={id}
                onClick={() => e.openObject(id)}
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            ))}
        </div>
        {e.chapter === "work" && (
          <div
            className="ring-console"
            onKeyDown={(ev) => {
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(ev.key)) {
                ev.preventDefault();
                e.select(
                  ev.key === "Home"
                    ? 0
                    : ev.key === "End"
                      ? content.projects.length - 1
                      : e.selected + (ev.key === "ArrowRight" ? 1 : -1),
                );
              }
            }}
          >
            <button
              aria-label="Previous archive artifact"
              onClick={() => e.select(e.selected - 1)}
            >
              <ArrowLeft size={20} />
            </button>
            <div role="status">
              <small>
                Artifact {e.selected + 1} / {content.projects.length}
              </small>
              <strong>{project.title}</strong>
            </div>
            <button
              aria-label="Next archive artifact"
              onClick={() => e.select(e.selected + 1)}
            >
              <ArrowRight size={20} />
            </button>
            <button onClick={() => e.openObject("project")}>
              Inspect {project.title}
            </button>
            <Link to="/projects">All project files</Link>
          </div>
        )}
        <nav className="room-destinations" aria-label="Room destinations">
          {sceneChapters.map((c) => (
            <button
              key={c.id}
              aria-current={
                e.cameraMode === "guided" && e.settledChapter === c.id
                  ? "location"
                  : undefined
              }
              onClick={() => e.goChapter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </main>
      <ObjectSurface copyEmail={copyEmail} notify={notify} />
    </>
  );
}
