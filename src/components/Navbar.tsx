import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useApp } from "../lib/store";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/report", label: "Report" },
  { to: "/community", label: "Community" },
  { to: "/solutions", label: "Solutions" },
  { to: "/assistant", label: "AI Sathi" },
  { to: "/emergency", label: "Emergency" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <span className="brand-logo">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                <path d="M12 5.5c-1 1.4-2.8 1.6-2.8 1.6s1.8.8 1.8 2.3c0 .9-.5 1.7-1.3 2.2.8.5 1.3 1.3 1.3 2.2 0 1.5-1.8 2.3-1.8 2.3s1.8.2 2.8 1.6c1-1.4 2.8-1.6 2.8-1.6S13 16 13 14.5c0-.9.5-1.7 1.3-2.2-.8-.5-1.3-1.3-1.3-2.2 0-1.5 1.8-2.3 1.8-2.3S13 6.9 12 5.5z" fill="white" />
              </svg>
            </span>
            <span>
              Nibourly
              <em>Nepal · Society · Daily Life</em>
            </span>
          </Link>

          <nav className="nav-links">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="icon-btn theme" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <Link to="/settings" className="icon-btn" aria-label="Settings" title="Settings">⚙️</Link>
            <button className="icon-btn btn-hamburger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="mobile-menu">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}
