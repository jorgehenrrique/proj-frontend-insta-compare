import type { ReactNode } from 'react';
import { InstructionsPanel } from '../InstructionsPanel';
import { SecurityNotice } from '../SecurityNotice';

interface HomePanelProps {
  hasData: boolean;
  onGoToResults: () => void;
  uploadSection: ReactNode;
}

export function HomePanel({ hasData, onGoToResults, uploadSection }: HomePanelProps) {
  return (
    <div className="panel-scroll mx-auto flex min-h-full max-w-3xl flex-col gap-6 px-4 py-10 pb-24 sm:px-6 sm:pb-10">
      <header className="flex flex-col items-center gap-2 text-center">
        <span className="rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end bg-clip-text text-sm font-semibold tracking-wide text-transparent uppercase">
          Insta Compare
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Quem não te segue de volta?
        </h1>
        <p className="max-w-xl text-ink-muted">
          Compare seus arquivos de seguidores e seguindo exportados do Instagram, tudo processado
          localmente no seu navegador — nenhum dado é enviado para servidores.
        </p>
      </header>

      <InstructionsPanel />

      <SecurityNotice />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Enviar arquivos</h2>
          {hasData && (
            <button
              type="button"
              onClick={onGoToResults}
              className="hidden items-center gap-1 rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 sm:inline-flex"
            >
              Ver resultados →
            </button>
          )}
        </div>
        {uploadSection}
      </section>

      {hasData && (
        <div className="sm:hidden">
          <button
            type="button"
            onClick={onGoToResults}
            className="w-full rounded-xl bg-linear-to-r from-brand-start via-brand-mid to-brand-end px-4 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Ver resultados →
          </button>
        </div>
      )}

      <footer className="mt-auto pt-6 text-center text-xs text-ink-muted">
        Seus dados nunca saem do seu dispositivo — a comparação acontece inteiramente no
        navegador.
      </footer>
    </div>
  );
}
