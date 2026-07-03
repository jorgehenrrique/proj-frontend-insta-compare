import { PhoneFrame } from './PhoneFrame';
import { Slideshow } from './Slideshow';

const FAKE_USER = 'maria.exemplo';

function ScreenHeader({ title, showBack = true }: { title: string; showBack?: boolean }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 pb-2">
      {showBack && <span className="text-ink-muted">‹</span>}
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
    </div>
  );
}

function Row({ label, sub, highlighted = false }: { label: string; sub?: string; highlighted?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-border/60 px-4 py-2.5 ${
        highlighted ? 'bg-brand-mid/10' : ''
      }`}
    >
      <div>
        <p className={`text-xs font-medium ${highlighted ? 'text-brand-mid' : 'text-ink'}`}>{label}</p>
        {sub && <p className="text-[10px] text-ink-muted">{sub}</p>}
      </div>
      <span className="text-ink-muted">›</span>
    </div>
  );
}

function RadioOption({ label, selected }: { label: string; selected: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-2.5">
      <span className="text-xs text-ink">{label}</span>
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
          selected ? 'border-brand-mid' : 'border-border'
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-brand-mid" />}
      </span>
    </div>
  );
}

const SLIDES = [
  {
    key: 'profile',
    content: (
      <PhoneFrame>
        <div className="flex flex-col items-center gap-2 px-4 pt-4">
          <div className="h-16 w-16 rounded-full bg-linear-to-br from-brand-start via-brand-mid to-brand-end" />
          <p className="text-sm font-semibold text-ink">@{FAKE_USER}</p>
          <div className="flex gap-4 text-xs text-ink-muted">
            <span>128 posts</span>
            <span>842 seguidores</span>
            <span>310 seguindo</span>
          </div>
        </div>
        <span className="absolute top-8 right-4 flex h-7 w-7 animate-pulse items-center justify-center rounded-full bg-brand-mid/20 text-sm text-ink">
          ≡
        </span>
      </PhoneFrame>
    ),
  },
  {
    key: 'settings-activity',
    content: (
      <PhoneFrame>
        <ScreenHeader title="Configurações e atividade" showBack={false} />
        <Row label="Central de Contas" sub="Senha, segurança, dados pessoais" highlighted />
        <Row label="Salvos" />
        <Row label="Arquivo" />
        <Row label="Sua atividade" />
      </PhoneFrame>
    ),
  },
  {
    key: 'accounts-center',
    content: (
      <PhoneFrame>
        <ScreenHeader title="Central de Contas" />
        <Row label={`@${FAKE_USER}`} sub="Perfis e dados pessoais" />
        <Row label="Senha e segurança" />
        <Row label="Suas informações e permissões" highlighted />
        <Row label="Preferências de anúncios" />
      </PhoneFrame>
    ),
  },
  {
    key: 'info-permissions',
    content: (
      <PhoneFrame>
        <ScreenHeader title="Suas informações e permissões" />
        <Row label="Exportar suas informações" highlighted />
        <Row label="Histórico de pesquisa" />
      </PhoneFrame>
    ),
  },
  {
    key: 'choose-account',
    content: (
      <PhoneFrame>
        <ScreenHeader title="Exportar suas informações" />
        <div className="px-4 py-3">
          <p className="mb-2 text-[11px] text-ink-muted">Escolha a conta para exportar</p>
          <RadioOption label={`@${FAKE_USER} · Instagram`} selected />
        </div>
      </PhoneFrame>
    ),
  },
  {
    key: 'customize',
    content: (
      <PhoneFrame>
        <ScreenHeader title="Personalizar informações" />
        <div className="px-4 py-2">
          <label className="flex items-center justify-between border-b border-border/60 py-2 text-xs text-ink">
            Conexões
            <span className="flex h-4 w-4 items-center justify-center rounded bg-brand-mid text-[10px] text-white">
              ✓
            </span>
          </label>
          <label className="flex items-center justify-between border-b border-border/60 py-2 text-xs text-ink-muted">
            Comentários
            <span className="h-4 w-4 rounded border border-border" />
          </label>
          <label className="flex items-center justify-between border-b border-border/60 py-2 text-xs text-ink-muted">
            Mensagens
            <span className="h-4 w-4 rounded border border-border" />
          </label>
        </div>
      </PhoneFrame>
    ),
  },
  {
    key: 'format',
    content: (
      <PhoneFrame>
        <ScreenHeader title="Formato" />
        <div className="px-4 py-3">
          <RadioOption label="HTML" selected={false} />
          <RadioOption label="JSON" selected />
        </div>
      </PhoneFrame>
    ),
  },
  {
    key: 'date-range',
    content: (
      <PhoneFrame>
        <ScreenHeader title="Intervalo de datas" />
        <div className="px-4 py-3">
          <RadioOption label="Último ano" selected={false} />
          <RadioOption label="Desde o início" selected />
        </div>
      </PhoneFrame>
    ),
  },
  {
    key: 'creating',
    content: (
      <PhoneFrame>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-brand-start via-brand-mid to-brand-end text-xl text-white">
            ✓
          </span>
          <p className="text-sm font-semibold text-ink">Preparando seus arquivos</p>
          <p className="text-[11px] text-ink-muted">
            Você vai receber um aviso quando o download estiver pronto.
          </p>
        </div>
      </PhoneFrame>
    ),
  },
];

export function ExportWalkthrough() {
  return <Slideshow slides={SLIDES} />;
}
