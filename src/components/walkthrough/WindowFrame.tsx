interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
}

export function WindowFrame({ title, children }: WindowFrameProps) {
  return (
    <div className="mx-auto w-[280px] shrink-0 overflow-hidden rounded-xl border border-border shadow-lg">
      <div className="flex items-center gap-1.5 bg-surface-muted px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 truncate text-[11px] text-ink-muted">{title}</span>
      </div>
      <div className="h-[300px] bg-surface text-left">{children}</div>
    </div>
  );
}
