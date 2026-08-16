import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { solutions } from "../data/solutions";
import { useApp } from "../lib/store";
import { Reveal, Empty, Toast, SectionHead } from "../components/ui";

export default function Solutions() {
  const { saved, toggleSaved, isSaved } = useApp();
  const [q, setQ] = useState("");
  const [onlySaved, setOnlySaved] = useState(false);
  const [toast, setToast] = useState("");
  const loc = useLocation();

  useEffect(() => {
    if (loc.hash) {
      const id = loc.hash.replace("#", "");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    }
  }, [loc.hash]);

  const filtered = useMemo(() => {
    let list = solutions;
    if (onlySaved) list = list.filter((s) => saved.includes(s.id));
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter((s) => (s.topic + s.problem + s.solutions.join(" ") + s.community).toLowerCase().includes(t));
    }
    return list;
  }, [q, onlySaved, saved]);

  const save = (id: string) => {
    toggleSaved(id);
    setToast(isSaved(id) ? "Removed from saved ❌" : "Saved to your list ❤️");
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <h1>
              Solutions <span className="grad-text">Library</span> 📚
            </h1>
            <p>
              Researched, practical answers to Nepal's most common society &amp; daily-life problems — what you can do,
              and what your community can do together.
            </p>
          </Reveal>
          <Reveal delay="d1">
            <div style={{ maxWidth: 520, margin: "26px auto 0", display: "flex", gap: 10 }}>
              <div className="search-box" style={{ flex: 1 }}>
                <span className="s-icon">🔍</span>
                <input className="input" placeholder="Search problems… e.g. water, pollution, education" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <button className={`btn ${onlySaved ? "btn-primary" : "btn-ghost"} btn-sm`} onClick={() => setOnlySaved((s) => !s)}>
                ❤️ Saved {saved.length > 0 && `(${saved.length})`}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          {filtered.length === 0 ? (
            <Empty
              icon="📚"
              title={onlySaved ? "No saved solutions yet" : "No solutions match"}
              sub={onlySaved ? "Tap the ♥ on any solution card to save it here." : "Try a different search term."}
            />
          ) : (
            <div className="grid-2">
              {filtered.map((s, i) => (
                <Reveal key={s.id} delay={`d${(i % 2) + 1}`}>
                  <div id={s.id} className="card sol-card" style={{ flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: 16, width: "100%" }}>
                      <div className="s-ico" style={{ background: `${s.color}22`, color: s.color }}>
                        {s.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3>{s.topic}</h3>
                        <p className="small">{s.problem}</p>
                      </div>
                      <button className="icon-btn" onClick={() => save(s.id)} aria-label="Save" title="Save">
                        <span style={{ filter: isSaved(s.id) ? "none" : "grayscale(1) opacity(.55)" }}>❤️</span>
                      </button>
                    </div>

                    <div className="card-flat" style={{ padding: "14px 16px", background: "var(--bg)" }}>
                      <h4 className="mb-1" style={{ fontSize: 13.5, color: "var(--text-dim)" }}>
                        🔍 Root causes
                      </h4>
                      <ul style={{ paddingLeft: 20, marginBottom: 14 }}>
                        {s.causes.map((c) => (
                          <li key={c} className="small muted" style={{ marginBottom: 3 }}>
                            {c}
                          </li>
                        ))}
                      </ul>
                      <h4 className="mb-1" style={{ fontSize: 13.5, color: "var(--text-dim)" }}>
                        ✅ What you can do
                      </h4>
                      <ol style={{ paddingLeft: 20, marginBottom: 14 }}>
                        {s.solutions.map((x) => (
                          <li key={x} className="small muted" style={{ marginBottom: 3 }}>
                            {x}
                          </li>
                        ))}
                      </ol>
                      <h4 className="mb-1" style={{ fontSize: 13.5, color: "var(--text-dim)" }}>
                        🤝 Community action
                      </h4>
                      <p className="small muted mb-2">{s.community}</p>
                      <h4 className="mb-1" style={{ fontSize: 13.5, color: "var(--text-dim)" }}>
                        📞 Seek help
                      </h4>
                      <p className="small" style={{ color: "var(--primary-2)" }}>
                        {s.help}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-4">
            <SectionHead
              eyebrow="Ask Sathi"
              title="Need a tailored answer?"
              sub="The AI can give you a step-by-step plan for your specific situation and location."
            />
            <div className="center">
              <a href="#/assistant" className="btn btn-gold">
                ✨ Ask AI Sathi
              </a>
            </div>
          </div>
        </div>
      </section>
      <Toast message={toast} />
    </div>
  );
}
