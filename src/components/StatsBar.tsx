interface StatsBarProps {
  followingCount: number;
  followersCount: number;
  notFollowingBackCount: number;
  checkedCount: number;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-xl border border-border bg-surface px-4 py-3">
      <span className="text-2xl font-semibold tracking-tight text-ink">{value}</span>
      <span className="text-sm text-ink-muted">{label}</span>
    </div>
  );
}

export function StatsBar({ followingCount, followersCount, notFollowingBackCount, checkedCount }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Você segue" value={followingCount} />
      <Stat label="Te seguem" value={followersCount} />
      <Stat label="Não seguem de volta" value={notFollowingBackCount} />
      <Stat label="Já revisados" value={checkedCount} />
    </div>
  );
}
