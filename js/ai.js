'use strict';
/* ============================================================
   Nibourly — AI integration layer.
   Providers: Google Gemini (free), Groq (free), OpenRouter.
   Always falls back to a built-in Nepal knowledge engine so the
   assistant works even without an API key.
   ============================================================ */

const NibourlyAI = (function () {
  const cfg = NB.getConfig();

  const PROVIDERS = {
    gemini: {
      label: 'Google Gemini (recommended — free)',
      keyUrl: 'https://aistudio.google.com/apikey',
      keyHint: 'Paste your Gemini API key (AIza...)',
      models: ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
      async ask(msgs, key, model) {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + (model || 'gemini-1.5-flash') + ':generateContent?key=' + encodeURIComponent(key);
        const body = { contents: msgs.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })) };
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) { let e = ''; try { e = (await res.json()).error.message; } catch (x) {} throw new Error('Gemini error ' + res.status + ': ' + e); }
        const j = await res.json();
        const text = j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text;
        if (!text) throw new Error('Gemini returned an empty response.');
        return text.trim();
      }
    },
    groq: {
      label: 'Groq (free & fast)',
      keyUrl: 'https://console.groq.com/keys',
      keyHint: 'Paste your Groq API key (gsk_...)',
      models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
      async ask(msgs, key, model) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({ model: model || 'llama-3.3-70b-versatile', messages: msgs.map(m => ({ role: m.role, content: m.content })) })
        });
        if (!res.ok) { let e = ''; try { e = (await res.json()).error.message; } catch (x) {} throw new Error('Groq error ' + res.status + ': ' + e); }
        const j = await res.json();
        const text = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (!text) throw new Error('Groq returned an empty response.');
        return text.trim();
      }
    },
    openrouter: {
      label: 'OpenRouter (many free models)',
      keyUrl: 'https://openrouter.ai/keys',
      keyHint: 'Paste your OpenRouter API key (sk-or-...)',
      models: ['meta-llama/llama-3.3-70b-instruct:free', 'mistralai/mistral-small-3.1-24b-instruct:free'],
      async ask(msgs, key, model) {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key, 'HTTP-Referer': 'https://nibourly.np', 'X-Title': 'Nibourly' },
          body: JSON.stringify({ model: model || 'meta-llama/llama-3.3-70b-instruct:free', messages: msgs.map(m => ({ role: m.role, content: m.content })) })
        });
        if (!res.ok) { let e = ''; try { e = (await res.json()).error.message; } catch (x) {} throw new Error('OpenRouter error ' + res.status + ': ' + e); }
        const j = await res.json();
        const text = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (!text) throw new Error('OpenRouter returned an empty response.');
        return text.trim();
      }
    }
  };

  const SYSTEM_PROMPT =
    'You are "Mitra", the friendly AI assistant of Nibourly — Nepal\'s community platform for society and daily life. ' +
    'You answer ONLY about Nepal: daily life, society, festivals, districts, places, emergency help, waste, water, load-shedding, ' +
    'health, safety, earthquake preparedness, local services, Nepali culture and food. ' +
    'Be warm, practical, concise and specific. Use simple English, occasionally a Nepali word (like "छिमेकी", "तोल", "दशैं") for flavour. ' +
    'Keep answers under 180 words unless asked for detail. If a question is off-topic, politely steer back to Nepal life. ' +
    'Useful facts: 7 provinces, 77 districts, 6,743 wards, capital Kathmandu, timezone UTC+5:45, ' +
    'emergency numbers 100 police, 101 fire, 102 ambulance, 103 traffic, 1155 disaster, 1145 women helpline, 1098 child helpline. ' +
    'Load-shedding groups: Kathmandu A, Lalitpur B, Bhaktapur C, Pokhara D, Biratnagar E, Butwal F, Hetauda G, Nepalgunj H. ';

  /* ---------- Local knowledge fallback engine ---------- */
  function includesAll(text, keys) { return keys.every(k => text.indexOf(k) !== -1); }
  function hasAny(text, keys) { return keys.some(k => text.indexOf(k) !== -1); }

  function festivalReply(q) {
    const f = NBData.festivals.find(x => hasAny(q, [x.name.toLowerCase(), x.np.toLowerCase()]) || (hasAny(q, ['dashain']) && x.name === 'Dashain'));
    if (!f) return null;
    return '🎉 **' + f.name + ' ' + f.np + '**\n\n' + f.desc + '\n\n• Approximate date: **' + f.date + '** (' + f.month + ')\n• Region: ' + f.region + '\n\nWant the full festival calendar? Open the **Events & Festivals** page.';
  }

  function districtReply(q) {
    if (!hasAny(q, ['district', 'jilla', 'जिल्ला', 'where is'])) return null;
    const d = NBData.districts.find(x => q.indexOf(x.d.toLowerCase()) !== -1);
    if (d) {
      const p = NBData.provinces[d.p];
      return '📍 **' + d.d + ' District**\n\n• Headquarters: ' + d.hq + '\n• Province: ' + p.name + ' (' + p.nameNp + ')\n• Known for: ' + d.k + '\n\nSee the **Nepal Guide** page to browse all 77 districts!';
    }
    return null;
  }

  function provinceReply(q) {
    const p = NBData.provinceList.find(x => hasAny(q, [x.name.toLowerCase(), x.nameNp]));
    if (!p) return null;
    return '🏔️ **' + p.name + ' Province ' + p.nameNp + '**\n\n• Capital: ' + p.cap + '\n• Districts: ' + p.districts + ' • Area: ' + p.area + ' • Population: ' + p.pop + '\n• ' + p.facts + '\n\nWant to explore more? Visit the **Nepal Guide** page.';
  }

  function placeReply(q) {
    if (!hasAny(q, ['place', 'visit', 'travel', 'tour', 'sightseeing', 'tourist', 'best place'])) return null;
    const p = NBData.places.find(x => q.indexOf(x.name.toLowerCase()) !== -1);
    if (p) return '🗺️ **' + p.name + '** (' + p.d + ', ' + p.tag + ')\n\n' + p.why + '\n\nFind more must-see places on the **Nepal Guide** page.';
    const g = NBData.places.find(x => hasAny(q, [x.d.toLowerCase()]));
    if (g) return '🗺️ In **' + g.d + '**, a must-visit is **' + g.name + '** — ' + g.why + '\n\nOpen the Nepal Guide page for the full list.';
    return 'Here are a few top picks from our Nepal Guide:\n\n' + NBData.places.slice(0, 5).map(p => '• **' + p.name + '** (' + p.d + ')').join('\n') + '\n\nSee **Nepal Guide** for all 26+ places!';
  }

  function emergencyReply(q) {
    if (!hasAny(q, ['emergency', 'number', 'phone', 'helpline', 'police', 'ambulance', 'fire', 'hotline'])) return null;
    const e = NBData.emergency.find(x => hasAny(q, x.name.toLowerCase().split(' ')[0] ? [x.name.toLowerCase()] : []));
    if (e) return '📞 **' + e.name + ': ' + e.number + '**\n\n' + e.desc;
    return '🚨 **Nepal Emergency Numbers:**\n\n' + NBData.emergency.slice(0, 8).map(x => '• ' + x.name + ' — **' + x.number + '**').join('\n') + '\n\nFull list with hospitals is on the **Emergency** page.';
  }

  function foodReply(q) {
    if (!hasAny(q, ['food', 'eat', 'momo', 'dal bhat', 'dish', 'khana', 'restaurant'])) return null;
    const f = NBData.foods.find(x => q.indexOf(x.name.toLowerCase()) !== -1);
    if (f) return f.emoji + ' **' + f.name + '**\n\n' + f.desc;
    return '🍽️ Famous Nepali foods:\n\n' + NBData.foods.slice(0, 6).map(x => '• ' + x.emoji + ' **' + x.name + '** — ' + x.desc).join('\n');
  }

  function hospitalReply(q) {
    if (!hasAny(q, ['hospital', 'doctor', 'clinic', 'blood bank', 'pharmacy', 'medicine', 'sick'])) return null;
    return '🏥 **Recommended hospitals in Nepal:**\n\n' + NBData.hospitals.slice(0, 6).map(h => '• **' + h.name + '** (' + h.city + ') — ' + h.phone + '\n  ' + h.note).join('\n') + '\n\nFor blood, call Red Cross **14200** or use the Community board.';
  }

  function solutionReply(q) {
    if (!hasAny(q, ['how', 'solution', 'solve', 'tips', 'advice', 'what should', 'compost', 'pothole', 'waste', 'water', 'load', 'shedding', 'earthquake', 'flood', 'safety'])) return null;
    const s = NBData.solutions.find(x => x.title.toLowerCase().split(' ').some(w => w.length > 3 && q.indexOf(w) !== -1)) ||
             NBData.solutions.find(x => hasAny(q, x.title.toLowerCase().split(' ').filter(w => w.length > 4)));
    if (s) {
      return '💡 **' + s.icon + ' ' + s.title + '**\n\n' + s.problem + '\n\n**Solutions:**\n' + s.solutions.slice(0, 4).map((x, i) => (i + 1) + '. ' + x).join('\n') + '\n\n💬 ' + s.tip + '\n\nMore on the **Solutions** page.';
    }
    if (hasAny(q, ['compost'])) return '♻️ Composting is easy: layer green (kitchen scraps) + brown (dry leaves/paper) in a bin, keep moist, turn weekly. In ~3 weeks you get rich soil for plants. It cuts household waste by 40–60%!';
    return null;
  }

  function welcomeReply(q) {
    if (hasAny(q, ['hello', 'hi', 'namaste', 'hey', 'welcome'])) return 'नमस्ते! 🙏 I am **Mitra**, Nibourly\'s community assistant. Ask me about Nepal\'s festivals, districts, emergency numbers, daily-life problems or places to visit — or just type a topic!';
    return null;
  }

  function localAnswer(q) {
    const lower = q.toLowerCase();
    return welcomeReply(lower) ||
      festivalReply(lower) ||
      districtReply(lower) ||
      provinceReply(lower) ||
      emergencyReply(lower) ||
      hospitalReply(lower) ||
      foodReply(lower) ||
      placeReply(lower) ||
      solutionReply(lower) ||
      'Hmm, I am not 100% sure about that one. Try asking about:\n\n• Festivals (Dashain, Tihar, Holi)\n• Districts & provinces of Nepal\n• Emergency numbers\n• Load-shedding & power cuts\n• Waste, water or road problems\n• Places to visit\n• Nepali food\n\nOr add a **free Gemini API key** in Settings → AI to unlock my full brain! ✨';
  }

  /* ---------- main ask ---------- */
  function buildMessages(userText, history) {
    const msgs = [{ role: 'system', content: SYSTEM_PROMPT }];
    history.slice(-8).forEach(m => msgs.push({ role: m.role, content: m.content }));
    msgs.push({ role: 'user', content: userText });
    return msgs;
  }

  async function ask(userText, history) {
    const cfg = NB.getConfig();
    const prov = PROVIDERS[cfg.aiProvider] || PROVIDERS.gemini;
    const key = (cfg.aiKey || '').trim();
    if (key) {
      try {
        const msgs = buildMessages(userText, history);
        return await prov.ask(msgs, key, cfg.aiModel);
      } catch (e) {
        console.warn('AI provider failed, using local knowledge:', e.message);
        return localAnswer(userText) + '\n\n⚠️ *(Online AI unavailable: ' + e.message + ' — using built-in Nepal knowledge.)*';
      }
    }
    return localAnswer(userText);
  }

  async function testConnection() {
    const cfg = NB.getConfig();
    const prov = PROVIDERS[cfg.aiProvider] || PROVIDERS.gemini;
    const key = (cfg.aiKey || '').trim();
    if (!key) return { ok: false, msg: 'No API key saved yet. Get a free key and paste it here.' };
    try {
      const msgs = [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: 'Reply with exactly: OK' }];
      const out = await prov.ask(msgs, key, cfg.aiModel);
      return { ok: true, msg: 'Connected! Model replied: ' + out.slice(0, 60) };
    } catch (e) {
      return { ok: false, msg: 'Connection failed: ' + e.message };
    }
  }

  return { ask, testConnection, PROVIDERS, getProvider() { return PROVIDERS[NB.getConfig().aiProvider] || PROVIDERS.gemini; } };
})();
