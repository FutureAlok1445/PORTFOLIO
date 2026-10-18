import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, Moon, Sun, X, Search, Volume2, VolumeX, LampDesk } from "lucide-react";
import { content } from "./data/content";
import { scheduleScrollToTarget } from "./components/scroll";
import Seo from "./components/Seo";
import CommandPalette from "./components/CommandPalette";
import BackToTop from "./components/BackToTop";
import CustomReticle from "./components/CustomReticle";
import { getISTSnapshot } from "./utils/istTime";
import { isSoundEnabled, setSoundEnabled, playLampPull, playKeyClick } from "./utils/sound";

class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="error-page">
        <h1>Something interrupted the page.</h1>
        <p>Reload to try again, or reach me directly.</p>
        <a href="/#contact">Go to Writing Desk</a>
        <button onClick={() => window.location.reload()}>Reload</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
const sections = content.navigation;
const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K";
function NavButton({ label, active, onClick }) {
  return (
    <button
      className={active ? "active" : ""}
      aria-current={active ? "location" : undefined}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const [sound, setSound] = useState(() => isSoundEnabled());
  const [ist, setIst] = useState(() => getISTSnapshot());
  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState("");
  const [active, setActive] = useState("");
  const [intro, setIntro] = useState(() => {
    try {
      if (
        typeof window !== "undefined" &&
        (sessionStorage.getItem("visited") ||
          new URLSearchParams(window.location.search).get("qa") === "1" ||
          navigator.webdriver)
      ) {
        sessionStorage.setItem("visited", "1");
        return false;
      }
      return !matchMedia("(prefers-reduced-motion:reduce)").matches;
    } catch {
      return false;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();
  const toastTimer = useRef();

  useEffect(() => {
    const id = setInterval(() => setIst(getISTSnapshot()), 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);
  useEffect(() => {
    let frame;
    const progress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - innerHeight;
        const bar = document.querySelector(".scroll-progress");
        if (bar)
          bar.style.transform = `scaleX(${height > 0 ? scrollY / height : 0})`;
      });
    };
    window.addEventListener("scroll", progress, { passive: true });
    window.addEventListener("resize", progress);
    progress();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", progress);
      window.removeEventListener("resize", progress);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* Optional persistence. */
    }
  }, [theme]);
  useEffect(() => {
    const t = setTimeout(() => {
      setIntro(false);
      try {
        sessionStorage.setItem("visited", "1");
      } catch {
        /* Optional persistence. */
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        playKeyClick(1.1);
        setPalette((v) => !v);
      }
      if (e.key === "Escape") {
        setPalette(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            setActive(
              ["credentials", "education"].includes(e.target.id)
                ? "experience"
                : e.target.id,
            );
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const notify = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  }, []);
  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content.profile.email);
      notify("Copied ✓");
      return true;
    } catch {
      notify("Copy unavailable. Email: " + content.profile.email);
      return false;
    }
  }, [notify]);
  const toggleSound = useCallback(() => {
    const next = setSoundEnabled(!sound);
    setSound(next);
    notify(next ? "Tactile workshop audio enabled" : "Workshop audio muted");
  }, [sound, notify]);

  const outletContext = useMemo(
    () => ({ copyEmail, notify, sound, toggleSound, ist }),
    [copyEmail, notify, sound, toggleSound, ist],
  );
  function jump(id) {
    playKeyClick(1.0);
    setPalette(false);
    setMenu(false);
    if (location.pathname !== "/") navigate("/#" + id);
    else navigate("/#" + id, { preventScrollReset: true });
  }
  useEffect(() => {
    if (document.querySelector(".world-interface")) return;
    if (!location.hash) return;
    return scheduleScrollToTarget(location.hash);
  }, [location.pathname, location.hash]);
  return (
    <ErrorBoundary>
      <Seo />
      <CustomReticle />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {intro && (
        <section className="intro atelier-ignition" aria-label="Welcome">
          <span>
            <img src="/images/after-hours/brand/mark.svg" alt="" />
            <strong>{content.workshop.welcome}</strong>
            <small className="mono-telemetry">
              THANE / KALYAN · {ist.shortClock} · {ist.phase.toUpperCase()}
            </small>
          </span>
          <button
            onClick={() => {
              playLampPull(true);
              setIntro(false);
            }}
          >
            <LampDesk size={16} /> Pull lamp chain / Enter <X size={16} />
          </button>
        </section>
      )}
      <header className="nav">
        <Link
          className="wordmark"
          to="/"
          aria-label="After hours — Alok Sahoo home"
        >
          <img src="/images/after-hours/brand/mark.svg" alt="" />
          <span>
            {content.workshop.name}
            <small>
              {content.profile.name} · <em className="ist-badge">{ist.shortClock}</em>
            </small>
          </span>
        </Link>
        <nav
          className={menu ? "links open" : "links"}
          aria-label="Main navigation"
        >
          {sections.map((s) => (
            <NavButton
              key={s.id}
              label={s.label}
              active={
                location.pathname.startsWith("/projects/")
                  ? s.id === "work"
                  : active === s.id
              }
              onClick={() => jump(s.id)}
            />
          ))}
        </nav>
        <div className="nav-tools">
          <button
            aria-label="Open command palette"
            data-tooltip={content.workshop.interface.quickActionsHint + " · " + shortcut}
            onClick={() => {
              playKeyClick(1.08);
              setPalette(true);
            }}
          >
            <Search size={18} className="command-icon" />
            <span className="key-label">{content.workshop.interface.quickActions}</span>
          </button>
          <button
            aria-label={sound ? "Mute workshop soundscape" : "Enable tactile workshop soundscape"}
            data-tooltip={sound ? "Mute workshop audio" : "Enable tactile key & studio audio"}
            aria-pressed={sound}
            onClick={toggleSound}
          >
            {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            aria-label={
              "Switch to " + (theme === "light" ? "dark" : "light") + " mode"
            }
            data-tooltip={
              "Switch to " + (theme === "light" ? "dark" : "light") + " mode"
            }
            onClick={() => {
              playLampPull(theme === "light");
              setTheme(theme === "light" ? "dark" : "light");
            }}
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <a
            className="nav-contact"
            href="#contact"
            onClick={(ev) => {
              ev.preventDefault();
              jump("contact");
              setTimeout(() => {
                const el = document.getElementById("message");
                if (el) el.focus();
              }, 350);
            }}
          >
            Writing desk <ArrowUpRight size={17} />
          </a>
          <button
            className="mobile-menu"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        <div className="scroll-progress" />
      </header>
      <Suspense
        fallback={
          <main id="main" className="loading-page">
            Opening the next page…
          </main>
        }
      >
        <div className="route-page" key={location.pathname}>
          <Outlet context={outletContext} />
        </div>
      </Suspense>
      {palette && (
        <CommandPalette
          close={() => setPalette(false)}
          jump={jump}
          copyEmail={copyEmail}
          toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
          toggleSound={toggleSound}
          openProject={(slug) =>
            navigate("/projects/" + slug, {
              viewTransition:
                typeof document.startViewTransition === "function" &&
                !matchMedia("(prefers-reduced-motion:reduce)").matches,
            })
          }
        />
      )}
      <div className={"toast " + (toast ? "visible" : "")} role="status">
        {toast}
      </div>
      <BackToTop />
    </ErrorBoundary>
  );
}
