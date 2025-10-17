
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TelemetryIngest } from '@xnode/schemas';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

function payloadForSign(input: TelemetryIngest): Uint8Array {
  const { signature, ...rest } = input as any;
  return new TextEncoder().encode(JSON.stringify(rest));
}

@Injectable()
export class TelemetryService {
  constructor(private readonly db: PrismaService) {}

  async ingest(input: TelemetryIngest) {
    // TODO: fetch watcher pubkey by watcher_id and verify signature
    // const watcher = await this.db.watcher.findUnique({ where: { id: input.watcher_id } });
    // const ok = nacl.sign.detached.verify(payloadForSign(input), bs58.decode(input.signature), bs58.decode(watcher.pubkey));
    // if (!ok) throw new Error('Invalid signature');

    await this.db.telemetry.create({ data: {
      watcherId: input.watcher_id, epoch_id: input.epoch_id, validator_pubkey: input.validator_pubkey,
      uptime: input.uptime, agreement: input.agreement, latency_ms: input.latency_ms,
      ledger_index: input.ledger_index, signature: input.signature
    }});
    return { accepted: true };
  }

  async getByValidator(pubkey: string, limit = 50) {
    return this.db.epochAggregate.findMany({ where: { validator_pubkey: pubkey }, orderBy: { epoch_id: 'desc' }, take: limit });
  }

  async getEpoch(epoch_id: number) {
    return this.db.epochAggregate.findMany({ where: { epoch_id }, orderBy: { score: 'desc' } });
  }
}
