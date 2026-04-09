import { useState } from 'react';
import { runtimeRequest } from '../../background/client';
import { useWalletStore } from '../../store/wallet';
import { ErrorBanner } from '../components/ErrorBanner';

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function strengthLevel(password: string): number {
  if (password.length < 8) return 0;
  let score = 1;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', 'bg-white/20', 'bg-white/35', 'bg-white/55', 'bg-white'];

export function WalletSetup(): JSX.Element {
  const refresh = useWalletStore((s) => s.refresh);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = strengthLevel(password);

  async function createWallet(): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      await runtimeRequest('PROOFLY_POPUP_CREATE_WALLET', { password });
      setPassword('');
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Shield mark */}
      <div className="relative mb-5 mt-4">
        <div className="flex size-20 items-center justify-center rounded-full border border-white/8 bg-surface">
          <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-elevated">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 text-white/60" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-white">Create Your Wallet</h2>
      <p className="mt-1.5 px-6 text-center text-[11px] leading-relaxed text-muted">
        Your keys never leave this device.
        <br />
        Encrypted locally, always in your control.
      </p>

      <div className="mt-7 w-full space-y-3">
        {error ? <ErrorBanner message={error} /> : null}

        <div className="relative">
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-11 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-white/20 focus:bg-elevated"
            type={showPassword ? 'text' : 'password'}
            placeholder="Set password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && password.length >= 8) void createWallet();
            }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-subtext"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        {/* Strength meter */}
        {password.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${strength >= level ? STRENGTH_COLORS[strength] : 'bg-white/10'}`}
                />
              ))}
            </div>
            {strength > 0 && (
              <p className="text-[10px] text-muted">{STRENGTH_LABELS[strength]}</p>
            )}
          </div>
        )}

        <button
          type="button"
          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-30 active:scale-[0.98]"
          onClick={() => { void createWallet(); }}
          disabled={busy || password.length < 8}
        >
          {busy ? 'Creating Wallet…' : 'Create Wallet'}
        </button>

        {/* Security note */}
        <div className="flex items-start gap-2 rounded-xl border border-border bg-surface px-3.5 py-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mt-0.5 size-3.5 shrink-0 text-muted" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[10px] leading-relaxed text-muted">
            A new Ethereum wallet will be generated and encrypted with your password. Back up your private key after setup.
          </p>
        </div>
      </div>
    </div>
  );
}

