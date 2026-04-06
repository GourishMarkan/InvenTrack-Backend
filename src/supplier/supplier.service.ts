import { HttpException, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private prismaService:PrismaService ){}
  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const supplier=await this.prismaService.supplier.create({
        data:createSupplierDto
      })
      return supplier
    } catch (error) {
      throw new HttpException(error.message,error.BAD_REQUEST)
    }
  }
  
  async  findAll() {
    try {
      return this.prismaService.supplier.findMany({
        where:{
          isDeleted:false
        }
      })
    } catch (error) {
      throw new HttpException(error.message,error.BAD_REQUEST)
      
    }
  }
  
  async findOne(id: number) {
    try {
      return this.prismaService.supplier.findFirst({
        where:{
          id:id,
          isDeleted:false
        }
      })
    } catch (error) {
  throw new HttpException(error.message,error.BAD_REQUEST)
  
}
}

async update(id: number, updateSupplierDto: UpdateSupplierDto) {
  try {
    const update=this.prismaService.supplier.update({
      where:{
        id:id
      },
      data:updateSupplierDto
    })
    return update
    
  } catch (error) {
    throw new HttpException(error.message,error.BAD_REQUEST)
    
  }
}

async remove(id: number) {
  try {
    return this.prismaService.supplier.update({
      where:{
        id:id
      },
      data:{
        isDeleted:true
      }
    })
  } catch (error) {
    throw new HttpException(error.message,error.BAD_REQUEST)
    
}
  }
}
