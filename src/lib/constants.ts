import { Category } from "@/types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "groceries", name: "Groceries", color: "#4CAF50", icon: "🛒" },
  { id: "household", name: "Household", color: "#FF9800", icon: "🏠" },
  { id: "pharmacy", name: "Pharmacy", color: "#F44336", icon: "💊" },
  { id: "electronics", name: "Electronics", color: "#2196F3", icon: "📱" },
  { id: "clothing", name: "Clothing", color: "#9C27B0", icon: "👕" },
  { id: "other", name: "Other", color: "#607D8B", icon: "📦" },
];

export const STORAGE_KEYS = {
  SHOPPING_LIST: "shopping-list-data",
  SETTINGS: "shopping-list-settings",
};
