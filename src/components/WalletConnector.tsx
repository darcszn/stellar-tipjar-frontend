"use client";

import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/Button";

export function WalletConnector() {
  const { isConnected, shortAddress, network, connect, disconnect } = useWallet();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-wave/25 bg-white px-3 py-2 text-xs sm:text-sm dark:border-wave-dark/25 dark:bg-[color:var(--surface-dark)]">
        <span className="font-medium text-wave dark:text-wave-dark">{network}</span>
        <span className="text-ink/70 dark:text-ink-dark/70">{shortAddress}</span>
        <Button variant="ghost" className="px-2 py-1 text-xs" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return <Button onClick={connect}>Connect Wallet</Button>;
}
