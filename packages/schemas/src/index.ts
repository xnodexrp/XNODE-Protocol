
import { z } from 'zod';

/** --- Registry DTOs --- */
export const ValidatorRegisterInput = z.object({
  validator_pubkey: z.string().min(32),
  operator_name: z.string().min(2),
  contact_email: z.string().email().optional(),
  domain: z.string().min(3),
  ripple_validator_token: z.string().min(16),
  proof_method: z.enum(['dns_txt','well_known']).default('dns_txt'),
  jurisdiction: z.string().optional()
});
export type ValidatorRegisterInput = z.infer<typeof ValidatorRegisterInput>;

export const DomainVerifyInput = z.object({
  nonce: z.string(),
  proof: z.string()
});

/** --- Telemetry DTOs --- */
export const TelemetryIngest = z.object({
  watcher_id: z.string().uuid(),
  epoch_id: z.number().int().nonnegative(),
  validator_pubkey: z.string().min(32),
  uptime: z.number().min(0).max(1),
  agreement: z.number().min(0).max(1),
  latency_ms: z.number().int().nonnegative(),
  ledger_index: z.number().int().nonnegative(),
  signature: z.string().min(64) // base58/hex depending on agent
});
export type TelemetryIngest = z.infer<typeof TelemetryIngest>;

export const EpochQuery = z.object({ id: z.coerce.number().int().nonnegative() });
