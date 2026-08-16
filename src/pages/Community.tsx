import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../lib/db";
import { issueCategories, categoryById, urgencyLevels } from "../data/issues";
import { provinces } from "../data/nepal";
import { Reveal, Empty, StatusPill, Toast } from "../components/ui";
import type { ReportedIssue } from "../types";

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function Community() {
  const [reports, setReports] = useState<ReportedIssue[]>(() => db.getReports());
  const [cat, setCat] = useState("all");
  const [prov, setProv] = useState("all");
  const [urgency, setUrgency] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<"new" | "top">("new");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");
  const [voted, setVoted] = useState<Record<string, "up" | "down">>({});

  const refresh = () => setReports(db.getReports());

  const filtered = useMemo(() => {
    let list = [...reports];
    if (cat !== "all") list = list.filter((r) => r.category === cat);
    if (prov !== "all") list = list.filter((r) => r.province === prov);
    if (urgency !== "all") list = list.filter((r) => r.urgency === urgency);
    if (status !== "all") list = list.filter((r) => r.status === status);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter((r) => (r.title + r.description + r.district + r.place).toLowerCase().includes(t));
    }
    list.sort((a, b) => (sort === "new" ? b.createdAt - a.createdAt : b.upvotes - b.downvotes - (a.upvotes - a.downvotes)));
    return list;
  }, [reports, cat, prov, urgency, status, sort, q]);

  const stats = useMemo(() => {
    const open = reports.filter((r) => r.status === "open").length;
    const ip = reports.filter((r) => r.status === "in-progress").length;
    const rs = reports.filter((r) => r.status === "resolved").length;
    return { open, ip, rs, total: reports.length };
  }, [reports]);

  const vote = (id: string, dir: "up" | "down") => {
    if (voted[id]) return;
    db.vote(id, dir);
    setVoted((v) => ({ ...v, [id]: dir }));
    refresh();
    setToast(dir === "up" ? "Thanks for supporting this issue! 👍" : "Noted. Thanks for the feedback.");
  };

  const changeStatus = (id: string, s: ReportedIssue["status"]) => {
    db.setStatus(id, s);
    refresh();
  };

  const del = (id: string) => {
    db.deleteReport(id);
    refresh();
    setToast("Report removed.");
  };

  const activeFilters = cat !== "all" || prov !== "all" || urgency !== "all" || status !== "all" || !!q.trim();

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <h1>
              Community <span className="grad-text">Board</span> 🗳️
            </h1>
            <p>
              Reports from neighbours across Nepal. Upvote issues that affect you — the louder the community, the faster
              the action.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <Reveal>
            <div className="stat-grid mb-3" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              {[
                { l: "Open issues", n: stats.open, c: "#ef4444" },
                { l: "In progress", n: stats.ip, c: "#fbbf24" },
                { l: "Resolved", n: stats.rs, c: "#34d399" },
                { l: "Total reports", n: stats.total, c: "#38bdf8" },
              ].map((s) => (
                <div key={s.l} className="card stat-tile">
                  <div className="big" style={{ color: s.c }}>
                    {s.n}
                  </div>
                  <div className="lbl">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay="d1">
            <div className="card-flat mb-3" style={{ padding: 16 }}>
              <div className="search-box mb-2">
                <span className="s-icon">🔍</span>
                <input className="input" placeholder="Search reports…" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="flex wrap gap-1">
                <select className="select" style={{ width: "auto", paddingRight: 30 }} value={cat} onChange={(e) => setCat(e.target.value)}>
                  <option value="all">All categories</option>
                  {issueCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
                <select className="select" style={{ width: "auto", paddingRight: 30 }} value={prov} onChange={(e) => setProv(e.target.value)}>
                  <option value="all">All provinces</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <select className="select" style={{ width: "auto", paddingRight: 30 }} value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                  <option value="all">Any urgency</option>
                  {urgencyLevels.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
                <select className="select" style={{ width: "auto", paddingRight: 30 }} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="all">Any status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select className="select" style={{ width: "auto", paddingRight: 30 }} value={sort} onChange={(e) => setSort(e.target.value as "new" | "top")}>
                  <option value="new">Newest first</option>
                  <option value="top">Top upvoted</option>
                </select>
                {activeFilters && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setCat("all");
                      setProv("all");
                      setUrgency("all");
                      setStatus("all");
                      setQ("");
                    }}
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {filtered.length === 0 ? (
            <Empty icon="📭" title="No reports match" sub="Try clearing the filters or be the first to report this issue." />
          ) : (
            <div className="grid-2">
              {filtered.map((r, i) => {
                const c = categoryById(r.category);
                const u = urgencyLevels.find((x) => x.id === r.urgency)!;
                return (
                  <Reveal key={r.id} delay={`d${(i % 2) + 1}`}>
                    <div className="card issue-card">
                      <div className="issue-head">
                        <div className="i-ico" style={{ background: `${c.color}20`, color: c.color }}>
                          {c.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3>{r.title}</h3>
                          <div className="issue-meta">
                            <span>📍 {r.district}, {r.province}</span>
                            <span>{r.place}</span>
                            <span>🕒 {timeAgo(r.createdAt)}</span>
                            <span>👤 {r.name}</span>
                          </div>
                        </div>
                      </div>
                      <p className="issue-desc">{r.description}</p>
                      <div className="flex gap-1 wrap mb-2">
                        <span className="badge" style={{ background: `${c.color}20`, color: c.color }}>
                          {c.icon} {c.label}
                        </span>
                        <span className="badge" style={{ background: `${u.color}18`, color: u.color }}>
                          {u.label} urgency
                        </span>
                      </div>
                      <div className="issue-foot">
                        <button className="vote-btn up" disabled={!!voted[r.id]} onClick={() => vote(r.id, "up")}>
                          👍 {r.upvotes}
                        </button>
                        <button className="vote-btn down" disabled={!!voted[r.id]} onClick={() => vote(r.id, "down")}>
                          👎 {r.downvotes}
                        </button>
                        <select className="select" style={{ width: "auto", padding: "7px 26px 7px 12px", fontSize: 12.5 }} value={r.status} onChange={(e) => changeStatus(r.id, e.target.value as ReportedIssue["status"])}>
                          <option value="open">Open</option>
                          <option value="in-progress">In progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <span className="status-badge">
                          <StatusPill status={r.status} />
                        </span>
                        <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => del(r.id)} aria-label="Delete" title="Remove">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}

          {reports.length === 0 && (
            <div className="center mt-3">
              <Link to="/report" className="btn btn-primary">
                🛠️ Report the first issue
              </Link>
            </div>
          )}
        </div>
      </section>
      <Toast message={toast} />
    </div>
  );
}
