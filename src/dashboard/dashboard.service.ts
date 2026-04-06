import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfISOWeek, getISOWeek, getISOWeekYear } from 'date-fns';
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
    // const purchases=
    //   await this.prismaService.purchase.groupBy({
    //  by:[  'createdAt'],
    //  where:{
    //   createdAt:{
    //     gte:from,
    //     lte:to
    //   }
    //  },
    //  _sum:{total:true,totalQuantity:true}

    //   })
    //   return purchases;
    const purchases=await this.prismaService.$queryRaw<{
      date:string;
      totalQuantity:number;
      totalAmount:number;

    }[]>`SELECT DATE("createdAt") as date,SUM("total") as "totalAmount",Sum("totalQuantity") as "totalQuantity" FROM "Purchase" WHERE "createdAt">=${from} And "createdAt"<=${to} GROUP BY DATE("createdAt") ORDER BY DATE("createdAt") ASC`

    return purchases;
  

  }

   async getTopProducts(to:Date,from:Date){
     const topProduct=await this.prismaService.$queryRaw<{
      productId:number;
      productName:string;
      totalQuantity:number;
      totalRevenue:number;

     }>` SELECT 
      pi."productId" as "productName",
      pro."name" as "productName",
      SUM(pi."quantity") as "totalQuantity",
      SUM(pi."quantity" * pro."sellingPrice") as "totalRevenue"
    FROM "PurchaseItem" pi
    JOIN "Purchase" purc
      ON pi."purchaseId" = purc."id"
    JOIN "Product" pro
      ON pi."productId" = pro."id"
    WHERE purc."createdAt" >= ${from}
      AND purc."createdAt" <= ${to}
    GROUP BY pi."productId", pro."name"
    ORDER BY "totalQuantity" DESC
    LIMIT 5`;
     return topProduct;
   }

  async getAnalyticsSupplier(to:Date,from:Date){
    const topSupplier=await this.prismaService.$queryRaw<{supplierName:string;totalPurchaseAmount:number}>
    `
    SELECT s."name" as "supplierName",COALESCE(SUM(purc."total"), 0) as "totalPurchaseAmount" FROM "Supplier" s JOIN "Purchase" purc 
    ON purc."supplierId"=s."id"
    WHERE purc."createdAt">=${from}
    AND purc."createdAt"<=${to}
    AND s."isDeleted"=false
    
    GROUP BY s."id",s."name"
    ORDER BY "totalPurchaseAmount" DESC
    LIMIT 5
    `
    return topSupplier;

  }

  async getProfitPerDay(from: Date, to: Date) {
  const ledgers = await this.prismaService.dailyLedger.findMany({
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
    include: {
      expenses:{
       where:{
        type:"ShopExpense"
       }
      }
    },
    orderBy: {
      date: 'asc',
    },
  });

  return ledgers.map((ledger) => {
    const totalExpenses = ledger.expenses.reduce(
      (acc, exp) => acc + exp.amount,
      0
    );

    const totalSales = ledger.totalSales ?? 0;

    return {
      date: ledger.date,
      totalSales,
      totalExpenses,
      profit: totalSales - totalExpenses,
    };
  });
}

async getWeeklyProfit(from: Date, to: Date) {
  const ledgers = await this.prismaService.dailyLedger.findMany({
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
    include: {
      expenses: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  const weeklyMap = new Map<string, number>();

  for (const ledger of ledgers) {
    // 1️⃣ calculate daily profit
    const totalExpenses = ledger.expenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );

    const profit = (ledger.totalSales ?? 0) - totalExpenses;


    const week = getISOWeek(ledger.date);
    const year = getISOWeekYear(ledger.date);

   
    const weekKey = `${year}-W${String(week).padStart(2, '0')}`;


    weeklyMap.set(
      weekKey,
      (weeklyMap.get(weekKey) ?? 0) + profit
    );
  }


  return Array.from(weeklyMap.entries()).map(([week, profit]) => ({
    week,
    profit,
  }));
}

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
