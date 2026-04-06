import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client'; // Adjust path if using custom generated types

export class CreateUserInput {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  // Make role strictly typed to the Prisma Enum
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}