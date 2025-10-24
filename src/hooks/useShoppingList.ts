"use client";

import { useState } from "react";
import { ShoppingItem, ShoppingList } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_CATEGORIES, STORAGE_KEYS } from "@/lib/constants";

// Helper function to ensure we always have proper Date objects
const createDefaultList = (): ShoppingList => ({
  id: "default",
  name: "My Shopping List",
  items: [],
  categories: DEFAULT_CATEGORIES.map((cat) => cat.id),
  createdAt: new Date(),
  updatedAt: new Date(),
});

export function useShoppingList() {
  const [list, setList] = useLocalStorage<ShoppingList>(
    STORAGE_KEYS.SHOPPING_LIST,
    createDefaultList()
  );
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Add new item
  const addItem = (text: string, category: string = "other") => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      text: text.trim(),
      status: "todo",
      category,
      createdAt: new Date(), // Always use new Date() here
    };

    setList((prev) => ({
      ...prev,
      items: [newItem, ...prev.items],
      updatedAt: new Date(), // Always use new Date() here
    }));
  };

  // Remove item
  const removeItem = (id: string) => {
    setList((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
      updatedAt: new Date(), // Always use new Date() here
    }));
  };

  // Toggle item status
  const toggleItemStatus = (id: string) => {
    setList((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "todo" ? "done" : "todo" }
          : item
      ),
      updatedAt: new Date(), // Always use new Date() here
    }));
  };

  // Buy again (move from done to todo)
  const buyAgain = (id: string) => {
    setList((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, status: "todo" } : item
      ),
      updatedAt: new Date(), // Always use new Date() here
    }));
  };

  // Clear all completed items
  const clearCompleted = () => {
    setList((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.status !== "done"),
      updatedAt: new Date(), // Always use new Date() here
    }));
  };

  // Filtered items based on status and category
  const filteredItems = list.items.filter((item) => {
    const statusMatch = filter === "all" || item.status === filter;
    const categoryMatch =
      selectedCategory === "all" || item.category === selectedCategory;
    return statusMatch && categoryMatch;
  });

  return {
    list,
    filteredItems,
    filter,
    setFilter,
    selectedCategory,
    setSelectedCategory,
    addItem,
    removeItem,
    toggleItemStatus,
    buyAgain,
    clearCompleted,
  };
}
