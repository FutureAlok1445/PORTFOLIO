import { useEffect, useRef, useState } from "react";
import { ArrowUp, Volume2, VolumeX } from "lucide-react";
import { content } from "../data/content";
import { scrollToTarget } from "./scroll";
export default function Footer({ notify }) {
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
      /* Optional preference. */
    }
  }, [sound]);
  useEffect(
    () => () => {
      audio.current?.close();
    },
    [],
  );
  function egg() {
    notify(content.workshop.patchHello);
    if (!sound) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audio.current ||= new Audio();
    const context = audio.current;
    context.resume();
    const oscillator = context.createOscillator(),
      gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      660,
      context.currentTime + 0.12,
    );
    gain.gain.setValueAtTime(0.025, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start();
    oscillator.stop(context.currentTime + 0.22);
  }
  return (
    <footer>
      <div className="footer-bottom container">
        <div className="footer-identity">
          <button
            className="wordmark"
            aria-label="Discover one more workshop note"
            onClick={egg}
          >
            <img src="/images/after-hours/brand/mark.svg" alt="" />
            {content.workshop.name}
          </button>
          <p>
            {content.profile.name}
            <br />
            <small>{content.workshop.close}</small>
          </p>
        </div>
        <div className="footer-controls">
          <button onClick={() => setSound(!sound)} aria-pressed={sound}>
            {sound ? <Volume2 size={16} /> : <VolumeX size={16} />} Sound{" "}
            {sound ? "on" : "off"}
          </button>
          <button onClick={() => scrollToTarget(0)}>
            Back to top <ArrowUp size={16} />
          </button>
        </div>
        <small>
          © {new Date().getFullYear()} {content.profile.name}
        </small>
      </div>
    </footer>
  );
}
