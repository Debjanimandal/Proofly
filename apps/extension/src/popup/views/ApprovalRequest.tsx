import { IDKitWidget } from '@worldcoin/idkit';
import { useState } from 'react';
import type { Hex } from 'viem';
import { runtimeRequest } from '../../background/client';
import { recordAudioHash3s } from '../../media/audio-hash';
import type { ApprovalDecision, PendingApprovalRequest } from '../../shared/types';
import {
  normalizeWorldIdResult,
  saveWorldIdProof,
  verifyProofWithServer,
  type WorldIdProofBundle,
} from '../../zk/world-id';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { Field } from '../components/Field';

interface ApprovalRequestViewProps {
  approval: PendingApprovalRequest;
  chainId: Hex;
  address: Hex;
}

const apiBaseUrl = import.meta.env.VITE_PROOFLY_API_BASE_URL?.replace(/\/$/, '') as string | undefined;

export function ApprovalRequestView({ approval, chainId, address }: ApprovalRequestViewProps): JSX.Element {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [worldProof, setWorldProof] = useState<WorldIdProofBundle | null>(null);
  const [voiceHash, setVoiceHash] = useState<Hex | null>(null);

  async function sendDecision(decision: ApprovalDecision): Promise<void> {
    await runtimeRequest('PROOFLY_POPUP_APPROVAL_RESULT', decision);
    window.close();
  }

  const worldAction = (import.meta.env.VITE_WORLD_ACTION as string) || 'proofly-human-verify';

  /** Gate called by IDKit — throws to keep modal open on failure. */
  async function handleVerify(rawProof: unknown): Promise<void> {
    if (!apiBaseUrl) throw new Error('Verification server not configured.');
    await verifyProofWithServer(rawProof, address, apiBaseUrl);
  }

  /** Called only after handleVerify resolves — saves proof locally. */
  async function onWorldIdSuccess(rawProof: unknown): Promise<void> {
    const normalized = normalizeWorldIdResult(rawProof as never);
    await saveWorldIdProof({
      ...normalized,
      action: worldAction,
      walletAddress: address,
      verifiedAt: Date.now(),
    });
    setWorldProof(normalized);
  }

  async function recordVoice(): Promise<void> {
    setBusy(true);
    setError(null);

    try {
      const hash = await recordAudioHash3s();
      setVoiceHash(hash);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function approve(): Promise<void> {
    setBusy(true);
    setError(null);

    try {
      if (approval.requiresHumanProof) {
        if (!worldProof || !voiceHash) {
          throw new Error('High-security request requires World ID proof and voice hash.');
        }

        await sendDecision({
          id: approval.id,
          approved: true,
          proofContext: {
            zkProof: worldProof.proof,
            nullifier: worldProof.nullifierHash,
            voiceHash,
          },
        });

        return;
      }

      await sendDecision({ id: approval.id, approved: true });
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  async function reject(): Promise<void> {
    await sendDecision({ id: approval.id, approved: false, reason: 'User rejected request.' });
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium">Approval Request</h2>
      {error ? <ErrorBanner message={error} /> : null}

      <Field label="Origin" value={approval.origin} />
      <Field label="Method" value={approval.method} />
      <Field label="Chain" value={chainId} />

      {approval.requiresHumanProof ? (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-3">
          <p className="text-xs text-subtext">
            High-security request — World ID proof and 3-second voice hash required.
          </p>

          {/* @ts-expect-error — IDKit is not yet typed for React 19 */}
          <IDKitWidget
            signal={address}
            handleVerify={handleVerify}
            onSuccess={(proof: unknown) => { void onWorldIdSuccess(proof); }}
          >
            {({ open }: { open: () => void }) => (
              <Button onClick={open} disabled={busy || Boolean(worldProof)}>
                {worldProof ? 'World ID Verified' : 'Complete World ID Verification'}
              </Button>
            )}
          </IDKitWidget>

          <Button
            onClick={() => { void recordVoice(); }}
            disabled={busy || Boolean(voiceHash)}
          >
            {voiceHash ? 'Voice Hash Recorded' : 'Record 3s Voice Hash'}
          </Button>

          <div className="grid gap-1 text-xs text-subtext">
            <p>World ID: {worldProof ? 'Verified' : 'Pending'}</p>
            <p className="break-all">Voice Hash: {voiceHash ?? 'Pending'}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Button variant="primary" onClick={() => { void approve(); }} disabled={busy}>
          Approve
        </Button>
        <Button onClick={() => { void reject(); }} disabled={busy}>
          Reject
        </Button>
      </div>
    </section>
  );
}
