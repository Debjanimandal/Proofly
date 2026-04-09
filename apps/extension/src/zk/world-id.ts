import type { Hex } from 'viem';
import { bytesToHex, isHex } from 'viem';

const WORLD_ID_STORAGE_KEY = 'proofly.world-id.latest.v1';

/** World ID proofs are valid for approximately one year. */
export const ZK_PROOF_LIFETIME_MS = 365 * 24 * 60 * 60 * 1000;

export interface WorldIdProofBundle {
  nullifierHash: Hex;
  proof: string[];
  merkleRoot?: string;
  verificationLevel?: string;
}

export interface StoredWorldIdProof extends WorldIdProofBundle {
  action: string;
  walletAddress: Hex;
  verifiedAt: number;
}

export interface ZkStatus {
  verified: boolean;
  proof: StoredWorldIdProof | null;
  /** Unix-ms timestamp after which the cached proof should be considered stale. */
  expiresAt: number | null;
}

export function splitHexToUint256Array(hexValue: string): string[] {
  const normalized = hexValue.startsWith('0x') ? hexValue.slice(2) : hexValue;
  const padded = normalized.length % 64 === 0 ? normalized : normalized.padStart(Math.ceil(normalized.length / 64) * 64, '0');
  const output: string[] = [];

  for (let i = 0; i < padded.length; i += 64) {
    output.push(`0x${padded.slice(i, i + 64)}`);
  }

  return output;
}

export async function makeExternalNullifier(contractAddress: Hex, action: string): Promise<Hex> {
  const data = new TextEncoder().encode(`${contractAddress.toLowerCase()}:${action.toLowerCase()}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(digest));
}

export function normalizeWorldIdResult(raw: {
  nullifier_hash?: string;
  nullifierHash?: string;
  proof?: string;
  merkle_root?: string;
  merkleRoot?: string;
  verification_level?: string;
  verificationLevel?: string;
}): WorldIdProofBundle {
  const nullifier = raw.nullifier_hash ?? raw.nullifierHash;
  const proofHex = raw.proof;

  if (!nullifier || !isHex(nullifier)) {
    throw new Error('World ID result missing valid nullifier hash.');
  }

  if (!proofHex || !isHex(proofHex)) {
    throw new Error('World ID result missing valid proof.');
  }

  return {
    nullifierHash: nullifier,
    proof: splitHexToUint256Array(proofHex),
    merkleRoot: raw.merkle_root ?? raw.merkleRoot,
    verificationLevel: raw.verification_level ?? raw.verificationLevel,
  };
}

/**
 * Sends a raw IDKit proof to the Proofly server for verification.
 * Throws on failure — use this as the `handleVerify` callback in IDKitWidget
 * so the modal remains open when verification fails.
 */
export async function verifyProofWithServer(
  rawProof: unknown,
  address: Hex,
  apiBaseUrl: string,
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/zk/worldid/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...(rawProof as Record<string, unknown>), address }),
  });
  if (!response.ok) {
    const message = await response.text().catch(() => 'Verification failed');
    throw new Error(message);
  }
}

export async function saveWorldIdProof(record: StoredWorldIdProof): Promise<void> {
  await chrome.storage.local.set({ [WORLD_ID_STORAGE_KEY]: record });
}

export async function getLatestWorldIdProof(): Promise<StoredWorldIdProof | null> {
  const output = await chrome.storage.local.get([WORLD_ID_STORAGE_KEY]);
  return (output[WORLD_ID_STORAGE_KEY] as StoredWorldIdProof | undefined) ?? null;
}

export async function clearWorldIdProof(): Promise<void> {
  await chrome.storage.local.remove(WORLD_ID_STORAGE_KEY);
}

/** Returns the current ZK verification status including expiry. */
export async function getZkStatus(): Promise<ZkStatus> {
  const proof = await getLatestWorldIdProof();
  if (!proof) return { verified: false, proof: null, expiresAt: null };
  const expiresAt = proof.verifiedAt + ZK_PROOF_LIFETIME_MS;
  return { verified: Date.now() < expiresAt, proof, expiresAt };
}
