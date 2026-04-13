import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

 

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dashboardService.findOne(+id);
  // }
  @Get('/summary')
   getSummary(@Body('to')to:string,@Body('from') from:string){
    return this.dashboardService.getSummary(to ,from)
   }

   @Get("/analytics/purchases")
   getAnalyticsPurchases(
  @Body('to')to:Date,@Body('from') from:Date
   ){
    return this.dashboardService.getAnalyticsPurchase(to,from);
   }

   @Get('/analytics/top-products')
   getTopProducts(@Body('to')to:Date,@Body('from') from:Date){
    return this.dashboardService.getTopProducts(to,from)
    
   }
   @Get('/analytics/Supplier')
   getSupplierAnalysis(@Body('to')to:Date,@Body('from') from:Date){
    return this.dashboardService.getAnalyticsSupplier(to,from)

   }

   @Get(`/analytics/profit-per-day`)
   getProfitPerDay(@Body('to')to:Date,@Body('from') from:Date){
    return this.dashboardService.getProfitPerDay(to,from)
   }

   @Get(`/analytics/profit-week`)

  getProfitWeekly(@Body('to')to:Date,@Body('from') from:Date) {
    return this.dashboardService.getWeeklyProfit(to,from);
  }

  

  
}
