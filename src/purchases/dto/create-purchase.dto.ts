import { PaymentStatus, PaymentType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";

export class CreatePurchaseDto {
    @IsNumber()
    total:number
    @IsNumber()
    totalQuantity:number
    @IsNumber()
    supplierId:number
    @IsEnum(PaymentType)
    paymentType:PaymentType
    @IsEnum(PaymentStatus)

    paymentStatus:PaymentStatus
    @IsDateString()
    purchaseDate:string
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItem)
    purchaseItems:PurchaseItem[]
}

export class PurchaseItem{
    @IsNumber()
  productId  :    number
  
  @IsNumber()
  @IsPositive()
  costPrice :number
  @IsNumber()
  @IsPositive()
  quantity   :   number

//   stockMovements StockMovement[]
}


