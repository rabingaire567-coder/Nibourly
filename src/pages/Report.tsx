import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { issueCategories, urgencyLevels, categoryById } from "../data/issues";
import { provinces, districtsOfProvince, districtByName } from "../data/nepal";
import { db } from "../lib/db";
import { useApp } from "../lib/store";
import { Reveal, Toast } from "../components/ui";
import type { ReportedIssue } from "../types";

export default function Report() {
  const [params] = useSearchParams();
  const { user } = useApp();
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState<string>(params.get("cat") || "");
  const [provinceId, setProvinceId] = useState<number>(0);
  const [district, setDistrict] = useState("");
  const [place, setPlace] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [urgency, setUrgency] = useState<ReportedIssue["urgency"]>("medium");
  const [name, setName] = useState(user.name || "");
  const [contact, setContact] = useState("");
  const [toast, setToast] = useState("");
  const [done, setDone] = useState<ReportedIssue | null>(null);

  const districts = useMemo(() => (provinceId ? districtsOfProvince(provinceId) : []), [provinceId]);
  const selCat = cat ? categoryById(cat) : null;

  const canNext1 = !!cat;
  const canNext2 = provinceId > 0 && !!district && place.trim().length > 1;
  const canNext3 = title.trim().length >= 8 && desc.trim().length >= 20;

  const submit = () => {
    if (!canNext3) return;
    const report = db.addReport({
      category: cat,
      title: title.trim(),
      description: desc.trim(),
      province: provinces.find((p) => p.id === provinceId)?.name ?? "",
      district,
      place: place.trim(),
      urgency,
      name: name.trim() || "Anonymous",
      contact: contact.trim(),
    });
    setDone(report);
    setToast("Issue reported successfully! 🎉");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: 560 }}>
          <Reveal>
            <div className="card center" style={{ padding: "44px 28px" }}>
              <div style={{ fontSize: 54, marginBottom: 12 }}>🎉</div>
              <h2 className="mb-1">Issue reported, {done.name}!</h2>
              <p className="muted">
                Your report is now live on the <b>Community Board</b>. Neighbours can upvote it to speed up action.
              </p>
              <div className="card-flat mt-3" style={{ padding: 18, textAlign: "left" }}>
                <div className="flex between items-center gap-2 wrap">
                  <span className="badge" style={{ background: `${selCat?.color}22`, color: selCat?.color }}>
                    {selCat?.icon} {selCat?.label}
                  </span>
                  <span className="badge badge-red">● Open</span>
                </div>
                <h3 className="mt-2" style={{ fontSize: 17 }}>
                  {done.title}
                </h3>
                <p className="muted small mt-1">
                  📍 {done.district}, {done.province} · {done.place}
                </p>
              </div>
              <div className="flex gap-2 wrap mt-4" style={{ justifyContent: "center" }}>
                <Link to="/community" className="btn btn-primary">
                  View Community Board
                </Link>
                <Link to="/report" className="btn btn-ghost">
                  Report Another
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
        <Toast message={toast} />
      </div>
    );
  }

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <h1>
              Report an <span className="grad-text">Issue</span> 🛠️
            </h1>
            <p>
              Describe a problem in your neighbourhood — it takes under a minute and your community + ward can act on it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="flex gap-2 mb-3 center wrap" style={{ justifyContent: "center" }}>
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                className={`chip ${step === s ? "active" : ""}`}
                onClick={() => setStep(s)}
                disabled={s > step && !(s === 2 ? canNext1 : canNext1 && canNext2)}
              >
                {s} · {s === 1 ? "Category" : s === 2 ? "Location" : "Details"}
              </button>
            ))}
          </div>

          <Reveal key={step}>
            {step === 1 && (
              <div className="form-card">
                <h3 className="mb-2">What kind of problem is it?</h3>
                <p className="muted small mb-3">Choose the closest category — you can describe details later.</p>
                <div className="cat-grid">
                  {issueCategories.map((c) => (
                    <button
                      key={c.id}
                      className={`card cat-card ${cat === c.id ? "selected" : ""}`}
                      style={{ borderTop: `3px solid ${c.color}`, ...(cat === c.id ? { borderColor: c.color, background: `${c.color}14` } : {}) }}
                      onClick={() => setCat(c.id)}
                    >
                      <span className="ico">{c.icon}</span>
                      <h3>{c.label}</h3>
                      <p>{c.labelNp}</p>
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary mt-3" disabled={!canNext1} onClick={() => setStep(2)}>
                  Next: Location →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-card">
                <h3 className="mb-2">Where is it happening?</h3>
                <p className="muted small mb-3">Pick your province, then the district, then the exact place.</p>
                <div className="field">
                  <label>Province</label>
                  <select className="select" value={provinceId} onChange={(e) => { setProvinceId(Number(e.target.value)); setDistrict(""); }}>
                    <option value={0}>Select your province…</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id}. {p.name} — {p.capital}
                      </option>
                    ))}
                  </select>
                </div>
                {provinceId > 0 && (
                  <div className="field">
                    <label>District ({districts.length})</label>
                    <select className="select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                      <option value="">Select your district…</option>
                      {districts.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name} ({d.nameNp}) — {d.hq}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {district && (
                  <div className="field">
                    <label>Place / Tole / Ward</label>
                    <input
                      className="input"
                      placeholder="e.g. Chabhail tole, ward 10, or main bazaar"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                    />
                    <p className="faint small mt-1">💡 {districtByName(district)?.blurb}</p>
                  </div>
                )}
                <div className="flex gap-2 wrap">
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" disabled={!canNext2} onClick={() => setStep(3)}>
                    Next: Details →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-card">
                <h3 className="mb-2">Tell us the details</h3>
                <p className="muted small mb-3">The more specific you are, the faster the community can act.</p>
                <div className="field">
                  <label>Short title</label>
                  <input className="input" placeholder="e.g. Large pothole near the school gate" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={90} />
                </div>
                <div className="field">
                  <label>Describe the problem</label>
                  <textarea className="textarea" placeholder="What is happening? How long? Who is affected? Any safety risk?" value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div className="field">
                  <label>Urgency</label>
                  <div className="flex gap-2 wrap">
                    {urgencyLevels.map((u) => (
                      <button
                        key={u.id}
                        className={`chip ${urgency === u.id ? "active" : ""}`}
                        style={urgency === u.id ? { borderColor: u.color, background: `${u.color}18`, color: u.color } : {}}
                        onClick={() => setUrgency(u.id)}
                      >
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: u.color, display: "inline-block" }} />
                        {u.label} — {u.hint}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label>Your name (optional)</label>
                    <input className="input" placeholder="Anonymous" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Contact (optional)</label>
                    <input className="input" placeholder="98XXXXXXXX" value={contact} onChange={(e) => setContact(e.target.value)} />
                  </div>
                </div>
                <p className="faint small mb-2">
                  🔒 Your contact is stored only on this device and is never shown publicly.
                </p>
                <div className="flex gap-2 wrap">
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" disabled={!canNext3} onClick={submit}>
                    📤 Submit Report
                  </button>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
