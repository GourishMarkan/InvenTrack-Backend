import { IsNumber, IsString } from "class-validator";

export class CreatePurchaseDto {
    @IsNumber()
    total:number
    @IsNumber()
    totalQuantity:number
    @IsNumber()
    supplierId:number
    @IsString()
    paymentType:string
    @IsString()
    paymentStatus:string
}

export class purchaseItem{
    @IsNumber()
  productId  :    number
  
  @IsNumber()
  
  costPrice :number
  @IsNumber()
  quantity   :   number
//   stockMovements StockMovement[]
}

export class paymentType{

}
