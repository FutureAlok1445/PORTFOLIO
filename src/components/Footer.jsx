import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, Volume2, VolumeX } from "lucide-react";
import { content } from "../data/content";
import { scrollToTarget } from "./scroll";
export default function Footer({ notify }) {
  const marquee = useRef();
  const audio = useRef();
  const [sound, setSound] = useState(() => {
    try {
      return sessionStorage.getItem("sound") === "on";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem("sound", sound ? "on" : "off");
    } catch {
      /* Optional persistence. */
    }
  }, [sound]);
  useEffect(() => {
    let disposed = false;
    let cleanup;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const el = marquee.current;
    let generation = 0;
    const setup = () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      el.dataset.animationActive = "false";
      if (media.matches) return;
      import("gsap").then(({ default: gsap }) => {
        if (disposed || current !== generation || media.matches) return;
        const animation = gsap.to(el, {
          xPercent: -50,
          ease: "none",
          duration: 40,
          repeat: -1,
          paused: true,
        });
        let inView = false;
        const sync = () => {
          const active = inView && !document.hidden;
          el.dataset.animationActive = String(active);
          active ? animation.resume() : animation.pause();
        };
        const observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          sync();
        });
        observer.observe(el);
        document.addEventListener("visibilitychange", sync);
        cleanup = () => {
          animation.revert();
          observer.disconnect();
          document.removeEventListener("visibilitychange", sync);
          el.dataset.animationActive = "false";
        };
      });
    };
    setup();
    media.addEventListener("change", setup);
    return () => {
      disposed = true;
      generation++;
      cleanup?.();
      media.removeEventListener("change", setup);
    };
  }, []);
  useEffect(
    () => () => {
      audio.current?.close();
    },
    [],
  );
  function egg() {
    notify("Connection established. Curiosity is always welcome.");
    if (!sound) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audio.current ||= new Audio();
    const context = audio.current;
    context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      880,
      context.currentTime + 0.12,
    );
    gain.gain.setValueAtTime(0.04, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.25);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);
  }
  return (
    <footer>
      <div className="marquee-window" aria-hidden="true">
        <div className="marquee-track" ref={marquee}>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              Stay curious. Keep building. <span className="marquee-dot" />{" "}
            </span>
          ))}
        </div>
      </div>
      <div className="footer-bottom container">
        <div className="footer-identity">
          <span className="wordmark">
            as<span>.</span>
          </span>
          <p>
            {content.profile.name}
            <br />
            <small>Software engineer · Thane, India</small>
          </p>
        </div>
        <div className="footer-controls">
          <button
            onClick={() => setSound(!sound)}
            aria-pressed={sound}
            data-tooltip="Optional sound for the connection button"
          >
            {sound ? <Volume2 size={18} /> : <VolumeX size={18} />} Sound{" "}
            {sound ? "on" : "off"}
          </button>
          <button
            aria-label="Discover one more connection"
            data-tooltip="A small hello · optional sound"
            onClick={egg}
          >
            <Sparkles size={18} />
          </button>
          <button onClick={() => scrollToTarget(0)}>
            Back to top <ArrowUp size={18} />
          </button>
        </div>
        <small>
          © {new Date().getFullYear()} {content.profile.name}
        </small>
      </div>
    </footer>
  );
}
