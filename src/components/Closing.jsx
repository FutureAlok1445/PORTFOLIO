import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Award,
  Copy,
  Code2,
  UserRound,
  Send,
  Sparkles,
  Flag,
  Trophy,
  Medal,
} from "lucide-react";
import { content } from "../data/content";
import { Magnetic } from "./Motion";
import { scrollToTarget } from "./scroll";
export function Credentials() {
  const icons = { flag: Flag, trophy: Trophy, medal: Medal };
  return (
    <section className="credentials container" id="credentials">
      <div className="section-meta">
        <span>A little outside the syllabus</span>
        <span>Recognition & continued learning</span>
      </div>
      <h2 className="serif reveal-title">
        Show up. Build.
        <br />
        Keep learning.
      </h2>
      <div className="honors">
        {content.achievements.map((a) => {
          const Icon = icons[a.icon] || Medal;
          return (
            <article key={a.title}>
              <span>{a.year}</span>
              <h3>{a.title}</h3>
              <p>{a.result}</p>
              <small>{a.issuer}</small>
              <Icon size={22} />
            </article>
          );
        })}
      </div>
      <div className="certificate-heading">
        <h3>Courses & certificates</h3>
        <p>A growing set of foundations.</p>
      </div>
      <div className="certificates">
        {content.certificates.map((c) => {
          const Body = (
            <>
              <span className="certificate-date">{c.date}</span>
              <h4>{c.title}</h4>
              <p>{c.issuer}</p>
              {c.url && (
                <span className="certificate-link">
                  View credential <ArrowUpRight size={16} />
                </span>
              )}
            </>
          );
          return c.url ? (
            <a
              className="certificate"
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              key={c.title}
            >
              {Body}
            </a>
          ) : (
            <article className="certificate" key={c.title}>
              {Body}
            </article>
          );
        })}
      </div>
    </section>
  );
}
export function Contact({ copyEmail, notify }) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const abort = useRef();
  useEffect(() => () => abort.current?.abort(), []);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (
      !name ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      message.length < 10
    ) {
      setError(
        "Add your name, a valid email, and a message of at least 10 characters.",
      );
      setState("error");
      return;
    }
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setState("unconfigured");
      setError(
        "The form isn’t connected yet. Email me directly using the link above.",
      );
      return;
    }
    setState("loading");
    setError("");
    abort.current = new AbortController();
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: abort.current.signal,
      });
      if (!response.ok) throw new Error("service");
      setState("success");
      form.reset();
      notify("Message sent. Thanks for reaching out.");
    } catch (err) {
      if (err.name !== "AbortError") {
        setState("error");
        setError("Your message didn’t send. Try again, or email me directly.");
      }
    }
  }
  return (
    <section id="contact" className="contact-band">
      <div className="container">
        <div className="section-meta">
          <span>The next connection</span>
          <span>Have something in mind?</span>
        </div>
        <div className="contact-grid">
          <div>
            <h2 className="contact-title reveal-title">
              Let’s build
              <br />
              something
              <br />
              <span className="serif">that works.</span>
            </h2>
            <div className="email-row">
              <a href={"mailto:" + content.profile.email}>
                {content.profile.email}
              </a>
              <Magnetic aria-label="Copy email address" onClick={copyEmail}>
                <Copy size={18} />
              </Magnetic>
            </div>
            <div className="social-links">
              {content.socials.map((s) => (
                <Magnetic
                  as="a"
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label === "GitHub" ? (
                    <Code2 size={19} />
                  ) : (
                    <UserRound size={19} />
                  )}{" "}
                  {s.label}
                  <ArrowUpRight size={15} />
                </Magnetic>
              ))}
            </div>
          </div>
          <form onSubmit={submit} className="contact-form">
            <p>Tell me about the problem you’re solving.</p>
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="How should I call you?"
              required
              maxLength={100}
            />
            <label htmlFor="email">Your email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              maxLength={254}
            />
            <label htmlFor="message">What are you thinking?</label>
            <textarea
              id="message"
              name="message"
              placeholder="A project, a role, or an interesting idea…"
              required
              minLength={10}
              maxLength={5000}
              rows={4}
            />
            <input
              name="_gotcha"
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <Magnetic
              className="button send-button"
              disabled={state === "loading"}
              type="submit"
            >
              {state === "loading" ? "Sending…" : "Send a message"}
              <Send size={17} />
            </Magnetic>
            <div className="form-feedback" aria-live="polite">
              {state === "success" ? (
                <p>Message sent. Thanks for reaching out.</p>
              ) : (
                error && <p className="form-error">{error}</p>
              )}
            </div>
            <small>
              Prefer your own inbox? The email link opens it directly.
            </small>
          </form>
        </div>
      </div>
    </section>
  );
}
export function Footer({ notify }) {
  const marquee = useRef();
  const [sound, setSound] = useState(false);
  const audio = useRef();
  const soundRef = useRef(false);
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let disposed = false;
    let cleanup;
    import("gsap").then(({ default: gsap }) => {
      if (disposed) return;
      const animation = gsap.to(marquee.current, {
        xPercent: -50,
        ease: "none",
        duration: 40,
        repeat: -1,
      });
      let last = window.scrollY;
      let idle;
      const scroll = () => {
        const velocity = Math.min(4, 1 + Math.abs(window.scrollY - last) / 100);
        last = window.scrollY;
        animation.timeScale(velocity);
        clearTimeout(idle);
        idle = setTimeout(() => animation.timeScale(1), 120);
      };
      const visibility = () =>
        document.hidden ? animation.pause() : animation.resume();
      window.addEventListener("scroll", scroll, { passive: true });
      document.addEventListener("visibilitychange", visibility);
      const observer = new IntersectionObserver(([entry]) =>
        entry.isIntersecting ? animation.resume() : animation.pause(),
      );
      observer.observe(marquee.current);
      cleanup = () => {
        animation.kill();
        clearTimeout(idle);
        observer.disconnect();
        window.removeEventListener("scroll", scroll);
        document.removeEventListener("visibilitychange", visibility);
      };
    });
    return () => {
      disposed = true;
      cleanup?.();
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
    if (soundRef.current) {
      audio.current ||= new (
        window.AudioContext || window.webkitAudioContext
      )();
      audio.current.resume();
      const oscillator = audio.current.createOscillator();
      const gain = audio.current.createGain();
      oscillator.connect(gain);
      gain.connect(audio.current.destination);
      oscillator.frequency.setValueAtTime(440, audio.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        880,
        audio.current.currentTime + 0.12,
      );
      gain.gain.setValueAtTime(0.04, audio.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.current.currentTime + 0.25,
      );
      oscillator.start();
      oscillator.stop(audio.current.currentTime + 0.25);
    }
  }
  return (
    <footer>
      <div className="marquee-window" aria-hidden="true">
        <div className="marquee-track" ref={marquee}>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              Stay curious. Keep building. <span>✳</span>{" "}
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
            Alok Sahoo
            <br />
            <small>Software engineer · Thane, India</small>
          </p>
        </div>
        <div className="footer-controls">
          <button onClick={() => setSound(!sound)} aria-pressed={sound}>
            Sound {sound ? "on" : "off"}
          </button>
          <button aria-label="Discover one more connection" onClick={egg}>
            <Sparkles size={17} />
          </button>
          <button onClick={() => scrollToTarget(0)}>
            Back to top <ArrowUp size={17} />
          </button>
        </div>
        <small>© {new Date().getFullYear()} Alok Sahoo</small>
      </div>
    </footer>
  );
}
