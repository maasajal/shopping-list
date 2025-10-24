"use client";

import { useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state with value from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Convert date strings back to Date objects
        return reviveDates(parsed) as T;
      }
      return initialValue;
    } catch (error) {
      console.log(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.log(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

// Helper function to convert date strings back to Date objects
function reviveDates(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Check if it's a date string (ISO format)
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
      const date = new Date(obj);
      return isNaN(date.getTime()) ? obj : date;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(reviveDates);
  }

  if (typeof obj === "object") {
    const revived: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      revived[key] = reviveDates(value);
    }
    return revived;
  }

  return obj;
}
