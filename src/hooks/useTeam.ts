"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  split: number;
}

export interface TeamProfile {
  name: string;
  members: TeamMember[];
  updatedAt: string;
}

const STORAGE_KEY = "stellar_tipjar_team_profiles";

const parse = (value: string | null): Record<string, TeamProfile> => {
  if (!value) return {};
  try {
    return JSON.parse(value) as Record<string, TeamProfile>;
  } catch {
    return {};
  }
};

const fmt = (date = new Date()) => new Date(date).toISOString();

export function useTeam(teamName: string) {
  const [profiles, setProfiles] = useState<Record<string, TeamProfile>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    setProfiles(parse(raw));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const team = profiles[teamName] ?? { name: teamName, members: [], updatedAt: fmt() };

  const createTeam = useCallback(() => {
    if (profiles[teamName]) return;
    setProfiles((prev) => ({
      ...prev,
      [teamName]: { name: teamName, members: [], updatedAt: fmt() },
    }));
  }, [teamName, profiles]);

  const addMember = useCallback((member: { name: string; email?: string; split: number }) => {
    setProfiles((prev) => {
      const current = prev[teamName] ?? { name: teamName, members: [], updatedAt: fmt() };
      const newMember = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ...member };
      return {
        ...prev,
        [teamName]: { ...current, members: [...current.members, newMember], updatedAt: fmt() },
      };
    });
  }, [teamName]);

  const removeMember = useCallback((memberId: string) => {
    setProfiles((prev) => {
      const current = prev[teamName];
      if (!current) return prev;
      return {
        ...prev,
        [teamName]: {
          ...current,
          members: current.members.filter((m) => m.id !== memberId),
          updatedAt: fmt(),
        },
      };
    });
  }, [teamName]);

  const updateSplit = useCallback((memberId: string, split: number) => {
    setProfiles((prev) => {
      const current = prev[teamName];
      if (!current) return prev;
      const newMembers = current.members.map((m) => (m.id === memberId ? { ...m, split } : m));
      return {
        ...prev,
        [teamName]: { ...current, members: newMembers, updatedAt: fmt() },
      };
    });
  }, [teamName]);

  const totalSplit = useMemo(() => team.members.reduce((sum, member) => sum + member.split, 0), [team.members]);

  const splitStatus = totalSplit === 100 ? "balanced" : "unbalanced";

  const inviteMember = useCallback((email: string) => {
    // Mock invite status in localStorage.
    console.info(`Invite sent to ${email} for team ${teamName}`);
  }, [teamName]);

  return {
    team,
    createTeam,
    addMember,
    removeMember,
    updateSplit,
    totalSplit,
    splitStatus,
    inviteMember,
  };
}
