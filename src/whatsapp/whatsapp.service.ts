import { Injectable, Logger } from '@nestjs/common';

import axios from 'axios';
@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private accessToken=process.env.WHATSAPP_ACCESS_TOKEN
  private baseUrl=`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
  constructor(){
     this.logger.log(`WhatsApp Phone Number ID: ${process.env.WHATSAPP_PHONE_NUMBER_ID}`);
    this.logger.log(`Access Token exists: ${!!this.accessToken}`)
  }

    private formatItemsToString(items: Array<{ name: string; quantity: number }>) {
    return items.map((i, ind) => `${i.name} ${i.name}  Quantity: ${i.quantity}`).join('\n');
  }

  async sendOrderToSupplier(phoneNumber:any,

    messageTemplate:any,
    parameter:any){

      console.log("parameter are",parameter)
      // in parameter there is items array with item name and item quantity converting it to formatted String
         const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    const fullPhone = '91' + cleanPhone; 
      const formattedItems=this.formatItemsToString(parameter.products)
      console.log("formattedItems",formattedItems)
      const template={
           messaging_product: 'whatsapp',
      to:fullPhone,
      type: 'template',
      template:{
        name:messageTemplate,
        language:{code:"en"},
        // language:{code:"en_US"},
         components: [
          
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                "parameter_name":"items",
                text: "biscuit:10",
              },
            ],
          },
        ],
      }
      };

       try {
            this.logger.log(`Sending WhatsApp to ${fullPhone}`);
      this.logger.log(`Base URL: ${this.baseUrl}`);
      this.logger.log(`Template payload: ${JSON.stringify(template, null, 2)}`);
      const response = await axios.post(this.baseUrl, template, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          // Authorization: `Bearer EAAUW6lUNVqMBRavtU2C6qXW0Ap8h5FuS0VkLHsx6V8GyWkNNTWU5MpYZBb8eom0SHcsZC1pMZB93fGZClDj4W9zTmcKIPCBHZAA1naN53onlNy6zN9puaOgPP1g3rcc9zcSHkxG8OEOVurXEomq2fsBc7NrCgqpvCR5GYXNtiLidgZA79c3ErruoAh4KleZAUjtGQZDZD`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Error sending message:',
        error.response?.data || error.message,
      );
       throw error;
    }
    }


  findAll() {
    return `This action returns all whatsapp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whatsapp`;
  }


 

  remove(id: number) {
    return `This action removes a #${id} whatsapp`;
  }
}
