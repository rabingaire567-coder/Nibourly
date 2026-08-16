import { useState } from "react";
import { emergencyContacts, cityServices } from "../data/contacts";
import { Reveal, SectionHead, Toast } from "../components/ui";

export default function Emergency() {
  const [toast, setToast] = useState("");

  const call = (num: string) => {
    window.location.href = `tel:${num.replace(/-/g, "")}`;
    setToast(`Calling ${num}…`);
  };

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <h1>
              Emergency <span className="grad-text">Numbers</span> 🆘
            </h1>
            <p>
              National helplines of Nepal — save this page and share it with family. Tap a card to call directly.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="emergency-grid">
            {emergencyContacts.map((c, i) => (
              <Reveal key={c.service} delay={`d${(i % 5) + 1}`}>
                <button className="card hoverable emergency-tile" onClick={() => call(c.number)}>
                  <span className="e-ico">{c.icon}</span>
                  <div className="e-num">{c.number}</div>
                  <div className="e-lbl">{c.service}</div>
                  <div className="faint small mt-1">{c.note}</div>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="mt-4">
            <SectionHead
              eyebrow="City services"
              title="Utility & special services"
              sub="Water, electricity, blood and more — the numbers that keep daily life running."
            />
            <div className="grid-3">
              {cityServices.map((c, i) => (
                <Reveal key={c.service} delay={`d${(i % 3) + 1}`}>
                  <div className="card hoverable" style={{ padding: 20 }} onClick={() => call(c.number)}>
                    <div className="flex between items-center">
                      <span style={{ fontSize: 26 }}>{c.icon}</span>
                      <span className="badge badge-red" style={{ fontSize: 15 }}>
                        {c.number}
                      </span>
                    </div>
                    <h3 className="mt-2" style={{ fontSize: 15.5 }}>
                      {c.service}
                    </h3>
                    <p className="faint small">{c.place}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <div
              className="card mt-4"
              style={{ padding: 26, background: "linear-gradient(120deg, rgba(239,68,68,.14), rgba(251,191,36,.1))" }}
            >
              <h3 style={{ marginBottom: 8 }}>⚠️ Safety note</h3>
              <p className="muted small">
                Emergency numbers should be verified with your local authorities before use. In any emergency, stay calm,
                share your exact location (tole, ward, landmark), and follow the operator's instructions. Numbers are also
                available on the Nepal Police and National Emergency Operation Centre websites.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <Toast message={toast} />
    </div>
  );
}
