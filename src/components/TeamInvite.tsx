"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";

interface TeamInviteProps {
  onInvite: (email: string) => void;
}

export function TeamInvite({ onInvite }: TeamInviteProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("Enter an email address.");
      return;
    }
    onInvite(email.trim());
    setMessage(`Invitation sent to ${email}`);
    setEmail("");
  };

  return (
    <div className="rounded-3xl border border-ink/10 bg-[color:var(--surface)] p-4">
      <h3 className="font-semibold text-ink">Invite a member</h3>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
        />
        <Button type="submit">Invite</Button>
      </form>
      {message && <p className="mt-2 text-sm text-ink/70">{message}</p>}
    </div>
  );
}
