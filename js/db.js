'use strict';
/* ============================================================
   Nibourly — localStorage database layer.
   Tables: users, sessions, posts, reports, events, userServices
   ============================================================ */

const NB = (function () {
  const D = 'nibourly_db_v1';
  const mem = {};

  const store = {
    get(key, def) {
      if (key in mem) return mem[key];
      try {
        const raw = localStorage.getItem(D + ':' + key);
        return raw ? JSON.parse(raw) : def;
      } catch (e) { return def; }
    },
    set(key, val) {
      mem[key] = val;
      try { localStorage.setItem(D + ':' + key, JSON.stringify(val)); } catch (e) { /* storage full */ }
    },
    remove(key) {
      delete mem[key];
      try { localStorage.removeItem(D + ':' + key); } catch (e) {}
    }
  };

  const uid = () => 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const now = () => new Date().toISOString();

  /* ---------- helpers ---------- */
  function seed() {
    if (store.get('seeded', false)) return;
    store.set('users', [
      { id: 'u-admin', name: 'Nibourly Admin', email: 'admin@nibourly.np', pass: 'demo1234', district: 'Kathmandu', avatar: 'A', role: 'admin', created: now() }
    ]);
    store.set('posts', [
      { id: uid(), type: 'offer', cat: 'Grocery Support', title: 'Buying groceries from Kalimati — can pick yours too', desc: 'Going to Kalimati market at 9am tomorrow. Happy to pick up vegetables for 2–3 neighbours and drop them home. No charge, just kindness. 🌾', user: 'Asha KC', district: 'Kathmandu', place: 'Ward 11, Kalimati', votes: 14, comments: 3, created: now(), status: 'open' },
      { id: uid(), type: 'request', cat: 'Elderly Care', title: 'Need help visiting my 82-year-old mother', desc: 'I live abroad. Mother lives alone in Chabahil, Ward 6. Would anyone be able to check on her twice a week and help with medicines? Happy to coordinate everything.', user: 'Deepak Rai', district: 'Kathmandu', place: 'Chabahil', votes: 9, comments: 2, created: now(), status: 'open' },
      { id: uid(), type: 'offer', cat: 'Tutoring', title: 'Free SEE maths help every Sunday at the community hall', desc: 'I am a retired maths teacher. Offering free help for SEE students from 10am–12pm every Sunday at Ward 3 community hall, Pokhara. Bring your books!', user: 'Govinda Pokhrel', district: 'Kaski', place: 'Ward 3, Pokhara', votes: 22, comments: 5, created: now(), status: 'open' },
      { id: uid(), type: 'request', cat: 'Blood Donation', title: 'URGENT: B+ blood needed at Bir Hospital', desc: 'A neighbour needs 2 units of B+ blood for surgery tomorrow morning. Please contact Nepal Red Cross or me directly if you can donate. 🙏', user: 'Sneha Maharjan', district: 'Kathmandu', place: 'Maharajgunj', votes: 31, comments: 8, created: now(), status: 'open' },
      { id: uid(), type: 'offer', cat: 'Tool & Equipment', title: 'Borrowing my pressure washer & ladder', desc: 'Have a pressure washer and an 8ft ladder. Happy to lend to neighbours in Banepa for a day or two. Just return clean.', user: 'Kiran Shrestha', district: 'Kavrepalanchok', place: 'Banepa', votes: 7, comments: 1, created: now(), status: 'open' },
      { id: uid(), type: 'request', cat: 'Ride Share', title: 'Ride share to Nepalgunj this Friday evening', desc: 'Driving from Butwal to Nepalgunj Friday 5pm. Two seats free — share fuel. DM if interested.', user: 'Hari Pun', district: 'Banke', place: 'Butwal → Nepalgunj', votes: 5, comments: 2, created: now(), status: 'open' }
    ]);
    store.set('reports', [
      { id: uid(), cat: 'Roads & Infrastructure', title: 'Big pothole near Ratna Park junction', desc: 'Deep pothole right on the main road, causes bikes to swerve dangerously. Present for 2 weeks.', district: 'Kathmandu', place: 'Ratna Park', urgency: 'high', votes: 18, status: 'in-progress', reporter: 'Guest', created: now(), updated: now() },
      { id: uid(), cat: 'Street Lighting', title: '3 streetlights out on Tinkune stretch', desc: 'Dark stretch every evening — safety risk for pedestrians and women returning home late.', district: 'Kathmandu', place: 'Tinkune', urgency: 'med', votes: 11, status: 'new', reporter: 'Guest', created: now(), updated: now() },
      { id: uid(), cat: 'Waste & Sanitation', title: 'Garbage pile behind the school since a week', desc: 'Waste has not been collected for a week; stray dogs are spreading it around.', district: 'Lalitpur', place: 'Sanepa', urgency: 'high', votes: 26, status: 'resolved', reporter: 'Guest', created: now(), updated: now() },
      { id: uid(), cat: 'Water Supply', title: 'Pipe burst leaking at Ward 8 chowk', desc: 'Clean water flowing on the road for 3 days. KUKL has been informed but nothing yet.', district: 'Kathmandu', place: 'Baluwatar', urgency: 'high', votes: 14, status: 'new', reporter: 'Guest', created: now(), updated: now() },
      { id: uid(), cat: 'Electricity & Power', title: 'Transformer sparking near the temple', desc: 'Transformer on the pole near Saraswati temple sparks on rainy nights. Worried about fire risk.', district: 'Bhaktapur', place: 'Suryabinayak', urgency: 'high', votes: 20, status: 'in-progress', reporter: 'Guest', created: now(), updated: now() }
    ]);
    store.set('events', [
      { id: uid(), title: 'Tole Cleanup Drive — Baneshwor', date: '2026-08-22', time: '7:00 AM', type: 'Cleanup', district: 'Kathmandu', place: 'Baneshwor Tole', desc: 'Monthly plastic & drain cleanup. Gloves and bags provided. Chiya after!', by: 'Ward 10 Committee', going: 24 },
      { id: uid(), title: 'Free Health Camp', date: '2026-08-23', time: '9:00 AM', type: 'Health', district: 'Lalitpur', place: 'Patan Hospital', desc: 'Free BP, sugar and general checkups with volunteer doctors.', by: 'Red Cross Lalitpur', going: 60 },
      { id: uid(), title: 'Dashain Swing (Linge Ping) Build', date: '2026-09-28', time: '8:00 AM', type: 'Festival', district: 'Kathmandu', place: 'Baneshwor Park', desc: 'Let us build the community Dashain swing together. Bring bamboo and rope if you can!', by: 'Tole Youth Group', going: 15 },
      { id: uid(), title: 'Tihar Diyo Making Workshop', date: '2026-11-05', time: '2:00 PM', type: 'Festival', district: 'Kathmandu', place: 'Patan Museum Lawn', desc: 'Learn to make clay diyo and rangoli with local artists.', by: 'Newa Art Collective', going: 32 },
      { id: uid(), title: 'Blood Donation Camp', date: '2026-08-30', time: '10:00 AM', type: 'Health', district: 'Kaski', place: 'Lakeside Chautari, Pokhara', desc: 'Blood donation drive with Nepal Red Cross. Breakfast served for donors.', by: 'Red Cross Pokhara', going: 45 }
    ]);
    store.set('userServices', []);
    store.set('voted', {});
    store.set('config', { theme: 'dark', aiProvider: 'gemini', aiKey: '', aiModel: '', name: '', district: '', ward: '' });
    store.set('seeded', true);
  }

  /* ---------- users & auth ---------- */
  function hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
    return 'h' + (h >>> 0).toString(36) + s.length.toString(36);
  }

  function register({ name, email, pass, district }) {
    const users = store.get('users', []);
    const key = (email || '').trim().toLowerCase();
    if (users.some(u => u.email === key)) return { ok: false, msg: 'Account already exists. Please login.' };
    if (!name || !key || !pass) return { ok: false, msg: 'Please fill all the fields.' };
    const u = { id: uid(), name: name.trim(), email: key, pass: hash(pass), district: district || '', avatar: (name.trim()[0] || 'N').toUpperCase(), role: 'user', created: now() };
    users.push(u);
    store.set('users', users);
    store.set('session', u.id);
    return { ok: true, user: u };
  }

  function login({ email, pass }) {
    const users = store.get('users', []);
    const key = (email || '').trim().toLowerCase();
    const u = users.find(x => x.email === key && x.pass === hash(pass));
    if (!u) return { ok: false, msg: 'Wrong email or password.' };
    store.set('session', u.id);
    return { ok: true, user: u };
  }

  function loginDemo() {
    const users = store.get('users', []);
    const key = 'admin@nibourly.np';
    let u = users.find(x => x.email === key);
    if (!u) {
      u = { id: uid(), name: 'Nibourly Admin', email: key, pass: hash('demo1234'), district: 'Kathmandu', avatar: 'A', role: 'admin', created: now() };
      users.push(u);
      store.set('users', users);
    }
    store.set('session', u.id);
    return u;
  }

  function logout() { store.remove('session'); }

  function currentUser() {
    const id = store.get('session', '');
    return store.get('users', []).find(u => u.id === id) || null;
  }

  function updateUser(patch) {
    const users = store.get('users', []);
    const id = store.get('session', '');
    const i = users.findIndex(u => u.id === id);
    if (i < 0) return null;
    users[i] = Object.assign({}, users[i], patch);
    if (patch.name) users[i].avatar = (patch.name.trim()[0] || 'N').toUpperCase();
    store.set('users', users);
    return users[i];
  }

  /* ---------- posts ---------- */
  function listPosts() {
    return store.get('posts', []).slice().sort((a, b) => new Date(b.created) - new Date(a.created));
  }
  function addPost(p) {
    const posts = store.get('posts', []);
    const post = Object.assign({
      id: uid(), type: 'request', cat: 'Other', title: '', desc: '', user: 'Guest',
      district: 'Kathmandu', place: '', votes: 0, comments: 0, created: now(), status: 'open'
    }, p, { id: uid(), created: now() });
    posts.unshift(post);
    store.set('posts', posts);
    return post;
  }
  function votePost(id) {
    const voted = store.get('voted', {});
    const posts = store.get('posts', []);
    const p = posts.find(x => x.id === id);
    if (!p) return;
    if (voted[id]) { p.votes = Math.max(0, p.votes - 1); delete voted[id]; }
    else { p.votes = (p.votes || 0) + 1; voted[id] = 1; }
    store.set('posts', posts);
    store.set('voted', voted);
    return { votes: p.votes, voted: !!voted[id] };
  }
  function closePost(id) {
    const posts = store.get('posts', []);
    const p = posts.find(x => x.id === id);
    if (p) { p.status = 'closed'; store.set('posts', posts); }
  }

  /* ---------- reports ---------- */
  function listReports() {
    return store.get('reports', []).slice().sort((a, b) => new Date(b.created) - new Date(a.created));
  }
  function addReport(r) {
    const reports = store.get('reports', []);
    const report = Object.assign({
      id: uid(), cat: 'Other', title: '', desc: '', district: 'Kathmandu', place: '', urgency: 'med', votes: 0, status: 'new', reporter: 'Guest', created: now(), updated: now()
    }, r, { id: uid(), created: now(), updated: now(), reporter: r.reporter || 'Guest' });
    reports.unshift(report);
    store.set('reports', reports);
    return report;
  }
  function voteReport(id) {
    const voted = store.get('voted', {});
    const reports = store.get('reports', []);
    const r = reports.find(x => x.id === id);
    if (!r) return;
    if (voted['r:' + id]) { r.votes = Math.max(0, r.votes - 1); delete voted['r:' + id]; }
    else { r.votes = (r.votes || 0) + 1; voted['r:' + id] = 1; }
    store.set('reports', reports);
    store.set('voted', voted);
    return { votes: r.votes, voted: !!voted['r:' + id] };
  }
  function setReportStatus(id, status) {
    const reports = store.get('reports', []);
    const r = reports.find(x => x.id === id);
    if (r) { r.status = status; r.updated = now(); store.set('reports', reports); }
  }

  /* ---------- events ---------- */
  function listEvents() {
    return store.get('events', []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  function addEvent(e) {
    const events = store.get('events', []);
    const ev = Object.assign({ id: uid(), title: '', date: '', time: '', type: 'Other', district: 'Kathmandu', place: '', desc: '', by: 'Community', going: 0, rsvped: false }, e, { id: uid() });
    events.push(ev);
    store.set('events', events);
    return ev;
  }
  function rsvpEvent(id) {
    const events = store.get('events', []);
    const ev = events.find(x => x.id === id);
    if (!ev) return;
    ev.rsvped = !ev.rsvped;
    ev.going = (ev.going || 0) + (ev.rsvped ? 1 : -1);
    store.set('events', events);
    return { going: ev.going, rsvped: ev.rsvped };
  }

  /* ---------- services ---------- */
  function listServices() {
    return NBData.sampleServices.concat(store.get('userServices', []));
  }
  function addService(s) {
    const list = store.get('userServices', []);
    const svc = Object.assign({ id: uid(), cat: 'Other', name: '', area: '', phone: '', rating: 4.0, verified: false, note: '' }, s, { id: uid(), userAdded: true });
    list.unshift(svc);
    store.set('userServices', list);
    return svc;
  }

  /* ---------- config ---------- */
  function getConfig() { return store.get('config', { theme: 'dark', aiProvider: 'gemini', aiKey: '', aiModel: '' }); }
  function setConfig(patch) { store.set('config', Object.assign(getConfig(), patch)); return getConfig(); }

  /* ---------- export / import ---------- */
  function exportAll() {
    const tables = ['users', 'posts', 'reports', 'events', 'userServices', 'config'];
    const out = {};
    tables.forEach(t => { out[t] = store.get(t, null); });
    return JSON.stringify({ app: 'Nibourly', version: NBData.version, exported: now(), data: out }, null, 2);
  }
  function importAll(json) {
    try {
      const obj = JSON.parse(json);
      if (!obj || obj.app !== 'Nibourly' || !obj.data) return { ok: false, msg: 'Invalid backup file.' };
      Object.keys(obj.data).forEach(k => { if (obj.data[k] !== null && obj.data[k] !== undefined) store.set(k, obj.data[k]); });
      store.set('seeded', true);
      return { ok: true, msg: 'Backup restored successfully.' };
    } catch (e) { return { ok: false, msg: 'Could not read file: ' + e.message }; }
  }

  function resetAll() {
    Object.keys(mem).forEach(k => delete mem[k]);
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(D + ':') === 0) keys.push(k);
      }
      keys.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
    seed();
  }

  function stats() {
    return {
      users: store.get('users', []).length,
      posts: store.get('posts', []).length,
      reports: store.get('reports', []).length,
      events: store.get('events', []).length,
      services: listServices().length,
      resolved: store.get('reports', []).filter(r => r.status === 'resolved').length
    };
  }

  seed();
  return {
    uid, now, store, getConfig, setConfig,
    register, login, loginDemo, logout, currentUser, updateUser,
    listPosts, addPost, votePost, closePost,
    listReports, addReport, voteReport, setReportStatus,
    listEvents, addEvent, rsvpEvent,
    listServices, addService,
    exportAll, importAll, resetAll, stats
  };
})();
