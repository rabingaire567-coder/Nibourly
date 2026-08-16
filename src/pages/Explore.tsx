import { useMemo, useState } from "react";
import { provinces, districts, cities, districtsOfProvince } from "../data/nepal";
import { Reveal, Modal, SectionHead, Empty } from "../components/ui";
import type { District, Province, City } from "../types";

const PROV_COLORS = ["#e23744", "#f59e0b", "#38bdf8", "#34d399", "#a78bfa", "#fb7185", "#fbbf24"];

export default function Explore() {
  const [query, setQuery] = useState("");
  const [openProv, setOpenProv] = useState<number | null>(1);
  const [selected, setSelected] = useState<District | null>(null);
  const [citySel, setCitySel] = useState<City | null>(null);

  const q = query.trim().toLowerCase();

  const filteredDistricts = useMemo(
    () => (q ? districts.filter((d) => d.name.toLowerCase().includes(q) || d.nameNp.includes(q) || d.hq.toLowerCase().includes(q)) : []),
    [q]
  );
  const filteredCities = useMemo(
    () => (q ? cities.filter((c) => c.name.toLowerCase().includes(q) || c.nameNp.includes(q) || c.district.toLowerCase().includes(q)) : []),
    [q]
  );
  const filteredProvinces = useMemo(
    () => (q ? provinces.filter((p) => p.name.toLowerCase().includes(q) || p.nameNp.includes(q) || p.capital.toLowerCase().includes(q)) : []),
    [q]
  );

  const searching = q.length > 0;

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <h1>
              Explore <span className="grad-text">Nepal</span> 🇳🇵
            </h1>
            <p>
              7 provinces · 77 districts · hundreds of cities and villages. Every corner of Nepal, in tiny detail.
            </p>
          </Reveal>
          <Reveal delay="d1">
            <div className="search-box" style={{ maxWidth: 520, margin: "28px auto 0" }}>
              <span className="s-icon">🔍</span>
              <input
                className="input"
                placeholder="Search districts, cities, capitals… e.g. Mustang, Pokhara, Ilam"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          {searching ? (
            <>
              {filteredDistricts.length === 0 && filteredCities.length === 0 && filteredProvinces.length === 0 ? (
                <Empty icon="🔎" title="No matches found" sub={`No place matches "${query}". Try another search.`} />
              ) : (
                <>
                  {filteredProvinces.length > 0 && (
                    <div className="mb-3">
                      <h3 className="mb-2">Provinces</h3>
                      <div className="grid-3">
                        {filteredProvinces.map((p) => (
                          <ProvinceCard key={p.id} p={p} onOpen={() => setOpenProv(p.id)} />
                        ))}
                      </div>
                    </div>
                  )}
                  {filteredDistricts.length > 0 && (
                    <div className="mb-3">
                      <h3 className="mb-2">Districts ({filteredDistricts.length})</h3>
                      <div className="flex wrap gap-1">
                        {filteredDistricts.map((d) => (
                          <button key={d.name} className="dist-chip" onClick={() => setSelected(d)}>
                            {d.name} <span className="np">{d.nameNp}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {filteredCities.length > 0 && (
                    <div>
                      <h3 className="mb-2">Cities & Towns ({filteredCities.length})</h3>
                      <div className="grid-3">
                        {filteredCities.map((c) => (
                          <CityCard key={c.name} c={c} onOpen={() => setCitySel(c)} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <SectionHead
                eyebrow="Provinces of Nepal"
                title="Tap a province to see its districts"
                sub="After the 2015 constitution, Nepal was restructured into 7 provinces — each with its own capital and identity."
              />
              <div className="grid-2">
                {provinces.map((p, i) => (
                  <Reveal key={p.id} delay={`d${(i % 2) + 1}`}>
                    <div className="card">
                      <div className="prov-row" onClick={() => setOpenProv(openProv === p.id ? null : p.id)}>
                        <div className="p-num" style={{ background: PROV_COLORS[(p.id - 1) % PROV_COLORS.length] }}>
                          {p.id}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3>
                            {p.name} <span className="np faint" style={{ fontFamily: "Noto Sans Devanagari" }}>{p.nameNp}</span>
                          </h3>
                          <p>
                            Capital: {p.capital} · {p.districts} districts · {p.areaKm.toLocaleString()} km²
                          </p>
                        </div>
                        <span className="arrow">{openProv === p.id ? "▲" : "▼"}</span>
                      </div>
                      {openProv === p.id && (
                        <div style={{ padding: "6px 18px 20px", animation: "pop-in .3s ease" }}>
                          <p className="small muted mb-2">{p.tagline}</p>
                          <div className="flex wrap gap-1">
                            {districtsOfProvince(p.id).map((d) => (
                              <button key={d.name} className="dist-chip" onClick={() => setSelected(d)}>
                                {d.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="mt-4">
                <SectionHead
                  eyebrow="Cities & Towns"
                  title="Major cities of Nepal"
                  sub="From the capital valley to the far-west — the urban life of Nepal at a glance."
                />
                <div className="grid-3">
                  {cities.slice(0, 9).map((c, i) => (
                    <Reveal key={c.name} delay={`d${(i % 3) + 1}`}>
                      <CityCard c={c} onOpen={() => setCitySel(c)} />
                    </Reveal>
                  ))}
                </div>
                <div className="flex wrap gap-1 mt-3 center" style={{ justifyContent: "center" }}>
                  {cities.slice(9).map((c) => (
                    <button key={c.name} className="dist-chip" onClick={() => setCitySel(c)}>
                      {c.emoji} {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.name} (${selected.nameNp})` : ""}>
        {selected && <DistrictDetail d={selected} />}
      </Modal>
      <Modal open={!!citySel} onClose={() => setCitySel(null)} title={citySel ? `${citySel.emoji} ${citySel.name}` : ""}>
        {citySel && <CityDetail c={citySel} />}
      </Modal>
    </div>
  );
}

function ProvinceCard({ p, onOpen }: { p: Province; onOpen: () => void }) {
  return (
    <div className="card hoverable" style={{ padding: 20 }} onClick={onOpen}>
      <h3>{p.name}</h3>
      <p className="muted small">
        Capital: {p.capital} · {p.districts} districts
      </p>
      <p className="faint small mt-1">{p.tagline}</p>
    </div>
  );
}

function CityCard({ c, onOpen }: { c: City; onOpen: () => void }) {
  return (
    <div className="card hoverable" style={{ padding: 18 }} onClick={onOpen}>
      <div style={{ fontSize: 30, marginBottom: 8 }}>{c.emoji}</div>
      <h3 style={{ fontSize: 16 }}>
        {c.name} <span className="np faint small" style={{ fontFamily: "Noto Sans Devanagari" }}>{c.nameNp}</span>
      </h3>
      <p className="muted small" style={{ marginTop: 6 }}>
        {c.district}, {c.province}
      </p>
      <p className="faint small mt-1">{c.known}</p>
    </div>
  );
}

function DistrictDetail({ d }: { d: District }) {
  const p = provinces.find((x) => x.id === d.provinceId);
  return (
    <div>
      <div className="flex gap-1 wrap mb-2">
        <span className="badge badge-red">{p?.name}</span>
        <span className="badge badge-blue">HQ: {d.hq}</span>
        <span className="badge badge-gold">{d.areaKm.toLocaleString()} km²</span>
        <span className="badge badge-violet">Pop: {d.population}</span>
      </div>
      <p className="muted">{d.blurb}</p>
      <div className="mt-3">
        <h4 className="mb-2">Famous places</h4>
        <div className="flex wrap gap-1">
          {d.famous.map((f) => (
            <span key={f} className="pill">
              ⭐ {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CityDetail({ c }: { c: City }) {
  return (
    <div>
      <div className="flex gap-1 wrap mb-2">
        <span className="badge badge-blue">{c.province}</span>
        <span className="badge badge-gold">District: {c.district}</span>
      </div>
      <p className="muted">{c.known}</p>
      <p className="small faint mt-3">
        Devanagari: <b style={{ fontFamily: "Noto Sans Devanagari" }}>{c.nameNp}</b>
      </p>
    </div>
  );
}
