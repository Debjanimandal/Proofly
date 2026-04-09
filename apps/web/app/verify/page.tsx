'use client';

import { IDKitWidget } from '@worldcoin/idkit';
import { useState } from 'react';
import { walletRequest } from '../../lib/wallet/provider';

export default function VerifyPage(): JSX.Element {
  const [status, setStatus] = useState<'idle' | 'verified' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  async function connectWallet(): Promise<void> {
    try {
      const accounts = (await walletRequest('eth_requestAccounts', [])) as string[];
      setWalletAddress(accounts[0] ?? null);
      setError(null);
    } catch (connectError) {
      setError((connectError as Error).message);
    }
  }

  async function onProofSuccess(proof: unknown): Promise<void> {
    setError(null);

    const response = await fetch('/api/zk/worldid/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...(proof as Record<string, unknown>),
        address: walletAddress,
      }),
    });

    if (!response.ok) {
      setStatus('failed');
      setError(await response.text());
      return;
    }

    setStatus('verified');
  }

  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <div className="mx-auto grid w-full max-w-shell gap-6">
        <section className="rounded-3xl border border-border bg-surface p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Verify Human</h1>
          <p className="mt-2 text-sm text-subtext">World ID proof flow for human-gated actions.</p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 rounded-xl border border-border bg-elevated p-3 text-sm">
            <p className="text-xs uppercase tracking-wide text-muted">Wallet</p>
            <p className="mt-1 break-all font-mono text-subtext">{walletAddress ?? 'Not connected'}</p>
            <button
              className="mt-3 rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-text"
              onClick={() => {
                void connectWallet();
              }}
              type="button"
            >
              Connect Wallet
            </button>
          </div>

          <IDKitWidget
            app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID as string}
            action={(process.env.NEXT_PUBLIC_WORLD_ID_ACTION as string) || 'proofly-human-verify'}
            signal={walletAddress ?? 'proofly-web'}
            handleVerify={async (proof: unknown) => proof}
            onSuccess={(proof: unknown) => {
              void onProofSuccess(proof);
            }}
          >
            {({ open }: { open: () => void }) => (
              <button
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
                onClick={open}
                type="button"
              >
                Start World ID Verification
              </button>
            )}
          </IDKitWidget>

          <p className="mt-4 text-sm text-subtext">Status: {status}</p>
          {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
        </section>
      </div>
    </main>
  );
}
