import { ShoppingList } from "@/types";

// Define proper types for the compressed data structure
interface CompressedItem {
  t: string; // text
  c: string; // category
}

interface CompressedData {
  n: string; // name
  i: CompressedItem[];
}

// Generate a much shorter shareable link
export function generateShortShareableLink(list: ShoppingList): string {
  if (typeof window === "undefined") {
    return "";
  }

  // Compress the data more efficiently
  const compressedData: CompressedData = {
    n: list.name, // name
    i: list.items
      .map((item) => ({
        t: item.text, // text
        c: item.category, // category
        // Skip status since we usually want to share todo items
      }))
      .filter((item) => item.t.trim().length > 0), // Remove empty items
  };

  const jsonString = JSON.stringify(compressedData);
  const base64 = btoa(unescape(encodeURIComponent(jsonString)))
    .replace(/\+/g, "-") // Replace + with -
    .replace(/\//g, "_") // Replace / with _
    .replace(/=+$/, ""); // Remove padding =

  return `${window.location.origin}/s/${base64}`;
}

export function parseShortShareableLink(
  url: string
): { name: string; items: Array<{ text: string; category: string }> } | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const base64Data = pathParts[pathParts.length - 1];

    if (!base64Data) return null;

    // Add padding back if needed and convert URL-safe base64 to regular base64
    let paddedBase64 = base64Data;
    while (paddedBase64.length % 4) {
      paddedBase64 += "=";
    }
    const regularBase64 = paddedBase64.replace(/-/g, "+").replace(/_/g, "/");

    const jsonString = decodeURIComponent(escape(atob(regularBase64)));
    const data: CompressedData = JSON.parse(jsonString);

    // Convert back to full format
    return {
      name: data.n,
      items: data.i.map((item: CompressedItem) => ({
        text: item.t,
        category: item.c,
        status: "todo", // Default status for shared items
      })),
    };
  } catch (error) {
    console.error("Error parsing short shareable link:", error);
    return null;
  }
}
