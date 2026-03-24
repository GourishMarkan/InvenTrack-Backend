import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import {  StockMovementType } from '@prisma/client';

@Injectable()
export class StockMovementService {
  constructor(private readonly prismaService:PrismaService){}
 

  async findAll() {
    return await  this.prismaService.stockMovement.findMany({
      orderBy:{
        createdAt:"desc"
      }
    })
  }
  

  async findByProduct(productId:number){
    return this.prismaService.stockMovement.findMany({
      where:{
        productId
      },
      orderBy:{
        createdAt:"desc"
      }
    })

  }

  async findByDate(from:Date,to:Date){
    return this.prismaService.stockMovement.findMany({
      where:{
        createdAt:{
          gte:from,
          lte:to
        },
        
      },
      orderBy:{
        createdAt:"desc"
      }
    })
  }
  async findByType(type:StockMovementType){
      return this.prismaService.stockMovement.findMany({
    where: {
      type:type
    }
  });
  }
  findOne(id: number) {
    return this.prismaService.stockMovement.findFirst({
      where:{
        productId:id
      },
      orderBy:{
        createdAt:"desc"
      }
    })
  }

  
}
