import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';


@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
   
  @Post()
  create(@Body() createProductDto: CreateProductDto,@CurrentUser() user ) {
    return this.productsService.create(createProductDto,user.id);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,@CurrentUser() user ) {
    return this.productsService.update(+id, updateProductDto,user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@CurrentUser() user) {
    return this.productsService.remove(+id,user.id);
  }
}
