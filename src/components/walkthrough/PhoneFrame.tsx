interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="mx-auto w-[260px] shrink-0 rounded-4xl border-4 border-ink/80 bg-black p-1.5 shadow-lg">
      <div className="relative h-[440px] overflow-hidden rounded-[1.5rem] bg-surface">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-2 text-[10px] font-medium text-ink">
          <span>15:53</span>
          <div className="h-4 w-20 rounded-full bg-black/90" />
          <span>100%</span>
        </div>
        <div className="flex h-full flex-col pt-7 text-left">{children}</div>
      </div>
    </div>
  );
}
