import type { InstagramProfile, ProfileContext } from '../types/instagram';
import { Checkbox } from './Checkbox';
import { ProfileBadges } from './ProfileBadges';

interface UserCardProps {
  profile: InstagramProfile;
  checked: boolean;
  onToggle: (username: string) => void;
  context?: ProfileContext | null;
}

function formatDate(timestamp: number | null): string | null {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function UserCard({ profile, checked, onToggle, context }: UserCardProps) {
  const followedAt = formatDate(profile.followedAt);
  const displayName = context?.displayName;

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
        {displayName && displayName !== profile.username && (
          <p className="truncate text-xs text-ink-muted">{displayName}</p>
        )}
        {followedAt && <p className="text-xs text-ink-muted">Você seguiu em {followedAt}</p>}
        {context?.tags && <ProfileBadges tags={context.tags} />}
      </div>

      <Checkbox
        checked={checked}
        onChange={() => onToggle(profile.username)}
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
