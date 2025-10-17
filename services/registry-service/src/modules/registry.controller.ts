
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { z } from 'zod';
import { ValidatorRegisterInput, DomainVerifyInput } from '@xnode/schemas';
import { RegistryService } from './registry.service';

@ApiTags('registry')
@Controller('registry')
export class RegistryController {
  constructor(private readonly svc: RegistryService) {}

  @Post('validator')
  @ApiOperation({ summary: 'Register a validator (pending verification)' })
  async register(@Body() body: any) {
    const parsed = ValidatorRegisterInput.parse(body);
    return this.svc.registerValidator(parsed);
  }

  @Post('validator/:id/verify')
  @ApiOperation({ summary: 'Verify domain proof (DNS TXT or /.well-known)' })
  async verify(@Param('id') id: string, @Body() body: any) {
    const parsed = DomainVerifyInput.parse(body);
    return this.svc.verifyDomain(id, parsed);
  }

  @Get('validator/:pubkey')
  @ApiOperation({ summary: 'Get validator' })
  async byPubkey(@Param('pubkey') pubkey: string) {
    return this.svc.getValidator(pubkey);
  }

  @Get('validators')
  @ApiOperation({ summary: 'List validators (filter by verified)' })
  async list(@Query('verified') verified?: string) {
    const v = verified === 'true' ? true : verified === 'false' ? false : undefined;
    return this.svc.listValidators(v);
  }
}
