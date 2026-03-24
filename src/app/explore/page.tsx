import Link from "next/link";
import type { Metadata } from "next";

import { buildMetadata } from "@/utils/seo";

export const metadata: Metadata = buildMetadata({
  title: "Explore Creators",
  description: "Discover creators you can support with Stellar tips.",
  path: "/explore",
});

const creatorExamples = ["alice", "stellar-dev", "pixelmaker", "community-lab"];

export default function ExplorePage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Explore Creators</h1>
        <p className="mt-2 max-w-2xl text-ink/75">
          This page will eventually be populated from the backend. For now, use sample creator
          links below.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {creatorExamples.map((username) => (
          <li key={username}>
            <Link
              href={`/creator/${username}`}
              className="block rounded-2xl border border-ink/10 bg-[color:var(--surface)] p-5 transition hover:border-wave/40 hover:shadow-card"
            >
              <p className="text-xs uppercase tracking-wide text-wave">Creator</p>
              <p className="mt-1 text-lg font-semibold text-ink">@{username}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
