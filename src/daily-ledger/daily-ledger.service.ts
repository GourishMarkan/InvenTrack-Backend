import { Injectable } from '@nestjs/common';
import { CreateDailyLedgerDto } from './dto/create-daily-ledger.dto';
import { UpdateDailyLedgerDto } from './dto/update-daily-ledger.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DailyLedgerService {
  constructor(private prismaService:PrismaService){}
  async create(createDailyLedgerDto: CreateDailyLedgerDto) {
    const {expenses=[],...rest}=createDailyLedgerDto;
    // using transaction
   return await this.prismaService.$transaction(async(tx)=>{

      
         const ledger=  await tx.dailyLedger.create({
            data:{
              ...rest
            }
          })
         if( expenses.length>0){
            
            await tx.expenses.createMany({
                data:
                  expenses.map((e)=>({
                    ...e,
                    // name:e.name,
                    dailyLedgerId:ledger.id,
                    
                  }))
                
              })
          }

          
          return ledger;
    },{
          maxWait: 5000,   // Wait up to 5s for a connection
      timeout: 15000
    })
  }

  async findAll() {
    return await this.prismaService.dailyLedger.findMany({
      include:{
        expenses:true
      }
    });
  }

  async findOne(id: number) {
    return  await this.prismaService.dailyLedger.findUnique({
      where:{
        id
      },
      include:{
        expenses:true
      }
    })
  }

  async update(id: number, updateDailyLedgerDto: UpdateDailyLedgerDto) {
    const {expenses=[],...rest}=updateDailyLedgerDto;
    return await this.prismaService.$transaction(async(tx)=>{
      const ledger=await tx.dailyLedger.update({
        where:{
          id:id
        },
        data:{
          ...rest
        }
      })

      for(const expense of expenses??[]){

         if (expense.id) {
          await tx.expenses.update({
            where: { id: expense.id },
            data: { ...expense }
          });
        } 
        // Otherwise, create a new one
        else {
          await tx.expenses.create({
            data: {
              name:expense.name!,
               amount: expense.amount!,
    type: expense.type,
    paymentMode: expense.paymentMode, 
              dailyLedgerId: ledger.id
            }
          });
        }

      }
      return ledger;
      // Promise.all(())
    })
  }

  async remove(id: number) {
    return await this.prismaService.$transaction(async(tx)=>{
      await tx.expenses.deleteMany({
        where:{
          dailyLedgerId:id
        }
      })
      const ledger=await tx.dailyLedger.delete({
        where:{
          id
        }
      })
      return ledger;
    })
  }

  async getProfit(to:Date,from:Date){
    // const ledger=await this.prismaService.dailyLedger.findFirst({
    //   where:{
    //     id
    //   },
    //   include:{
    //     expenses:true
    //   }
    // })

    const [totalSales,totalexpenses]=await Promise.all([
      
      this.prismaService.dailyLedger.aggregate({
        _sum:{
          totalSales:true
        },
        where:{
      
          date:{
            gte:from,
            lte:to
          }
        },
        
        
      }),

      this.prismaService.expenses.aggregate({
        _sum:{
          amount:true
        },
        where:{
 
         dailyLedger:{
          date:{
                 gte:from,
            lte:to
          }
         }
        },

      })

    ])
    const sales = totalSales?._sum.totalSales ?? 0;
    const expenses =totalexpenses._sum?.amount ?? 0;

    return {sales,expenses,profit:sales-expenses}

    

  
  }
}
