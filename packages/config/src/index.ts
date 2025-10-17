
import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

export const envSchema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  NATS_URL: z.string().default('nats://localhost:4222'),
  SERVICE_NAME: z.string().default('xnode-service'),
  JWT_SECRET: z.string().min(16).default('dev-secret-change-me')
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(overrides?: Partial<Record<keyof AppEnv, any>>): AppEnv {
  const parsed = envSchema.safeParse({ ...process.env, ...overrides });
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    process.exit(1);
  }
  return parsed.data;
}
