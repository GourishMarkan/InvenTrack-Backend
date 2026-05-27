import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ProductsModule } from './products/products.module';
import { SupplierModule } from './supplier/supplier.module';
import { PurchasesModule } from './purchases/purchases.module';
import { StockMovementModule } from './stock-movement/stock-movement.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DailyLedgerModule } from './daily-ledger/daily-ledger.module';
import { OrdersModule } from './orders/orders.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { BullModule } from '@nestjs/bullmq';

import { NotificationModule } from './notification.module';
import { PdfModule } from './pdf/pdf.module';
@Module({
  imports: [
    BullModule.forRoot({
       connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name:"notification"
    }),
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath:`.env`,
      isGlobal:true
}),
    UsersModule,
    AuthModule,
    ProductsModule,
    SupplierModule,
    PurchasesModule,
    StockMovementModule,
    DashboardModule,
    DailyLedgerModule,
    OrdersModule,
    WhatsappModule,
    NotificationModule,
    PdfModule
   
  ],
  controllers: [AppController],
  providers: [AppService,
    {
    provide:APP_GUARD,
    useClass:JwtAuthGuard,
  },
  // NotificationProcessor
],
})
export class AppModule {}
