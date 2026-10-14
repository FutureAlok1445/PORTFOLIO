import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ExperienceContext } from "./ExperienceContext";
import { sceneChapters } from "../../scene/SceneTimeline";
import { content } from "../../data/content";
import { useLocation, useNavigate } from "react-router-dom";
const allowed = matchMedia(
  "(min-width:1025px) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
);
const reducedQuery = matchMedia("(prefers-reduced-motion:reduce)");
const subscribeMotion = (fn) => {
  reducedQuery.addEventListener("change", fn);
  return () => reducedQuery.removeEventListener("change", fn);
};
const subscribe = (fn) => {
  allowed.addEventListener("change", fn);
  return () => allowed.removeEventListener("change", fn);
};
const read = (key, fallback) => {
  try {
    return (
      (key === "workshop-view" ? localStorage : sessionStorage).getItem(key) ||
      fallback
    );
  } catch {
    return fallback;
  }
};
export default function WorkshopExperience({ children }) {
  const location = useLocation(),
    navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const objectParam = params.get("object");
  const focusedObject = [
    "monitor",
    "notebook",
    "project",
    "toolkit",
    "journey",
    "credentials",
    "contact",
    "window",
  ].includes(objectParam)
    ? objectParam
    : null;
  const returnFocus = useRef(null);
  const pushedFocus = useRef(false);
  const surfaceAnchor = useRef(null);
  const actionsAnchor = useRef(null);
  const bindSurface = useCallback((node) => {
    surfaceAnchor.current = node;
  }, []);
  const bindActions = useCallback((node) => {
    actionsAnchor.current = node;
  }, []);
  const inputCapable = useSyncExternalStore(subscribe, () => allowed.matches);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => reducedQuery.matches,
  );
  const [mode, setMode] = useState(() => read("workshop-view", "explore"));
  const [observedChapter, setChapter] = useState("desk");
  const [lampOn, setLampOn] = useState(true);
  const [ambient, setAmbient] = useState(true);
  const [lookAround, setLookAround] = useState(false);
  const [settledChapter, setSettledChapter] = useState(null);
  const [cameraMode, setCameraMode] = useState("guided");
  const [cameraSpeed, setCameraSpeed] = useState(4);
  const [timeOfDay, setTimeOfDay] = useState("night");
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      Math.min(
        content.projects.length - 1,
        Number(read("workshop-file", "0")) || 0,
      ),
    ),
  );
  const [inspecting, setInspecting] = useState(false);
  const [toolCategory, setToolCategory] = useState("All tools");
  const [tool, setTool] = useState("");
  const command = useRef({ serial: 0, type: "chapter" });
  const sceneAPI = useRef(null);
  const lowPower =
    navigator.connection?.saveData ||
    navigator.hardwareConcurrency < 4 ||
    (navigator.deviceMemory && navigator.deviceMemory < 4);
  const capable = !reduced && !lowPower;
  const worldMode = capable && !failed && mode === "explore";
  const chapter = worldMode
    ? chapterByTarget(location.hash.slice(1))
    : observedChapter;
  const live = inputCapable && worldMode;
  const goChapter = useCallback(
    (id) => {
      setCameraMode("guided");
      setSettledChapter(null);
      const next =
        id === "credentials" || id === "education" ? "experience" : id;
      if (!worldMode) setChapter(chapterByTarget(next));
      navigate({ pathname: "/", search: "", hash: "#" + id });
    },
    [navigate, worldMode, setCameraMode],
  );
  const openObject = (id, subroute = "") => {
    if (id === "monitor" && !focusedObject)
      window.dispatchEvent(new Event("workshop:monitor-open"));
    if (!focusedObject) {
      returnFocus.current = document.activeElement;
      pushedFocus.current = true;
    }
    const query = new URLSearchParams(location.search);
    query.set("object", id);
    if (subroute) query.set("view", subroute);
    else query.delete("view");
    navigate(
      { pathname: "/", search: "?" + query.toString(), hash: location.hash },
      { replace: Boolean(focusedObject) },
    );
  };
  const closeObject = useCallback(() => {
    if (pushedFocus.current) {
      pushedFocus.current = false;
      navigate(-1);
    } else
      navigate(
        { pathname: "/", search: "", hash: location.hash },
        { replace: true },
      );
    requestAnimationFrame(() =>
      returnFocus.current?.focus({ preventScroll: true }),
    );
  }, [navigate, location.hash]);
  const issue = useCallback((type, detail = null) => {
    command.current = { serial: command.current.serial + 1, type, detail };
    sceneAPI.current?.invalidate();
  }, []);
  const chooseMode = (next) => {
    setMode(next);
    if (next === "explore") setCameraMode("guided");
    if (next === "explore") setFailed(false);
    setInspecting(false);
    if (focusedObject)
      navigate(
        { pathname: "/", search: "", hash: location.hash },
        { replace: true },
      );
    try {
      localStorage.setItem("workshop-view", next);
    } catch {
      /* Preference is optional. */
    }
  };
  const select = useCallback(
    (index) => {
      const n =
        ((index % content.projects.length) + content.projects.length) %
        content.projects.length;
      setSelected(n);
      setInspecting(false);
      try {
        sessionStorage.setItem("workshop-file", String(n));
      } catch {
        /* Optional selection memory. */
      }
      issue("archive");
    },
    [issue],
  );
  const inspect = useCallback(
    (value) => {
      setInspecting(value);
      issue(value ? "inspect" : "return");
    },
    [issue],
  );
  const toggleLamp = useCallback(() => {
    setLampOn((v) => !v);
    issue("lamp");
  }, [issue]);
  const sceneFailed = useCallback(() => setFailed(true), []);
  const chooseTool = useCallback(
    (category, name = "") => {
      setToolCategory(category);
      setTool(name);
      issue("tool");
    },
    [issue],
  );
  useEffect(() => {
    if (worldMode) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - innerHeight * 0.35) -
              Math.abs(b.boundingClientRect.top - innerHeight * 0.35),
          );
        const hit = visible[0];
        if (hit) {
          const id =
            hit.target.id === "credentials" ? "experience" : hit.target.id;
          setChapter((previous) => {
            if (previous !== id) {
              command.current = {
                serial: command.current.serial + 1,
                type: "chapter",
              };
              sceneAPI.current?.invalidate();
            }
            return id;
          });
        }
      },
      { rootMargin: "-22% 0px -47% 0px", threshold: 0 },
    );
    for (const c of sceneChapters) {
      const el = document.getElementById(c.targetId);
      if (el) observer.observe(el);
    }
    const credentials = document.getElementById("credentials");
    if (credentials) observer.observe(credentials);
    return () => observer.disconnect();
  }, [worldMode]);
  useEffect(() => {
    if (!worldMode) return;
    const navigateObject = (event) => goChapter(event.detail);
    window.addEventListener("workshop:navigate", navigateObject);
    return () =>
      window.removeEventListener("workshop:navigate", navigateObject);
  }, [location.hash, worldMode, goChapter]);
  useEffect(() => {
    sceneAPI.current?.invalidate();
  }, [chapter, lampOn, ambient, selected, inspecting, toolCategory, tool]);
  useEffect(() => {
    const settled = (ev) => setSettledChapter(ev.detail);
    window.addEventListener("workshop:camera-settled", settled);
    return () => window.removeEventListener("workshop:camera-settled", settled);
  }, []);
  const snapshot = useRef(null);
  // Updated semantic state is read by the renderer; never set React state per frame.
  useEffect(() => {
    snapshot.current = {
      chapter,
      lampOn,
      ambient,
      selected,
      inspecting,
      toolCategory,
      tool,
      focusedObject,
      lookAround,
      cameraMode,
      cameraSpeed,
      timeOfDay,
    };
    sceneAPI.current?.invalidate();
  }, [
    chapter,
    lampOn,
    ambient,
    selected,
    inspecting,
    toolCategory,
    tool,
    focusedObject,
    cameraMode,
    cameraSpeed,
    timeOfDay,
    lookAround,
  ]);
  const value = {
    mode,
    cameraMode,
    settledChapter,
    setCameraMode,
    cameraSpeed,
    setCameraSpeed,
    timeOfDay,
    setTimeOfDay,
    lookAround,
    setLookAround,
    worldMode,
    focusedObject,
    subroute: params.get("view") || "work",
    openObject,
    closeObject,
    goChapter,
    surfaceAnchor,
    actionsAnchor,
    bindSurface,
    bindActions,
    live,
    capable,
    failed,
    chapter,
    lampOn,
    ambient,
    selected,
    inspecting,
    toolCategory,
    tool,
    chooseMode,
    select,
    inspect,
    toggleLamp,
    setAmbient,
    sceneFailed,
    chooseTool,
    snapshot,
    sceneAPI,
    command,
    issue,
  };
  return (
    <ExperienceContext.Provider value={value}>
      <div
        className={
          "living-workshop " +
          (worldMode ? "world-interface " : "") +
          (live ? "living-explore" : "living-quick")
        }
        data-mood={timeOfDay}
        data-view={worldMode ? "explore" : "quick"}
        data-chapter={chapter}
      >
        {children}
      </div>
    </ExperienceContext.Provider>
  );
}
function chapterByTarget(id) {
  return sceneChapters.some((c) => c.id === id)
    ? id
    : id === "credentials" || id === "education"
      ? "experience"
      : "desk";
}
