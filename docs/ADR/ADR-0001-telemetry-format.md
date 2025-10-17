
# ADR-0001 Telemetry Payload
Fields: watcher_id, epoch_id, validator_pubkey, uptime, agreement, latency_ms, ledger_index, signature.
Signature: detached Ed25519 over canonical JSON without `signature`, base58-encoded.
