export async function createWalletChallenge(address: string): Promise<{ nonce: string; message: string; expiresAt: string }> {
  const response = await fetch('/api/wallet/challenge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create challenge.');
  }

  return response.json() as Promise<{ nonce: string; message: string; expiresAt: string }>;
}

export async function verifyWalletChallenge(
  address: string,
  nonce: string,
  signature: string,
): Promise<{ sessionToken: string }> {
  const response = await fetch('/api/wallet/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address, nonce, signature }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Challenge verification failed.');
  }

  return response.json() as Promise<{ sessionToken: string }>;
}
