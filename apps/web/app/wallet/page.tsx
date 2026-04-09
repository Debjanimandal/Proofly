import WalletConsole from '../../components/wallet/wallet-console';
import { getProoflyContractAddresses } from '../../lib/chain/contracts';

export default function WalletPage(): JSX.Element {
  const contracts = getProoflyContractAddresses();

  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <div className="mx-auto grid w-full max-w-shell gap-6">
        <section className="rounded-3xl border border-border bg-surface p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Proofly Dashboard</h1>
          <p className="mt-2 text-sm text-subtext">
            Connect extension, run nonce-based wallet auth, verify human proof, and monitor trust events.
          </p>
          <div className="mt-4 grid gap-2 text-xs text-subtext">
            <p className="break-all">Registry: {contracts.registry ?? 'Unset'}</p>
            <p className="break-all">Policy: {contracts.policy ?? 'Unset'}</p>
            <p className="break-all">Session: {contracts.session ?? 'Unset'}</p>
            <p className="break-all">Task Gate: {contracts.taskGate ?? 'Unset'}</p>
          </div>
        </section>
        <WalletConsole />
      </div>
    </main>
  );
}
