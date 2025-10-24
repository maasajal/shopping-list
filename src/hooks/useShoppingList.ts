"use client";

import { useState, useEffect } from "react";
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

// Helper to ensure dates are properly handled when loading from localStorage
const ensureDateObjects = (list: ShoppingList): ShoppingList => ({
  ...list,
  createdAt: new Date(list.createdAt),
  updatedAt: new Date(list.updatedAt),
  items: list.items.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
  })),
});

export function useShoppingList() {
  const [rawList, setRawList] = useLocalStorage<ShoppingList>(
    STORAGE_KEYS.SHOPPING_LIST,
    createDefaultList()
  );
  const [list, setList] = useState<ShoppingList>(createDefaultList());
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Ensure dates are proper Date objects when loading from localStorage
  useEffect(() => {
    setList(ensureDateObjects(rawList));
  }, [rawList]);

  // Add new item
  const addItem = (text: string, category: string = "other") => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      text: text.trim(),
      status: "todo",
      category,
      createdAt: new Date(),
    };

    setRawList((prev) => ({
      ...prev,
      items: [newItem, ...prev.items],
      updatedAt: new Date(),
    }));
  };

  // Remove item
  const removeItem = (id: string) => {
    setRawList((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
      updatedAt: new Date(),
    }));
  };

  // Toggle item status
  const toggleItemStatus = (id: string) => {
    setRawList((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "todo" ? "done" : "todo" }
          : item
      ),
      updatedAt: new Date(),
    }));
  };

  // Buy again (move from done to todo)
  const buyAgain = (id: string) => {
    setRawList((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, status: "todo" } : item
      ),
      updatedAt: new Date(),
    }));
  };

  // Clear all completed items
  const clearCompleted = () => {
    setRawList((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.status !== "done"),
      updatedAt: new Date(),
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
