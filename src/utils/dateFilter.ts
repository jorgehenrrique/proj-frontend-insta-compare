import type { InstagramProfile } from '../types/instagram';

export interface YearMonth {
  year: number;
  month: number; // 1–12
}

export interface DateFilterState {
  enabled: boolean;
  from: YearMonth;
  untilPresent: boolean;
  to: YearMonth;
}

const MONTH_LABELS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

export function getMonthLabels(): readonly string[] {
  return MONTH_LABELS;
}

export function getYearMonthFromTimestamp(timestamp: number): YearMonth {
  const date = new Date(timestamp * 1000);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function yearMonthRangeStart({ year, month }: YearMonth): number {
  return Math.floor(Date.UTC(year, month - 1, 1) / 1000);
}

export function yearMonthRangeEnd({ year, month }: YearMonth): number {
  // Last second of the month (UTC)
  return Math.floor(Date.UTC(year, month, 0, 23, 59, 59) / 1000);
}

export function compareYearMonth(a: YearMonth, b: YearMonth): number {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}

export function isDateFilterRangeInvalid(filter: DateFilterState): boolean {
  if (!filter.enabled || filter.untilPresent) return false;
  return compareYearMonth(filter.from, filter.to) > 0;
}

export function profileMatchesDateFilter(
  followedAt: number | null,
  filter: DateFilterState,
): boolean {
  if (!filter.enabled) return true;
  if (followedAt === null) return false;
  if (isDateFilterRangeInvalid(filter)) return true;

  const fromStart = yearMonthRangeStart(filter.from);
  const toEnd = filter.untilPresent
    ? Math.floor(Date.now() / 1000)
    : yearMonthRangeEnd(filter.to);

  return followedAt >= fromStart && followedAt <= toEnd;
}

export function getAvailableYears(profiles: InstagramProfile[]): number[] {
  const years = new Set<number>();
  for (const profile of profiles) {
    if (profile.followedAt !== null) {
      years.add(getYearMonthFromTimestamp(profile.followedAt).year);
    }
  }
  return [...years].sort((a, b) => a - b);
}

function currentYearMonth(): YearMonth {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function getDefaultDateFilter(profiles: InstagramProfile[]): DateFilterState {
  const timestamps = profiles
    .map((p) => p.followedAt)
    .filter((ts): ts is number => ts !== null);

  if (timestamps.length === 0) {
    const now = currentYearMonth();
    return {
      enabled: false,
      from: { year: now.year, month: 1 },
      untilPresent: true,
      to: now,
    };
  }

  const oldest = timestamps.reduce((min, ts) => (ts < min ? ts : min), timestamps[0]);
  const newest = timestamps.reduce((max, ts) => (ts > max ? ts : max), timestamps[0]);

  return {
    enabled: false,
    from: getYearMonthFromTimestamp(oldest),
    untilPresent: true,
    to: getYearMonthFromTimestamp(newest),
  };
}

export function dateFilterForYear(year: number): Pick<DateFilterState, 'from' | 'to' | 'untilPresent'> {
  return {
    from: { year, month: 1 },
    to: { year, month: 12 },
    untilPresent: false,
  };
}
