import { Field, Int } from "@nestjs/graphql";
import { IsInt, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
    @Field(()=>String)
    @IsString()
    name:string;
    @Field(()=>Int)
    @IsInt()
    @IsPositive()
    costPrice:number;
    @Field(()=>Int)
    @IsInt()
    @IsPositive()
    sellingPrice:number;
    @Field(()=>Int)
    @IsInt()
    stock:number;
    @Field(()=>Int)
    @IsInt()
   supplierId:number
}


