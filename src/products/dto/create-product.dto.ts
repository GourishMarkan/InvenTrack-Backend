
import { IsInt, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
   
    @IsString()
    name:string;

    @IsInt()
    @IsPositive()
    costPrice:number;
   
    @IsInt()
    @IsPositive()
    sellingPrice:number;
   
    @IsInt()
    @Min(0)
    stock:number;
    @IsInt()
    @Min(0)
    minStock:number
   
    @IsInt()
   supplierId:number
}


