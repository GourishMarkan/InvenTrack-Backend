import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService){}
  async create(createUserInput: CreateUserInput) {
    try {
      const user=await this.prisma.user.create({
        data:createUserInput
      })
      return user;
    } catch (error) {
      throw new HttpException(error.message,error.code);
    }
  }

  async findAll() {
   try {
    return await this.prisma.user.findMany()
   } catch (error) {
    throw new HttpException(error.message,error.code)
  }
}

async findOne(id: number) {
  try {
    return await this.prisma.user.findUnique({
      where:{
        id:id
      }
    })
  } catch (error) {
    throw new HttpException(error.message,error.code)
    
  }
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    try {
      const user=await this.prisma.user.update({
        where:{
          id:id
        },
        data:updateUserInput
      })
    
    } catch (error) {
      throw new HttpException(error.message,error.code)
    }
  }
  
  async remove(id: number) {
    try {
      // const user
    } catch (error) {
       throw new HttpException(error.message,error.code)
      
     }
  }
}
