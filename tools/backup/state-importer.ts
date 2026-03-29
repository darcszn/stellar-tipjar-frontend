/**
 * Contract State Importer
 * Imports/restores contract state from a backup JSON
 */

import * as fs from "fs";
import * as crypto from "crypto";
import { ContractState, StateExporter } from "./state-exporter";

export interface ImportResult {
  success: boolean;
  contractId: string;
  creatorsRestored: number;
  tipsRestored: number;
  balancesRestored: number;
  errors: string[];
}

export interface ImporterConfig {
  contractId: string;
  network: "testnet" | "mainnet" | "futurenet";
  encryptionKey?: string;
}

export class StateImporter {
  private config: ImporterConfig;

  constructor(config: ImporterConfig) {
    this.config = config;
  }

  /**
   * Load and parse a backup file (supports encrypted and plain JSON)
   */
  async loadBackup(filePath: string): Promise<ContractState> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Backup file not found: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, "utf-8");

    let state: ContractState;
    if (this.config.encryptionKey && this.isEncrypted(raw)) {
      const decrypted = this.decrypt(raw, this.config.encryptionKey);
      state = JSON.parse(decrypted);
    } else {
      state = JSON.parse(raw);
    }

    return state;
  }

  /**
   * Verify backup integrity before import
   */
  verifyBackup(state: ContractState): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!state.metadata) errors.push("Missing metadata");
    if (!state.metadata?.checksum) errors.push("Missing checksum");
    if (!state.metadata?.contractId) errors.push("Missing contractId");
    if (state.metadata?.contractId !== this.config.contractId) {
      errors.push(
        `Contract ID mismatch: expected ${this.config.contractId}, got ${state.metadata?.contractId}`
      );
    }
    if (state.metadata?.network !== this.config.network) {
      errors.push(
        `Network mismatch: expected ${this.config.network}, got ${state.metadata?.network}`
      );
    }

    // Verify checksum
    if (state.metadata?.checksum) {
      const exporter = new StateExporter({
        contractId: this.config.contractId,
        network: this.config.network,
      });
      const { metadata: _meta, ...rest } = state;
      const computed = exporter.computeChecksum(rest);
      if (computed !== state.metadata.checksum) {
        errors.push(
          `Checksum mismatch: data may be corrupted or tampered with`
        );
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Perform a dry-run import — validates without writing
   */
  async dryRun(state: ContractState): Promise<ImportResult> {
    const { valid, errors } = this.verifyBackup(state);
    return {
      success: valid,
      contractId: this.config.contractId,
      creatorsRestored: valid ? state.creators.length : 0,
      tipsRestored: valid ? state.tips.length : 0,
      balancesRestored: valid ? Object.keys(state.balances).length : 0,
      errors,
    };
  }

  /**
   * Import state — in practice this would submit transactions to restore
   * contract storage entries. Requires admin/owner keypair.
   */
  async importState(
    state: ContractState,
    _adminSecret: string
  ): Promise<ImportResult> {
    const { valid, errors } = this.verifyBackup(state);
    if (!valid) {
      return {
        success: false,
        contractId: this.config.contractId,
        creatorsRestored: 0,
        tipsRestored: 0,
        balancesRestored: 0,
        errors,
      };
    }

    console.log(`Importing state into contract: ${this.config.contractId}`);
    console.log(`  Creators: ${state.creators.length}`);
    console.log(`  Tips: ${state.tips.length}`);
    console.log(`  Balances: ${Object.keys(state.balances).length}`);

    // NOTE: Actual on-chain restoration requires calling contract admin
    // functions or using Soroban footprint restoration. This is a scaffold
    // that logs what would be restored.

    return {
      success: true,
      contractId: this.config.contractId,
      creatorsRestored: state.creators.length,
      tipsRestored: state.tips.length,
      balancesRestored: Object.keys(state.balances).length,
      errors: [],
    };
  }

  private isEncrypted(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      return typeof parsed.iv === "string" && typeof parsed.data === "string";
    } catch {
      return false;
    }
  }

  private decrypt(encryptedJson: string, key: string): string {
    const { iv, data, tag } = JSON.parse(encryptedJson);
    const keyBuf = crypto.scryptSync(key, "salt", 32);
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      keyBuf,
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(tag, "hex"));
    return decipher.update(data, "hex", "utf8") + decipher.final("utf8");
  }
}
