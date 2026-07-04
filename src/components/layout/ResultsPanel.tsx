import type { InstagramProfile } from '../../types/instagram';
import { ResultsList } from '../ResultsList';
import { StatsBar } from '../StatsBar';

interface ResultsPanelProps {
  onGoToHome: () => void;
  followingCount: number;
  followersCount: number;
  notFollowingBackCount: number;
  checkedCount: number;
  profiles: InstagramProfile[];
  checked: Set<string>;
  onToggle: (username: string) => void;
}

export function ResultsPanel({
  onGoToHome,
  followingCount,
  followersCount,
  notFollowingBackCount,
  checkedCount,
  profiles,
  checked,
  onToggle,
}: ResultsPanelProps) {
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col gap-5 overflow-hidden px-4 py-8 pb-24 sm:px-6 sm:pb-8">
      <header className="flex shrink-0 flex-col gap-3">
        <button
          type="button"
          onClick={onGoToHome}
          className="hidden w-fit items-center gap-1 text-sm text-ink-muted transition-colors hover:text-brand-mid sm:inline-flex"
        >
          ← Voltar ao início
        </button>
        <div>
          <span className="rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end bg-clip-text text-xs font-semibold tracking-wide text-transparent uppercase">
            Resultados
          </span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Pessoas que você segue e não te seguem de volta
          </h2>
        </div>
      </header>

      <StatsBar
        followingCount={followingCount}
        followersCount={followersCount}
        notFollowingBackCount={notFollowingBackCount}
        checkedCount={checkedCount}
      />

      <ResultsList profiles={profiles} checked={checked} onToggle={onToggle} />
    </div>
  );
}
