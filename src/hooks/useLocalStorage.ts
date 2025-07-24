import { useState, useEffect } from "react";

/**
 *
 * @param key The key under which to store the value in localStorage
 * @param defaultValue The default value to use if no value is found in localStorage
 * @returns A tuple containing the current value and a function to update it
 * @author Madhusudhana RK
 * @date 2025-07-23
 */

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
