import { Link } from "react-router-dom";
import { Reveal, SectionHead, CountUp } from "../components/ui";
import { issueCategories } from "../data/issues";
import { solutions } from "../data/solutions";
import { provinces, cities } from "../data/nepal";

export default function Home() {
  const featured = solutions.slice(0, 4);
  const totalReports = 1260;
  const totalSolved = 840;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <span className="dot" />
              AI-powered · Built for Nepal's society 🇳🇵
            </div>
            <h1>
              Solve daily-life problems, <span className="grad-text">together.</span>
            </h1>
            <p>
              Nibourly connects neighbours across all <b>7 provinces</b> and <b>77 districts</b> of Nepal — report civic
              issues like garbage, water and potholes, find practical solutions, and ask <b>Sathi</b>, our AI, anytime.
            </p>
            <div className="hero-cta">
              <Link to="/report" className="btn btn-primary">
                🛠️ Report an Issue
              </Link>
              <Link to="/assistant" className="btn btn-gold">
                ✨ Ask AI Sathi
              </Link>
              <Link to="/explore" className="btn btn-ghost">
                🗺️ Explore Nepal
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="num">
                  <CountUp to={77} />
                </div>
                <div className="lbl">Districts covered</div>
              </div>
              <div className="stat">
                <div className="num">
                  <CountUp to={totalReports} />
                </div>
                <div className="lbl">Issues reported</div>
              </div>
              <div className="stat">
                <div className="num">
                  <CountUp to={totalSolved} />
                </div>
                <div className="lbl">Solved by community</div>
              </div>
              <div className="stat">
                <div className="num">
                  <CountUp to={16} />
                </div>
                <div className="lbl">Solution guides</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-ring" />
            <div className="hero-card-stack">
              <div className="float-card fc1 floaty-slow">
                <div className="fc-title">
                  <span>🚧 Road pothole · New Baneshwor</span>
                  <span className="tag" style={{ background: "rgba(251,191,36,.15)", color: "#fbbf24" }}>
                    High
                  </span>
                </div>
                <div className="fc-bar">
                  <i style={{ width: "64%", background: "linear-gradient(90deg,#fbbf24,#f59e0b)" }} />
                </div>
                <div className="fc-row">
                  <span className="fc-avatar" style={{ background: "#e23744" }}>
                    S
                  </span>
                  <span>
                    <b>Sita S.</b> · Kathmandu
                  </span>
                  <span style={{ marginLeft: "auto" }}>👍 87</span>
                </div>
              </div>
              <div className="float-card fc2 floaty">
                <div className="fc-ai">
                  <span className="fc-avatar" style={{ background: "linear-gradient(135deg,#e23744,#a78bfa)" }}>
                    ✨
                  </span>
                  <div className="bubble">
                    <b>Sathi:</b> Namaste! Segregate kitchen waste into a compost pit — the ward's compost programme can
                    take it. 🌱
                  </div>
                </div>
              </div>
              <div className="float-card fc3 floaty-slow">
                <div className="fc-title">
                  <span>💧 Water shortage · Chabhail</span>
                  <span className="tag" style={{ background: "rgba(239,68,68,.15)", color: "#ef4444" }}>
                    Critical
                  </span>
                </div>
                <div className="fc-bar">
                  <i style={{ width: "38%", background: "linear-gradient(90deg,#ef4444,#f43f5e)" }} />
                </div>
                <div className="fc-row">
                  <span className="fc-avatar" style={{ background: "#38bdf8" }}>
                    R
                  </span>
                  <span>
                    <b>Ram T.</b> · Kathmandu
                  </span>
                  <span style={{ marginLeft: "auto" }}>👍 134</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k} aria-hidden={k === 1}>
              {provinces.map((p) => (
                <span key={p.id}>
                  {p.name} <span className="faint">·</span>
                </span>
              ))}
              {cities.slice(0, 8).map((c) => (
                <span key={c.name}>
                  {c.name} <span className="faint">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ============ CATEGORIES ============ */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="What can you report?"
            title="Common problems in Nepali daily life"
            sub="From potholes and garbage to water shortages and pollution — pick a category and let your community act."
          />
          <div className="cat-grid">
            {issueCategories.slice(0, 8).map((c, i) => (
              <Reveal key={c.id} delay={`d${(i % 4) + 1}`}>
                <Link to={`/report?cat=${c.id}`} className="card hoverable cat-card" style={{ borderTop: `3px solid ${c.color}` }}>
                  <span className="ico">{c.icon}</span>
                  <h3>{c.label}</h3>
                  <p>{c.labelNp}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stat-grid">
            {[
              { n: 77, l: "Districts across 7 provinces", c: "#fbbf24" },
              { n: 3, l: "Steps to report an issue", c: "#e23744" },
              { n: 16, l: "Curated solution guides", c: "#a78bfa" },
              { n: 10, l: "Emergency helplines listed", c: "#38bdf8" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={`d${i + 1}`}>
                <div className="card hoverable stat-tile">
                  <div className="big" style={{ color: s.c }}>
                    <CountUp to={s.n} />
                  </div>
                  <div className="lbl">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED SOLUTIONS ============ */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Real solutions"
            title="Society problems, practical answers"
            sub="Researched solutions for Nepal's most common daily-life challenges — personal actions and community steps."
          />
          <div className="grid-2">
            {featured.map((s, i) => (
              <Reveal key={s.id} delay={`d${(i % 2) + 1}`}>
                <Link to={`/solutions#${s.id}`} className="card hoverable sol-card">
                  <div className="s-ico" style={{ background: `${s.color}22`, color: s.color }}>
                    {s.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3>{s.topic}</h3>
                    <p>{s.problem.length > 150 ? s.problem.slice(0, 150) + "…" : s.problem}</p>
                  </div>
                  <span className="arrow" style={{ color: "var(--text-faint)" }}>
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="center mt-4">
            <Link to="/solutions" className="btn btn-ghost">
              Browse all {solutions.length} solutions →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="How it works"
            title="From problem to solution in 3 steps"
            sub="No paperwork, no waiting for the right office — the community handles it together."
          />
          <div className="steps">
            <Reveal delay="d1">
              <div className="card step">
                <span className="s-no">1</span>
                <h3>📝 Report the issue</h3>
                <p>
                  Choose the category and your exact location — province, district and neighbourhood — then describe what
                  needs fixing.
                </p>
              </div>
            </Reveal>
            <Reveal delay="d2">
              <div className="card step">
                <span className="s-no">2</span>
                <h3>🗳️ Community supports it</h3>
                <p>
                  Neighbours see it on the Community board and upvote. High-voted issues get real attention and faster
                  ward action.
                </p>
              </div>
            </Reveal>
            <Reveal delay="d3">
              <div className="card step">
                <span className="s-no">3</span>
                <h3>✅ Solved together</h3>
                <p>
                  Mark issues resolved once fixed, share what worked, and read Sathi's AI suggestions for sustainable
                  solutions.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div
              className="card center"
              style={{
                padding: "52px 24px",
                background: "linear-gradient(120deg, rgba(226,55,68,.16), rgba(167,139,250,.12), rgba(56,189,248,.1))",
                border: "1px solid var(--border-strong)",
              }}
            >
              <h2 style={{ fontSize: "clamp(26px,4vw,40px)", marginBottom: 14 }}>
                Have a problem in your tole? <span className="grad-text">Let's fix it.</span>
              </h2>
              <p className="muted" style={{ maxWidth: 560, margin: "0 auto 26px" }}>
                Every report is a step toward a cleaner, safer Nepal. Join {totalReports.toLocaleString()}+ reports from
                citizens just like you.
              </p>
              <div className="flex center gap-2 wrap" style={{ justifyContent: "center" }}>
                <Link to="/report" className="btn btn-primary">
                  🛠️ Report Now
                </Link>
                <Link to="/community" className="btn btn-ghost">
                  👀 See Community Board
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
