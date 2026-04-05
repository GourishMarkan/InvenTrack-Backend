import { IsInt, IsOptional, IsDateString, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType,ExpensesType } from '@prisma/client';
 // Adjust import path based on your Prisma setup

export class CreateExpenseDto {
  @IsInt()
  amount: number;

  @IsOptional()
  @IsEnum(ExpensesType)
  type?: ExpensesType;

  @IsOptional()
  @IsEnum(PaymentType)
  paymentMode?: PaymentType;
}

export class CreateDailyLedgerDto {
  @IsInt()
  totalSales: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsInt()
  cashInHand?: number;

  @IsOptional()
  @IsInt()
  upiAmount?: number;

  @IsOptional()
  @IsInt()
  dues?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseDto)
  expenses?: CreateExpenseDto[];
}