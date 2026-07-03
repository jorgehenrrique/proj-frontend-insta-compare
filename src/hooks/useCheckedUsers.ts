import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'insta-compare:checked-users';

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

export function useCheckedUsers() {
  const [checked, setChecked] = useState<Set<string>>(() => loadChecked());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
  }, [checked]);

  const toggle = useCallback((username: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(username)) {
        next.delete(username);
      } else {
        next.add(username);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setChecked(new Set()), []);

  return { checked, toggle, clear };
}
