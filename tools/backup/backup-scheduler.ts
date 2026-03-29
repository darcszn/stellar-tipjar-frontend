/**
 * Backup Scheduler
 * Automates periodic contract state snapshots with incremental support
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { StateExporter, ContractState, ExporterConfig } from "./state-exporter";

export interface SchedulerConfig extends ExporterConfig {
  outputDir: string;
  intervalMs: number;
  maxBackups?: number;
  encryptionKey?: string;
  storageBackend?: "local" | "s3" | "ipfs";
  s3?: {
    bucket: string;
    region: string;
    prefix?: string;
  };
  ipfs?: {
    apiUrl: string;
  };
}

export interface BackupRecord {
  id: string;
  timestamp: number;
  filePath: string;
  checksum: string;
  size: number;
  incremental: boolean;
  previousBackupId?: string;
}

export interface BackupManifest {
  contractId: string;
  network: string;
  backups: BackupRecord[];
  lastFullBackup?: string;
}

export class BackupScheduler {
  private config: SchedulerConfig;
  private exporter: StateExporter;
  private timer: ReturnType<typeof setInterval> | null = null;
  private manifest: BackupManifest;
  private manifestPath: string;

  constructor(config: SchedulerConfig) {
    this.config = { maxBackups: 30, ...config };
    this.exporter = new StateExporter(config);
    this.manifestPath = path.join(config.outputDir, "manifest.json");
    this.manifest = this.loadManifest();
  }

  /** Start automated backups on the configured interval */
  start(): void {
    if (this.timer) return;
    console.log(
      `Backup scheduler started. Interval: ${this.config.intervalMs}ms`
    );
    // Run immediately, then on interval
    this.runBackup().catch(console.error);
    this.timer = setInterval(() => {
      this.runBackup().catch(console.error);
    }, this.config.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log("Backup scheduler stopped.");
    }
  }

  /** Run a single backup cycle */
  async runBackup(incremental = false): Promise<BackupRecord> {
    const state = await this.exporter.exportState();
    const lastBackup = this.getLastBackup();

    // Incremental: skip if state hasn't changed
    if (incremental && lastBackup) {
      const { metadata: _m, ...rest } = state;
      const currentChecksum = this.exporter.computeChecksum(rest);
      if (currentChecksum === lastBackup.checksum) {
        console.log("No state changes detected, skipping incremental backup.");
        return lastBackup;
      }
    }

    const record = await this.saveBackup(state, incremental, lastBackup?.id);
    this.manifest.backups.push(record);

    if (!incremental) {
      this.manifest.lastFullBackup = record.id;
    }

    this.pruneOldBackups();
    this.saveManifest();

    console.log(`Backup saved: ${record.id} (${record.size} bytes)`);
    return record;
  }

  private async saveBackup(
    state: ContractState,
    incremental: boolean,
    previousId?: string
  ): Promise<BackupRecord> {
    fs.mkdirSync(this.config.outputDir, { recursive: true });

    const id = `backup_${this.config.contractId}_${Date.now()}`;
    const fileName = `${id}.json`;
    const filePath = path.join(this.config.outputDir, fileName);

    let content = JSON.stringify(state, null, 2);

    if (this.config.encryptionKey) {
      content = this.encrypt(content, this.config.encryptionKey);
    }

    fs.writeFileSync(filePath, content, "utf-8");

    const { metadata: _m, ...rest } = state;
    const checksum = this.exporter.computeChecksum(rest);

    const record: BackupRecord = {
      id,
      timestamp: Date.now(),
      filePath,
      checksum,
      size: Buffer.byteLength(content),
      incremental,
      previousBackupId: previousId,
    };

    // Upload to remote storage if configured
    if (this.config.storageBackend === "s3") {
      await this.uploadToS3(filePath, fileName, content);
    } else if (this.config.storageBackend === "ipfs") {
      const cid = await this.uploadToIPFS(content);
      console.log(`IPFS CID: ${cid}`);
    }

    return record;
  }

  private encrypt(data: string, key: string): string {
    const keyBuf = crypto.scryptSync(key, "salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", keyBuf, iv);
    const encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");
    return JSON.stringify({ iv: iv.toString("hex"), data: encrypted, tag });
  }

  private async uploadToS3(
    _filePath: string,
    fileName: string,
    content: string
  ): Promise<void> {
    // Requires @aws-sdk/client-s3 — stub for now
    const { s3 } = this.config;
    if (!s3) return;
    const key = `${s3.prefix ?? "backups"}/${fileName}`;
    console.log(`[S3] Would upload to s3://${s3.bucket}/${key} (${content.length} bytes)`);
    // const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    // const client = new S3Client({ region: s3.region });
    // await client.send(new PutObjectCommand({ Bucket: s3.bucket, Key: key, Body: content }));
  }

  private async uploadToIPFS(content: string): Promise<string> {
    const { ipfs } = this.config;
    if (!ipfs) return "";
    // Stub — real impl would POST to Kubo/Pinata API
    console.log(`[IPFS] Would upload ${content.length} bytes to ${ipfs.apiUrl}`);
    return "Qm_stub_cid";
  }

  private pruneOldBackups(): void {
    const max = this.config.maxBackups ?? 30;
    while (this.manifest.backups.length > max) {
      const oldest = this.manifest.backups.shift();
      if (oldest && fs.existsSync(oldest.filePath)) {
        fs.unlinkSync(oldest.filePath);
        console.log(`Pruned old backup: ${oldest.id}`);
      }
    }
  }

  getLastBackup(): BackupRecord | undefined {
    return this.manifest.backups[this.manifest.backups.length - 1];
  }

  getManifest(): BackupManifest {
    return this.manifest;
  }

  private loadManifest(): BackupManifest {
    if (fs.existsSync(this.manifestPath)) {
      try {
        return JSON.parse(fs.readFileSync(this.manifestPath, "utf-8"));
      } catch {
        // fall through to default
      }
    }
    return {
      contractId: this.config.contractId,
      network: this.config.network,
      backups: [],
    };
  }

  private saveManifest(): void {
    fs.mkdirSync(this.config.outputDir, { recursive: true });
    fs.writeFileSync(
      this.manifestPath,
      JSON.stringify(this.manifest, null, 2),
      "utf-8"
    );
  }
}
