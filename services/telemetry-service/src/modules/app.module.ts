
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';

@Module({
  controllers: [TelemetryController],
  providers: [PrismaService, TelemetryService],
})
export class AppModule {}
