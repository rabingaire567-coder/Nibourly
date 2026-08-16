import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { db } from "./db";
import type { User, ChatMsg } from "../types";

interface AppState {
  user: User;
  theme: "dark" | "light";
  saved: string[];
  chat: ChatMsg[];
  setUser: (u: User) => void;
  toggleTheme: () => void;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  setChat: (msgs: ChatMsg[]) => void;
  addChat: (msg: ChatMsg) => void;
  clearChat: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(() => db.getUser());
  const [theme, setTheme] = useState<"dark" | "light">(() => db.getTheme());
  const [saved, setSaved] = useState<string[]>(() => db.getSaved());
  const [chat, setChatState] = useState<ChatMsg[]>(() => db.getChat());

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    db.setTheme(theme);
  }, [theme]);

  const value = useMemo<AppState>(
    () => ({
      user,
      theme,
      saved,
      chat,
      setUser: (u) => {
        setUserState(u);
        db.setUser(u);
      },
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      toggleSaved: (id) => setSaved(db.toggleSaved(id)),
      isSaved: (id) => saved.includes(id),
      setChat: (msgs) => {
        setChatState(msgs);
        db.saveChat(msgs);
      },
      addChat: (msg) => {
        setChatState((prev) => {
          const next = [...prev, msg];
          db.saveChat(next);
          return next;
        });
      },
      clearChat: () => {
        setChatState([]);
        db.saveChat([]);
      },
    }),
    [user, theme, saved, chat]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
