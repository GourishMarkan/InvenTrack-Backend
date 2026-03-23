import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class PurchasesService {
  constructor(private prismaService:PrismaService){}
  async create(createPurchaseDto: CreatePurchaseDto,userId:number) {
    await this.prismaService.$transaction(async(tx)=>{

      // 


         const { purchaseItems, supplierId, ...rest } = createPurchaseDto;
          const purchase=await tx.purchase.create({
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
                purchaseId:purchase.id

            }))
          })

          // updating the stock 
        for (const item of purchaseItems) {
            await tx.product.update({
              where:{
                id:item.productId
              },
              data:{
                stock:{
                  increment:item.quantity
                }
              }
            })
        }
          // stockMovement 
          // purchaseItems.map(async(item)=>(
          const stocksMovements=  await tx.stockMovement.createMany({
            data:purchaseItems.map((item)=>({
              productId:item.productId,
                quantity :item.quantity,
              type:"Purchase",
              createdById:userId,
              purchaseItemId:purchase.id
              // userStockMovement:{connect:{id:userId}}
              

            }))
          })
          return { purchase, stocksMovements, createdItems }
       
        })
  }

  async findAll() {
    return await this.prismaService.purchase.findMany({
      where:{
        isDeleted:false
      }
    })
  }
  
  async findOne(id: number) {
    return await this.prismaService.purchase.findUnique({
      where:{
        id,
        isDeleted:false
      }
    })

  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto,userId:number) {
   return  await this.prismaService.$transaction(async(tx)=>{
        // finding the purchase and reUpdating
      const { purchaseItems, supplierId,...rest } = updatePurchaseDto;
        // finding oldTimes FIrst
        const oldItems=await tx.purchaseItem.findMany({
          where:{
             purchaseId:id,
             isDeleted:false
          }
        })

        // reverese old stock
        for(const item of oldItems){
          await tx.product.update({
            where:{
              id:item.productId
            },data:{
              stock:{
                decrement:item.quantity
              }
            }
          })
          
          
        }
        
        // reversing the old stock movement
 
   await tx.stockMovement.createMany({
        data: oldItems.map((item) => ({
          productId: item.productId,
          quantity: -item.quantity,
          type: "Adjustment",
          createdById: userId,
        })),
      });


         

        // soft delete purchase items old

        await tx.purchaseItem.updateMany({
          where:{
            purchaseId:id
          },data:{
            isDeleted:true
          }
        })


        // update purchase
        const purchase=await tx.purchase.update({
          where:{
            id:id,
            isDeleted:false
          },data:{...rest,supplierId}
        })


        // creating a new   purchase item
          const purchasedItems=await tx.purchaseItem.createMany({
            data:purchaseItems?.map((item)=>({
              ...item,
              purchaseId: id
          
            }))?? []
          })

          // update the product with new stock
          if(purchaseItems){

            for (const item of purchaseItems) {
               await tx.product.update({
                where:{id:item.productId},
                data:{
                  stock:{
                    increment:item.quantity
                  }
                }
               })
             }
          }

        
       

        // creating new stock movement
         
    await tx.stockMovement.createMany({
      data: purchaseItems?.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        type: "Purchase",
        createdById: userId
      }))??[]
    });

      //  
     return purchase;


        
   })
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
