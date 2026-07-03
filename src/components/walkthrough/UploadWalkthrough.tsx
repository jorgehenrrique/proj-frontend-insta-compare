import { Slideshow } from './Slideshow';
import { WindowFrame } from './WindowFrame';

function FileRow({ label, icon = '📄', highlighted = false }: { label: string; icon?: string; highlighted?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
        highlighted ? 'bg-brand-mid/10 text-brand-mid' : 'text-ink'
      }`}
    >
      <span>{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

const ZIP_NAME = 'instagram-maria.exemplo-2026-07-03.zip';

const SLIDES = [
  {
    key: 'downloads',
    content: (
      <WindowFrame title="Downloads">
        <div className="flex flex-col gap-1 p-3">
          <p className="mb-1 text-[10px] font-medium text-ink-muted uppercase">Downloads</p>
          <FileRow label="relatorio.pdf" />
          <FileRow label={ZIP_NAME} icon="🗜️" highlighted />
          <FileRow label="foto.png" />
        </div>
      </WindowFrame>
    ),
  },
  {
    key: 'extracted',
    content: (
      <WindowFrame title={ZIP_NAME.replace('.zip', '')}>
        <div className="flex flex-col gap-1 p-3">
          <FileRow label="ads_information/" icon="📁" />
          <FileRow label="connections/" icon="📁" />
          <div className="ml-4 flex flex-col gap-1 border-l border-border pl-2">
            <FileRow label="followers_and_following/" icon="📁" highlighted />
            <div className="ml-4 flex flex-col gap-1 border-l border-border pl-2">
              <FileRow label="following.json" highlighted />
              <FileRow label="followers_1.json" highlighted />
            </div>
          </div>
          <FileRow label="media/" icon="📁" />
        </div>
      </WindowFrame>
    ),
  },
  {
    key: 'dragging',
    content: (
      <WindowFrame title="insta-compare — enviar arquivos">
        <div className="relative flex h-full flex-col items-center justify-center gap-2 border-2 border-dashed border-brand-mid bg-brand-mid/8 p-4 text-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-brand-start via-brand-mid to-brand-end text-lg text-white">
            ↑
          </span>
          <p className="text-xs font-medium text-ink">Solte os arquivos aqui</p>
          <div className="absolute right-6 bottom-8 flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-[10px] text-ink shadow-md">
            📄 following.json <span className="text-ink-muted">+1</span>
          </div>
        </div>
      </WindowFrame>
    ),
  },
  {
    key: 'uploaded',
    content: (
      <WindowFrame title="insta-compare — enviar arquivos">
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-[11px] text-ink">
            ✅ following.json <span className="ml-auto text-ink-muted">310 perfis</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-[11px] text-ink">
            ✅ followers_1.json <span className="ml-auto text-ink-muted">842 perfis</span>
          </div>
        </div>
      </WindowFrame>
    ),
  },
  {
    key: 'results',
    content: (
      <WindowFrame title="insta-compare — resultado">
        <div className="flex flex-col gap-2 p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-border px-2 py-1.5 text-center">
              <p className="text-sm font-semibold text-ink">310</p>
              <p className="text-[9px] text-ink-muted">Seguindo</p>
            </div>
            <div className="rounded-md border border-border px-2 py-1.5 text-center">
              <p className="text-sm font-semibold text-ink">27</p>
              <p className="text-[9px] text-ink-muted">Não seguem de volta</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-[11px] text-ink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-brand-start via-brand-mid to-brand-end text-[9px] text-white">
              JS
            </span>
            @joao.silva.fake
          </div>
        </div>
      </WindowFrame>
    ),
  },
];

export function UploadWalkthrough() {
  return <Slideshow slides={SLIDES} />;
}
