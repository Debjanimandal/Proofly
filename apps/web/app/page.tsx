import Link from 'next/link';

const PILLARS = [
  {
    label: '01 — Human Proof',
    title: 'Prove you\'re real without revealing who you are.',
    body: 'World ID zero-knowledge proof registered on Base. One verification. Permanent, private, portable.',
    href: '/verify',
    cta: 'Verify Now',
  },
  {
    label: '02 — Signed Actions',
    title: 'Every action carries your cryptographic signature.',
    body: 'Messages, transactions, and session grants are wallet-signed and chain-verified. No fakes, no spoofs.',
    href: '/wallet',
    cta: 'Open Wallet',
  },
  {
    label: '03 — AI Leash',
    title: 'Authorize agents with hard limits.',
    body: 'Define exactly what an AI agent may spend, touch, and when it expires. Policy enforced on-chain.',
    href: '/agent',
    cta: 'Set Policy',
  },
] as const;

const HOW_IT_WORKS = [
  { step: '1', title: 'Install the extension', body: 'Create a wallet in seconds. No seed phrase registration with third parties.' },
  { step: '2', title: 'Prove you\'re human', body: 'One World ID verification. Your nullifier hash is registered on Base Sepolia — no name, no email.' },
  { step: '3', title: 'Set agent policy', body: 'Give your AI agent a bounded mandate: max spend, allowed contracts, expiry time.' },
  { step: '4', title: 'Verifiers check on-chain', body: 'Any dApp or AI platform can read your proof and policy directly from the registry contract.' },
] as const;

const STATS = [
  { value: '0', label: 'personal data stored' },
  { value: 'ZK', label: 'humanity proof' },
  { value: 'Base', label: 'enforcement layer' },
  { value: 'MV3', label: 'extension standard' },
] as const;

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-bg text-text">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] flex-col items-center justify-center px-6 text-center">
        {/* subtle grid overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-muted">
            Wallet-native trust for the AI era
          </p>
          <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight sm:text-7xl">
            Be provably human.<br />
            <span className="text-subtext">Stay completely private.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-subtext">
            Proofly is a Chrome extension wallet that proves you are a real human, signs your actions, and puts AI agents on a hard leash — all without exposing a single identity attribute.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/verify"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Verify Your Humanity
            </Link>
            <Link
              href="/wallet"
              className="rounded-xl border border-border px-6 py-3 text-sm text-text transition-colors hover:border-white/20"
            >
              Open Wallet Console
            </Link>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="h-10 w-px bg-gradient-to-b from-border to-transparent" />
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="border-y border-border px-6 py-6">
        <div className="mx-auto grid max-w-shell grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THREE PILLARS ───────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-shell">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">Core Pillars</p>
          <h2 className="mb-16 max-w-lg text-3xl font-semibold leading-tight tracking-tight">
            Three layers of trust. One extension.
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {PILLARS.map(({ label, title, body, href, cta }) => (
              <div
                key={label}
                className="group flex flex-col rounded-3xl border border-border bg-surface p-8 transition-colors hover:border-white/20"
              >
                <p className="mb-6 text-xs font-mono text-muted">{label}</p>
                <h3 className="text-lg font-semibold leading-snug tracking-tight">{title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-subtext">{body}</p>
                <Link
                  href={href}
                  className="mt-8 inline-flex items-center gap-1.5 text-sm text-subtext transition-colors hover:text-text"
                >
                  {cta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="border-t border-border bg-surface px-6 py-24">
        <div className="mx-auto max-w-shell">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">How It Works</p>
          <h2 className="mb-16 text-3xl font-semibold leading-tight tracking-tight">
            From install to proof in four steps.
          </h2>

          <div className="grid gap-px bg-border sm:grid-cols-4">
            {HOW_IT_WORKS.map(({ step, title, body }) => (
              <div key={step} className="bg-surface p-8">
                <p className="mb-6 text-4xl font-semibold text-elevated">{step}</p>
                <h3 className="mb-3 text-sm font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-subtext">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ARCHITECTURE ──────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-shell">
          <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12">
            <div className="grid gap-12 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">Stack</p>
                <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                  Real implementation.<br />Not a prototype.
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-subtext">
                  Every trust action is backed by a real contract, a real ZK proof, and a real wallet signature. No mocks, no staging fallbacks, no simulated trust.
                </p>
                <div className="mt-8 flex gap-3">
                  <Link
                    href="/verify"
                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                  >
                    Start with Verification
                  </Link>
                  <Link
                    href="/activity"
                    className="rounded-xl border border-border px-5 py-2.5 text-sm text-text transition-colors hover:border-white/20"
                  >
                    View Activity
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  { label: 'Identity Layer', value: 'World ID (Managed, ZK nullifier)' },
                  { label: 'Wallet', value: 'Chrome MV3, viem, encrypted local storage' },
                  { label: 'Chain', value: 'Base Sepolia — Registry + Policy + Session' },
                  { label: 'Database', value: 'Neon PostgreSQL — proof events + audit log' },
                  { label: 'Media Signing', value: 'SHA-256 canvas hash + wallet signature' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-xs text-muted">{label}</p>
                    <p className="mt-1 font-mono text-xs text-text">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ──────────────────────────────────────── */}
      <section className="border-t border-border px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-4xl font-semibold tracking-tight">
            Start proving.<br />Stop trusting blindly.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-subtext">
            Install the Proofly extension. Complete one World ID verification. Your proof lives on-chain — permanent, portable, and privacy-preserving.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/verify"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Get Verified
            </Link>
            <Link
              href="/profile"
              className="rounded-xl border border-border px-6 py-3 text-sm text-text transition-colors hover:border-white/20"
            >
              View Profile
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-shell flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold tracking-tight">Proofly</p>
          <p className="text-xs text-muted">Wallet-native trust for the AI era. Built on Base.</p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/verify" className="hover:text-text">Verify</Link>
            <Link href="/agent" className="hover:text-text">Agent</Link>
            <Link href="/media" className="hover:text-text">Media</Link>
            <Link href="/activity" className="hover:text-text">Activity</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
