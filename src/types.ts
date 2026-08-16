export interface Province {
  id: number;
  name: string;
  nameNp: string;
  capital: string;
  areaKm: number;
  population: string;
  districts: number;
  tagline: string;
}

export interface District {
  provinceId: number;
  name: string;
  nameNp: string;
  hq: string;
  areaKm: number;
  population: string;
  famous: string[];
  blurb: string;
}

export interface City {
  name: string;
  nameNp: string;
  province: string;
  district: string;
  known: string;
  emoji: string;
}

export interface IssueCategory {
  id: string;
  label: string;
  labelNp: string;
  icon: string;
  color: string;
}

export interface ReportedIssue {
  id: string;
  category: string;
  title: string;
  description: string;
  province: string;
  district: string;
  place: string;
  urgency: "low" | "medium" | "high" | "critical";
  name: string;
  contact: string;
  status: "open" | "in-progress" | "resolved";
  upvotes: number;
  downvotes: number;
  createdAt: number;
}

export interface Solution {
  id: string;
  topic: string;
  icon: string;
  color: string;
  problem: string;
  causes: string[];
  solutions: string[];
  community: string;
  help: string;
}

export interface Contact {
  service: string;
  number: string;
  icon: string;
  note: string;
}

export interface ChatMsg {
  id: string;
  role: "user" | "ai";
  text: string;
  time: number;
}

export interface User {
  name: string;
  location: string;
  role: string;
}
