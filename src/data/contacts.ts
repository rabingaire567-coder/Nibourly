import type { Contact } from "../types";

export const emergencyContacts: Contact[] = [
  { service: "Nepal Police", number: "100", icon: "🚓", note: "All-purpose police emergency" },
  { service: "Fire Brigade", number: "101", icon: "🔥", note: "Fire and rescue service" },
  { service: "Ambulance", number: "102", icon: "🚑", note: "Medical emergency ambulance" },
  { service: "Traffic Police", number: "103", icon: "🚦", note: "Traffic accidents & violations" },
  { service: "National Emergency Helpline", number: "1149", icon: "🆘", note: "Disasters, floods, earthquakes" },
  { service: "Women's Helpline", number: "1145", icon: "🌸", note: "Violence & harassment support" },
  { service: "Child Helpline", number: "1098", icon: "🧒", note: "Child protection & rights" },
  { service: "Tourism Police", number: "1144", icon: "🎒", note: "Help for tourists in Nepal" },
  { service: "Cyber Bureau", number: "1129", icon: "💻", note: "Online fraud & cyber crime" },
  { service: "NEA Power Failure", number: "1333", icon: "⚡", note: "Report electricity outages" },
];

export const cityServices = [
  { place: "Kathmandu (all wards)", number: "1660-01-499999", service: "KUKL water complaints", icon: "💧" },
  { place: "Kathmandu Valley", number: "1180", service: "Valley emergency services", icon: "🏙️" },
  { place: "All Nepal", number: "1595", service: "NEA electricity app", icon: "⚡" },
  { place: "Blood requirement", number: "1054", service: "Nepal Red Cross blood info", icon: "🩸" },
  { place: "Poison information", number: "01-4251010", service: "National Poison Info Centre", icon: "☠️" },
];
