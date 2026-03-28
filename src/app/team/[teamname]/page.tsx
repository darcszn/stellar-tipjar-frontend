"use client";

import { FormEvent, useState } from "react";
import { TeamInvite } from "@/components/TeamInvite";
import { TeamMembers } from "@/components/TeamMembers";
import { RevenueSplit } from "@/components/RevenueSplit";
import { useTeam } from "@/hooks/useTeam";
import { Button } from "@/components/Button";

interface TeamPageProps {
  params: { teamname: string };
}

export default function TeamPage({ params }: TeamPageProps) {
  const { teamname } = params;
  const { team, createTeam, addMember, removeMember, updateSplit, totalSplit, splitStatus, inviteMember } = useTeam(teamname);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [split, setSplit] = useState(0);

  if (!team.name) {
    createTeam();
  }

  const handleAddMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || split <= 0) return;
    addMember({ name, email, split });
    setName("");
    setEmail("");
    setSplit(0);
  };

  return (
    <div className="space-y-6 px-4 py-8 sm:px-8">
      <h1 className="text-3xl font-bold text-ink">Team: {teamname}</h1>
      <p className="text-sm text-ink/70">Collaboration with split tip revenue and member management.</p>
      <p className="text-sm text-ink/70">Split status: {splitStatus} ({totalSplit}%)</p>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Add a member</h2>
        <form className="flex flex-col gap-2" onSubmit={handleAddMember}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Member name"
            className="rounded-lg border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Member email"
            className="rounded-lg border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            placeholder="Revenue split %"
            min={0}
            max={100}
            className="rounded-lg border border-ink/20 px-3 py-2 text-sm"
          />
          <Button type="submit">Add team member</Button>
        </form>
      </section>

      <TeamMembers members={team.members} onRemove={removeMember} />

      <RevenueSplit members={team.members} onUpdateSplit={updateSplit} totalSplit={totalSplit} />

      <TeamInvite onInvite={inviteMember} />
    </div>
  );
}
