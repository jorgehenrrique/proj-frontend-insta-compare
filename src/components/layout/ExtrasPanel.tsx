import { useMemo } from 'react';
import type { OptionalProfileData } from '../../types/instagram';
import { buildOptionalInsights } from '../../utils/profileContext';
import { BackButton } from '../CollapseToggleIcon';
import { ExtrasList } from '../ExtrasList';

interface ExtrasPanelProps {
  onGoToResults: () => void;
  optionalData: OptionalProfileData;
  notFollowingBackUsernames: string[];
  checked: Set<string>;
  onToggleChecked: (itemId: string) => void;
}

export function ExtrasPanel({
  onGoToResults,
  optionalData,
  notFollowingBackUsernames,
  checked,
  onToggleChecked,
}: ExtrasPanelProps) {
  const insightsSummary = useMemo(
    () => buildOptionalInsights(optionalData, notFollowingBackUsernames),
    [optionalData, notFollowingBackUsernames],
  );

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col gap-5 overflow-hidden px-4 py-8 pb-24 sm:px-6 sm:pb-8">
      <header className="flex shrink-0 flex-col gap-3">
        <BackButton onClick={onGoToResults} className="hidden sm:inline-flex">
          Voltar aos resultados
        </BackButton>
        <div>
          <span className="rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end bg-clip-text text-xs font-semibold tracking-wide text-transparent uppercase">
            Extras
          </span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Conteúdos extras
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Revise pedidos pendentes, bloqueados, Close Friends e outros dados opcionais do export.
          </p>
        </div>
      </header>

      <ExtrasList
        optionalData={optionalData}
        crossRefInsights={insightsSummary.insights.filter((i) =>
          ['close_friends', 'restricted', 'hide_story', 'pending'].includes(i.id),
        )}
        checked={checked}
        onToggle={onToggleChecked}
      />
    </div>
  );
}
