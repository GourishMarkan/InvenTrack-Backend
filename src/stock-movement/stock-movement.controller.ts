import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { StockMovementType } from '@prisma/client';

@Controller('stock-movement')
@UseGuards(JwtAuthGuard)
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}

  

  @Get()
  findAll() {
    return this.stockMovementService.findAll();
  }

  @Get('product/:productId')
  findByProduct(
    @Param('productId', ParseIntPipe) productId: number
  ) {
    return this.stockMovementService.findByProduct(productId);
  }

 
  @Get('type/:type')
  findByType(@Param('type') type: StockMovementType) {
    return this.stockMovementService.findByType(type);
  }

  // 4️⃣ Get by date range
  @Get('date')
  findByDate(
    @Query('from') from: string,
    @Query('to') to: string
  ) {
    return this.stockMovementService.findByDate(new Date(from), new Date(to));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockMovementService.findOne(+id);
  }
 

 
}
