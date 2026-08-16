import type { IssueCategory } from "../types";

export const issueCategories: IssueCategory[] = [
  { id: "roads", label: "Roads & Potholes", labelNp: "सडक र खाल्डा", icon: "🛣️", color: "#f59e0b" },
  { id: "garbage", label: "Garbage & Waste", labelNp: "फोहोर व्यवस्थापन", icon: "🗑️", color: "#84cc16" },
  { id: "water", label: "Water Supply", labelNp: "खानेपानी", icon: "💧", color: "#38bdf8" },
  { id: "electricity", label: "Electricity & Power", labelNp: "विद्युत", icon: "⚡", color: "#facc15" },
  { id: "health", label: "Health & Sanitation", labelNp: "स्वास्थ्य र सरसफाइ", icon: "🏥", color: "#f43f5e" },
  { id: "education", label: "Education", labelNp: "शिक्षा", icon: "🎓", color: "#a78bfa" },
  { id: "traffic", label: "Traffic & Transport", labelNp: "यातायात", icon: "🚦", color: "#fb7185" },
  { id: "pollution", label: "Pollution & Environment", labelNp: "प्रदूषण", icon: "🌫️", color: "#34d399" },
  { id: "disaster", label: "Disaster & Risk", labelNp: "विपद्", icon: "🌊", color: "#fb923c" },
  { id: "safety", label: "Public Safety", labelNp: "सुरक्षा", icon: "🛡️", color: "#818cf8" },
  { id: "animal", label: "Stray Animals", labelNp: "छाडा पशु", icon: "🐕", color: "#fbbf24" },
  { id: "other", label: "Other", labelNp: "अन्य", icon: "📌", color: "#94a3b8" },
];

export const urgencyLevels = [
  { id: "low", label: "Low", color: "#34d399", hint: "Minor, can wait" },
  { id: "medium", label: "Medium", color: "#fbbf24", hint: "Needs attention soon" },
  { id: "high", label: "High", color: "#fb923c", hint: "Affects many people" },
  { id: "critical", label: "Critical", color: "#ef4444", hint: "Immediate danger" },
] as const;

export function categoryById(id: string): IssueCategory {
  return issueCategories.find((c) => c.id === id) ?? issueCategories[issueCategories.length - 1];
}
