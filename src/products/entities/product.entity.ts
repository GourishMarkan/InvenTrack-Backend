import { ObjectType, Field, Int } from '@nestjs/graphql';
export class Product {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  costPrice: number;

  @Field(() => Int)
  sellingPrice: number;

  @Field(() => Int)
  stock: number;

  @Field(() => Int)
  supplierId: number;

  @Field(() => Date)
  createdAt: Date;

//   @Field(() => [OrderItem], { nullable: true })
//   orderItems?: OrderItem[];

//   @Field(() => [PurchaseItem], { nullable: true })
//   purchaseItems?: PurchaseItem[];

//   @Field(() => [StockMovement], { nullable: true })
//   stockMovements?: StockMovement[];

//   @Field(() => Supplier, { nullable: true })
//   supplier?: Supplier;
}
