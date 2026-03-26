import { useQuery } from "@tanstack/react-query";
import { getCreatorStats, type CreatorStats } from "@/services/api";

export type { CreatorStats };

export const creatorStatsKeys = {
  stats: (username: string) => ["creators", username, "stats"] as const,
};

export function useCreatorStats(username: string) {
  return useQuery({
    queryKey: creatorStatsKeys.stats(username),
    queryFn: () => getCreatorStats(username),
    staleTime: 2 * 60 * 1000, // 2 min cache
    enabled: !!username,
  });
}
