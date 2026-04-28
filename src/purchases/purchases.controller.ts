import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PurchasesService, SupplierOrder } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { Public } from 'src/common/decorators/public.decorator';
@UseGuards(JwtAuthGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto, @CurrentUser() user) {
    return this.purchasesService.create(createPurchaseDto,user.id);
  }

  @Get()
  findAll() {
    return this.purchasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto,@CurrentUser() user) {
    return this.purchasesService.update(+id, updatePurchaseDto,user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@CurrentUser() user) {
    return this.purchasesService.remove(+id,user.id);
  }
  // @Public()
  @Post("/order-items")
  orderItemsWhatsapp(
    @Body('items') items: any
  ){
     console.log('Received items in controller:', items); // Debug log
    
    // if (!items || !Array.isArray(items)) {
    //   throw new Error('Items must be an array');
    // }
    return this.purchasesService.orderItems(items)

  }
}
