import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;
  @Field(()=>String)
  name:string;
  @Field(()=>String)
  password:string;
  @Field(()=>String)
  role:string
  @Field(()=>String)
  email:string
}
