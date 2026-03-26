import { formatUsername } from "@/utils/format";

interface Supporter {
  sender: string;
  totalAmount: number;
  tipCount: number;
}

interface TopSupportersProps {
  supporters: Supporter[];
}

export function TopSupporters({ supporters }: TopSupportersProps) {
  if (!supporters.length) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-[color:var(--surface)] p-5 shadow-card">
        <p className="text-sm font-semibold text-ink">Top Supporters</p>
        <p className="mt-4 text-sm text-ink/50">No supporters yet</p>
      </div>
    );
  }

  const max = supporters[0].totalAmount;

  return (
    <div className="rounded-2xl border border-ink/10 bg-[color:var(--surface)] p-5 shadow-card">
      <p className="mb-4 text-sm font-semibold text-ink">Top Supporters</p>
      <ol className="space-y-3">
        {supporters.map((s, i) => (
          <li key={s.sender} className="flex items-center gap-3">
            <span className="w-5 text-center text-xs font-bold text-ink/40">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-ink">{formatUsername(s.sender)}</span>
                <span className="ml-2 shrink-0 text-wave font-semibold">{s.totalAmount} XLM</span>
              </div>
              {/* progress bar relative to top supporter */}
              <div className="mt-1 h-1.5 w-full rounded-full bg-ink/10">
                <div
                  className="h-1.5 rounded-full bg-wave"
                  style={{ width: `${(s.totalAmount / max) * 100}%` }}
                />
              </div>
              <p className="mt-0.5 text-xs text-ink/50">{s.tipCount} tips</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
