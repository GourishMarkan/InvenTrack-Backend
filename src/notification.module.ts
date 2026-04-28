import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { NotificationProcessor } from './queues/notification.provider/notication.provider.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification',
    }),
    WhatsappModule,
  ],
  providers: [NotificationProcessor],
})
export class NotificationModule {}