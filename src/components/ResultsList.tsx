import { useMemo, useState } from 'react';
import type { InstagramProfile } from '../types/instagram';
import { UserCard } from './UserCard';

type SortOrder = 'recent' | 'alphabetical';

interface ResultsListProps {
  profiles: InstagramProfile[];
  checked: Set<string>;
  onToggle: (username: string) => void;
}

export function ResultsList({ profiles, checked, onToggle }: ResultsListProps) {
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [hideChecked, setHideChecked] = useState(false);

  const visibleProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return profiles
      .filter((p) => !normalizedQuery || p.username.includes(normalizedQuery))
      .filter((p) => !hideChecked || !checked.has(p.username))
      .sort((a, b) => {
        if (sortOrder === 'alphabetical') {
          return a.username.localeCompare(b.username);
        }
        return (b.followedAt ?? 0) - (a.followedAt ?? 0);
      });
  }, [profiles, query, hideChecked, checked, sortOrder]);

  if (profiles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
        <p className="text-lg font-medium text-ink">Ninguém por aqui! 🎉</p>
        <p className="mt-1 text-sm text-ink-muted">Todo mundo que você segue também te segue de volta.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por @usuário..."
          className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-brand-mid sm:max-w-xs"
        />

        <div className="flex items-center gap-3">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-mid"
          >
            <option value="recent">Seguidos recentemente</option>
            <option value="alphabetical">Ordem alfabética</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={hideChecked}
              onChange={(e) => setHideChecked(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-brand-mid"
            />
            Ocultar revisados
          </label>
        </div>
      </div>

      <p className="text-sm text-ink-muted">
        {visibleProfiles.length} de {profiles.length} perfis
      </p>

      <ul className="scrollbar-thin flex max-h-[560px] flex-col gap-2 overflow-y-auto pr-1">
        {visibleProfiles.map((profile) => (
          <UserCard key={profile.username} profile={profile} checked={checked.has(profile.username)} onToggle={onToggle} />
        ))}
      </ul>
    </div>
  );
}
