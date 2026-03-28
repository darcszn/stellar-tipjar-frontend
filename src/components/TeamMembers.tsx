"use client";

import { TeamMember } from "@/hooks/useTeam";
import { Button } from "@/components/Button";

interface TeamMembersProps {
  members: TeamMember[];
  onRemove: (id: string) => void;
}

export function TeamMembers({ members, onRemove }: TeamMembersProps) {
  if (members.length === 0) {
    return <p className="text-sm text-ink/70">No team members yet.</p>;
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between rounded-xl border border-ink/10 p-3">
          <div>
            <p className="font-semibold text-ink">{member.name}</p>
            <p className="text-sm text-ink/70">{member.email ?? "no email"}</p>
            <p className="text-xs text-ink/60">Split: {member.split}%</p>
          </div>
          <Button variant="secondary" onClick={() => onRemove(member.id)}>
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
