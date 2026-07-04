import type { InstagramProfile, OptionalProfileData } from '../../types/instagram';
import { hasOptionalData } from '../../utils/parseOptionalProfiles';
import { BackButton, ExtrasNavButton } from '../CollapseToggleIcon';
import { ResultsList } from '../ResultsList';
import { StatsBar } from '../StatsBar';

interface ResultsPanelProps {
  onGoToHome: () => void;
  onGoToExtras?: () => void;
  followingCount: number;
  followersCount: number;
  notFollowingBackCount: number;
  checkedCount: number;
  profiles: InstagramProfile[];
  checked: Set<string>;
  onToggle: (username: string) => void;
  optionalData: OptionalProfileData;
}

export function ResultsPanel({
  onGoToHome,
  onGoToExtras,
  followingCount,
  followersCount,
  notFollowingBackCount,
  checkedCount,
  profiles,
  checked,
  onToggle,
  optionalData,
}: ResultsPanelProps) {
  const showExtrasNav = hasOptionalData(optionalData) && onGoToExtras;

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col gap-5 overflow-hidden px-4 py-8 pb-24 sm:px-6 sm:pb-8">
      <header className="flex shrink-0 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <BackButton onClick={onGoToHome} className="hidden sm:inline-flex">
            Voltar ao início
          </BackButton>
          {showExtrasNav && (
            <ExtrasNavButton onClick={onGoToExtras} className="hidden sm:inline-flex" />
          )}
        </div>
        <div>
          <span className="rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end bg-clip-text text-xs font-semibold tracking-wide text-transparent uppercase">
            Resultados
          </span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Pessoas que você segue e não te seguem de volta
          </h2>
        </div>
        {showExtrasNav && (
          <ExtrasNavButton onClick={onGoToExtras} className="w-full justify-center sm:hidden" />
        )}
      </header>

      <StatsBar
        followingCount={followingCount}
        followersCount={followersCount}
        notFollowingBackCount={notFollowingBackCount}
        checkedCount={checkedCount}
      />

      <ResultsList
        profiles={profiles}
        checked={checked}
        onToggle={onToggle}
        optionalData={optionalData}
      />
    </div>
  );
}
