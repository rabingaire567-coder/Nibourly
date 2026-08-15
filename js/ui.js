'use strict';
/* ============================================================
   Nibourly — UI helpers, animation engine and components.
   ============================================================ */

const UI = (function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(k => {
        const v = attrs[k];
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'style') node.setAttribute('style', v);
        else if (v != null && v !== false) node.setAttribute(k, v === true ? '' : v);
      });
    }
    (children || []).forEach(c => {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  /* ---------- toast ---------- */
  let toastBox = null;
  function toast(msg, type) {
    if (!toastBox) {
      toastBox = el('div', { class: 'toast-box' });
      document.body.appendChild(toastBox);
    }
    const t = el('div', { class: 'toast toast-' + (type || 'info') });
    t.innerHTML = msg;
    toastBox.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 3200);
  }

  /* ---------- modal helpers ---------- */
  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    document.body.classList.add('no-scroll');
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  function bindModals() {
    document.querySelectorAll('[data-close]').forEach(b => {
      b.addEventListener('click', () => closeModal(b.getAttribute('data-close')));
    });
    document.querySelectorAll('.modal-backdrop').forEach(bd => {
      bd.addEventListener('click', e => { if (e.target === bd) bd.classList.remove('open'); document.body.classList.remove('no-scroll'); });
    });
  }

  /* ---------- time formatting ---------- */
  function timeAgo(iso) {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
    const mo = Math.floor(d / 30); if (mo < 12) return mo + 'mo ago';
    return Math.floor(mo / 12) + 'y ago';
  }
  function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function fmtDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  /* ---------- avatar ---------- */
  function avatar(name, size) {
    const ch = (name || 'N').trim()[0] || 'N';
    const hues = ['#e23744', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    const c = hues[h % hues.length];
    return '<span class="avatar" style="background:' + c + ';width:' + (size || 38) + 'px;height:' + (size || 38) + 'px">' + esc(ch) + '</span>';
  }

  /* ---------- animation: reveal on scroll ---------- */
  let obs = null;
  function observeReveals(root) {
    if (!obs) {
      obs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            obs.unobserve(en.target);
          }
        });
      }, { threshold: 0.08 });
    }
    (root || document).querySelectorAll('.reveal:not(.in)').forEach(n => obs.observe(n));
  }

  /* ---------- animation: count-up ---------- */
  function countUp(node, target, opts) {
    const dur = (opts && opts.duration) || 1200;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- page transition ---------- */
  function setPage(html) {
    const app = document.getElementById('app');
    app.classList.remove('page-in');
    app.innerHTML = html;
    requestAnimationFrame(() => app.classList.add('page-in'));
  }

  /* ---------- share helper ---------- */
  function share(title, text, url) {
    const data = { title, text, url: url || location.href };
    if (navigator.share) { navigator.share(data).catch(() => {}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText((text || title) + ' ' + url).then(() => toast('📋 Copied to clipboard')); }
  }

  /* ---------- category icon ---------- */
  const EMOJI = {
    'Waste & Sanitation': '🗑️', 'Water Supply': '💧', 'Electricity & Power': '⚡', 'Roads & Infrastructure': '🛣️',
    'Traffic & Transport': '🚦', 'Air Pollution': '🌫️', 'Street Lighting': '💡', 'Health & Hygiene': '🩺',
    'Safety & Security': '🛡️', 'Education': '📚', 'Flood & Drainage': '🌊', 'Other': '📌',
    'Elderly Care': '👴', 'Child Care': '🧒', 'Ride Share': '🚗', 'Tool & Equipment': '🔧', 'Grocery Support': '🛒',
    'Tutoring': '✏️', 'Blood Donation': '🩸', 'Clothes & Donation': '👕', 'Pet Care': '🐾', 'Emergency Aid': '🚨'
  };
  function icon(name) { return EMOJI[name] || '📌'; }

  function urgencyBadge(u) {
    const map = { high: ['🔴', 'High'], med: ['🟡', 'Medium'], low: ['🟢', 'Low'] };
    const m = map[u] || map.low;
    return '<span class="badge badge-' + u + '">' + m[0] + ' ' + m[1] + '</span>';
  }

  function statusBadge(s) {
    const map = { 'new': ['New', 'info'], 'in-progress': ['In Progress', 'warn'], 'resolved': ['Resolved', 'ok'], 'open': ['Open', 'ok'], 'closed': ['Closed', 'muted'] };
    const m = map[s] || map.new;
    return '<span class="badge badge-' + m[1] + '">' + m[0] + '</span>';
  }

  return { esc, el, toast, openModal, closeModal, bindModals, timeAgo, fmtDate, fmtDateTime, avatar, observeReveals, countUp, setPage, share, icon, urgencyBadge, statusBadge };
})();

window.UI = UI;
