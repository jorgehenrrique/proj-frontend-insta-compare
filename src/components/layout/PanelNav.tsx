export type ActivePanel = 'home' | 'results';

interface PanelNavProps {
  activePanel: ActivePanel;
  hasData: boolean;
  onNavigate: (panel: ActivePanel) => void;
}

export function PanelNav({ activePanel, hasData, onNavigate }: PanelNavProps) {
  if (!hasData) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur-sm sm:hidden"
      aria-label="Navegação entre painéis"
    >
      <div className="mx-auto flex max-w-lg">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`relative flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
            activePanel === 'home' ? 'text-ink' : 'text-ink-muted'
          }`}
        >
          {activePanel === 'home' && (
            <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end" />
          )}
          Início
        </button>
        <button
          type="button"
          onClick={() => onNavigate('results')}
          className={`relative flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
            activePanel === 'results' ? 'text-ink' : 'text-ink-muted'
          }`}
        >
          {activePanel === 'results' && (
            <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end" />
          )}
          Resultados
        </button>
      </div>
    </nav>
  );
}
