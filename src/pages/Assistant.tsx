import { useApp } from "../lib/store";
import { ChatPanel } from "../components/AiChat";
import { Reveal } from "../components/ui";

export default function Assistant() {
  const { clearChat } = useApp();
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <h1>
              Sathi — <span className="grad-text">Nibourly AI</span> ✨
            </h1>
            <p>
              Your friendly AI companion for Nepal's society and daily life. Ask about civic problems, solutions, places,
              helplines — in English, Nepali or romanized Nepali.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 12 }}>
        <div className="container">
          <Reveal>
            <div className="chat-main">
              <div className="chat-head">
                <div className="chat-ava">🤖</div>
                <div style={{ flex: 1 }}>
                  <h4>Sathi — Nibourly AI</h4>
                  <p>● Powered by Gemini · knows all 77 districts</p>
                </div>
                <button className="icon-btn" onClick={clearChat} title="Clear conversation" aria-label="Clear">
                  🗑️
                </button>
              </div>
              <ChatPanel />
            </div>
          </Reveal>

          <div className="grid-3 mt-4">
            {[
              { i: "🏠", t: "Daily life", d: "Garbage, water, power cuts, roads, pollution, traffic." },
              { i: "🗺️", t: "Nepal knowledge", d: "Provinces, districts, capitals, famous places, culture." },
              { i: "🆘", t: "Help & helplines", d: "Emergency numbers and who to call for each problem." },
            ].map((x, i) => (
              <Reveal key={x.t} delay={`d${i + 1}`}>
                <div className="card center" style={{ padding: 24 }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{x.i}</div>
                  <h3 style={{ fontSize: 16 }}>{x.t}</h3>
                  <p className="muted small mt-1">{x.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
