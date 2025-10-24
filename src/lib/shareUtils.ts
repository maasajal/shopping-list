import { ShoppingList } from "@/types";

export function generateShareableLink(list: ShoppingList): string {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return ""; // Return empty string during SSR
  }

  // Create a simple shareable URL with list data
  const listData = {
    name: list.name,
    items: list.items.map((item) => ({
      text: item.text,
      status: item.status,
      category: item.category,
    })),
  };

  const jsonString = JSON.stringify(listData);
  // Use btoa for browser compatibility
  const base64 = btoa(unescape(encodeURIComponent(jsonString)));
  return `${window.location.origin}/share?data=${encodeURIComponent(base64)}`;
}

export function parseShareableLink(
  url: string
): {
  name: string;
  items: Array<{ text: string; status: string; category: string }>;
} | null {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const urlObj = new URL(url);
    const base64Data = urlObj.searchParams.get("data");

    if (!base64Data) return null;

    // Use atob for browser compatibility
    const jsonString = decodeURIComponent(escape(atob(base64Data)));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing shareable link:", error);
    return null;
  }
}
