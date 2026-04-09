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

export function WalletUnlock(): JSX.Element {
  const address = useWalletStore((s) => s.address);
  const refresh = useWalletStore((s) => s.refresh);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shortAddress = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : null;
  const avatarChars = address ? address.slice(2, 4).toUpperCase() : '??';

  async function unlock(): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      await runtimeRequest('PROOFLY_POPUP_UNLOCK', { password });
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
      {/* Avatar ring */}
      <div className="relative mb-5 mt-4">
        <div className="flex size-20 items-center justify-center rounded-full border border-white/10 bg-surface">
          <div className="flex size-14 items-center justify-center rounded-full border border-white/8 bg-elevated">
            <span className="font-mono text-base font-bold tracking-tight text-subtext select-none">
              {avatarChars}
            </span>
          </div>
        </div>
        {/* Lock badge */}
        <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border border-white/10 bg-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3 text-muted" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-white">Welcome back</h2>
      {shortAddress && (
        <p className="mt-1 font-mono text-[11px] text-muted">{shortAddress}</p>
      )}

      <div className="mt-7 w-full space-y-3">
        {error ? <ErrorBanner message={error} /> : null}

        <div className="relative">
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-11 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-white/20 focus:bg-elevated"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && password.length >= 8) void unlock();
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

        <button
          type="button"
          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-30 active:scale-[0.98]"
          onClick={() => { void unlock(); }}
          disabled={busy || password.length < 8}
        >
          {busy ? 'Unlocking…' : 'Unlock'}
        </button>
      </div>
    </div>
  );
}

