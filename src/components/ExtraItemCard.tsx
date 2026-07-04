import type { ExtraListItem } from '../utils/optionalExtrasList';
import { EXTRA_DATE_LABELS } from '../utils/optionalExtrasList';
import { Checkbox } from './Checkbox';

interface ExtraItemCardProps {
  item: ExtraListItem;
  checked: boolean;
  onToggle: (itemId: string) => void;
}

const CATEGORY_STYLES: Record<ExtraListItem['category'], string> = {
  closeFriends: 'border-brand-mid/40 bg-brand-mid/10 text-brand-mid',
  restricted: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  hideStoryFrom: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400',
  pendingFollowRequests: 'border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-400',
  recentFollowRequests: 'border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-400',
  recentlyUnfollowed: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-400',
  blocked: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400',
  removedSuggestions: 'border-zinc-500/40 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  followingHashtags: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
};

function formatDate(timestamp: number | null): string | null {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function displayUsername(item: ExtraListItem): string {
  if (item.category === 'followingHashtags') {
    return item.displayName ?? `#${item.username}`;
  }
  return `@${item.username}`;
}

function avatarLabel(item: ExtraListItem): string {
  if (item.category === 'followingHashtags') {
    return item.username.slice(0, 2).toUpperCase();
  }
  return item.username.slice(0, 2);
}

export function ExtraItemCard({ item, checked, onToggle }: ExtraItemCardProps) {
  const dateLabel = EXTRA_DATE_LABELS[item.category] ?? 'Em';
  const formattedDate = formatDate(item.timestamp);

  return (
    <li
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        checked ? 'border-border bg-surface-muted opacity-60' : 'border-border bg-surface'
      }`}
    >
      <a
        href={item.profileUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-start via-brand-mid to-brand-end text-sm font-semibold text-white uppercase"
      >
        {avatarLabel(item)}
      </a>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium leading-tight ${CATEGORY_STYLES[item.category]}`}
          >
            {item.categoryLabel}
          </span>
        </div>
        <a
          href={item.profileUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="truncate font-medium text-brand-mid hover:underline"
        >
          {displayUsername(item)}
        </a>
        {item.displayName &&
          item.category !== 'followingHashtags' &&
          item.displayName !== item.username && (
            <p className="truncate text-xs text-ink-muted">{item.displayName}</p>
          )}
        {formattedDate && (
          <p className="text-xs text-ink-muted">
            {dateLabel} {formattedDate}
          </p>
        )}
      </div>

      <Checkbox
        checked={checked}
        onChange={() => onToggle(item.id)}
        size="md"
        labelPosition="start"
        labelClassName="text-sm text-ink-muted"
        className="shrink-0"
      >
        <span className="hidden sm:inline">Revisado</span>
      </Checkbox>
    </li>
  );
}
