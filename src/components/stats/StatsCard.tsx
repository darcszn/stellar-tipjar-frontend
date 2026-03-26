interface StatsCardProps {
  title: string;
  value: string | number;
  sub?: string;
}

export function StatsCard({ title, value, sub }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-[color:var(--surface)] p-5 shadow-card">
      <p className="text-xs uppercase tracking-wide text-wave">{title}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-1 text-sm text-ink/60">{sub}</p>}
    </div>
  );
}
