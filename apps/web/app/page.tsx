'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

// ─── Animation helpers ────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    label: '01',
    badge: 'Human Proof',
    title: 'Prove you\'re real without revealing who you are.',
    body: 'Proofly zero-knowledge proof registered on Base. One verification. Permanent, private, portable.',
    href: '/verify',
    cta: 'Verify Now',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    accentColor: 'from-accent/10 to-transparent',
    borderColor: 'border-accent/15 hover:border-accent/35',
    iconBg: 'bg-accent/10 border-accent/20 text-accent-bright',
  },
  {
    label: '02',
    badge: 'Signed Actions',
    title: 'Every action carries your cryptographic signature.',
    body: 'Messages, transactions, and session grants are wallet-signed and chain-verified. No fakes, no spoofs.',
    href: '/wallet',
    cta: 'Open Wallet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    accentColor: 'from-violet-900/15 to-transparent',
    borderColor: 'border-white/[0.06] hover:border-white/[0.14]',
    iconBg: 'bg-violet-900/20 border-violet-800/30 text-violet-400',
  },
  {
    label: '03',
    badge: 'AI Leash',
    title: 'Authorize agents with hard limits.',
    body: 'Define exactly what an AI agent may spend, touch, and when it expires. Policy enforced on-chain.',
    href: '/agent',
    cta: 'Set Policy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
        <path d="M16.24 7.76a6 6 0 010 8.49M7.76 7.76a6 6 0 000 8.49" />
      </svg>
    ),
    accentColor: 'from-emerald-900/10 to-transparent',
    borderColor: 'border-white/[0.06] hover:border-emerald-900/40',
    iconBg: 'bg-emerald-900/20 border-emerald-800/30 text-success',
  },
] as const;

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Install the extension',
    body: 'Create a wallet in seconds. No seed phrase registration with third parties. Keys stay on your device.',
    icon: '⬇️',
  },
  {
    step: '02',
    title: 'Prove you\'re human',
    body: 'One Proofly verification. Your nullifier hash is registered on Base — no name, no email, no data.',
    icon: '👤',
  },
  {
    step: '03',
    title: 'Set agent policy',
    body: 'Give your AI agent a bounded mandate: max spend, allowed contracts, expiry time.',
    icon: '📋',
  },
  {
    step: '04',
    title: 'Verifiers check on-chain',
    body: 'Any dApp or AI platform can read your proof and policy directly from the registry contract.',
    icon: '✅',
  },
] as const;

const STATS = [
  { value: '0', label: 'personal data stored', sub: 'truly zero' },
  { value: 'ZK', label: 'humanity proof', sub: 'Proofly nullifier' },
  { value: 'Base', label: 'enforcement layer', sub: 'on-chain policy' },
  { value: 'MV3', label: 'extension standard', sub: 'Chrome manifest v3' },
] as const;

