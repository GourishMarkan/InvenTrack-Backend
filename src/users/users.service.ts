import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
// import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService){}
  async create(createUserInput: CreateUserInput) {
    try {
      // console.log("input",createUserInput);

     const hashedPassword=await bcrypt.hash(createUserInput.password,10)
    //  console.log("hashed paaa",hashedPassword);
  
      const user=await this.prisma.user.create({
        data:{
        name:createUserInput.name,
        // ...createUserInput,
          password:hashedPassword,
          email:createUserInput.email,
          role:createUserInput.role
// 
        },
       
      })
      // console.log("user is",user);
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
