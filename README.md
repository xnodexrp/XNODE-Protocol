
# XNODE Protocol Monorepo

Production-grade starter for **Telemetry** and **Validator Registry** on XRPL.

## Stack
- **TypeScript / NestJS (Fastify)** for APIs
- **Prisma + PostgreSQL** for storage
- **Zod** for DTO validation
- **OpenAPI** auto-docs at `/docs`
- **Docker Compose** (Postgres + NATS optional)

## Quickstart
```bash
corepack enable
pnpm i

# Start infra (Postgres, optional NATS)
docker compose -f docker/docker-compose.yml up -d

# Create DB schema
pnpm --filter @xnode/registry-service prisma:generate
pnpm --filter @xnode/telemetry-service prisma:generate
pnpm --filter @xnode/registry-service prisma:migrate
pnpm --filter @xnode/telemetry-service prisma:migrate

# Run services
pnpm --filter @xnode/registry-service dev
pnpm --filter @xnode/telemetry-service dev

# Browse docs
# Registry:   http://localhost:3001/docs
# Telemetry:  http://localhost:3002/docs
```

## Security Notes (abridged)
- Watcher signatures (Ed25519) required for telemetry ingest. Sign JSON payloads excluding the signature field.
- Domain verification for validators via DNS TXT or `/.well-known` path with a server-generated nonce.
- Replay protection via epoch windows and monotonic ingest IDs.
- Aggregate epochs only after cross-watcher quorum. Outliers discarded with MAD-based filter.
- API rate limiting is recommended at the gateway level (e.g., Traefik/NGINX with token bucket).

MIT License (starter)
