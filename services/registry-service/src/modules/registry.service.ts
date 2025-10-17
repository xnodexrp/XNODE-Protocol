
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ValidatorRegisterInput, DomainVerifyInput } from '@xnode/schemas';
import crypto from 'crypto';

@Injectable()
export class RegistryService {
  constructor(private readonly db: PrismaService) {}

  async registerValidator(input: ValidatorRegisterInput) {
    const nonce = crypto.randomBytes(16).toString('hex');
    const v = await this.db.validator.create({
      data: {
        validator_pubkey: input.validator_pubkey,
        operator_name: input.operator_name,
        contact_email: input.contact_email,
        domain: input.domain,
        ripple_token: input.ripple_validator_token,
        proof_method: input.proof_method,
        verified: false
      }
    });
    await this.db.domainProof.create({ data: { validatorId: v.id, method: input.proof_method, nonce } });
    return { id: v.id, instructions: this.proofInstructions(input.domain, nonce, input.proof_method) };
  }

  proofInstructions(domain: string, nonce: string, method: string) {
    if (method === 'well_known') {
      return { method, url: `https://${domain}/.well-known/xnode.txt`, expected_content: `xnode-domain-proof=${nonce}` };
    }
    return { method: 'dns_txt', record: `_xnode.${domain}`, expected_txt: `xnode-domain-proof=${nonce}` };
  }

  async verifyDomain(id: string, dto: DomainVerifyInput) {
    const dp = await this.db.domainProof.findFirst({ where: { validatorId: id } });
    if (!dp || dp.nonce !== dto.nonce) throw new NotFoundException('Invalid nonce or missing proof record');
    await this.db.validator.update({ where: { id }, data: { verified: true, verification_ts: new Date() } });
    return { ok: true };
  }

  async getValidator(pubkey: string) {
    const v = await this.db.validator.findUnique({ where: { validator_pubkey: pubkey } });
    if (!v) throw new NotFoundException('Validator not found');
    return v;
  }

  async listValidators(verified?: boolean) {
    return this.db.validator.findMany({ where: verified === undefined ? {} : { verified } });
  }
}
