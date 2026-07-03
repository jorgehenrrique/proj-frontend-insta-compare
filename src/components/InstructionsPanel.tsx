import { useState } from 'react';
import { ExportWalkthrough } from './walkthrough/ExportWalkthrough';
import { UploadWalkthrough } from './walkthrough/UploadWalkthrough';

const STEPS = [
  {
    title: 'Abra as configurações da conta',
    detail:
      'No app do Instagram, vá até o seu perfil, toque no menu (≡) e depois em "Configurações e atividade".',
  },
  {
    title: 'Acesse a Central de Contas',
    detail: 'Em "Sua conta", toque em "Central de Contas".',
  },
  {
    title: 'Suas informações e permissões',
    detail: 'Na Central de Contas, toque em "Suas informações e permissões".',
  },
  {
    title: 'Exportar suas informações',
    detail:
      'Toque em "Exportar suas informações" → "Criar exportação" → selecione a sua conta do Instagram.',
  },
  {
    title: 'Escolha o que exportar',
    detail:
      'Em "Personalizar informações" você pode selecionar apenas "Conexões" (seguidores e seguindo) para deixar o arquivo bem menor e mais rápido de gerar.',
  },
  {
    title: 'Destino, formato e qualidade',
    detail:
      'Escolha "Baixar para o dispositivo". Em Formato, selecione JSON (não HTML). Em Qualidade da mídia, pode deixar "Qualidade mais baixa" — não afeta os dados de seguidores.',
  },
  {
    title: 'Intervalo de datas',
    detail: 'Selecione "Desde o início" para garantir que todo o seu histórico de conexões seja incluído.',
  },
  {
    title: 'Criar arquivos e aguardar',
    detail:
      'Toque em "Criar arquivos". O Instagram vai preparar o pacote e te avisar (por notificação ou e-mail) quando estiver pronto para baixar — pode levar de minutos a algumas horas.',
  },
] as const;

const UPLOAD_STEPS = [
  {
    title: 'Extraia o arquivo baixado',
    detail: 'Baixe o .zip e extraia em uma pasta no seu computador ou celular.',
  },
  {
    title: 'Localize os arquivos certos',
    detail:
      'Acesse connections/followers_and_following/ e localize following.json e followers_1.json (followers_2.json, followers_3.json... se você seguir muita gente, o Instagram divide em blocos).',
  },
  {
    title: 'Envie na área abaixo',
    detail: 'Arraste esses arquivos até a área de envio desta página, ou clique nela para selecioná-los.',
  },
] as const;

export function InstructionsPanel() {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-2xl border border-border bg-surface shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-start via-brand-mid to-brand-end text-sm font-semibold text-white">
            i
          </span>
          <div>
            <h2 className="text-base font-semibold text-ink">Como baixar seus dados do Instagram</h2>
            <p className="text-sm text-ink-muted">
              Siga os passos para exportar os arquivos que essa página vai comparar
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-8 border-t border-border px-5 py-5">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">1. Exporte seus dados no Instagram</h3>
              <ol className="flex flex-col gap-4">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-ink">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{step.title}</p>
                      <p className="text-sm text-ink-muted">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <ExportWalkthrough />
          </div>

          <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">2. Envie os arquivos aqui</h3>
              <ol className="flex flex-col gap-4">
                {UPLOAD_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-ink">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{step.title}</p>
                      <p className="text-sm text-ink-muted">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <UploadWalkthrough />
          </div>

          <p className="text-center text-xs text-ink-muted italic">
            As telas acima são apenas uma demonstração ilustrativa (conta e dados fictícios).
          </p>
        </div>
      )}
    </section>
  );
}
