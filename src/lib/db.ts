import type { ReportedIssue, ChatMsg, User } from "../types";

const K = {
  reports: "nb_reports",
  favs: "nb_favs",
  chat: "nb_chat",
  user: "nb_user",
  theme: "nb_theme",
  apikey: "nb_apikey",
  savedSolutions: "nb_saved",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

export const db = {
  getReports(): ReportedIssue[] {
    return read<ReportedIssue[]>(K.reports, []);
  },
  addReport(data: Omit<ReportedIssue, "id" | "createdAt" | "status" | "upvotes" | "downvotes">): ReportedIssue {
    const report: ReportedIssue = {
      ...data,
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      status: "open",
      upvotes: 0,
      downvotes: 0,
    };
    write(K.reports, [report, ...db.getReports()]);
    return report;
  },
  vote(id: string, dir: "up" | "down"): void {
    write(
      K.reports,
      db.getReports().map((r) =>
        r.id === id ? { ...r, upvotes: r.upvotes + (dir === "up" ? 1 : 0), downvotes: r.downvotes + (dir === "down" ? 1 : 0) } : r
      )
    );
  },
  setStatus(id: string, status: ReportedIssue["status"]): void {
    write(K.reports, db.getReports().map((r) => (r.id === id ? { ...r, status } : r)));
  },
  deleteReport(id: string): void {
    write(K.reports, db.getReports().filter((r) => r.id !== id));
  },

  getSaved(): string[] {
    return read<string[]>(K.savedSolutions, []);
  },
  toggleSaved(id: string): string[] {
    const cur = db.getSaved();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(K.savedSolutions, next);
    return next;
  },
  isSaved(id: string): boolean {
    return db.getSaved().includes(id);
  },

  getChat(): ChatMsg[] {
    return read<ChatMsg[]>(K.chat, []);
  },
  saveChat(msgs: ChatMsg[]): void {
    write(K.chat, msgs.slice(-80));
  },

  getUser(): User {
    return read<User>(K.user, { name: "", location: "", role: "" });
  },
  setUser(user: User): void {
    write(K.user, user);
  },

  getTheme(): "dark" | "light" {
    return read<"dark" | "light">(K.theme, "dark");
  },
  setTheme(t: "dark" | "light"): void {
    write(K.theme, t);
  },

  getApiKey(): string {
    try {
      return localStorage.getItem(K.apikey) ?? "";
    } catch {
      return "";
    }
  },
  setApiKey(key: string): void {
    try {
      localStorage.setItem(K.apikey, key.trim());
    } catch {
      /* ignore */
    }
  },
  clearAll(): void {
    Object.values(K).forEach((k) => localStorage.removeItem(k));
  },
};

export function seedDemoReports(): void {
  if (db.getReports().length > 0) return;
  const now = Date.now();
  const demo: ReportedIssue[] = [
    {
      id: "demo_1", category: "roads", title: "Large pothole near New Baneshwor junction",
      description: "A deep pothole appears every monsoon at the New Baneshwor-Bhaktapur road junction. Two-wheelers have skidded here at least 3 times this week.",
      province: "Bagmati Province", district: "Kathmandu", place: "New Baneshwor", urgency: "high",
      name: "Sita Sharma", contact: "98********", status: "in-progress", upvotes: 87, downvotes: 2, createdAt: now - 86400000 * 2,
    },
    {
      id: "demo_2", category: "water", title: "No water in Chabhail for 3 days",
      description: "Households in Chabhail tole have had no pipeline water for three days. Tankers are charging 10x the normal rate.",
      province: "Bagmati Province", district: "Kathmandu", place: "Chabhail", urgency: "critical",
      name: "Ram Thapa", contact: "98********", status: "open", upvotes: 134, downvotes: 1, createdAt: now - 86400000,
    },
    {
      id: "demo_3", category: "garbage", title: "Waste pile on Maharajgunj walkway",
      description: "Garbage has been dumped on the walking track near Maharajgunj for over a week. Stray dogs and smell are becoming a problem.",
      province: "Bagmati Province", district: "Kathmandu", place: "Maharajgunj", urgency: "medium",
      name: "Prakash Gurung", contact: "", status: "open", upvotes: 42, downvotes: 0, createdAt: now - 43200000,
    },
    {
      id: "demo_4", category: "traffic", title: "Traffic jam at Kalanki every evening",
      description: "The Kalanki underpass approach jams for 45+ minutes every evening after 5pm. Pedestrians also have to cross the road dangerously.",
      province: "Bagmati Province", district: "Kathmandu", place: "Kalanki", urgency: "medium",
      name: "Anita K.C.", contact: "98********", status: "open", upvotes: 61, downvotes: 3, createdAt: now - 21600000,
    },
    {
      id: "demo_5", category: "electricity", title: "Frequent outages in Birtamode market",
      description: "The market area of Birtamode loses power 4-5 times a day, spoiling shop freezers and hampering businesses.",
      province: "Koshi Province", district: "Jhapa", place: "Birtamode", urgency: "high",
      name: "Deepak Rai", contact: "98********", status: "resolved", upvotes: 55, downvotes: 1, createdAt: now - 86400000 * 5,
    },
  ];
  write(K.reports, demo);
}
