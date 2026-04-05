import { PartialType, OmitType } from '@nestjs/mapped-types'; // Import OmitType
import { CreateDailyLedgerDto, CreateExpenseDto } from './create-daily-ledger.dto';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateExpensesDto extends PartialType(CreateExpenseDto) {
    @IsInt()
    id: number;
}


export class UpdateDailyLedgerDto extends PartialType(OmitType(CreateDailyLedgerDto, ['expenses'] as const)) {
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateExpensesDto)
    expenses?: UpdateExpensesDto[];
}

