import { useState, useEffect } from 'react';

/**
 * Simple debounce hook. Returns a debounced value after the specified delay.
 * Useful for throttling expensive operations like API calls when the user
 * is typing.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounced;
}
