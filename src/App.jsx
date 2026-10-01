import { Component, Suspense, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, Moon, Sun, X, Search } from "lucide-react";
import { content } from "./data/content";
import { scrollToTarget, scheduleScrollToTarget } from "./components/scroll";
import ProjectCursor from "./components/ProjectCursor";
import Seo from "./components/Seo";
import CommandPalette from "./components/CommandPalette";
import BackToTop from "./components/BackToTop";
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
        <a href={"mailto:" + content.profile.email}>Email Alok</a>
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
  const [display, setDisplay] = useState(label);
  const timer = useRef();
  useEffect(() => () => clearInterval(timer.current), []);
  function reset() {
    clearInterval(timer.current);
    setDisplay(label);
  }
  function scramble() {
    if (
      !matchMedia("(pointer:fine)").matches ||
      matchMedia("(prefers-reduced-motion:reduce)").matches
    )
      return;
    clearInterval(timer.current);
    let frame = 0;
    timer.current = setInterval(() => {
      frame++;
      if (frame > label.length) {
        reset();
        return;
      }
      setDisplay(
        label
          .split("")
          .map((letter, index) =>
            index < frame
              ? letter
              : "abcdefghijklmnopqrstuvwxyz"[(frame * 7 + index * 3) % 26],
          )
          .join(""),
      );
    }, 35);
  }
  return (
    <button
      className={active ? "active" : ""}
      aria-current={active ? "location" : undefined}
      onClick={onClick}
      onPointerEnter={scramble}
      onPointerLeave={reset}
    >
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return (
        localStorage.getItem("theme") ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      );
    } catch {
      return "light";
    }
  });
  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState("");
  const [active, setActive] = useState("");
  const [intro, setIntro] = useState(() => {
    try {
      return !sessionStorage.getItem("visited");
    } catch {
      return true;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();
  const toastTimer = useRef();
  const isReload = useRef(
    typeof window !== "undefined" &&
      ((window.performance &&
        window.performance.getEntriesByType("navigation")[0]?.type ===
          "reload") ||
        window.performance?.navigation?.type === 1),
  );
  useEffect(() => {
    if (isReload.current) {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (!location.hash) {
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
                : e.target.id === "skills"
                  ? "about"
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
  function notify(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(content.profile.email);
      notify("Copied ✓");
      return true;
    } catch {
      notify("Copy unavailable. Email: " + content.profile.email);
      return false;
    }
  }
  function jump(id) {
    setPalette(false);
    setMenu(false);
    if (location.pathname !== "/") navigate("/#" + id);
    else scrollToTarget(id);
  }
  useEffect(() => {
    if (!location.hash) return;
    if (isReload.current) {
      isReload.current = false;
      return;
    }
    return scheduleScrollToTarget(location.hash);
  }, [location]);
  return (
    <ErrorBoundary>
      <Seo />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {intro && (
        <section className="intro" aria-label="Welcome">
          <span>
            Alok<span className="orange">.</span>
          </span>
          <button onClick={() => setIntro(false)}>
            Skip intro <X size={16} />
          </button>
        </section>
      )}
      <header className="nav">
        <Link className="wordmark" to="/" aria-label="as. — Alok Sahoo home">
          as<span>.</span>
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
            data-tooltip={"Search portfolio · " + shortcut}
            onClick={() => setPalette(true)}
          >
            <Search size={18} className="command-icon" />
            <span className="key-label">{shortcut}</span>
          </button>
          <button
            aria-label={
              "Switch to " + (theme === "light" ? "dark" : "light") + " mode"
            }
            data-tooltip={
              "Switch to " + (theme === "light" ? "dark" : "light") + " mode"
            }
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <a className="nav-contact" href={"mailto:" + content.profile.email}>
            Let’s talk <ArrowUpRight size={17} />
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
          <Outlet context={{ copyEmail, notify }} />
        </div>
      </Suspense>
      {palette && (
        <CommandPalette
          close={() => setPalette(false)}
          jump={jump}
          copyEmail={copyEmail}
          toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
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
      <ProjectCursor />
      <BackToTop />
    </ErrorBoundary>
  );
}
