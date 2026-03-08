import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  
  constructor( private prismaService:PrismaService){}
 async create(createProductDto: CreateProductDto) {
    try {
      const product=await this.prismaService.product.create({
        data:createProductDto
      })
      return product;
    } catch (error) {
      throw new HttpException(error.message,HttpStatus.BAD_REQUEST);
    }
  }
  
  async findAll() {
    try {
      return this.prismaService.product.findMany();
      
    } catch (error) {
     throw new HttpException(error.message,HttpStatus.BAD_REQUEST);
     
    }
  }
  
  async  findOne(id: number) {
    try {
      return this.prismaService.product.findFirst({
        where:{
          id:id
        }
      })
    } catch (error) {
      throw new HttpException(error.message,HttpStatus.BAD_REQUEST);
      
    }
  }
  
  async   update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return this.prismaService.product.update({
        where:{
          id:id
        },
        data:updateProductDto
      })
    } catch (error) {
      throw new HttpException(error.message,HttpStatus.BAD_REQUEST);
      
    }
  }
  
  async  remove(id: number) {
    try {
      return this.prismaService.product.update({
        where:{
          id:id
        },
        data:{
          isDeleted:true
        }
      })
    } catch (error) {
     throw new HttpException(error.message,HttpStatus.BAD_REQUEST);
    
   }
  }
}
