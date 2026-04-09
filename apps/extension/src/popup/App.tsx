import { useEffect, useMemo } from 'react';
import { useWalletStore } from '../store/wallet';
import { ApprovalRequestView } from './views/ApprovalRequest';
import { WalletHome } from './views/WalletHome';
import { WalletSetup } from './views/WalletSetup';
import { WalletUnlock } from './views/WalletUnlock';

function ProoflyMark() {
  return (
    <div className="flex size-7 items-center justify-center rounded-lg border border-white/12 bg-surface">
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 text-white/70" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      </svg>
    </div>
  );
}

export default function App(): JSX.Element {
  const { loaded, unlocked, address, chainId, pendingApprovals, refresh } = useWalletStore();

  const approvalId = useMemo(() => {
    const hash = window.location.hash;
    return hash.startsWith('#approval=') ? hash.slice('#approval='.length) : null;
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const pendingApproval = approvalId ? pendingApprovals[approvalId] : null;

  function renderContent() {
    if (!loaded) {
      return (
        <div className="flex flex-col items-center gap-3 pt-16 text-sm text-muted">
          <div className="size-5 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
          <span className="text-[11px] tracking-widest uppercase">Loading</span>
        </div>
      );
    }
    if (pendingApproval && address) {
      return <ApprovalRequestView approval={pendingApproval} chainId={chainId} address={address} />;
    }
    if (!address) return <WalletSetup />;
    if (!unlocked) return <WalletUnlock />;
    return <WalletHome />;
  }

  return (
    <main className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <ProoflyMark />
        <span className="flex-1 text-[11px] font-bold uppercase tracking-[0.28em] text-white/85">
          Proofly
        </span>
        <div className="flex items-center gap-2 rounded-full border border-white/8 bg-surface px-2.5 py-1">
          <div
            className={`size-1.5 rounded-full transition-colors duration-500 ${
              !loaded ? 'bg-white/20' : unlocked ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.6)]' : 'bg-white/20'
            }`}
          />
          <span className="text-[10px] tabular-nums text-muted">
            {!loaded ? '…' : unlocked ? 'unlocked' : 'locked'}
          </span>
        </div>
      </header>

      <div className="px-4 pt-4 pb-6">{renderContent()}</div>
    </main>
  );
}
