import { useState } from "react";
import { useApp } from "../lib/store";
import { db, seedDemoReports } from "../lib/db";
import { getApiKey, testKey } from "../lib/ai";
import { Reveal, Toast } from "../components/ui";

export default function Settings() {
  const { user, setUser, theme, toggleTheme, clearChat } = useApp();
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [key, setKey] = useState(getApiKey());
  const [testing, setTesting] = useState(false);
  const [keyMsg, setKeyMsg] = useState("");
  const [toast, setToast] = useState("");

  const saveProfile = () => {
    setUser({ name, location, role: user.role });
    setToast("Profile saved ✅");
  };

  const saveKey = async () => {
    setTesting(true);
    setKeyMsg("");
    const res = await testKey(key);
    if (res.ok) {
      db.setApiKey(key);
      setToast("API key saved & connected ✅");
    } else {
      setToast("Could not connect with this key ❌");
    }
    setKeyMsg(res.message);
    setTesting(false);
  };

  const clearKey = () => {
    db.setApiKey("");
    setKey("");
    setKeyMsg("");
    setToast("Custom API key removed — using default.");
  };

  const wipe = () => {
    if (!window.confirm("This will erase all reports, saved chats and settings on this device. Continue?")) return;
    db.clearAll();
    clearChat();
    setToast("All local data cleared 🧹");
    window.location.hash = "#/";
    window.location.reload();
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <h1>
              Settings <span className="grad-text">⚙️</span>
            </h1>
            <p>Profile, AI connection, theme and your data — all stored privately on this device.</p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          {/* Profile */}
          <Reveal>
            <div className="form-card mb-3">
              <h3 className="mb-2">👤 Your profile</h3>
              <p className="muted small mb-3">Used to personalise reporting — never shared.</p>
              <div className="grid-2">
                <div className="field">
                  <label>Name</label>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sita Sharma" />
                </div>
                <div className="field">
                  <label>Location</label>
                  <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Chabhail, Kathmandu" />
                </div>
              </div>
              <button className="btn btn-primary" onClick={saveProfile}>
                Save profile
              </button>
            </div>
          </Reveal>

          {/* AI key */}
          <Reveal delay="d1">
            <div className="form-card mb-3">
              <div className="flex between items-center wrap gap-2 mb-2">
                <h3>🤖 Gemini AI connection</h3>
                <span className="badge badge-green">● {getApiKey() ? "Key configured" : "Using default key"}</span>
              </div>
              <p className="muted small mb-3">
                Nibourly uses Google Gemini to power <b>Sathi</b>. Get a free API key at{" "}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: "var(--primary-2)" }}>
                  aistudio.google.com/apikey
                </a>
              </p>
              <div className="field">
                <label>Gemini API key</label>
                <input
                  className="input"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Paste your AIza… or AQ… key"
                  type="password"
                />
              </div>
              {keyMsg && <p className="small mt-1" style={{ color: keyMsg.startsWith("Invalid") || keyMsg.startsWith("Could") ? "var(--danger)" : "var(--green)" }}>{keyMsg}</p>}
              <div className="flex gap-2 wrap">
                <button className="btn btn-primary" onClick={saveKey} disabled={testing || key.length < 10}>
                  {testing ? <span className="loader" /> : "🔌 Test & save key"}
                </button>
                <button className="btn btn-ghost" onClick={clearKey}>
                  Reset to default
                </button>
              </div>
            </div>
          </Reveal>

          {/* Appearance */}
          <Reveal delay="d2">
            <div className="form-card mb-3">
              <h3 className="mb-2">🎨 Appearance</h3>
              <p className="muted small mb-3">Switch between dark and light mode.</p>
              <div className="flex gap-2 wrap">
                <button className={`btn ${theme === "dark" ? "btn-primary" : "btn-ghost"}`} onClick={() => theme !== "dark" && toggleTheme()}>
                  🌙 Dark
                </button>
                <button className={`btn ${theme === "light" ? "btn-primary" : "btn-ghost"}`} onClick={() => theme !== "light" && toggleTheme()}>
                  ☀️ Light
                </button>
              </div>
            </div>
          </Reveal>

          {/* Data */}
          <Reveal delay="d3">
            <div className="form-card">
              <h3 className="mb-2">🗄️ Your data</h3>
              <p className="muted small mb-3">
                Nibourly stores reports, saved solutions and chat history locally in your browser (localStorage). Nothing
                leaves your device.
              </p>
              <button className="btn btn-ghost mb-2" onClick={() => { seedDemoReports(); setToast("Demo reports restored 📊"); }}>
                Restore demo reports
              </button>
              <div>
                <button className="btn" style={{ background: "rgba(239,68,68,.14)", color: "var(--danger)", borderColor: "rgba(239,68,68,.4)" }} onClick={wipe}>
                  🗑️ Erase all local data
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <Toast message={toast} />
    </div>
  );
}
