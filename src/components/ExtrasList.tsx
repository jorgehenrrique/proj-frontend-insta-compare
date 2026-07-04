import { useEffect, useMemo, useState } from 'react';
import type { OptionalProfileData } from '../types/instagram';
import type { ContextInsight } from '../utils/profileContext';
import {
  getAvailableYearsFromTimestamps,
  getDefaultDateFilterFromTimestamps,
  timestampMatchesDateFilter,
  type DateFilterState,
} from '../utils/dateFilter';
import {
  flattenOptionalExtras,
  getExtraCategoryFilterOptions,
  type ExtraListCategory,
} from '../utils/optionalExtrasList';
import { Checkbox } from './Checkbox';
import { DateFilterPanel } from './DateFilterPanel';
import { ExtraItemCard } from './ExtraItemCard';
import { ScrollFadeList } from './ScrollFadeList';

type SortOrder = 'recent' | 'alphabetical' | 'category';

interface ExtrasListProps {
  optionalData: OptionalProfileData;
  crossRefInsights: ContextInsight[];
  checked: Set<string>;
  onToggle: (itemId: string) => void;
}

export function ExtrasList({
  optionalData,
  crossRefInsights,
  checked,
  onToggle,
}: ExtrasListProps) {
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [hideChecked, setHideChecked] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | ExtraListCategory>('all');

  const allItems = useMemo(() => flattenOptionalExtras(optionalData), [optionalData]);

  const [dateFilter, setDateFilter] = useState<DateFilterState>(() =>
    getDefaultDateFilterFromTimestamps(allItems.map((i) => i.timestamp)),
  );

  const availableYears = useMemo(
    () => getAvailableYearsFromTimestamps(allItems.map((i) => i.timestamp)),
    [allItems],
  );

  const categoryOptions = useMemo(() => getExtraCategoryFilterOptions(allItems), [allItems]);

  useEffect(() => {
    setDateFilter(getDefaultDateFilterFromTimestamps(allItems.map((i) => i.timestamp)));
  }, [allItems]);

  useEffect(() => {
    if (
      categoryFilter !== 'all' &&
      !allItems.some((item) => item.category === categoryFilter)
    ) {
      setCategoryFilter('all');
    }
  }, [allItems, categoryFilter]);

  const itemsWithoutDate = useMemo(
    () => allItems.filter((i) => i.timestamp === null).length,
    [allItems],
  );

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allItems
      .filter(
        (item) =>
          !normalizedQuery ||
          item.username.includes(normalizedQuery) ||
          item.displayName?.toLowerCase().includes(normalizedQuery),
      )
      .filter((item) => !hideChecked || !checked.has(item.id))
      .filter((item) => timestampMatchesDateFilter(item.timestamp, dateFilter))
      .filter((item) => categoryFilter === 'all' || item.category === categoryFilter)
      .sort((a, b) => {
        if (sortOrder === 'alphabetical') {
          return a.username.localeCompare(b.username);
        }
        if (sortOrder === 'category') {
          const byCategory = a.categoryLabel.localeCompare(b.categoryLabel);
          if (byCategory !== 0) return byCategory;
          return a.username.localeCompare(b.username);
        }
        return (b.timestamp ?? 0) - (a.timestamp ?? 0);
      });
  }, [allItems, query, hideChecked, checked, dateFilter, categoryFilter, sortOrder]);

  if (allItems.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
        <p className="text-sm text-ink-muted">Nenhum conteúdo extra carregado.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {crossRefInsights.length > 0 && (
        <ul className="shrink-0 flex flex-col gap-2">
          {crossRefInsights.map((insight) => (
            <li
              key={insight.id}
              className="rounded-lg border border-brand-mid/20 bg-brand-mid/5 px-3 py-2 text-sm"
            >
              <span className="font-semibold text-brand-mid">{insight.count}</span>{' '}
              <span className="text-ink">{insight.description}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por @usuário ou nome..."
          className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-brand-mid sm:max-w-xs"
        />

        <div className="flex flex-wrap items-center gap-3">
          {categoryOptions.length > 1 && (
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as 'all' | ExtraListCategory)
              }
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-mid"
            >
              <option value="all">Todas categorias</option>
              {categoryOptions.map((opt) => (
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
            <option value="recent">Mais recentes</option>
            <option value="alphabetical">Ordem alfabética</option>
            <option value="category">Por categoria</option>
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
        label="Filtrar por data"
      />

      <p className="text-sm text-ink-muted">
        {visibleItems.length} de {allItems.length} registros
        {dateFilter.enabled && itemsWithoutDate > 0 && (
          <span> · {itemsWithoutDate} sem data ocultos</span>
        )}
        {checked.size > 0 && (
          <span>
            {' '}
            · {allItems.filter((i) => checked.has(i.id)).length} revisados
          </span>
        )}
      </p>

      <ScrollFadeList
        wrapClassName="flex min-h-0 flex-1 flex-col"
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5"
      >
        {visibleItems.map((item) => (
          <ExtraItemCard
            key={item.id}
            item={item}
            checked={checked.has(item.id)}
            onToggle={onToggle}
          />
        ))}
      </ScrollFadeList>
    </div>
  );
}
