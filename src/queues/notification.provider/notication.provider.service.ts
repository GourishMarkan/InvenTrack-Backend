import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job,  } from 'bullmq'
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Injectable()
@Processor("notification")

export class NotificationProcessor extends WorkerHost{
  private readonly logger = new Logger(NotificationProcessor.name);
constructor( private readonly whatsappService:WhatsappService){
   super()
}
async process(job: Job, token?: string): Promise<any> {
   try {
      
      switch(job.name){
          case 'send-whatsapp-purchase-order':
              return await this.sendWhatsappPurchaseOrder(job.data)
      }
   } catch (error) {
       this.logger.error(`Error processing job ${job.id}:`, error);
      throw error;
   }
}

async sendWhatsappPurchaseOrder(data:any){
     console.log("data in queue",data);
     try {
        console.log("data in queue",data);

        await this.whatsappService.sendOrderToSupplier(data.supplierMobileNumber,"purchase_order_items",data);
    
        
     } catch (error) {
        console.log("error in. sendig whatsapp purchase order",error)
     }
}
}