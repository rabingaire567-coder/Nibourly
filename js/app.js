'use strict';
/* ============================================================
   Nibourly — Application core: router, pages, widgets, AI chat.
   ============================================================ */

(function () {
  const D = NBData;
  const route = { page: 'home', params: {} };

  /* ================= ROUTER ================= */
  function parseHash() {
    const raw = (location.hash || '#/').replace(/^#\/?/, '');
    const parts = raw.split('/');
    route.page = (parts[0] || 'home').toLowerCase() || 'home';
    route.params = { id: parts[1] || '' };
    if (!['home', 'community', 'report', 'events', 'services', 'solutions', 'places', 'emergency', 'settings'].includes(route.page)) route.page = 'home';
  }

  const PAGES = {
    home: renderHome,
    community: renderCommunity,
    report: renderReport,
    events: renderEvents,
    services: renderServices,
    solutions: renderSolutions,
    places: renderPlaces,
    emergency: renderEmergency,
    settings: renderSettings
  };

  function render() {
    parseHash();
    const fn = PAGES[route.page] || renderHome;
    UI.setPage(fn());
    window.scrollTo({ top: 0, behavior: 'instant' });
    renderNav();
    userBoxRender();
    postRender();
  }

  function renderNav() {
    document.querySelectorAll('[data-route]').forEach(a => {
      const href = a.getAttribute('href') || '';
      a.classList.toggle('active', href === '#/' + route.page || (route.page === 'home' && href === '#/'));
    });
  }

  /* ================= NAVBAR / THEME / DRAWER ================= */
  function userBoxRender() {
    const box = document.getElementById('userBox');
    const u = NB.currentUser();
    if (u) {
      box.innerHTML = '<button class="user-chip" data-action="profile" title="' + UI.esc(u.name) + '">' + UI.avatar(u.name, 34) + '<span>' + UI.esc(u.name.split(' ')[0]) + '</span></button>';
    } else {
      box.innerHTML = '<button class="btn btn-primary btn-sm" data-action="login">Login</button>';
    }
  }

  function applyTheme() {
    const cfg = NB.getConfig();
    document.documentElement.setAttribute('data-theme', cfg.theme || 'dark');
    const moon = document.querySelector('.ico-moon');
    const sun = document.querySelector('.ico-sun');
    if (moon && sun) {
      moon.style.display = (cfg.theme === 'dark') ? 'block' : 'none';
      sun.style.display = (cfg.theme === 'dark') ? 'none' : 'block';
    }
  }

  function initChrome() {
    document.getElementById('year').textContent = new Date().getFullYear();

    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('click', () => {
      const cfg = NB.getConfig();
      const next = cfg.theme === 'dark' ? 'light' : 'dark';
      NB.setConfig({ theme: next });
      applyTheme();
      UI.toast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
    });

    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('drawer').classList.toggle('open');
    });
    document.getElementById('drawer').addEventListener('click', () => {
      document.getElementById('drawer').classList.remove('open');
    });

    window.addEventListener('hashchange', render);
    UI.bindModals();

    // nav blur on scroll
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ================= PARTICLES ================= */
  function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let W, H, dots = [];
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    function spawn() {
      const n = Math.max(24, Math.min(70, Math.floor(W / 22)));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        a: Math.random() * 0.35 + 0.1
      }));
    }
    resize(); spawn();
    window.addEventListener('resize', () => { resize(); spawn(); });
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + d.a + ')';
        ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ================= TICKER ================= */
  function tickerHTML() {
    const items = D.ticker.map(t => '<span>' + UI.esc(t) + '</span>').join('');
    return '<div class="ticker"><div class="ticker-track">' + items + items + '</div></div>';
  }

  /* ================= HOME ================= */
  function renderHome() {
    const u = NB.currentUser();
    const st = NB.stats();
    const nowFest = D.festivals[Math.floor((Date.now() / 1000 / 86400) % D.festivals.length)];
    const cfg = NB.getConfig();
    const myDistrict = cfg.district || 'Kathmandu';
    const group = D.loadGroups[myDistrict] || 'A';
    const clock = '<span id="npClock">--:--:--</span>';

    const recent = NB.listPosts().slice(0, 3);
    const recentHTML = recent.map(postCard).join('') || '<p class="empty">No posts yet — be the first!</p>';
    const solPreview = D.solutions.slice(0, 3).map(s => `
      <div class="card reveal sol-mini" data-action="goto" data-href="#/solutions">
        <div class="sol-icon">${s.icon}</div>
        <h4>${UI.esc(s.title)}</h4>
        <p>${UI.esc(s.problem.slice(0, 90))}…</p>
        <span class="link">See solutions →</span>
      </div>`).join('');

    return `
    <section class="hero">
      <div class="hero-shape h1"></div><div class="hero-shape h2"></div><div class="hero-shape h3"></div>
      <div class="hero-inner">
        <span class="hero-badge reveal">🇳🇵 Nepal's AI-Powered Community Platform</span>
        <h1 class="reveal">छिमेकी भावना,<br><span class="grad-text">आधुनिक समाधान</span></h1>
        <p class="hero-sub reveal">Society &amp; Daily Life — report issues, help neighbours, join festivals, and explore all <b>77 districts</b> of Nepal. One app for every tole.</p>
        <div class="hero-actions reveal">
          <button class="btn btn-primary btn-lg" data-action="open-report">🚧 Report an Issue</button>
          <button class="btn btn-ghost btn-lg" data-action="chat-open">✨ Ask Mitra AI</button>
        </div>
        <div class="hero-quick reveal">
          <button class="chip" data-action="goto" data-href="#/community">🤝 Help Board</button>
          <button class="chip" data-action="goto" data-href="#/events">🎉 Festivals</button>
          <button class="chip" data-action="goto" data-href="#/services">🔧 Services</button>
          <button class="chip" data-action="goto" data-href="#/emergency">🚨 Emergency</button>
        </div>
      </div>
      <div class="hero-side reveal">
        <div class="float-card fc-1">
          <span class="fc-emoji">🗑️</span>
          <div><b>Pothole fixed!</b><small>Ratna Park • 2d ago</small></div>
        </div>
        <div class="float-card fc-2">
          <span class="fc-emoji">🩸</span>
          <div><b>Blood donated</b><small>Bir Hospital • 5h ago</small></div>
        </div>
        <div class="float-card fc-3">
          <span class="fc-emoji">🎎</span>
          <div><b>Dashain Tika</b><small>18 Oct 2082 BS</small></div>
        </div>
      </div>
    </section>

    ${tickerHTML()}

    <section class="stats-band reveal">
      <div class="stat"><b data-count="${D.districts.length}">0</b><span>Districts</span></div>
      <div class="stat"><b data-count="7">0</b><span>Provinces</span></div>
      <div class="stat"><b data-count="123">0</b><span>Languages</span></div>
      <div class="stat"><b data-count="${st.users}">0</b><span>Community Members</span></div>
      <div class="stat"><b data-count="${st.reports}">0</b><span>Issues Reported</span></div>
      <div class="stat"><b data-count="${st.resolved}">0</b><span>Resolved</span></div>
    </section>

    <section class="section">
      <div class="section-head reveal">
        <h2>Quick Actions</h2>
        <p>What would you like to do today?</p>
      </div>
      <div class="grid grid-4 reveal">
        <div class="card action-card" data-action="open-report"><span class="ac-emoji">🚧</span><h4>Report Issue</h4><p>Potholes, waste, water, lights</p></div>
        <div class="card action-card" data-action="open-post"><span class="ac-emoji">🤝</span><h4>Help Neighbours</h4><p>Ask or offer help</p></div>
        <div class="card action-card" data-action="goto" data-href="#/services"><span class="ac-emoji">🔧</span><h4>Find Services</h4><p>Plumbers, tuition, kirana</p></div>
        <div class="card action-card" data-action="goto" data-href="#/emergency"><span class="ac-emoji">🚨</span><h4>Emergency</h4><p>Police, fire, ambulance</p></div>
        <div class="card action-card" data-action="goto" data-href="#/events"><span class="ac-emoji">🎉</span><h4>Events &amp; Festivals</h4><p>Dashain, Tihar, Chhath</p></div>
        <div class="card action-card" data-action="goto" data-href="#/places"><span class="ac-emoji">🗺️</span><h4>Nepal Guide</h4><p>77 districts, places, food</p></div>
        <div class="card action-card" data-action="goto" data-href="#/solutions"><span class="ac-emoji">💡</span><h4>Problem Solutions</h4><p>Daily-life how-tos</p></div>
        <div class="card action-card" data-action="chat-open"><span class="ac-emoji">✨</span><h4>Ask Mitra AI</h4><p>Any Nepal question</p></div>
      </div>
    </section>

    <section class="section alt">
      <div class="section-head reveal">
        <h2>Today in Nepal <span class="live">● LIVE</span></h2>
        <p>Stay in sync with your community</p>
      </div>
      <div class="grid grid-3">
        <div class="card today-card reveal">
          <h4>🕰️ Nepal Time (UTC+5:45)</h4>
          <div class="big-clock">${clock}</div>
          <small>Kathmandu local time</small>
        </div>
        <div class="card today-card reveal">
          <h4>⚡ Load-Shedding</h4>
          <p class="big-group">Group <b>${UI.esc(group)}</b></p>
          <p>Your area: <b>${UI.esc(myDistrict)}</b> — check NEA app for exact hours. Report faults at <b>1650012</b>.</p>
        </div>
        <div class="card today-card reveal">
          <h4>🎎 ${UI.esc(nowFest.name)} ${UI.esc(nowFest.np)}</h4>
          <p>${UI.esc(nowFest.desc)}</p>
          <small>${UI.esc(nowFest.date)} • ${UI.esc(nowFest.region)}</small>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head reveal">
        <h2>Problems → Solutions</h2>
        <p>Researched fixes for Nepal's daily-life challenges</p>
      </div>
      <div class="grid grid-3">${solPreview}</div>
      <div class="center reveal"><button class="btn btn-outline" data-action="goto" data-href="#/solutions">View all 14 solutions →</button></div>
    </section>

    <section class="section alt">
      <div class="section-head reveal">
        <h2>🤝 Community Highlights</h2>
        <p>What your neighbours are doing</p>
      </div>
      <div class="grid grid-3">${recentHTML}</div>
      <div class="center reveal"><button class="btn btn-outline" data-action="goto" data-href="#/community">Open Help Board →</button></div>
    </section>

    <section class="section">
      <div class="ai-promo reveal">
        <div>
          <h2>✨ Meet Mitra — your AI neighbour</h2>
          <p>Ask about festivals, load-shedding, emergency numbers, districts, or how to compost. Works with a free Gemini API key — or instantly from built-in Nepal knowledge.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" data-action="chat-open">💬 Chat with Mitra</button>
            <button class="btn btn-ghost" data-action="goto" data-href="#/settings">Get API Key →</button>
          </div>
        </div>
        <div class="ai-promo-art">✨🤖✨</div>
      </div>
    </section>

    <section class="section alt">
      <div class="section-head reveal"><h2>❤️ From the Community</h2></div>
      <div class="grid grid-3">
        ${D.testimonials.map(t => `
        <div class="card quote reveal">
          <p>"${UI.esc(t.text)}"</p>
          <div class="quote-foot">${UI.avatar(t.name, 36)}<span><b>${UI.esc(t.name)}</b><small>${UI.esc(t.place)}</small></span></div>
        </div>`).join('')}
      </div>
    </section>`;
  }

  /* ================= COMMUNITY ================= */
  function postCard(p) {
    return `
    <div class="card post-card reveal">
      <div class="post-head">
        ${UI.avatar(p.user, 40)}
        <div class="post-who">
          <b>${UI.esc(p.user)}</b>
          <small>${UI.esc(p.district)}${p.place ? ' • ' + UI.esc(p.place) : ''} • ${UI.timeAgo(p.created)}</small>
        </div>
        <span class="badge ${p.type === 'offer' ? 'badge-ok' : 'badge-warn'}">${p.type === 'offer' ? '🤝 Offering' : '🙏 Requesting'}</span>
      </div>
      <div class="post-body">
        <span class="chip chip-sm">${UI.icon(p.cat)} ${UI.esc(p.cat)}</span>
        <h4>${UI.esc(p.title)}</h4>
        <p>${UI.esc(p.desc)}</p>
      </div>
      <div class="post-foot">
        <button class="btn-chip" data-action="vote-post" data-id="${p.id}">👍 ${p.votes || 0}</button>
        <button class="btn-chip" data-action="post-help">💬 ${p.comments || 0} replies</button>
        ${p.status === 'open' && (p.user === (NB.currentUser() || {}).name) ? `<button class="btn-chip" data-action="close-post" data-id="${p.id}">✓ Mark done</button>` : ''}
      </div>
    </div>`;
  }

  function renderCommunity() {
    const cats = ['All'].concat(D.helpCats);
    return `
    <section class="page-head reveal">
      <h1>🤝 Community Help Board</h1>
      <p>Ask for a hand or lend one — this is the छिमेकी (neighbour) spirit. From groceries to blood to ride shares.</p>
      <div class="page-actions">
        <button class="btn btn-primary" data-action="open-post">＋ New Post</button>
      </div>
    </section>
    <section class="section pt0">
      <div class="filter-bar reveal">
        <div class="chips" id="postFilters">
          ${cats.map((c, i) => `<button class="chip ${i === 0 ? 'on' : ''}" data-filter-cat="${UI.esc(c)}">${i === 0 ? 'All' : UI.esc(c)}</button>`).join('')}
        </div>
        <div class="search-wrap">
          <input type="search" id="postSearch" placeholder="Search posts..." class="input">
        </div>
      </div>
      <div class="grid grid-3" id="postList">
        ${NB.listPosts().map(postCard).join('') || '<p class="empty">No posts yet. Be the first to help!</p>'}
      </div>
    </section>`;
  }

  function filterPosts() {
    const box = document.getElementById('postList');
    if (!box) return;
    const cat = document.querySelector('#postFilters .chip.on');
    const catVal = cat ? cat.getAttribute('data-filter-cat') : 'All';
    const q = (document.getElementById('postSearch').value || '').toLowerCase();
    const list = NB.listPosts().filter(p => {
      const okCat = catVal === 'All' || p.cat === catVal;
      const okQ = !q || (p.title + ' ' + p.desc + ' ' + p.district + ' ' + p.place + ' ' + p.user).toLowerCase().indexOf(q) !== -1;
      return okCat && okQ;
    });
    box.innerHTML = list.map(postCard).join('') || '<p class="empty">No matching posts.</p>';
    UI.observeReveals(box);
  }

  /* ================= REPORT ================= */
  function reportCard(r) {
    return `
    <div class="card report-card reveal">
      <div class="post-head">
        <span class="rep-emoji">${UI.icon(r.cat)}</span>
        <div class="post-who">
          <b>${UI.esc(r.title)}</b>
          <small>${UI.esc(r.district)}${r.place ? ' • ' + UI.esc(r.place) : ''} • ${UI.timeAgo(r.created)}</small>
        </div>
        ${UI.statusBadge(r.status)}
      </div>
      <p class="rep-desc">${UI.esc(r.desc)}</p>
      <div class="post-foot">
        ${UI.urgencyBadge(r.urgency)}
        <span class="grow"></span>
        <button class="btn-chip" data-action="vote-report" data-id="${r.id}">👍 ${r.votes || 0}</button>
        <button class="btn-chip" data-action="report-help" data-rid="${r.id}">💬 Discuss</button>
      </div>
    </div>`;
  }

  function renderReport() {
    const reports = NB.listReports();
    const stats = {};
    reports.forEach(r => { stats[r.cat] = (stats[r.cat] || 0) + 1; });
    const maxCat = Math.max(1, ...Object.values(stats));
    const catBars = Object.keys(stats).sort((a, b) => stats[b] - stats[a]).slice(0, 6).map(c => `
      <div class="bar-row">
        <span>${UI.icon(c)} ${UI.esc(c)}</span>
        <div class="bar"><i style="width:${Math.round(stats[c] / maxCat * 100)}%"></i></div>
        <b>${stats[c]}</b>
      </div>`).join('') || '<p class="empty">No reports yet.</p>';

    return `
    <section class="page-head reveal">
      <h1>🚧 Report a Local Issue</h1>
      <p>Fix roads, waste, water, lights &amp; safety problems in your tole. Reports with photos and ward names get fixed faster.</p>
      <div class="page-actions">
        <button class="btn btn-primary" data-action="open-report">＋ New Report</button>
      </div>
    </section>
    <section class="section pt0">
      <div class="grid grid-3">
        <div class="card report-stats reveal">
          <h4>📊 Issues by Category</h4>
          ${catBars}
        </div>
        <div class="report-list">
          <div class="filter-bar reveal" style="margin-bottom:18px">
            <div class="chips" id="reportFilters">
              <button class="chip on" data-filter-status="all">All</button>
              <button class="chip" data-filter-status="new">New</button>
              <button class="chip" data-filter-status="in-progress">In Progress</button>
              <button class="chip" data-filter-status="resolved">Resolved</button>
            </div>
          </div>
          <div id="reportList">
            ${reports.map(reportCard).join('') || '<p class="empty">No reports yet.</p>'}
          </div>
        </div>
      </div>
    </section>`;
  }

  function filterReports() {
    const box = document.getElementById('reportList');
    if (!box) return;
    const sel = document.querySelector('#reportFilters .chip.on');
    const val = sel ? sel.getAttribute('data-filter-status') : 'all';
    const list = NB.listReports().filter(r => val === 'all' || r.status === val);
    box.innerHTML = list.map(reportCard).join('') || '<p class="empty">No reports here.</p>';
    UI.observeReveals(box);
  }

  /* ================= EVENTS ================= */
  function eventCard(e) {
    return `
    <div class="card event-card reveal">
      <div class="event-date">
        <b>${(e.date || '--').split('-')[2] || '--'}</b>
        <span>${UI.esc(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt((e.date || '').split('-')[1], 10) - 1] || '')}</span>
      </div>
      <div class="event-body">
        <span class="chip chip-sm">${UI.esc(e.type)}</span>
        <h4>${UI.esc(e.title)}</h4>
        <p>${UI.esc(e.desc)}</p>
        <div class="event-meta">
          <span>📍 ${UI.esc(e.district)}${e.place ? ' • ' + UI.esc(e.place) : ''}</span>
          <span>🕰️ ${UI.esc(e.time || 'All day')}</span>
          <span>👥 ${e.going || 0} going</span>
        </div>
        <div class="event-foot">
          <small>by ${UI.esc(e.by)}</small>
          <button class="btn ${e.rsvped ? 'btn-outline' : 'btn-primary'} btn-sm" data-action="rsvp" data-id="${e.id}">${e.rsvped ? '✓ Going' : 'I will go'}</button>
        </div>
      </div>
    </div>`;
  }

  function renderEvents() {
    const fests = D.festivals.map(f => `
      <div class="fest-card reveal" style="--fc:${f.color}">
        <span class="fest-dot"></span>
        <div>
          <b>${UI.esc(f.name)} ${UI.esc(f.np)}</b>
          <small>${UI.esc(f.date)} • ${UI.esc(f.region)}</small>
        </div>
      </div>`).join('');
    const festsTop = D.festivals.slice(0, 4).map(f => `
      <div class="card fest-top reveal">
        <span class="fest-emoji" style="background:${f.color}22;color:${f.color}">🎎</span>
        <h4>${UI.esc(f.name)}</h4>
        <p>${UI.esc(f.desc)}</p>
        <small><b>${UI.esc(f.date)}</b> • ${UI.esc(f.region)}</small>
      </div>`).join('');

    return `
    <section class="page-head reveal">
      <h1>🎉 Events &amp; Festivals</h1>
      <p>From Dashain swings to tole cleanups — celebrate and connect with your community.</p>
      <div class="page-actions">
        <button class="btn btn-primary" data-action="open-event">＋ Create Event</button>
      </div>
    </section>
    <section class="section alt pt0">
      <div class="section-head reveal"><h2>Festival Calendar (2082 BS)</h2></div>
      <div class="fest-strip reveal">${fests}</div>
    </section>
    <section class="section pt0">
      <div class="section-head reveal"><h2>Upcoming Community Events</h2></div>
      <div class="grid grid-3" id="eventList">
        ${NB.listEvents().map(eventCard).join('') || '<p class="empty">No events yet.</p>'}
      </div>
    </section>
    <section class="section alt">
      <div class="section-head reveal"><h2>Top Festivals</h2></div>
      <div class="grid grid-4">${festsTop}</div>
    </section>`;
  }

  /* ================= SERVICES ================= */
  function serviceCard(s) {
    return `
    <div class="card service-card reveal">
      <div class="service-top">
        <span class="service-icon">${D.serviceCats.find(c => c.cat === s.cat) ? D.serviceCats.find(c => c.cat === s.cat).icon : '🧰'}</span>
        <span class="rate">★ ${s.rating}</span>
      </div>
      <h4>${UI.esc(s.name)}</h4>
      <p class="service-note">${UI.esc(s.note || '')}</p>
      <small>📍 ${UI.esc(s.area)}</small>
      <div class="service-foot">
        ${s.verified ? '<span class="verified">✓ Verified</span>' : '<span class="unverified">Community</span>'}
        ${s.phone ? `<a class="btn btn-sm btn-outline" href="tel:+977${UI.esc(String(s.phone).replace(/\D/g, ''))}">📞 Call</a>
        <a class="btn btn-sm btn-primary" href="https://wa.me/977${UI.esc(String(s.phone).replace(/\D/g, ''))}" target="_blank" rel="noopener">WhatsApp</a>` : ''}
      </div>
    </div>`;
  }

  function renderServices() {
    const cats = D.serviceCats.map(c => `<button class="chip" data-filter-cat="${UI.esc(c.cat)}">${c.icon} ${UI.esc(c.cat)}</button>`).join('');
    return `
    <section class="page-head reveal">
      <h1>🔧 Local Services Directory</h1>
      <p>Trusted trades, health help and daily essentials near you — verified by the community.</p>
      <div class="page-actions">
        <button class="btn btn-primary" data-action="open-service">＋ List Your Service</button>
      </div>
    </section>
    <section class="section pt0">
      <div class="filter-bar reveal">
        <div class="chips" id="serviceFilters">
          <button class="chip on" data-filter-cat="All">✨ All</button>
          ${cats}
        </div>
        <div class="search-wrap">
          <input type="search" id="serviceSearch" placeholder="Search service or area..." class="input">
        </div>
      </div>
      <div class="grid grid-3" id="serviceList">
        ${NB.listServices().map(serviceCard).join('') || '<p class="empty">No services listed.</p>'}
      </div>
    </section>`;
  }

  function filterServices() {
    const box = document.getElementById('serviceList');
    if (!box) return;
    const sel = document.querySelector('#serviceFilters .chip.on');
    const cat = sel ? sel.getAttribute('data-filter-cat') : 'All';
    const q = (document.getElementById('serviceSearch').value || '').toLowerCase();
    const list = NB.listServices().filter(s => {
      const okCat = cat === 'All' || s.cat === cat;
      const okQ = !q || (s.name + ' ' + s.area + ' ' + s.cat + ' ' + s.note).toLowerCase().indexOf(q) !== -1;
      return okCat && okQ;
    });
    box.innerHTML = list.map(serviceCard).join('') || '<p class="empty">No matching services.</p>';
    UI.observeReveals(box);
  }

  /* ================= SOLUTIONS ================= */
  function renderSolutions() {
    const cards = D.solutions.map((s, i) => `
      <div class="card sol-card reveal">
        <div class="sol-card-head">
          <span class="sol-icon">${s.icon}</span>
          <span class="chip chip-sm">${UI.esc(s.cat)}</span>
        </div>
        <h3>${UI.esc(s.title)}</h3>
        <p class="sol-problem">${UI.esc(s.problem)}</p>
        <details class="sol-details">
          <summary>Show solutions (${s.solutions.length})</summary>
          <ul>${s.solutions.map(x => `<li>${UI.esc(x)}</li>`).join('')}</ul>
          <div class="sol-contacts">
            <b>📞 Contact:</b> ${s.contacts.map(c => UI.esc(c)).join(' · ')}
          </div>
        </details>
        <p class="sol-tip">💬 ${UI.esc(s.tip)}</p>
      </div>`).join('');

    return `
    <section class="page-head reveal">
      <h1>💡 Problems → Solutions</h1>
      <p>Researched answers to Nepal's daily-life challenges — society, environment, health, safety and community.</p>
    </section>
    <section class="section pt0">
      <div class="solution-grid">${cards}</div>
    </section>
    <section class="section alt">
      <div class="ai-promo reveal">
        <div>
          <h2>🤖 Not sure about something?</h2>
          <p>Ask Mitra AI anything about Nepal life — it uses this same knowledge plus a live AI model when you add a free API key.</p>
          <button class="btn btn-primary" data-action="chat-open">💬 Ask Mitra now</button>
        </div>
      </div>
    </section>`;
  }

  /* ================= PLACES ================= */
  function renderPlaces() {
    const facts = D.quickFacts.map(f => `<div class="fact reveal"><b>${UI.esc(f.value)}</b><span>${UI.esc(f.label)}</span></div>`).join('');
    const provCards = D.provinceList.map(p => `
      <div class="card prov-card reveal" style="--pc:${p.color}">
        <div class="prov-top"><span class="prov-icon">${p.icon}</span><span class="chip chip-sm">${p.districts} districts</span></div>
        <h3>${UI.esc(p.name)} <em>${UI.esc(p.nameNp)}</em></h3>
        <p>${UI.esc(p.facts)}</p>
        <div class="prov-meta">
          <span>🏛️ ${UI.esc(p.cap)}</span>
          <span>📍 ${UI.esc(p.area)}</span>
          <span>👥 ${UI.esc(p.pop)}</span>
        </div>
        <small>Languages: ${UI.esc(p.lang)}</small>
      </div>`).join('');
    const placeChips = [...new Set(D.places.map(x => x.tag))].map(t => `<button class="chip" data-filter-cat="${UI.esc(t)}">${UI.esc(t)}</button>`).join('');
    const foods = D.foods.map(f => `<div class="food-pill reveal"><span>${f.emoji}</span><div><b>${UI.esc(f.name)}</b><small>${UI.esc(f.desc)}</small></div></div>`).join('');
    const langs = D.languages.map(l => `<div class="lang-row reveal"><b>${UI.esc(l.name)}</b><span>${UI.esc(l.speakers)}</span><small>${UI.esc(l.note)}</small></div>`).join('');

    return `
    <section class="page-head reveal">
      <h1>🗺️ Nepal Guide</h1>
      <p>Every tiny detail — 7 provinces, all 77 districts, 26+ must-visit places, food, languages and facts.</p>
    </section>
    <section class="section alt pt0">
      <div class="section-head reveal"><h2>🇳🇵 Nepal at a Glance</h2></div>
      <div class="facts-grid">${facts}</div>
    </section>
    <section class="section">
      <div class="section-head reveal"><h2>7 Provinces</h2></div>
      <div class="grid grid-3">${provCards}</div>
    </section>
    <section class="section alt">
      <div class="section-head reveal"><h2>All 77 Districts</h2><p>Search any district — headquarters, province, zone &amp; what it is known for.</p></div>
      <div class="search-wrap reveal" style="max-width:480px;margin:0 auto 20px">
        <input type="search" id="districtSearch" placeholder="Search district (e.g. Ilam, Mustang)..." class="input">
      </div>
      <div class="district-table-wrap reveal" id="districtTable">
        ${districtsTable()}
      </div>
    </section>
    <section class="section">
      <div class="section-head reveal"><h2>Must-Visit Places</h2></div>
      <div class="chips reveal" id="placeFilters"><button class="chip on" data-filter-cat="All">✨ All</button>${placeChips}</div>
      <div class="grid grid-3" id="placeList">
        ${D.places.map(placeCard).join('')}
      </div>
    </section>
    <section class="section alt">
      <div class="section-head reveal"><h2>🍛 Nepali Food</h2></div>
      <div class="food-grid">${foods}</div>
    </section>
    <section class="section">
      <div class="section-head reveal"><h2>🗣️ Languages of Nepal</h2></div>
      <div class="lang-grid">${langs}</div>
    </section>`;
  }

  function placeCard(p) {
    return `
    <div class="card place-card reveal">
      <span class="chip chip-sm">${UI.esc(p.tag)}</span>
      <h4>${UI.esc(p.name)}</h4>
      <small>📍 ${UI.esc(p.d)} District</small>
      <p>${UI.esc(p.why)}</p>
    </div>`;
  }

  function districtsTable(filter) {
    const q = (filter || '').toLowerCase();
    const rows = D.districts.filter(d => !q || (d.d + ' ' + d.hq + ' ' + d.p).toLowerCase().indexOf(q) !== -1)
      .map(d => `<tr><td>${UI.esc(d.d)}</td><td>${UI.esc(D.provinces[d.p].name)}</td><td>${UI.esc(d.z)}</td><td>${UI.esc(d.hq)}</td><td class="dk">${UI.esc(d.k)}</td></tr>`).join('');
    return `<table class="district-table"><thead><tr><th>District</th><th>Province</th><th>Zone</th><th>HQ</th><th class="dk">Known For</th></tr></thead><tbody>${rows || '<tr><td colspan="5">No districts match.</td></tr>'}</tbody></table>`;
  }

  /* ================= EMERGENCY ================= */
  function renderEmergency() {
    const contacts = D.emergency.map(c => `
      <div class="card contact-card reveal">
        <span class="contact-icon">${c.icon === 'shield' ? '🛡️' : c.icon === 'flame' ? '🔥' : c.icon === 'plus' ? '⛑️' : c.icon === 'alert' ? '⚠️' : c.icon === 'map' ? '🗺️' : c.icon === 'heart' ? '💗' : c.icon === 'child' ? '🧒' : c.icon === 'bolt' ? '⚡' : c.icon === 'drop' ? '💧' : c.icon === 'droplet' ? '🩸' : c.icon === 'help' ? '🆘' : '📞'}</span>
        <div class="contact-body">
          <b>${UI.esc(c.name)}</b>
          <small>${UI.esc(c.desc)}</small>
          <span class="contact-num">${UI.esc(c.number)}</span>
        </div>
        <a class="btn btn-primary btn-sm" href="tel:${UI.esc(c.number)}">Call</a>
      </div>`).join('');
    const hospitals = D.hospitals.map(h => `
      <div class="card hospital-card reveal">
        <div><b>🏥 ${UI.esc(h.name)}</b><small>${UI.esc(h.city)} • ${UI.esc(h.note)}</small></div>
        <a class="btn btn-outline btn-sm" href="tel:${UI.esc(h.phone.replace(/\D/g, ''))}">📞 ${UI.esc(h.phone)}</a>
      </div>`).join('');

    return `
    <section class="page-head reveal">
      <h1>🚨 Emergency &amp; Safety</h1>
      <p>One tap away from help. Save these numbers and share them with your neighbours.</p>
      <div class="page-actions">
        <a class="btn btn-danger btn-lg sos-btn" href="tel:100">🆘 SOS — Call 100</a>
      </div>
    </section>
    <section class="section pt0">
      <div class="grid grid-2 contact-grid">${contacts}</div>
    </section>
    <section class="section alt">
      <div class="section-head reveal"><h2>🏥 Key Hospitals</h2></div>
      <div class="hospital-list">${hospitals}</div>
    </section>
    <section class="section">
      <div class="section-head reveal"><h2>🛟 Safety Quick Tips</h2></div>
      <div class="grid grid-4">
        <div class="card tip-card reveal"><span>🏔️</span><h4>Earthquake</h4><p>Drop, Cover, Hold On. Stay under a sturdy table during shaking — run only after it stops.</p></div>
        <div class="card tip-card reveal"><span>🌊</span><h4>Flood</h4><p>Move to higher ground. Never cross flooded roads — 30cm of water can sweep a car.</p></div>
        <div class="card tip-card reveal"><span>🔥</span><h4>Fire</h4><p>Evacuate, call 101, leave the door closed behind you. Never use water on electric fires.</p></div>
        <div class="card tip-card reveal"><span>⛰️</span><h4>Landslide</h4><p>Avoid steep slopes in heavy rain. Watch for cracks and moving soil; move sideways, never down.</p></div>
      </div>
    </section>`;
  }

  /* ================= SETTINGS ================= */
  function renderSettings() {
    const u = NB.currentUser();
    const cfg = NB.getConfig();
    const prov = NibourlyAI.getProvider();
    const opts = Object.keys(NibourlyAI.PROVIDERS).map(k => {
      const p = NibourlyAI.PROVIDERS[k];
      return `<option value="${k}" ${cfg.aiProvider === k ? 'selected' : ''}>${UI.esc(p.label)}</option>`;
    }).join('');
    const models = (NibourlyAI.PROVIDERS[cfg.aiProvider] || NibourlyAI.PROVIDERS.gemini).models.map(m => `<option value="${UI.esc(m)}" ${cfg.aiModel === m ? 'selected' : ''}>${UI.esc(m)}</option>`).join('');
    const districts = D.districtNames.slice().sort().map(d => `<option ${cfg.district === d ? 'selected' : ''}>${UI.esc(d)}</option>`).join('');

    return `
    <section class="page-head reveal">
      <h1>⚙️ Settings</h1>
      <p>Profile, AI assistant setup, theme and your data.</p>
    </section>
    <section class="section pt0">
      <div class="settings-grid">
        <div class="card settings-card reveal">
          <h3>👤 Profile</h3>
          ${u ? `
          <div class="profile-row">${UI.avatar(u.name, 56)}<div><b>${UI.esc(u.name)}</b><small>${UI.esc(u.email)} • ${UI.esc(u.district || '—')}</small></div></div>
          <div class="field"><label for="setName">Full Name</label><input id="setName" type="text" value="${UI.esc(u.name)}"></div>
          <div class="field"><label for="setDistrict">Home District</label><select id="setDistrict">${districts}</select></div>
          <button class="btn btn-primary" data-action="save-profile">Save Profile</button>
          <button class="btn btn-ghost btn-danger-ghost" data-action="logout" style="margin-left:10px">Logout</button>` : `
          <p>You are browsing as a <b>guest</b>.</p>
          <button class="btn btn-primary" data-action="login">Login / Register</button>`}
        </div>

        <div class="card settings-card reveal">
          <h3>✨ AI Assistant — Mitra</h3>
          <p class="muted">Connect a free AI model for smarter answers. <b>Without a key, Mitra still answers from built-in Nepal knowledge.</b></p>
          <div class="field">
            <label>Provider</label>
            <select id="aiProvider">${opts}</select>
          </div>
          <div class="field">
            <label>Model</label>
            <select id="aiModel">${models}</select>
          </div>
          <div class="field">
            <label>API Key</label>
            <div class="key-row">
              <input id="aiKey" type="password" placeholder="${UI.esc(prov.keyHint)}" value="${UI.esc(cfg.aiKey || '')}">
              <button class="btn btn-outline btn-sm" data-action="toggle-key">👁</button>
            </div>
          </div>
          <div class="key-help">
            <p><b>🔑 Generate your free API key here:</b></p>
            <a class="btn btn-sm btn-primary" href="${UI.esc(prov.keyUrl)}" target="_blank" rel="noopener">Open ${UI.esc(prov.keyUrl)} →</a>
          </div>
          <div class="hero-actions" style="margin-top:14px">
            <button class="btn btn-primary btn-sm" data-action="save-ai">Save AI Settings</button>
            <button class="btn btn-outline btn-sm" data-action="test-ai">Test Connection</button>
          </div>
          <p class="form-msg" id="aiStatus"></p>
        </div>

        <div class="card settings-card reveal">
          <h3>🎨 Appearance</h3>
          <p class="muted">Choose how Nibourly looks for you.</p>
          <div class="theme-row">
            <button class="btn ${cfg.theme === 'dark' ? 'btn-primary' : 'btn-outline'}" data-action="theme-dark">🌙 Dark</button>
            <button class="btn ${cfg.theme === 'light' ? 'btn-primary' : 'btn-outline'}" data-action="theme-light">☀️ Light</button>
          </div>
        </div>

        <div class="card settings-card reveal">
          <h3>💾 Your Data</h3>
          <p class="muted">Everything is stored safely in your browser (localStorage). Export a backup, import it on another device, or reset.</p>
          <div class="hero-actions">
            <button class="btn btn-outline btn-sm" data-action="export-data">⬇️ Export Backup</button>
            <button class="btn btn-outline btn-sm" data-action="import-data">⬆️ Import Backup</button>
            <input type="file" id="importFile" accept=".json,application/json" style="display:none">
            <button class="btn btn-ghost btn-danger-ghost btn-sm" data-action="reset-data">🗑️ Reset App</button>
          </div>
        </div>

        <div class="card settings-card reveal">
          <h3>ℹ️ About Nibourly</h3>
          <p class="muted"><b>Nibourly</b> — "छिमेकी" (neighbour) — is an AI-powered community platform built for Nepal's society &amp; daily life: 77 districts, 7 provinces, 123+ languages, festivals, problems &amp; solutions, and an AI assistant named <b>Mitra</b>.</p>
          <p class="muted">Tech: HTML / CSS / JavaScript · Static JSON · localStorage · AI API (Gemini / Groq / OpenRouter).</p>
          <p class="muted">Built with ❤️ in Nepal for the Vibe Coding Hackathon.</p>
        </div>
      </div>
    </section>`;
  }

  /* ================= POST-RENDER HOOKS ================= */
  function postRender() {
    UI.observeReveals();
    const t = document.getElementById('npClock');
    if (t) {
      const tick = () => {
        try {
          t.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) {
          t.textContent = new Date().toLocaleTimeString('en-GB');
        }
      };
      tick();
      setInterval(tick, 1000);
    }
    const counts = document.querySelectorAll('[data-count]');
    counts.forEach(c => {
      const target = parseInt(c.getAttribute('data-count'), 10) || 0;
      UI.countUp(c, target);
    });
    if (route.page === 'community') {
      const search = document.getElementById('postSearch');
      if (search) search.addEventListener('input', filterPosts);
    }
    if (route.page === 'report') {
      const q = document.getElementById('reportList');
      if (q) filterReports();
    }
    if (route.page === 'services') {
      const search = document.getElementById('serviceSearch');
      if (search) search.addEventListener('input', filterServices);
    }
    if (route.page === 'places') {
      const ds = document.getElementById('districtSearch');
      if (ds) ds.addEventListener('input', e => { document.getElementById('districtTable').innerHTML = districtsTable(e.target.value); });
    }
  }

  /* ================= EVENT DELEGATION ================= */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const action = t.getAttribute('data-action');
    const id = t.getAttribute('data-id') || '';

    switch (action) {
      case 'goto':
        if (t.getAttribute('data-href')) location.hash = t.getAttribute('data-href');
        break;
      case 'login': openAuth('login'); break;
      case 'logout':
        NB.logout(); userBoxRender(); UI.toast('👋 Logged out. See you soon!'); render();
        break;
      case 'profile': location.hash = '#/settings'; break;
      case 'open-post':
        if (!requireAuth('post')) return;
        openPostModal();
        break;
      case 'vote-post': {
        const res = NB.votePost(id);
        if (res) {
          const btn = t; btn.textContent = '👍 ' + res.votes;
          btn.style.color = res.voted ? '#f59e0b' : '';
        }
        break;
      }
      case 'close-post':
        NB.closePost(id); UI.toast('✅ Post marked done. Thank you for helping!'); render();
        break;
      case 'post-help': UI.toast('💬 Reply feature — comment on the post in the full app.'); break;
      case 'open-report':
        if (!requireAuth('report')) return;
        openReportModal();
        break;
      case 'vote-report': {
        const res = NB.voteReport(id);
        if (res) {
          const btn = t; btn.textContent = '👍 ' + res.votes;
          btn.style.color = res.voted ? '#f59e0b' : '';
        }
        break;
      }
      case 'report-help': UI.toast('💬 Discuss — join the community board to coordinate.'); break;
      case 'open-event': openEventModal(); break;
      case 'rsvp': {
        const res = NB.rsvpEvent(id);
        if (res) { t.textContent = res.rsvped ? '✓ Going' : 'I will go'; t.className = 'btn btn-sm ' + (res.rsvped ? 'btn-outline' : 'btn-primary'); }
        break;
      }
      case 'open-service': openServiceModal(); break;
      case 'chat-open': openChat(true); break;
      case 'toggle-key': {
        const inp = document.getElementById('aiKey');
        if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
        break;
      }
      case 'save-profile': {
        const name = document.getElementById('setName').value.trim();
        const district = document.getElementById('setDistrict').value;
        if (!name) return UI.toast('Please enter your name.');
        NB.updateUser({ name, district });
        UI.toast('✅ Profile updated'); render();
        break;
      }
      case 'save-ai': {
        const aiKey = document.getElementById('aiKey').value.trim();
        const aiProvider = document.getElementById('aiProvider').value;
        const aiModel = document.getElementById('aiModel').value;
        NB.setConfig({ aiKey, aiProvider, aiModel });
        UI.toast('✅ AI settings saved');
        break;
      }
      case 'test-ai': {
        const aiStatus = document.getElementById('aiStatus');
        aiStatus.textContent = '⏳ Testing connection...';
        aiStatus.style.color = 'var(--muted)';
        NibourlyAI.testConnection().then(r => {
          aiStatus.textContent = r.ok ? '✅ ' + r.msg : '⚠️ ' + r.msg;
          aiStatus.style.color = r.ok ? 'var(--ok)' : 'var(--danger)';
        });
        break;
      }
      case 'theme-dark': NB.setConfig({ theme: 'dark' }); applyTheme(); render(); break;
      case 'theme-light': NB.setConfig({ theme: 'light' }); applyTheme(); render(); break;
      case 'export-data': {
        const blob = new Blob([NB.exportAll()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'nibourly-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(a.href);
        UI.toast('⬇️ Backup downloaded');
        break;
      }
      case 'import-data': {
        const f = document.getElementById('importFile');
        if (f) f.click();
        break;
      }
      case 'reset-data': {
        if (confirm('Reset all Nibourly data on this device? This cannot be undone.')) {
          NB.resetAll(); UI.toast('🗑️ App data reset'); render();
        }
        break;
      }
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'importFile' && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const res = NB.importAll(String(reader.result));
        UI.toast(res.ok ? '✅ ' + res.msg : '⚠️ ' + res.msg);
        if (res.ok) render();
      };
      reader.readAsText(file);
      e.target.value = '';
    }
  });

  /* ================= FILTER DELEGATION ================= */
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.chips .chip');
    if (!chip || !chip.getAttribute('data-filter-cat')) return;
    const container = chip.closest('.chips');
    container.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
    chip.classList.add('on');
    if (container.id === 'postFilters') filterPosts();
    if (container.id === 'reportFilters') filterReports();
    if (container.id === 'serviceFilters') filterServices();
    if (container.id === 'placeFilters') {
      const val = chip.getAttribute('data-filter-cat');
      const list = document.getElementById('placeList');
      const places = val === 'All' ? D.places : D.places.filter(p => p.tag === val);
      list.innerHTML = places.map(placeCard).join('');
      UI.observeReveals(list);
    }
  });

  /* ================= AUTH ================= */
  let authMode = 'login';
  function openAuth(mode) {
    authMode = mode || 'login';
    document.querySelectorAll('#authTabs .tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === authMode));
    document.getElementById('regNameWrap').style.display = authMode === 'register' ? '' : 'none';
    document.getElementById('regDistrictWrap').style.display = authMode === 'register' ? '' : 'none';
    document.getElementById('authTitle').textContent = authMode === 'register' ? 'Join Nibourly' : 'Welcome back!';
    document.getElementById('authSub').textContent = authMode === 'register' ? 'Create your community account' : 'Login to post, report & help';
    document.getElementById('authSubmit').textContent = authMode === 'register' ? 'Create Account' : 'Login';
    document.getElementById('authMsg').textContent = '';
    UI.openModal('authModal');
  }
  function requireAuth(what) {
    if (NB.currentUser()) return true;
    openAuth('login');
    UI.toast('🔐 Please login to ' + what);
    return false;
  }

  function bindAuth() {
    document.querySelectorAll('#authTabs .tab').forEach(t => {
      t.addEventListener('click', () => openAuth(t.getAttribute('data-tab')));
    });
    document.getElementById('authForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('authUser').value.trim();
      const pass = document.getElementById('authPass').value;
      const msg = document.getElementById('authMsg');
      msg.style.color = 'var(--danger)';
      if (authMode === 'register') {
        const name = document.getElementById('regName').value.trim();
        const district = document.getElementById('regDistrict').value;
        const res = NB.register({ name, email, pass, district });
        if (!res.ok) { msg.textContent = res.msg; return; }
        msg.style.color = 'var(--ok)';
        msg.textContent = '✅ Account created — welcome ' + res.user.name + '!';
        UI.closeModal('authModal');
        UI.toast('🎉 Welcome to Nibourly, ' + res.user.name + '!');
        userBoxRender(); render();
      } else {
        const res = NB.login({ email, pass });
        if (!res.ok) { msg.textContent = res.msg; return; }
        UI.closeModal('authModal');
        UI.toast('🙏 Namaste, ' + res.user.name + '!');
        userBoxRender(); render();
      }
    });
  }

  function populateSelects() {
    const opts = D.districtNames.slice().sort().map(d => `<option>${UI.esc(d)}</option>`).join('');
    ['regDistrict', 'postDistrict', 'repDistrict'].forEach(id => {
      const s = document.getElementById(id);
      if (s) s.innerHTML = opts;
    });
    document.getElementById('postCat').innerHTML = D.helpCats.map(c => `<option>${UI.esc(c)}</option>`).join('');
    document.getElementById('repCat').innerHTML = D.issueCats.map(c => `<option>${UI.esc(c)}</option>`).join('');
  }

  /* ================= POST MODAL ================= */
  function openPostModal() {
    document.getElementById('postMsg').textContent = '';
    document.getElementById('postTitle').value = '';
    document.getElementById('postDesc').value = '';
    document.getElementById('postPlace').value = '';
    const u = NB.currentUser();
    if (u) document.getElementById('postDistrict').value = D.districtNames.includes(u.district) ? u.district : 'Kathmandu';
    UI.openModal('postModal');
  }
  function bindPostForm() {
    document.getElementById('postForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('postTitle').value.trim();
      const desc = document.getElementById('postDesc').value.trim();
      const msg = document.getElementById('postMsg');
      if (!title) { msg.style.color = 'var(--danger)'; msg.textContent = 'Please write a short headline.'; return; }
      if (!desc) { msg.style.color = 'var(--danger)'; msg.textContent = 'Please add a description.'; return; }
      const u = NB.currentUser() || { name: 'Guest' };
      NB.addPost({
        type: document.getElementById('postType').value,
        cat: document.getElementById('postCat').value,
        title, desc,
        user: u.name,
        district: document.getElementById('postDistrict').value,
        place: document.getElementById('postPlace').value.trim()
      });
      UI.closeModal('postModal');
      UI.toast('✅ Post published to your community!');
      if (route.page === 'community') render();
    });
  }

  /* ================= REPORT MODAL ================= */
  function openReportModal() {
    document.getElementById('repMsg').textContent = '';
    document.getElementById('repTitle').value = '';
    document.getElementById('repDesc').value = '';
    document.getElementById('repPlace').value = '';
    document.getElementById('repPhoto').value = '';
    const u = NB.currentUser();
    if (u) document.getElementById('repDistrict').value = D.districtNames.includes(u.district) ? u.district : 'Kathmandu';
    UI.openModal('reportModal');
  }
  function bindReportForm() {
    document.getElementById('reportForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('repTitle').value.trim();
      const desc = document.getElementById('repDesc').value.trim();
      const msg = document.getElementById('repMsg');
      if (!title) { msg.style.color = 'var(--danger)'; msg.textContent = 'Please describe the problem.'; return; }
      if (!desc) { msg.style.color = 'var(--danger)'; msg.textContent = 'Please add details — ward & tole help a lot.'; return; }
      const u = NB.currentUser() || { name: 'Guest' };
      NB.addReport({
        cat: document.getElementById('repCat').value,
        title, desc,
        district: document.getElementById('repDistrict').value,
        place: document.getElementById('repPlace').value.trim(),
        urgency: document.getElementById('repUrgency').value,
        reporter: u.name
      });
      UI.closeModal('reportModal');
      UI.toast('🚧 Report submitted — thank you! Your ward has been notified.');
      if (route.page === 'report') render();
      else if (route.page === 'home') render();
    });
  }

  /* ================= EVENT MODAL ================= */
  function openEventModal() {
    if (!requireAuth('create events')) return;
    const body = UI.el('div', { class: 'modal-form' }, [
      UI.el('div', { class: 'field' }, [UI.el('label', { for: 'evTitle' }, ['Event title']), UI.el('input', { id: 'evTitle', type: 'text', placeholder: 'e.g. Tole Cleanup Drive' })]),
      UI.el('div', { class: 'row2' }, [
        UI.el('div', { class: 'field' }, [UI.el('label', { for: 'evDate' }, ['Date']), UI.el('input', { id: 'evDate', type: 'date' })]),
        UI.el('div', { class: 'field' }, [UI.el('label', { for: 'evTime' }, ['Time']), UI.el('input', { id: 'evTime', type: 'text', placeholder: '9:00 AM' })])
      ]),
      UI.el('div', { class: 'row2' }, [
        UI.el('div', { class: 'field' }, [UI.el('label', { for: 'evType' }, ['Type']), UI.el('select', { id: 'evType' }, ['Cleanup', 'Health', 'Festival', 'Meeting', 'Sports', 'Education', 'Other'].map(v => UI.el('option', {}, [v])))]),
        UI.el('div', { class: 'field' }, [UI.el('label', { for: 'evDistrict' }, ['District']), UI.el('select', { id: 'evDistrict' }, D.districtNames.slice().sort().map(d => UI.el('option', {}, [d])))])
      ]),
      UI.el('div', { class: 'field' }, [UI.el('label', { for: 'evPlace' }, ['Place']), UI.el('input', { id: 'evPlace', type: 'text', placeholder: 'e.g. Baneshwor Tole' })]),
      UI.el('div', { class: 'field' }, [UI.el('label', { for: 'evDesc' }, ['Details']), UI.el('textarea', { id: 'evDesc', rows: 3 }, [''])]),
      UI.el('p', { class: 'form-msg', id: 'evMsg' }, []),
      UI.el('button', { class: 'btn btn-primary btn-block', type: 'button', 'data-action': 'submit-event' }, ['Create Event'])
    ]);
    const shell = UI.el('div', { class: 'modal-backdrop open' }, [
      UI.el('div', { class: 'modal' }, [
        UI.el('button', { class: 'modal-close', type: 'button', 'data-action': 'close-dynamic' }, ['×']),
        UI.el('div', { class: 'modal-head' }, [UI.el('h3', {}, ['Create Community Event']), UI.el('p', {}, ['Bring your tole together!'])]),
        body
      ])
    ]);
    document.body.appendChild(shell);
    const close = () => shell.remove();
    shell.addEventListener('click', (e) => {
      if (e.target === shell) close();
      if (e.target.getAttribute && e.target.getAttribute('data-action') === 'close-dynamic') close();
      if (e.target.getAttribute && e.target.getAttribute('data-action') === 'submit-event') {
        const title = document.getElementById('evTitle').value.trim();
        const date = document.getElementById('evDate').value;
        const msg = document.getElementById('evMsg');
        if (!title || !date) { msg.style.color = 'var(--danger)'; msg.textContent = 'Please add a title and a date.'; return; }
        NB.addEvent({
          title,
          date,
          time: document.getElementById('evTime').value.trim(),
          type: document.getElementById('evType').value,
          district: document.getElementById('evDistrict').value,
          place: document.getElementById('evPlace').value.trim(),
          desc: document.getElementById('evDesc').value.trim() || 'Community event — all neighbours welcome!',
          by: (NB.currentUser() || { name: 'Community' }).name
        });
        close();
        UI.toast('🎉 Event created!');
        if (route.page === 'events') render();
      }
    });
  }

  /* ================= SERVICE MODAL ================= */
  function openServiceModal() {
    if (!requireAuth('list services')) return;
    const cats = D.serviceCats.map(c => UI.el('option', {}, [c.cat]));
    const body = UI.el('div', { class: 'modal-form' }, [
      UI.el('div', { class: 'field' }, [UI.el('label', { for: 'svName' }, ['Service name']), UI.el('input', { id: 'svName', type: 'text', placeholder: 'e.g. Bishal Electric Service' })]),
      UI.el('div', { class: 'row2' }, [
        UI.el('div', { class: 'field' }, [UI.el('label', { for: 'svCat' }, ['Category']), UI.el('select', { id: 'svCat' }, cats)]),
        UI.el('div', { class: 'field' }, [UI.el('label', { for: 'svPhone' }, ['Phone (98xxxxxxxx)']), UI.el('input', { id: 'svPhone', type: 'text', placeholder: '9841-000000' })])
      ]),
      UI.el('div', { class: 'field' }, [UI.el('label', { for: 'svArea' }, ['Area']), UI.el('input', { id: 'svArea', type: 'text', placeholder: 'e.g. New Baneshwor, Kathmandu' })]),
      UI.el('div', { class: 'field' }, [UI.el('label', { for: 'svNote' }, ['Short note']), UI.el('input', { id: 'svNote', type: 'text', placeholder: 'e.g. Open 8am–8pm, home service' })]),
      UI.el('p', { class: 'form-msg', id: 'svMsg' }, []),
      UI.el('button', { class: 'btn btn-primary btn-block', type: 'button', 'data-action': 'submit-service' }, ['List Service'])
    ]);
    const shell = UI.el('div', { class: 'modal-backdrop open' }, [
      UI.el('div', { class: 'modal' }, [
        UI.el('button', { class: 'modal-close', type: 'button', 'data-action': 'close-dynamic' }, ['×']),
        UI.el('div', { class: 'modal-head' }, [UI.el('h3', {}, ['List Your Service']), UI.el('p', {}, ['Help your neighbours find you!'])]),
        body
      ])
    ]);
    document.body.appendChild(shell);
    shell.addEventListener('click', (e) => {
      if (e.target === shell) shell.remove();
      if (e.target.getAttribute && e.target.getAttribute('data-action') === 'close-dynamic') shell.remove();
      if (e.target.getAttribute && e.target.getAttribute('data-action') === 'submit-service') {
        const name = document.getElementById('svName').value.trim();
        const phone = document.getElementById('svPhone').value.trim();
        const msg = document.getElementById('svMsg');
        if (!name || !phone) { msg.style.color = 'var(--danger)'; msg.textContent = 'Name and phone are required.'; return; }
        NB.addService({ name, phone, cat: document.getElementById('svCat').value, area: document.getElementById('svArea').value.trim(), note: document.getElementById('svNote').value.trim() });
        shell.remove();
        UI.toast('✅ Service listed!');
        if (route.page === 'services') render();
      }
    });
  }

  /* ================= CHAT WIDGET ================= */
  const chat = { open: false, busy: false, msgs: [] };
  function openChat(force) {
    const panel = document.getElementById('chatPanel');
    const open = force ? true : !chat.open;
    chat.open = open;
    panel.classList.toggle('open', open);
    document.getElementById('chatToggle').classList.toggle('on', open);
    document.querySelector('.chat-ico-open').style.display = open ? 'none' : 'block';
    document.querySelector('.chat-ico-close').style.display = open ? 'block' : 'none';
    if (open && !chat.msgs.length) {
      chat.addMsg('assistant', 'नमस्ते! 🙏 I am **Mitra**, your AI neighbour. Ask me anything about Nepal life — festivals, load-shedding, districts, emergency help, places or daily problems. Or tap a quick question below.');
    }
    if (open) document.getElementById('chatInput').focus();
  }
  function bindChat() {
    chat.addMsg = (role, content) => {
      chat.msgs.push({ role, content });
      const box = document.getElementById('chatMsgs');
      const row = UI.el('div', { class: 'msg msg-' + role });
      const b = UI.el('div', { class: 'msg-bubble' });
      b.innerHTML = mdLight(content);
      row.appendChild(b);
      box.appendChild(row);
      box.scrollTop = box.scrollHeight;
      return b;
    };
    document.getElementById('chatToggle').addEventListener('click', () => openChat(false));
    document.getElementById('chatClose').addEventListener('click', () => openChat(false));
    document.getElementById('chatSend').addEventListener('click', sendChat);
    document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
    document.getElementById('chatQuick').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-q]');
      if (btn) { document.getElementById('chatInput').value = btn.getAttribute('data-q'); sendChat(); }
    });
  }
  function mdLight(text) {
    return String(text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
  function sendChat() {
    const input = document.getElementById('chatInput');
    const q = input.value.trim();
    if (!q || chat.busy) return;
    input.value = '';
    chat.addMsg('user', q);
    chat.busy = true;
    const typing = UI.el('div', { class: 'msg msg-assistant' }, [UI.el('div', { class: 'msg-bubble typing' }, ['Mitra is thinking…'] )]);
    const box = document.getElementById('chatMsgs');
    box.appendChild(typing);
    box.scrollTop = box.scrollHeight;
    const hist = chat.msgs.map(m => ({ role: m.role, content: m.content })).slice(-8);
    NibourlyAI.ask(q, hist).then(reply => {
      typing.remove();
      chat.busy = false;
      chat.addMsg('assistant', reply);
    }).catch(err => {
      typing.remove();
      chat.busy = false;
      chat.addMsg('assistant', '⚠️ Sorry, something went wrong: ' + err.message + ' Try again or add your free API key in Settings.');
    });
  }

  /* ================= INIT ================= */
  function init() {
    initChrome();
    initParticles();
    bindAuth();
    bindPostForm();
    bindReportForm();
    bindChat();
    populateSelects();
    applyTheme();
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
