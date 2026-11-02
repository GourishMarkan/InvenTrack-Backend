import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {

  constructor(private readonly prisma:PrismaService){}
  async create(createOrderDto: CreateOrderDto) {
   console.log("created order is :",createOrderDto)
    let total=0;
    
  }

 async  findAll() {
    return await this.prisma.order.findMany();
  }

  async findOne(id: number) {
    return  await this.prisma.order.findUnique({
      where:{
        id
      }
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return await this.prisma.order.delete({
      where:{
        id
      }
    });
  }
}
