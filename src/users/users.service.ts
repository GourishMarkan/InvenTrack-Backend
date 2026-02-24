import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService){}
  async create(createUserInput: CreateUserInput) {
    try {

     const hashedPassword=await bcrypt.hash(createUserInput.password,10)
  
      const user=await this.prisma.user.create({
        data:{
          ...createUserInput,
          password:hashedPassword

        },
       
      })
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException(error.message,error.code);
    }
  }

  async findAll() {
   try {
    return await this.prisma.user.findMany({
      where:{
        isDeleted:false
      }
    })
   } catch (error) {
    throw new HttpException(error.message,error.code)
  }
}

async findOne(id: number) {
  try {
    return await this.prisma.user.findFirst({
      where:{
        id:id,
        isDeleted:false
      }
    })
  } catch (error) {
    throw new HttpException(error.message,error.code)
    
  }
}

async findOneByEmail(email:string){
  try {
    return await this.prisma.user.findFirst({
      where:{
        email:email,
        isDeleted:false
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
          id:id,
          // isDeleted:f
        },
        data:updateUserInput
      })
      return user
    
    } catch (error) {
      throw new HttpException(error.message,error.code)
    }
  }
  
  async remove(id: number) {
    try {
      // const user
      return await this.prisma.user.update({
        where:{
          id:id
        },
        data:{
          isDeleted:true
        }
      })
    } catch (error) {
       throw new HttpException(error.message,error.code)
      
     }
  }
}
