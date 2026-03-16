import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class PurchasesService {
  constructor(private prismaService:PrismaService){}
  async create(createPurchaseDto: CreatePurchaseDto,userId:number) {
        const result =await this.prismaService.$transaction(async(tx)=>{

         const { purchaseItems, supplierId, ...rest } = createPurchaseDto;
          const mainPurchase=await tx.purchase.create({
            data:{
             ...rest,
             supplier:{connect:{id:supplierId}},
          user:{ connect: { id: userId } }
            },
          })
          // purchasesItem crud below

          const createdItems=await  tx.purchaseItem.createMany({
            data:purchaseItems.map((item)=>({
              ...item,
                purchaseId:mainPurchase.id

            }))
          })

          // updating the stock 
          // const purchase=await this.prismaService.purchase.createManyAndReturn({
          //   data:
          // })
        })
  }

  findAll() {
    return `This action returns all purchases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
