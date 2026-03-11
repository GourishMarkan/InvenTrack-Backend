import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplierService } from 'src/supplier/supplier.service';

@Injectable()
export class ProductsService {
  
  constructor( private prismaService:PrismaService ,private supplierService:SupplierService){}
 async create(createProductDto: CreateProductDto,userId:number) {
      //  checking whether supplier is there
      const supplier=await this.supplierService.findOne(createProductDto.supplierId)
      if(!supplier){
           throw new NotFoundException('Supplier not found');
      }

 
      const product=await this.prismaService.product.create({
        data:{
          ...createProductDto,
          createdBy:{connect:{id:userId}},
          updatedBy:{connect:{id:userId}}

        }
      })
      return product;
   
  }
  
  async findAll() {
    
      return this.prismaService.product.findMany({
        where:{
          isDeleted:false
        }
      });
      
 
  }
  
  async  findOne(id: number) {
 
      return this.prismaService.product.findFirst({
        where:{
          id:id,
          isDeleted:false
        }
      })
  
  }
  
  async   update(id: number, updateProductDto: UpdateProductDto) {
 
      return this.prismaService.product.update({
        where:{
          id:id
        },
        data:updateProductDto
      })
   
  }
  
  async  remove(id: number) {
 
      return this.prismaService.product.update({
        where:{
          id:id
        },
        data:{
          isDeleted:true
        }
      })
  
  }
}
