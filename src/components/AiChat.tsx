import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store";
import { askSathi } from "../lib/ai";

const QUICK = [
  "What can we do about garbage in Kathmandu?",
  "How do we deal with load-shedding?",
  "Tell me about Mustang district",
  "Nepal emergency helpline numbers",
];

function id() {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const { chat, addChat } = useApp();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat, busy]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput("");
    addChat({ id: id(), role: "user", text: msg, time: Date.now() });
    setBusy(true);
    const history = [...chat, { role: "user" as const, text: msg }];
    try {
      const res = await askSathi(msg, history.map((m) => ({ role: m.role, text: m.text })));
      addChat({
        id: id(),
        role: "ai",
        text: res.text,
        time: Date.now(),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="chat-body" ref={bodyRef}>
        {chat.length === 0 && !busy && (
          <div className="msg ai">
            Namaste! 🙏 I'm <b>Sathi</b>, the Nibourly AI. Ask me anything about daily life in Nepal — garbage, water,
            power cuts, roads, health, or any district.{"\n"}
            <span className="src">Powered by Gemini AI + Nibourly knowledge base</span>
          </div>
        )}
        {chat.map((m) => (
          <div key={m.id} className={`msg ${m.role}`}>
            {m.text}
            {m.role === "ai" && <span className="src">✨ Sathi · Gemini AI</span>}
          </div>
        ))}
        {busy && (
          <div className="typing-indicator">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
      <div className="chat-quick">
        {QUICK.slice(0, compact ? 2 : 4).map((q) => (
          <button key={q} onClick={() => send(q)} disabled={busy}>
            {q.length > 34 ? q.slice(0, 33) + "…" : q}
          </button>
        ))}
      </div>
      <div className="chat-input">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask Sathi anything…"
        />
        <button className="send-btn" onClick={() => send()} disabled={busy || !input.trim()} aria-label="Send">
          ➤
        </button>
      </div>
    </>
  );
}

export default function AiChat() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && (
        <div className="chat-window">
          <div className="chat-head">
            <div className="chat-ava">🤖</div>
            <div style={{ flex: 1 }}>
              <h4>Sathi — Nibourly AI</h4>
              <p>● Online · Nepal society expert</p>
            </div>
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close chat" title="Close">
              ✕
            </button>
          </div>
          <ChatPanel compact />
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Open AI chat" title="Chat with Sathi">
        {open ? "✕" : "✨"}
        <span className="spark" />
      </button>
    </>
  );
}
