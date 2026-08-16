import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, SectionHead } from "../components/ui";

const FAQS = [
  {
    q: "What is Nibourly?",
    a: "Nibourly is an AI-powered community platform for Nepal. It helps citizens report civic problems (garbage, water, potholes, power cuts, etc.), explore all 77 districts, learn practical solutions for society and daily life, and get instant help from the Sathi AI assistant.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All reports, saved solutions and chat history are stored locally in your browser using localStorage. Nothing is uploaded to a server — your reports exist only on your device.",
  },
  {
    q: "How does the AI work?",
    a: "Sathi is powered by Google Gemini. If the API is unavailable or a key isn't set, Sathi automatically falls back to Nibourly's built-in knowledge base so you always get an answer.",
  },
  {
    q: "Do I need an API key?",
    a: "No — a default key is bundled for the hackathon. If you want to use your own, go to Settings → AI connection and paste a free key from aistudio.google.com/apikey.",
  },
  {
    q: "How can I help my community?",
    a: "Report issues, upvote problems affecting your neighbourhood, follow the solutions library, organise cleanliness drives, and share the platform with neighbours. Community action multiplies impact.",
  },
  {
    q: "Is this a government platform?",
    a: "No. Nibourly is a citizen initiative built for a hackathon. It helps organise community voice, but official issues should also be filed with your ward office or municipality.",
  },
];

export default function Help() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <h1>
              About &amp; <span className="grad-text">Help</span> ℹ️
            </h1>
            <p>Everything you need to know about Nibourly — how it works, what it's for, and how to use it best.</p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 16 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <Reveal>
            <div className="card" style={{ padding: 26 }}>
              <h2 style={{ fontSize: 24, marginBottom: 10 }}>Why <span className="grad-text">Nibourly</span>?</h2>
              <p className="muted" style={{ marginBottom: 14 }}>
                Nepal is beautiful, but daily life brings real challenges — garbage piling up in the valley, water
                shortages in every dry season, potholes every monsoon, power cuts, air pollution, and a growing gap
                between people and the offices meant to serve them.
              </p>
              <p className="muted" style={{ marginBottom: 14 }}>
                <b>Nibourly</b> (from <i>neighbour</i>) turns individual complaints into <b>community action</b>. When a
                report is upvoted by the people who live there, it becomes impossible to ignore. And when you don't know
                what to do, <b>Sathi</b> — our AI — gives practical, Nepal-specific solutions instantly.
              </p>
              <p className="muted">
                We cover all <b>7 provinces</b> and <b>77 districts</b> — from Taplejung to Darchula — so that a problem
                in a remote village matters as much as one in Kathmandu.
              </p>
            </div>
          </Reveal>

          <div className="mt-4">
            <SectionHead
              eyebrow="Using Nibourly"
              title="How to get the most out of it"
              sub="Four quick steps from problem to progress."
            />
            <Reveal>
              <div className="card" style={{ padding: 24 }}>
                <div className="steps" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="step" style={{ padding: "14px 0 14px 20px" }}>
                    <span className="s-no">1</span>
                    <h3>Report a problem</h3>
                    <p className="muted small">Go to <Link to="/report" style={{ color: "var(--primary-2)" }}>Report</Link>, choose the category and exact location.</p>
                  </div>
                  <div className="step" style={{ padding: "14px 0 14px 20px" }}>
                    <span className="s-no">2</span>
                    <h3>Get community support</h3>
                    <p className="muted small">Share the report; neighbours <b>upvote</b> it on the Community Board.</p>
                  </div>
                  <div className="step" style={{ padding: "14px 0 14px 20px" }}>
                    <span className="s-no">3</span>
                    <h3>Learn &amp; act</h3>
                    <p className="muted small">Read the <Link to="/solutions" style={{ color: "var(--primary-2)" }}>Solutions Library</Link> or ask <Link to="/assistant" style={{ color: "var(--primary-2)" }}>AI Sathi</Link> for a tailored plan.</p>
                  </div>
                  <div className="step" style={{ padding: "14px 0 14px 20px" }}>
                    <span className="s-no">4</span>
                    <h3>Mark it resolved</h3>
                    <p className="muted small">When the issue is fixed, change its status to <b>Resolved</b> to inspire others.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-4">
            <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={`d${(i % 3) + 1}`}>
                <div className="card mb-2" style={{ overflow: "hidden" }}>
                  <button
                    className="flex between items-center"
                    style={{ width: "100%", padding: "18px 20px", textAlign: "left" }}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <span style={{ fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 15.5 }}>{f.q}</span>
                    <span style={{ color: "var(--text-faint)", fontSize: 18 }}>{open === i ? "−" : "+"}</span>
                  </button>
                  {open === i && (
                    <div style={{ padding: "0 20px 18px", animation: "pop-in .3s ease" }}>
                      <p className="muted small">{f.a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="center mt-4">
            <Link to="/report" className="btn btn-primary">
              🛠️ Start helping your community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
