import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService:PrismaService){}
  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  async getSummary(to:string,from:string){
    const fromDate=new Date(from);
    const toDate=new Date(to);

    const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
    const [totalPurchases, totalPurchaseCount,todayPurchases,todayPurchaseCount,products]=await Promise.all([

      this.prismaService.purchase.aggregate({
         _sum:{total:true},
         where:{
           createdAt:{
             gte:from,
             lte:to
           }
         }
       }),

       this.prismaService.purchase.count({
            where:{
              createdAt:{
                gte:fromDate,
                lte:toDate
              }
            },
            
          }),

      this.prismaService.purchase.aggregate({
        _sum:{total:true},
        where:{
          createdAt:{
            gte:todayStart,
            lte:todayEnd
          }
        }
      }),
      this.prismaService.purchase.count({
        // _sum:{total:true},
        where:{
          createdAt:{
            gte:todayStart,
            lte:todayEnd
          }
        }
      }),
        this.prismaService.product.findMany({
      select: {
        stock: true,
        costPrice: true,
        minStock: true,
      },
    }),
  

    ])
    const totalInventoryValue=products.reduce((acc,p)=>{
      return acc+p.stock*p.costPrice
    },0)
    const lowStockCount = products.filter(
    (p) => p.stock <= p.minStock
  ).length;

  

   
   
    return {purchases:{
      totalPurchases:totalPurchases._sum.total||0,
      totalCount:totalPurchaseCount,
      todayPurchases:todayPurchases._sum.total||0,
      todayPurchaseCount:todayPurchaseCount


    },
    inventory:{
      totalValue:totalInventoryValue
    },
     alerts: {
      lowStockCount,
    },
  }


  }
  async getAnalyticsPurchase(to:Date,from:Date){
    const purchases=
      await this.prismaService.purchase.groupBy({
     by:[  'createdAt'],
     where:{
      createdAt:{
        gte:from,
        lte:to
      }
     },
     _sum:{total:true,totalQuantity:true}

      })
      return purchases;
  

  }

   async getTopProducts(to:Date,from:Date){
    
   }

  async getAnalyticsSupplier(){

  }
  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
