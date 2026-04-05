import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyLedgerService } from './daily-ledger.service';
import { CreateDailyLedgerDto } from './dto/create-daily-ledger.dto';
import { UpdateDailyLedgerDto } from './dto/update-daily-ledger.dto';

@Controller('daily-ledger')
export class DailyLedgerController {
  constructor(private readonly dailyLedgerService: DailyLedgerService) {}

  @Post()
  create(@Body() createDailyLedgerDto: CreateDailyLedgerDto) {
    return this.dailyLedgerService.create(createDailyLedgerDto);
  }

  @Get()
  findAll() {
    return this.dailyLedgerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyLedgerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyLedgerDto: UpdateDailyLedgerDto) {
    return this.dailyLedgerService.update(+id, updateDailyLedgerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyLedgerService.remove(+id);
  }
}
