import { useEffect, useState } from 'react';

/**
 * useState that mirrors its value to localStorage.
 * `sanitize` lets callers drop stale or malformed data on load
 * (for example a product id that no longer exists).
 * Storage can be unavailable (private mode, blocked site data),
 * so every access is wrapped and the app keeps working in memory.
 */
export function useLocalStorage(key, initialValue, sanitize = (v) => v) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : sanitize(JSON.parse(raw));
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Storage full or blocked: keep working with in-memory state. */
    }
  }, [key, value]);

  return [value, setValue];
}
