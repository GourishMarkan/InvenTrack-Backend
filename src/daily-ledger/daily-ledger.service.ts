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
                    dailyLedgerId:ledger.id,
                    
                  }))
                
              })
          }

          
          return ledger;
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

        await tx.expenses.upsert({
          where:{
            // dailyLedgerId:ledger.id
            id:expense.id||-1
          },
          update:{
            ...expense
          },
          create:{
           amount: expense.amount!, 
            type: expense.type,
            paymentMode: expense.paymentMode,
            dailyLedgerId: ledger.id
          }
        })

      }
      return ledger;
      // Promise.all(())
    })
  }

  async remove(id: number) {
    return await this.prismaService.$transaction(async(tx)=>{
      const ledger=await tx.dailyLedger.delete({
        where:{
          id
        }
      })
      await tx.expenses.deleteMany({
        where:{
          dailyLedgerId:id
        }
      })
      return ledger;
    })
  }
}
