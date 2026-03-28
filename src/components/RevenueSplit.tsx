"use client";

import { TeamMember } from "@/hooks/useTeam";
import { Button } from "@/components/Button";

interface RevenueSplitProps {
  members: TeamMember[];
  onUpdateSplit: (memberId: string, split: number) => void;
  totalSplit: number;
}

export function RevenueSplit({ members, onUpdateSplit, totalSplit }: RevenueSplitProps) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-[color:var(--surface)] p-4">
      <h3 className="font-semibold text-ink">Revenue Split</h3>
      <p className="text-sm text-ink/70">Total: {totalSplit}% (100% recommended)</p>
      <div className="space-y-2 pt-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-2">
            <label className="w-24 text-sm text-ink/80">{member.name}</label>
            <input
              type="number"
              value={member.split}
              className="w-20 rounded-lg border border-ink/20 px-2 py-1 text-sm"
              min={0}
              max={100}
              onChange={(event) => onUpdateSplit(member.id, Number(event.target.value))}
            />
            <span className="text-xs text-ink/60">%</span>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Button variant={totalSplit === 100 ? "primary" : "secondary"} disabled={totalSplit !== 100}>
          {totalSplit === 100 ? "Split Balanced" : "Fix to 100%"}
        </Button>
      </div>
    </div>
  );
}
