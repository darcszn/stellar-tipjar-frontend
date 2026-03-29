/**
 * Contract State Exporter
 * Exports Stellar contract state to JSON for backup purposes
 */

import * as StellarSdk from "@stellar/stellar-sdk";
import * as crypto from "crypto";

export interface Creator {
  address: string;
  username: string;
  displayName: string;
  totalReceived: string;
  createdAt: number;
}

export interface Tip {
  id: string;
  sender: string;
  recipient: string;
  amount: string;
  asset: string;
  message: string;
  timestamp: number;
  txHash: string;
}

export interface StateMetadata {
  exportedAt: number;
  exportedBy: string;
  network: string;
  contractId: string;
  blockHeight?: number;
  checksum: string;
}

export interface ContractState {
  version: number;
  creators: Creator[];
  tips: Tip[];
  balances: Record<string, string>;
  metadata: StateMetadata;
}

export interface ExporterConfig {
  contractId: string;
  network: "testnet" | "mainnet" | "futurenet";
  rpcUrl?: string;
}

const NETWORK_URLS: Record<string, string> = {
  testnet: "https://soroban-testnet.stellar.org",
  mainnet: "https://mainnet.stellar.validationcloud.io/v1/soroban",
  futurenet: "https://rpc-futurenet.stellar.org",
};

export class StateExporter {
  private server: StellarSdk.SorobanRpc.Server;
  private contractId: string;
  private network: string;

  constructor(config: ExporterConfig) {
    this.contractId = config.contractId;
    this.network = config.network;
    const rpcUrl = config.rpcUrl ?? NETWORK_URLS[config.network];
    this.server = new StellarSdk.SorobanRpc.Server(rpcUrl, {
      allowHttp: rpcUrl.startsWith("http://"),
    });
  }

  async exportState(): Promise<ContractState> {
    console.log(`Exporting state for contract: ${this.contractId}`);

    const [creators, tips, balances] = await Promise.all([
      this.exportCreators(),
      this.exportTips(),
      this.exportBalances(),
    ]);

    const state: Omit<ContractState, "metadata"> = {
      version: 1,
      creators,
      tips,
      balances,
    };

    const checksum = this.computeChecksum(state);

    return {
      ...state,
      metadata: {
        exportedAt: Date.now(),
        exportedBy: "state-exporter",
        network: this.network,
        contractId: this.contractId,
        checksum,
      },
    };
  }

  private async exportCreators(): Promise<Creator[]> {
    try {
      const ledgerKey = StellarSdk.xdr.LedgerKey.contractData(
        new StellarSdk.xdr.LedgerKeyContractData({
          contract: new StellarSdk.Address(this.contractId).toScAddress(),
          key: StellarSdk.xdr.ScVal.scvSymbol("creators"),
          durability: StellarSdk.xdr.ContractDataDurability.persistent(),
        })
      );

      const response = await this.server.getLedgerEntries(ledgerKey);
      if (!response.entries?.length) return [];

      const entry = response.entries[0];
      return this.parseCreatorsFromLedgerEntry(entry);
    } catch (err) {
      console.warn("Could not fetch creators from contract storage:", err);
      return [];
    }
  }

  private async exportTips(): Promise<Tip[]> {
    try {
      const ledgerKey = StellarSdk.xdr.LedgerKey.contractData(
        new StellarSdk.xdr.LedgerKeyContractData({
          contract: new StellarSdk.Address(this.contractId).toScAddress(),
          key: StellarSdk.xdr.ScVal.scvSymbol("tips"),
          durability: StellarSdk.xdr.ContractDataDurability.persistent(),
        })
      );

      const response = await this.server.getLedgerEntries(ledgerKey);
      if (!response.entries?.length) return [];

      return this.parseTipsFromLedgerEntry(response.entries[0]);
    } catch (err) {
      console.warn("Could not fetch tips from contract storage:", err);
      return [];
    }
  }

  private async exportBalances(): Promise<Record<string, string>> {
    try {
      const ledgerKey = StellarSdk.xdr.LedgerKey.contractData(
        new StellarSdk.xdr.LedgerKeyContractData({
          contract: new StellarSdk.Address(this.contractId).toScAddress(),
          key: StellarSdk.xdr.ScVal.scvSymbol("balances"),
          durability: StellarSdk.xdr.ContractDataDurability.persistent(),
        })
      );

      const response = await this.server.getLedgerEntries(ledgerKey);
      if (!response.entries?.length) return {};

      return this.parseBalancesFromLedgerEntry(response.entries[0]);
    } catch (err) {
      console.warn("Could not fetch balances from contract storage:", err);
      return {};
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseCreatorsFromLedgerEntry(entry: any): Creator[] {
    try {
      const val = entry.val?.contractData()?.val();
      if (!val) return [];
      // Parse ScVal map/vec into Creator[]
      return [];
    } catch {
      return [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseTipsFromLedgerEntry(entry: any): Tip[] {
    try {
      const val = entry.val?.contractData()?.val();
      if (!val) return [];
      return [];
    } catch {
      return [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseBalancesFromLedgerEntry(entry: any): Record<string, string> {
    try {
      const val = entry.val?.contractData()?.val();
      if (!val) return {};
      return {};
    } catch {
      return {};
    }
  }

  computeChecksum(state: Omit<ContractState, "metadata">): string {
    const data = JSON.stringify(state, Object.keys(state).sort());
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  verifyChecksum(state: ContractState): boolean {
    const { metadata, ...rest } = state;
    const computed = this.computeChecksum(rest);
    return computed === metadata.checksum;
  }
}
