# 🇳🇵 Nibourly — AI-Powered Community Platform for Nepal

**Theme:** Society & Daily Life
**Stack:** React + Vite + TypeScript · Static data (JSON/TS) · localStorage · Google Gemini AI

Nibourly connects neighbours across all **7 provinces and 77 districts** of Nepal. Citizens can:

- 🛠️ **Report civic issues** — garbage, water, potholes, power cuts, pollution, traffic and more (with exact province → district → place)
- 🗳️ **Support community issues** — upvote reports so the ward and community act faster
- 🗺️ **Explore Nepal** — every province, all 77 districts (headquarters, area, population, famous places) and major cities
- 📚 **Find real solutions** — a curated library of practical answers for Nepal's most common society & daily-life problems
- ✨ **Ask AI Sathi** — a Gemini-powered assistant with deep Nepal knowledge, with an offline fallback knowledge base
- 🆘 **Emergency numbers** — Police 100, Fire 101, Ambulance 102, Disaster 1149, Women 1145, Child 1098 and more

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Configure your own Gemini API key

1. Get a free key at https://aistudio.google.com/apikey
2. Open the app → **Settings → Gemini AI connection**
3. Paste the key and click **Test & save key**

The key is stored only in your browser's localStorage. A default key is bundled for the hackathon.

## Data & privacy

- All reports, saved solutions and chat history live in **localStorage** — nothing is uploaded to a server.
- Nepal dataset: 7 provinces, 77 districts, 30+ cities, 16 solution guides, 10 emergency helplines.

## Live site

Deployed with GitHub Actions → GitHub Pages.
