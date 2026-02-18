import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';  
@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  @IsEmail()
  email: string;
  @Field(()=>String)
  @IsString()
  name:string
  @Field(()=>String)
  @IsString()
  @MinLength(6)
  password:string
  @Field(() => String)
  @IsString()
   roles:string
}
