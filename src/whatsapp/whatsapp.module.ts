import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService,PdfService],
    exports: [WhatsappService],
    // imports:[PdfService],
})
export class WhatsappModule {}
