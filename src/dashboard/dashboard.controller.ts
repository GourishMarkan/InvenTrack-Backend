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
   getSummary(@Param('to')to:string,@Param('from') from:string){
    return this.dashboardService.getSummary(to ,from)
   }

   @Get("/analytics/purchases")
   getAnalyticsPurchases(
    @Param('to') to:Date,
    @Param('from')from:Date
   ){
    return this.dashboardService.getAnalyticsPurchase(to,from);
   }

   @Get('/analytics/top-products')
   getTopProducts(to,from){
    return this.dashboardService.getTopProducts(to,from)
    
   }
   @Get('/analytics/Supplier')
   getSupplierAnalysis(to,from){
    return this.dashboardService.getAnalyticsSupplier(to,from)

   }

   @Get(`/analytics/profit-per-day`)
   getProfitPerDay(to,from){
    return this.dashboardService.getProfitPerDay(to,from)
   }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDashboardDto: UpdateDashboardDto) {
    return this.dashboardService.update(+id, updateDashboardDto);
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dashboardService.remove(+id);
  }
}