const STACK = [
  { label: 'Identity Layer', value: 'Proofly (Managed, ZK nullifier)', icon: '🆔' },
  { label: 'Wallet', value: 'Chrome MV3 · viem · encrypted storage', icon: '🔐' },
  { label: 'Chain', value: 'Base Sepolia — Registry + Policy + Session', icon: '⛓️' },
  { label: 'Database', value: 'Neon PostgreSQL — proof events + audit', icon: '🗄️' },
  { label: 'Media Signing', value: 'SHA-256 canvas hash + wallet signature', icon: '📸' },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-bg text-text">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Radial hero glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface/80 px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="size-1.5 rounded-full bg-success shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtext">
              Wallet-native trust for the AI era
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl font-bold leading-[1.06] tracking-[-0.03em] sm:text-7xl"
          >
            Be provably human.
            <br />
            <span className="accent-gradient-text">Stay completely private.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-subtext"
          >
            Proofly is a Chrome extension wallet that proves you are a real human, signs your actions, and puts AI agents on a hard leash — without exposing a single identity attribute.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/verify"
              className="rounded-xl bg-white px-7 py-3 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
            >
              Verify Your Humanity
            </Link>
            <Link
              href="/wallet"
              className="rounded-xl border border-white/[0.08] bg-surface/60 px-7 py-3 text-sm font-medium text-subtext backdrop-blur-sm transition-all hover:border-white/[0.15] hover:text-white"
            >
              Open Wallet Console
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex h-12 w-px flex-col items-center gap-1.5"
          >
            <div className="h-8 w-px bg-gradient-to-b from-border to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-surface/50 px-6 py-8">
        <div className="mx-auto grid max-w-shell grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map(({ value, label, sub }, i) => (
            <FadeUp key={label} delay={i * 0.06} className="text-center">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <p className="mt-1.5 text-sm font-medium text-subtext">{label}</p>
              <p className="mt-0.5 text-[11px] text-muted">{sub}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── THREE PILLARS ───────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-shell">
          <FadeUp className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Core Pillars</p>
          </FadeUp>
          <FadeUp delay={0.06} className="mb-16">
            <h2 className="max-w-lg text-4xl font-bold leading-tight tracking-tight">
              Three layers of trust.<br />One extension.
            </h2>
          </FadeUp>

          <div className="grid gap-4 sm:grid-cols-3">
            {PILLARS.map(({ label, badge, title, body, href, cta, icon, accentColor, borderColor, iconBg }, i) => (
              <FadeUp key={label} delay={i * 0.09}>
                <div
                  className={`group flex h-full flex-col rounded-3xl border bg-gradient-to-br p-7 transition-all duration-300 hover:shadow-card-hover ${accentColor} ${borderColor}`}
                >
                  {/* Icon + badge row */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className={`flex size-10 items-center justify-center rounded-2xl border ${iconBg}`}>
                      {icon}
                    </div>
                    <span className="font-mono text-xs text-muted">{label}</span>
                  </div>

                  {/* Tag */}
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{badge}</p>

                  {/* Title */}
                  <h3 className="text-lg font-bold leading-snug tracking-tight text-white">{title}</h3>

                  {/* Body */}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-subtext">{body}</p>

                  {/* CTA */}
                  <Link
                    href={href}
                    className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-subtext transition-all group-hover:text-white"
                  >
                    {cta}
                    <motion.span
                      aria-hidden
                      className="inline-block"
                      animate={{ x: 0 }}
                      whileHover={{ x: 3 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-surface px-6 py-28">
        <div className="mx-auto max-w-shell">
          <FadeUp>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-muted">How It Works</p>
          </FadeUp>
          <FadeUp delay={0.06}>
            <h2 className="mb-16 text-4xl font-bold leading-tight tracking-tight">
              From install to proof in four steps.
            </h2>
          </FadeUp>

          <div className="grid gap-px bg-white/[0.04] sm:grid-cols-4">
            {HOW_IT_WORKS.map(({ step, title, body, icon }, i) => (
              <FadeUp key={step} delay={i * 0.07}>
                <div className="bg-surface p-8">
                  <div className="mb-5 text-2xl">{icon}</div>
                  <p className="mb-4 font-mono text-[10px] font-bold tracking-[0.2em] text-muted">{step}</p>
                  <h3 className="mb-3 text-sm font-bold text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-subtext">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ARCHITECTURE ──────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-shell">
          <FadeUp>
            <div className="rounded-3xl border border-white/[0.06] bg-surface p-8 sm:p-14">
              <div className="grid gap-14 sm:grid-cols-2">
                {/* Left */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-muted">Stack</p>
                  <h2 className="text-4xl font-bold leading-tight tracking-tight">
                    Real implementation.<br />
                    <span className="text-subtext">Not a prototype.</span>
                  </h2>
                  <p className="mt-6 text-sm leading-relaxed text-subtext">
                    Every trust action is backed by a real contract, a real ZK proof, and a real wallet signature. No mocks, no staging fallbacks, no simulated trust.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/verify"
                      className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
                    >
                      Start with Verification
                    </Link>
                    <Link
                      href="/activity"
                      className="rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm text-subtext transition-colors hover:border-white/[0.15] hover:text-white"
                    >
                      View Activity
                    </Link>
                  </div>
                </div>

                {/* Right — stack cards */}
                <div className="grid gap-3 content-start">
                  {STACK.map(({ label, value, icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-card p-4 transition-colors hover:border-white/[0.09]"
                    >
                      <span className="text-lg">{icon}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">{label}</p>
                        <p className="mt-0.5 truncate font-mono text-xs text-subtext">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="px-6 pb-28">
        <FadeUp>
          <div className="mx-auto max-w-2xl rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/[0.08] to-transparent p-12 text-center">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent/15">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-6 text-accent-bright" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Ready to prove yourself?</h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-subtext">
              Join the first wave of cryptographically verified humans in the AI era.
            </p>
            <Link
              href="/verify"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-accent-dim hover:scale-[1.02] active:scale-[0.98]"
            >
              Verify with Proofly
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-4" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </FadeUp>
      </section>
    </main>
  );
}
