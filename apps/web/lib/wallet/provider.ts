'use client';

type RequestArgs = {
  method: string;
  params?: unknown[];
};

type BrowserProvider = {
  request(args: RequestArgs): Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: BrowserProvider;
    proofly?: BrowserProvider;
  }
}

// Wait up to 3s for the Proofly injected provider to appear
async function waitForProoflyProvider(timeoutMs = 3000): Promise<BrowserProvider> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (window.proofly) return window.proofly;
    // Also accept window.ethereum if it's Proofly (isProofly flag set by our provider)
    if ((window.ethereum as (BrowserProvider & { isProofly?: boolean }) | undefined)?.isProofly) {
      return window.ethereum as BrowserProvider;
    }
    await new Promise<void>((r) => setTimeout(r, 50));
  }

  throw new Error(
    'Proofly extension not detected. Make sure:\n1. The extension is loaded in chrome://extensions\n2. You refreshed this tab after loading the extension.',
  );
}

export function getProoflyProvider(): BrowserProvider {
  if (typeof window === 'undefined') throw new Error('Browser only.');
  if (window.proofly) return window.proofly;
  const eth = window.ethereum as (BrowserProvider & { isProofly?: boolean }) | undefined;
  if (eth?.isProofly) return eth;
  throw new Error('Proofly extension not detected.');
}

export async function walletRequest(method: string, params: unknown[] = []): Promise<unknown> {
  if (typeof window === 'undefined') throw new Error('Browser only.');
  const provider = await waitForProoflyProvider();
  return provider.request({ method, params });
}
