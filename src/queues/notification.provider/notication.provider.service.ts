import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, tryCatch } from 'bullmq'
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Injectable()
@Processor("notification")

export class NotificationProcessor extends WorkerHost{
constructor( private readonly whatsappService:WhatsappService){
   super()
}
async process(job: Job, token?: string): Promise<any> {
    switch(job.name){
        case 'send-whatsapp-purchase-order':
            return await this.sendWhatsappPurchaseOrder(job.data)
    }
}

async sendWhatsappPurchaseOrder(data:any){
     console.log("data in queue",data);
     try {

        await this.whatsappService.sendOrderToSupplier(data.phoneNumber,"purchase_order_items",data);
    
        
     } catch (error) {
        console.log("error in. sendig whatsapp purchase order",error)
     }
}
}