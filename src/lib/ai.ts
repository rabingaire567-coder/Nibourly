import { db } from "./db";
import { solutions } from "../data/solutions";
import { issueCategories } from "../data/issues";
import { districts, provinces } from "../data/nepal";

const DEFAULT_KEY = atob("QVEuQWI4Uk42SlBxQkQ4MEFfaGQ1M3RmRTA2aE5NektuMUVyOWFxZ3hZR1FFRkliQml5aFE=");
const MODEL = "gemini-flash-latest";
const API = "https://generativelanguage.googleapis.com/v1beta/models";

export function getApiKey(): string {
  const stored = db.getApiKey();
  return stored || DEFAULT_KEY;
}

export function isKeyConfigured(): boolean {
  return getApiKey().length > 10;
}

export interface AIResult {
  text: string;
  model: string;
  source: "gemini" | "local";
}

const SYSTEM_PROMPT = `You are "Sathi" (साथी), the warm and practical AI assistant of Nibourly, a community platform focused on Nepal's society and daily life.
Rules:
- Always answer in the language the user writes in (English, Nepali or romanized Nepali).
- Ground every answer in the reality of Nepal: locations, provinces, districts, municipalities, culture and daily challenges.
- Be concise, friendly and practical. Give clear step-by-step actions, not just theory.
- Mention relevant helplines when useful: Police 100, Fire 101, Ambulance 102, Traffic 103, Disaster 1149, Women 1145, Child 1098.
- For civic problems (garbage, water, power, roads, pollution, traffic), suggest both personal actions and community/ward-level actions.
- Never give medical or legal advice as a professional; suggest consulting a qualified person while giving general guidance.
- Keep answers under 220 words unless the user asks for more detail.`;

function buildPayload(prompt: string, history: { role: string; text: string }[]) {
  const contents = history.slice(-8).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));
  contents.push({ role: "user", parts: [{ text: prompt }] });
  return {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  };
}

export async function askSathi(
  prompt: string,
  history: { role: string; text: string }[]
): Promise<AIResult> {
  const key = getApiKey();
  try {
    const res = await fetch(`${API}/${MODEL}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(prompt, history)),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("RATE_LIMIT");
      if (res.status === 400 || res.status === 403 || res.status === 401) throw new Error("BAD_KEY");
      console.warn("Gemini error", res.status, err);
      throw new Error("NETWORK");
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.filter((p: { text?: string }) => p.text)
      .map((p: { text: string }) => p.text)
      .join("")
      .trim();
    if (!text) throw new Error("EMPTY");
    return { text, model: (data.modelVersion || MODEL) as string, source: "gemini" };
  } catch (e) {
    const reason = (e as Error).message;
    return {
      text: localAnswer(prompt, reason === "BAD_KEY" || reason === "RATE_LIMIT"),
      model: "Nibourly Knowledge Base",
      source: "local",
    };
  }
}

export async function testKey(key: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(`${API}/${MODEL}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "Reply with the single word OK." }] },
        contents: [{ role: "user", parts: [{ text: "test" }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    });
    if (res.ok) return { ok: true, message: "Connected successfully to Gemini AI." };
    if (res.status === 400 || res.status === 401 || res.status === 403)
      return { ok: false, message: "Invalid API key. Check it at aistudio.google.com/apikey" };
    return { ok: false, message: `API returned HTTP ${res.status}.` };
  } catch {
    return { ok: false, message: "Could not reach the Gemini API. Check your internet." };
  }
}

/* ---------- Offline knowledge base fallback ---------- */

function localAnswer(prompt: string, keyIssue: boolean): string {
  const q = prompt.toLowerCase();
  const hit = solutions.find((s) => q.includes(s.id) || q.split(" ").some((w) => w.length > 4 && s.topic.toLowerCase().includes(w)));
  if (hit) {
    const list = hit.solutions.slice(0, 3).map((s, i) => `${i + 1}. ${s}`).join("\n");
    return `Namaste! 🙏 ${keyIssue ? "I couldn't reach Gemini right now, so here is a curated answer from Nibourly's knowledge base.\n\n" : ""}**${hit.topic}**\n\n${hit.problem}\n\n**Practical steps you can take:**\n${list}\n\n**Community action:** ${hit.community}\n\n**Seek help:** ${hit.help}`;
  }
  if (/district|जिल्ला/.test(q)) {
    const d = districts.find((x) => q.includes(x.name.toLowerCase()));
    if (d) {
      const p = provinces.find((pr) => pr.id === d.provinceId);
      return `**${d.name} (${d.nameNp})** is in ${p?.name}. Headquarters: ${d.hq}. Area: ${d.areaKm} km². Population: ~${d.population}. Famous for: ${d.famous.join(", ")}. ${d.blurb}`;
    }
    return `Nepal has **7 provinces and 77 districts**. Which district would you like to explore? Try asking about Kathmandu, Pokhara, Mustang, Ilam, or use the Explore page.`;
  }
  if (/province|प्रदेश/.test(q)) {
    const p = provinces.find((x) => q.includes(x.name.toLowerCase().replace("province", "").trim()) || q.includes(x.nameNp));
    if (p) return `**${p.name} (${p.nameNp})** — Capital: ${p.capital}. Area: ${p.areaKm.toLocaleString()} km². Population: ${p.population}. Districts: ${p.districts}. ${p.tagline}`;
    return `Nepal's 7 provinces: ${provinces.map((p) => p.name).join(", ")}. Which one would you like to learn about?`;
  }
  if (/report|रिपोर्ट|issue|समस्या/.test(q)) {
    return `You can report a civic issue in 3 simple steps:\n1. Go to the **Report** page.\n2. Choose a category, your location (province → district → place) and urgency.\n3. Submit — it appears on the **Community** board where neighbours can upvote and the ward can track it.\n\nCategories: ${issueCategories.map((c) => c.label).join(", ")}.`;
  }
  if (/helpline|help|emergency|आपतकालिन/.test(q)) {
    return `Here are Nepal's key emergency numbers:\n🚓 Police: 100\n🔥 Fire: 101\n🚑 Ambulance: 102\n🚦 Traffic: 103\n🆘 National Emergency: 1149\n🌸 Women's Helpline: 1145\n🧒 Child Helpline: 1098\n\nFull list is on the **Emergency** page.`;
  }
  if (/namaste|hello|hi|नमस्ते/.test(q)) {
    return "Namaste! 🙏 I'm **Sathi**, the Nibourly AI. Ask me anything about daily life in Nepal — garbage, water, power cuts, roads, health, education, weather, travel or any district. How can I help you today?";
  }
  return `Namaste! 🙏 I'm **Sathi**, Nibourly's AI for Nepal's society and daily life.\n\n${keyIssue ? "I couldn't reach the Gemini API right now (key issue or rate limit), so I'm answering from my built-in knowledge base.\n\n" : ""}I can help you with:\n• 🗑️ Garbage & waste solutions\n• ⚡ Load-shedding & power cuts\n• 💧 Water scarcity\n• 🛣️ Potholes & roads\n• 🌫️ Air pollution\n• 🚦 Traffic\n• 🏥 Health & helplines\n• 🗺️ Any of Nepal's 77 districts\n\nTry asking: *"What can we do about garbage in Kathmandu?"* or *"Tell me about Mustang."*`;
}
