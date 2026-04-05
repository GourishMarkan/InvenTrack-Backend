import { Test, TestingModule } from '@nestjs/testing';
import { DailyLedgerService } from './daily-ledger.service';

describe('DailyLedgerService', () => {
  let service: DailyLedgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyLedgerService],
    }).compile();

    service = module.get<DailyLedgerService>(DailyLedgerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
