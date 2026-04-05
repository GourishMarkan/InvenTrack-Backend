import { Test, TestingModule } from '@nestjs/testing';
import { DailyLedgerController } from './daily-ledger.controller';
import { DailyLedgerService } from './daily-ledger.service';

describe('DailyLedgerController', () => {
  let controller: DailyLedgerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyLedgerController],
      providers: [DailyLedgerService],
    }).compile();

    controller = module.get<DailyLedgerController>(DailyLedgerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
