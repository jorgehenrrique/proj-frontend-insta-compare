import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'insta-compare:checked-extras';

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export function useCheckedExtras() {
  const [checked, setChecked] = useState<Set<string>>(() => loadChecked());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
  }, [checked]);

  const toggle = useCallback((itemId: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setChecked(new Set()), []);

  return { checked, toggle, clear };
}
