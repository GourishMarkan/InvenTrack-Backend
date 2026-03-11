import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
  imports:[PrismaModule,SupplierModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
