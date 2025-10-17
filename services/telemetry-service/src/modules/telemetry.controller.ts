
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TelemetryIngest } from '@xnode/schemas';
import { TelemetryService } from './telemetry.service';

@ApiTags('telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly svc: TelemetryService) {}

  @Post('ingest')
  @ApiOperation({ summary: 'Submit watcher metrics' })
  async ingest(@Body() body: any) {
    const parsed = TelemetryIngest.parse(body);
    return this.svc.ingest(parsed);
  }

  @Get('validator/:pubkey')
  @ApiOperation({ summary: 'Latest scores + history for a validator' })
  async byValidator(@Param('pubkey') pubkey: string, @Query('limit') limit = '50') {
    return this.svc.getByValidator(pubkey, Number(limit));
  }

  @Get('epoch/:id')
  @ApiOperation({ summary: 'Aggregated snapshot for an epoch' })
  async byEpoch(@Param('id') id: string) {
    return this.svc.getEpoch(Number(id));
  }
}
