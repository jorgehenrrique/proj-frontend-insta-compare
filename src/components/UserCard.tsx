import type { InstagramProfile } from '../types/instagram';

interface UserCardProps {
  profile: InstagramProfile;
  checked: boolean;
  onToggle: (username: string) => void;
}

function formatDate(timestamp: number | null): string | null {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function UserCard({ profile, checked, onToggle }: UserCardProps) {
  const followedAt = formatDate(profile.followedAt);

  return (
    <li
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        checked ? 'border-border bg-surface-muted opacity-60' : 'border-border bg-surface'
      }`}
    >
      <a
        href={profile.profileUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-start via-brand-mid to-brand-end text-sm font-semibold text-white uppercase"
      >
        {profile.username.slice(0, 2)}
      </a>

      <div className="min-w-0 flex-1">
        <a
          href={profile.profileUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="truncate font-medium text-brand-mid hover:underline"
        >
          @{profile.username}
        </a>
        {followedAt && <p className="text-xs text-ink-muted">Você seguiu em {followedAt}</p>}
      </div>

      <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-ink-muted">
        <span className="hidden sm:inline">Revisado</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(profile.username)}
          className="h-5 w-5 cursor-pointer rounded border-border accent-brand-mid"
        />
      </label>
    </li>
  );
}
