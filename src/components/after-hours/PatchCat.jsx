import { useEffect, useEffectEvent, useRef, useState } from "react";
import manifest from "../../data/patch-manifest.json";
export default function PatchCat({
  variant = "idle",
  interactive = false,
  label = "Pet Patch",
  size = 144,
  direction = "right",
  ambient = true,
  chapter = "desk",
  lampOn = true,
}) {
  const [reaction, setReaction] = useState(null),
    [running, setRunning] = useState(false),
    host = useRef(null),
    timer = useRef(null),
    count = useRef(0),
    visitor = useRef(false);
  const resting =
    variant === "curl" ||
    variant === "sleep" ||
    chapter === "contact" ||
    !lampOn
      ? "sleep"
      : "idle";
  const state = reaction || resting,
    animation = manifest.animations[state] || manifest.animations.idle;
  useEffect(() => {
    const el = host.current,
      reduced = matchMedia("(prefers-reduced-motion:reduce)");
    let visible = false,
      active = true,
      scheduled;
    function cycle() {
      if (!active || !visible || document.hidden || reduced.matches || !ambient)
        return;
      if (visitor.current) {
        scheduled = setTimeout(cycle, 9000);
        return;
      }
      const cues = ["blink", "look", "tail", "ear", "stand", "paw", "peek", "settle", "jump"];
      setReaction(cues[count.current++ % cues.length]);
      scheduled = setTimeout(() => {
        if (!visitor.current) setReaction(null);
        scheduled = setTimeout(cycle, 9000 + (count.current % 4) * 1200);
      }, 1100);
    }
    function sync() {
      const supported =
        visible &&
        !document.hidden &&
        !reduced.matches &&
        ["desk", "about", "contact"].includes(chapter);
      const enabled = supported && ambient;
      setRunning(supported);
      clearTimeout(scheduled);
      if (enabled && resting === "idle") scheduled = setTimeout(cycle, 9000);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      active = false;
      clearTimeout(scheduled);
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ambient, resting, chapter]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(()=>{
    window.dispatchEvent(new CustomEvent('workshop:patch',{detail:{state:state.toUpperCase()}}));
  },[state]);
  useEffect(()=>{
    const reset=setTimeout(()=>{clearTimeout(timer.current);visitor.current=false;setReaction(null);window.dispatchEvent(new Event('workshop:patch-cancel'));},0);
    return ()=>clearTimeout(reset);
  },[chapter]);
  const monitorWalk=useEffectEvent(()=>{if(resting==='idle'&&!visitor.current)walk();});
  useEffect(()=>{const run=()=>monitorWalk();window.addEventListener('workshop:monitor-open',run);return ()=>window.removeEventListener('workshop:monitor-open',run);},[]);
  useEffect(() => {
    const cue = () => {
      if (!visitor.current && resting === "idle" && ambient) {
        visitor.current = true;
        setReaction("look");
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          visitor.current = false;
          setReaction(null);
        }, 800);
      }
    };
    window.addEventListener("workshop:look", cue);
    return () => window.removeEventListener("workshop:look", cue);
  }, [resting, ambient]);
  function act(next, duration, after) {
    clearTimeout(timer.current);
    visitor.current = true;
    setReaction(next);
    timer.current = setTimeout(() => {
      if (after) {
        after();
        return;
      }
      visitor.current = false;
      setReaction(null);
    }, duration);
  }
  function hello() {
    if (resting === "sleep") {
      act("wake", 900, () => act("stretch", 900));
    } else act("pet", 1000);
  }
  function walk() {
    act("walk", 1560, () => act("return", 1040));
  }
  const sprite = (
    <span
      key={state}
      className="patch-sprite"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(/images/after-hours/patch/${animation.file})`,
        "--sheet-width": `${size * animation.frames}px`,
        "--frames": animation.frames,
        "--duration": `${animation.frames / animation.fps}s`,
        "--iterations": animation.loop ? "infinite" : 1,
        scale: direction === "left" || state === "return" ? "-1 1" : undefined,
      }}
    />
  );
  const props = {
    ref: host,
    className: `patch-button patch-${state} ${running && (ambient || reaction) ? "patch-visible" : "patch-static"}`,
    style: { width: size, height: size },
    "data-patch-state": state,
  };
  return (
    <>
      {interactive ? (
        <button
          type="button"
          {...props}
          onClick={hello}
          onPointerEnter={() =>
            window.dispatchEvent(new Event("workshop:look"))
          }
          aria-label={resting === "sleep" ? "Wake Patch" : label}
          title={resting === "sleep" ? "Wake Patch" : label}
        >
          {sprite}
        </button>
      ) : (
        <span {...props} aria-hidden="true">
          {sprite}
        </span>
      )}
      {interactive && chapter === "desk" && (
        <button
          className="patch-walk-control"
          onClick={walk}
          aria-label="Let Patch stretch its legs"
        >
          A little desk patrol ↗
        </button>
      )}
    </>
  );
}
