
.PHONY: up down generate migrate dev docs
up: ; docker compose -f docker/docker-compose.yml up -d
down: ; docker compose -f docker/docker-compose.yml down -v
generate:
	pnpm --filter @xnode/registry-service prisma:generate
	pnpm --filter @xnode/telemetry-service prisma:generate
	pnpm --filter @xnode/rewards-service prisma:generate
migrate:
	pnpm --filter @xnode/registry-service prisma:migrate
	pnpm --filter @xnode/telemetry-service prisma:migrate
	pnpm --filter @xnode/rewards-service prisma:migrate
dev:
	pnpm --filter @xnode/registry-service dev & pnpm --filter @xnode/telemetry-service dev & pnpm --filter @xnode/rewards-service dev
docs:
	@echo "Registry:  http://localhost:3001/docs"; echo "Telemetry: http://localhost:3002/docs"; echo "Rewards: http://localhost:3003/docs"
