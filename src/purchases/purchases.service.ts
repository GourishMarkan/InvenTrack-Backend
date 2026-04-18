import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto, PurchaseItem } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class PurchasesService {
  constructor(private prismaService:PrismaService){}
  async create(createPurchaseDto: CreatePurchaseDto,userId:number) {
    // console.log("createPurchase",createPurchaseDto)
   return await this.prismaService.$transaction(async(tx)=>{

      // 


         const { purchaseItems, supplierId, ...rest } = createPurchaseDto;
         console.log("inside transactions",tx)
          const purchase=await tx.purchase.create({
            data:{
             ...rest,
             supplier:{connect:{id:supplierId}},
          user:{ connect: { id: userId } }
            },
          })
          console.log("purchase",purchase);
          // purchasesItem crud below

          const createdItems=await  tx.purchaseItem.createManyAndReturn({
            data:purchaseItems.map((item)=>({
              ...item,
                purchaseId:purchase.id

            }))
          })
          console.log("createdItems",createdItems)

          // updating the stock 
            await Promise.all(
        purchaseItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          })
        )
      );
          // stockMovement 
          // purchaseItems.map(async(item)=>(
          const stocksMovements=  await tx.stockMovement.createManyAndReturn({
            data:createdItems.map((item:any)=>({
              productId:item.productId,
                quantity :item.quantity,
              type:"Purchase",
              createdById:userId,
              purchaseItemId:item.id
              // userStockMovement:{connect:{id:userId}}
              

            }))
          })
          console.log("stock movements",stocksMovements)
          return { purchase, stocksMovements, createdItems }
       
        },{
          maxWait: 5000,   // Wait up to 5s for a connection
      timeout: 15000
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

  async remove(id: number,userId:number) {
    return await this.prismaService.$transaction(async(tx)=>{
      // Get purchase items
      const items=await tx.purchaseItem.findMany({
        where:{
          purchaseId:id,
          isDeleted:false
        }
      })
      // reverse stock
      for(const {productId,quantity} of items){
         await tx.product.update({
          where:{id:productId},
          data:{
            stock:{
              decrement:quantity
            }
          }
         })
      }
      if (items.length > 0) {
      await tx.stockMovement.createMany({
        data: items.map((item) => ({
          productId: item.productId,
          quantity: -item.quantity,
          type: "Adjustment", // or "Reversal"
          createdById: userId,
        })),
      });
    }
  
    // soft delete purchase items
    await tx.purchaseItem.updateMany({
      where: { purchaseId: id },
      data: { isDeleted: true },
    });
  
    // soft delete purchase
    await tx.purchase.update({
      where: { id },
      data: { isDeleted: true },
    });
  
    return { message: "Purchase deleted successfully" };
    })

  
  }

  // function to send message from whatsapp 

  async orderItems(items:[{
    id:number,
    name:string,
    quantity:number
  }]){
    // const orderingitems=await this.prismaService.product.findMany({
    //   where:{
    //     id:{
    //       in:items.map((i)=>i.id)
    //     }
    //   }
    //   ,
    //   select:{
    //     supplier:true,
    //     supplierId:true,
    //     name:true,
    //   }
  
    // 
   
  // ).
  //  const grouped = orderingItems.reduce((acc, product) => {
  //   const key = product.supplierId;
  //   if (!acc[key]) {
  //     acc[key] = {
  //       supplierId: product.supplierId,
  //       supplierName: product.supplier.name,
  //       supplierMobileNumber: product.supplier.mobileNumber,
  //       products: []
  //     };
  //   }
  //   acc[key].products.push({ id: product.id, name: product.name });
  //   return acc;
  // }, {} as Record<number, any>);

  // return Object.values(grouped);
  const productIds = items.map(i => i.id);
  const orderingItemsGroupedBySupplier=await this.prismaService.$queryRaw`
  SELECT p."name" as "name ",p."id" as"id", s."mobileNumber" as"SupplierMobileNumber",      s."id" as "supplierId",
      s."name" as "supplierName" FROM "Product" p JOIN "Supplier" s on p."supplierId"=s."id"
  WHERE p."id" IN ANY(${productIds}::int[])
    GROUP BY  s."id"
  
  `
  return orderingItemsGroupedBySupplier;


  }
}
