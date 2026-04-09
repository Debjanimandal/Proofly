import { NextResponse } from 'next/server';
import { getAddress, isAddress } from 'viem';
import { registerHumanProofOnChain } from '../../../../../lib/contracts/client';
import { getOptionalDb } from '../../../../../lib/db/client';
import { insertAuditLog, upsertWalletProfile } from '../../../../../lib/server/persistence';

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as {
    address?: string;
    merkle_root?: string;
    merkleRoot?: string;
    nullifier_hash?: string;
    nullifierHash?: string;
    proof?: string;
    verification_level?: string;
    verificationLevel?: string;
  };

  const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID;
  const action = process.env.WORLD_ID_ACTION ?? 'proofly-human-verify';

  if (!appId) {
    return NextResponse.json({ error: 'World ID app ID is not configured.' }, { status: 500 });
  }

  const merkleRoot = body.merkle_root ?? body.merkleRoot;
  const nullifierHash = body.nullifier_hash ?? body.nullifierHash;
  const verificationLevel = body.verification_level ?? body.verificationLevel ?? 'orb';

  if (!nullifierHash || !body.proof || !merkleRoot) {
    return NextResponse.json({ error: 'Invalid World ID payload.' }, { status: 400 });
  }

  const verifyResponse = await fetch(`https://developer.worldcoin.org/api/v2/verify/${appId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merkle_root: merkleRoot,
      nullifier_hash: nullifierHash,
      proof: body.proof,
      verification_level: verificationLevel,
      action,
      signal: body.address ?? 'proofly',
      app_id: appId,
      action_id: action,
    }),
  });

  if (!verifyResponse.ok) {
    const verifyText = await verifyResponse.text();
    return NextResponse.json({ error: `World ID verification failed: ${verifyText}` }, { status: 400 });
  }

  const verifyBody = await verifyResponse.json();
  const normalizedAddress = body.address && isAddress(body.address) ? getAddress(body.address) : null;

  if (normalizedAddress) {
    const sql = getOptionalDb();
    if (sql) {
      const rows = await sql`
        INSERT INTO public.proof_events
          (wallet_address, proof_provider, action, nullifier_hash, status, verified_at, chain_id)
        VALUES (
          ${normalizedAddress},
          'world-id',
          ${action},
          ${nullifierHash},
          'verified',
          ${new Date().toISOString()},
          84532
        )
        ON CONFLICT (nullifier_hash) DO UPDATE
          SET status = 'verified', verified_at = now()
        RETURNING id
      `;

      if (!rows[0]) {
        return NextResponse.json({ error: 'Unable to persist verification.' }, { status: 500 });
      }

      // Register proof on-chain (best-effort — doesn't block the response)
      void registerHumanProofOnChain(normalizedAddress, nullifierHash, merkleRoot, body.proof).then(async (txHash) => {
        if (txHash && sql) {
          await sql`UPDATE public.proof_events SET tx_hash = ${txHash} WHERE nullifier_hash = ${nullifierHash}`;
        }
      }).catch(() => {
        // Silent — on-chain registration is best-effort
      });
    }

    await upsertWalletProfile(normalizedAddress, { active_chain: '84532', verification_status: 'verified' });
    await insertAuditLog({
      actorAddress: normalizedAddress,
      eventType: 'worldid_verified',
      targetId: nullifierHash,
      payload: { action, verificationLevel },
    });
  } else {
    await insertAuditLog({
      eventType: 'worldid_verified_unlinked',
      targetId: nullifierHash,
      payload: { action },
    });
  }

  return NextResponse.json({ verified: true, provider: 'world-id', result: verifyBody });
}
