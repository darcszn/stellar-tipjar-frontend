"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TipChartProps {
  data: { date: string; amount: number }[];
}

export function TipChart({ data }: TipChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-ink/10 bg-[color:var(--surface)] text-sm text-ink/50">
        No tip history yet
      </div>
    );
  }

  // Show last 14 data points with abbreviated date labels
  const visible = data.slice(-14).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <div className="rounded-2xl border border-ink/10 bg-[color:var(--surface)] p-5 shadow-card">
      <p className="mb-4 text-sm font-semibold text-ink">Tips over time (XLM)</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={visible} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="tipGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0066ff" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0066ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "0.75rem", border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
            formatter={(v) => [`${v ?? 0} XLM`, "Amount"]}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#0066ff"
            strokeWidth={2}
            fill="url(#tipGradient)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
