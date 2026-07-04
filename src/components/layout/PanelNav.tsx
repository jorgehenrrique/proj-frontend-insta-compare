export type ActivePanel = 'home' | 'results' | 'extras';

interface PanelNavProps {
  activePanel: ActivePanel;
  hasData: boolean;
  hasExtras: boolean;
  onNavigate: (panel: ActivePanel) => void;
}

function NavTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-all duration-150 ${
        active
          ? 'text-ink'
          : 'text-ink-muted hover:bg-surface-muted hover:text-ink active:bg-surface-muted/80'
      }`}
    >
      {active && (
        <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end" />
      )}
      {label}
    </button>
  );
}

export function PanelNav({ activePanel, hasData, hasExtras, onNavigate }: PanelNavProps) {
  if (!hasData) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur-sm sm:hidden"
      aria-label="Navegação entre painéis"
    >
      <div className="mx-auto flex max-w-lg">
        <NavTab label="Início" active={activePanel === 'home'} onClick={() => onNavigate('home')} />
        <NavTab
          label="Resultados"
          active={activePanel === 'results'}
          onClick={() => onNavigate('results')}
        />
        {hasExtras && (
          <NavTab
            label="Extras"
            active={activePanel === 'extras'}
            onClick={() => onNavigate('extras')}
          />
        )}
      </div>
    </nav>
  );
}
