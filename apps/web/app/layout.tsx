import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Proofly',
  description: 'Wallet-native trust for the AI era',
};

const NAV_LINKS = [
  { href: '/wallet', label: 'Wallet' },
  { href: '/verify', label: 'Verify' },
  { href: '/profile', label: 'Profile' },
  { href: '/agent', label: 'Agent' },
  { href: '/media', label: 'Media' },
  { href: '/activity', label: 'Activity' },
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 px-6 py-3 backdrop-blur">
          <div className="mx-auto flex w-full max-w-shell items-center justify-between">
            <Link href="/" className="text-sm font-semibold tracking-tight text-text">
              Proofly
            </Link>
            <div className="flex gap-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-subtext transition-colors hover:text-text"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
