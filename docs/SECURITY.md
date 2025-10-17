
# Security Overview
- JWT roles: `admin` for protected endpoints; `agent` for watcher ingest.
- Watcher signatures: detached Ed25519 over payload excluding `signature`, base58-encoded.
- Domain proofs: DNS TXT `_xnode.<domain>` or `/.well-known/xnode.txt` with server-provided nonce.
- Aggregations are idempotent (epoch keyed).
