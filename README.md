
# XNODE Protocol — Registry · Telemetry · Rewards (Consolidated)

Production-grade monorepo used for the XRPL grant review. Three services:
- **Registry** (port 3001): validator onboarding, domain-proof verification, watcher key registry
- **Telemetry** (port 3002): signed watcher metrics ingest, per-epoch aggregation
- **Rewards** (port 3003): epoch budget, weight normalisation, reward set materialisation

## Quickstart
```bash
corepack enable
pnpm i

# Infra
docker compose -f docker/docker-compose.yml up -d

# Prisma clients
pnpm --filter @xnode/registry-service prisma:generate
pnpm --filter @xnode/telemetry-service prisma:generate
pnpm --filter @xnode/rewards-service prisma:generate

# DB migrations
pnpm --filter @xnode/registry-service prisma:migrate
pnpm --filter @xnode/telemetry-service prisma:migrate
pnpm --filter @xnode/rewards-service prisma:migrate

# Run services (each in a new terminal)
pnpm --filter @xnode/registry-service dev     # http://localhost:3001/docs
pnpm --filter @xnode/telemetry-service dev    # http://localhost:3002/docs
pnpm --filter @xnode/rewards-service dev      # http://localhost:3003/docs
```

## Security Highlights
- **Ed25519** watcher signatures verified at ingest (tweetnacl + base58)
- **JWT roles**: `admin` (ops) and `agent` (watchers)
- **Domain-proof**: DNS TXT (`_xnode.<domain>`) or `/.well-known/xnode.txt` with server nonce
- Aggregation idempotency keyed by `(epoch_id)`

See `docs/SECURITY.md` and `docs/ADR/*` for details.
