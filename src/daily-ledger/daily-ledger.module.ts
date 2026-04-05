import { Module } from '@nestjs/common';
import { DailyLedgerService } from './daily-ledger.service';
import { DailyLedgerController } from './daily-ledger.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [DailyLedgerController],
  providers: [DailyLedgerService],
})
export class DailyLedgerModule {}
