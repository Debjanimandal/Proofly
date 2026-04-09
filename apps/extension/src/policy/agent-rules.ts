import type { Hex } from 'viem';
import type { AgentPolicy } from '../shared/types';

const POLICY_STORAGE_KEY = 'proofly.agent-policies.v1';

export interface PolicyTransaction {
  from: Hex;
  to?: Hex;
  valueUsd: number;
}

export class PolicyViolationError extends Error {
  public readonly code = 4001;

  constructor(message: string) {
    super(message);
    this.name = 'PolicyViolationError';
  }
}

export async function getPolicyByAgent(agentAddress: Hex): Promise<AgentPolicy | null> {
  const output = await chrome.storage.local.get([POLICY_STORAGE_KEY]);
  const allPolicies = (output[POLICY_STORAGE_KEY] as AgentPolicy[] | undefined) ?? [];

  return allPolicies.find((item) => item.agentAddress.toLowerCase() === agentAddress.toLowerCase()) ?? null;
}

export async function upsertPolicy(policy: AgentPolicy): Promise<void> {
  const output = await chrome.storage.local.get([POLICY_STORAGE_KEY]);
  const allPolicies = (output[POLICY_STORAGE_KEY] as AgentPolicy[] | undefined) ?? [];
  const index = allPolicies.findIndex((item) => item.agentAddress.toLowerCase() === policy.agentAddress.toLowerCase());

  if (index === -1) {
    allPolicies.push(policy);
  } else {
    allPolicies[index] = policy;
  }

  await chrome.storage.local.set({ [POLICY_STORAGE_KEY]: allPolicies });
}

export function enforceAgentPolicy(policy: AgentPolicy, tx: PolicyTransaction): void {
  if (Date.now() > policy.expiry) {
    throw new PolicyViolationError('Policy expired.');
  }

  if (tx.valueUsd > policy.maxLimitUSD) {
    throw new PolicyViolationError('Transaction value exceeds policy maxLimitUSD.');
  }

  if (!tx.to) {
    throw new PolicyViolationError('Transaction target required.');
  }

  const contractAllowed = policy.allowedContracts.some(
    (allowed) => allowed.toLowerCase() === tx.to?.toLowerCase(),
  );

  if (!contractAllowed) {
    throw new PolicyViolationError('Target contract is not allowed by policy.');
  }
}
