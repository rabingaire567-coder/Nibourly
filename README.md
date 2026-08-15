# Nibourly 🇳🇵

**छिमेकी भावना, आधुनिक समाधान** — Nepal's AI-powered community platform for **Society & Daily Life**.

Nibourly connects neighbours across all **77 districts** of Nepal: report local issues, lend a helping hand, join festivals and events, find trusted local services, learn researched solutions to daily-life problems — and ask **Mitra AI**, your AI neighbour.

---

## ✨ Features

| Section | What it does |
|---|---|
| 🏠 **Home** | Live Nepal clock (UTC+5:45), load-shedding widget, festival of the day, community highlights, animated stats |
| 🤝 **Community Help** | Ask for help or offer help — groceries, elderly care, blood, rides, tutoring… |
| 🚧 **Report Issues** | Report potholes, waste, water, streetlights with urgency & status tracking |
| 🎉 **Events & Festivals** | Full 2082 BS festival calendar (Dashain, Tihar, Chhath, Teej…) + community events |
| 🔧 **Services Directory** | Electricians, plumbers, doctors, kirana, tuition — call or WhatsApp directly |
| 💡 **Problem → Solutions** | 14 researched problems of Nepali daily life with practical solutions & contacts |
| 🗺️ **Nepal Guide** | 7 provinces, all 77 districts, 26+ must-visit places, food & languages |
| 🚨 **Emergency** | One-tap SOS (100), all national helplines + hospitals |
| ✨ **Mitra AI** | Chat assistant powered by Google Gemini / Groq / OpenRouter — with a built-in Nepal knowledge engine that works even **without an API key** |

## 🛠️ Tech Stack

- **HTML / CSS / JavaScript** (vanilla SPA, no build step — works on GitHub Pages & file://)
- **Static JSON** — all Nepal data lives in `/data/*.json` (and `js/data.js`)
- **localStorage** — browser database (users, posts, reports, events, services, settings)
- **AI Integration** — free API keys from Google AI Studio, Groq or OpenRouter

## 🔑 AI Setup (30 seconds)

1. Open **Settings → AI Assistant**
2. Tap **"Open https://aistudio.google.com/apikey"** (or https://console.groq.com/keys)
3. Create a free key and paste it in Settings → **Test Connection**

> No key? No problem — Mitra answers instantly from the built-in Nepal knowledge base.

## 🚀 Run Locally

Open `index.html` in any browser — no server or install needed.

Or serve it:
```bash
python -m http.server 8080
# then open http://localhost:8080
```

## ☁️ Deploy to GitHub Pages

1. Create a repo and push this folder.
2. GitHub → Settings → Pages → Source: **Deploy from a branch** → `main` / root.
3. Your site is live at `https://<username>.github.io/<repo>/`.

## 📦 Project Structure

```
Nibourly/
├── index.html          # App shell (nav, modals, chat, footer)
├── css/style.css       # Design system + animations
├── js/
│   ├── data.js         # Canonical Nepal data (77 districts, 7 provinces…)
│   ├── db.js           # localStorage database layer
│   ├── ai.js           # AI providers (Gemini/Groq/OpenRouter) + fallback engine
│   ├── ui.js           # UI helpers & animation engine
│   └── app.js          # Router, pages, chat, modals
├── data/               # Static JSON data files
├── assets/logo.svg
└── README.md
```

Built with ❤️ in Nepal for the Vibe Coding Hackathon.
