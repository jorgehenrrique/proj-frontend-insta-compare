import { useEffect, useMemo, useState } from 'react';
import type { InstagramProfile, OptionalProfileData } from '../types/instagram';
import {
  getAvailableYears,
  getDefaultDateFilter,
  profileMatchesDateFilter,
  type DateFilterState,
} from '../utils/dateFilter';
import {
  buildProfileContextIndex,
  CONTEXT_FILTER_OPTIONS,
  getProfileContext,
  profileMatchesContextFilter,
  type ContextFilter,
} from '../utils/profileContext';
import { hasOptionalData } from '../utils/parseOptionalProfiles';
import { Checkbox } from './Checkbox';
import { DateFilterPanel } from './DateFilterPanel';
import { ScrollFadeList } from './ScrollFadeList';
import { UserCard } from './UserCard';

type SortOrder = 'recent' | 'alphabetical';

interface ResultsListProps {
  profiles: InstagramProfile[];
  checked: Set<string>;
  onToggle: (username: string) => void;
  optionalData?: OptionalProfileData;
}

export function ResultsList({
  profiles,
  checked,
  onToggle,
  optionalData,
}: ResultsListProps) {
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [hideChecked, setHideChecked] = useState(false);
  const [contextFilter, setContextFilter] = useState<ContextFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterState>(() =>
    getDefaultDateFilter(profiles),
  );

  const availableYears = useMemo(() => getAvailableYears(profiles), [profiles]);

  const contextIndex = useMemo(
    () => (optionalData && hasOptionalData(optionalData) ? buildProfileContextIndex(optionalData) : new Map()),
    [optionalData],
  );

  const showContextFilter = useMemo(() => {
    if (contextIndex.size === 0) return false;
    return CONTEXT_FILTER_OPTIONS.some(
      (opt) =>
        opt.value !== 'all' &&
        profiles.some((p) => profileMatchesContextFilter(p.username, opt.value, contextIndex)),
    );
  }, [contextIndex, profiles]);

  useEffect(() => {
    setDateFilter(getDefaultDateFilter(profiles));
  }, [profiles]);

  useEffect(() => {
    if (contextFilter !== 'all' && !profiles.some((p) => profileMatchesContextFilter(p.username, contextFilter, contextIndex))) {
      setContextFilter('all');
    }
  }, [profiles, contextFilter, contextIndex]);

  const profilesWithoutDate = useMemo(
    () => profiles.filter((p) => p.followedAt === null).length,
    [profiles],
  );

  const visibleProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return profiles
      .filter((p) => !normalizedQuery || p.username.includes(normalizedQuery))
      .filter((p) => !hideChecked || !checked.has(p.username))
      .filter((p) => profileMatchesDateFilter(p.followedAt, dateFilter))
      .filter((p) => profileMatchesContextFilter(p.username, contextFilter, contextIndex))
      .sort((a, b) => {
        if (sortOrder === 'alphabetical') {
          return a.username.localeCompare(b.username);
        }
        return (b.followedAt ?? 0) - (a.followedAt ?? 0);
      });
  }, [profiles, query, hideChecked, checked, sortOrder, dateFilter, contextFilter, contextIndex]);

  if (profiles.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
        <div>
          <p className="text-lg font-medium text-ink">Ninguém por aqui! 🎉</p>
          <p className="mt-1 text-sm text-ink-muted">
            Todo mundo que você segue também te segue de volta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por @usuário..."
          className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-brand-mid sm:max-w-xs"
        />

        <div className="flex flex-wrap items-center gap-3">
          {showContextFilter && (
            <select
              value={contextFilter}
              onChange={(e) => setContextFilter(e.target.value as ContextFilter)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-mid"
            >
              {CONTEXT_FILTER_OPTIONS.filter(
                (opt) =>
                  opt.value === 'all' ||
                  profiles.some((p) =>
                    profileMatchesContextFilter(p.username, opt.value, contextIndex),
                  ),
              ).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-mid"
          >
            <option value="recent">Seguidos recentemente</option>
            <option value="alphabetical">Ordem alfabética</option>
          </select>

          <Checkbox
            checked={hideChecked}
            onChange={setHideChecked}
            labelClassName="text-sm text-ink-muted"
          >
            Ocultar revisados
          </Checkbox>
        </div>
      </div>

      <DateFilterPanel
        availableYears={availableYears}
        value={dateFilter}
        onChange={setDateFilter}
        label="Filtrar por data de follow"
      />

      <p className="text-sm text-ink-muted">
        {visibleProfiles.length} de {profiles.length} perfis
        {dateFilter.enabled && profilesWithoutDate > 0 && (
          <span> · {profilesWithoutDate} sem data ocultos</span>
        )}
      </p>

      <ScrollFadeList
        wrapClassName="flex min-h-0 flex-1 flex-col"
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5"
      >
        {visibleProfiles.map((profile) => (
          <UserCard
            key={profile.username}
            profile={profile}
            checked={checked.has(profile.username)}
            onToggle={onToggle}
            context={getProfileContext(profile.username, contextIndex)}
          />
        ))}
      </ScrollFadeList>
    </div>
  );
}
