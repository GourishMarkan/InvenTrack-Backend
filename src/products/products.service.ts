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

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
