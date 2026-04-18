import { Injectable } from '@nestjs/common';

import axios from 'axios';
@Injectable()
export class WhatsappService {

  private accessToken=process.env.WHATSAPP_ACCESS_TOKEN
  private baseUrl=` https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
  constructor(){}

  private formatItemsToString(items: Array<{ name: string; quantity: number }>){
     return items.map((i,ind)=>`${ind+1}.${i.name} -Quantity:${i.quantity}`).join("\n")
  }

  async sendOrderToSupplier(phoneNumber:any,

    messageTemplate:any,
    parameter:any){
      // in parameter there is items array with item name and item quantity converting it to formatted String
      const phone=phoneNumber.replace("+","")
      const formattedItems=this.formatItemsToString(parameter.items)
      const template={
           messaging_product: 'whatsapp',
      to:'91' + phone,
      type: 'template',
      template:{
        name:messageTemplate,
        language:{code:"en"},
        components:[
          {

            type:"body",
            parameter:[{
              type:"text",
              text:formattedItems
            }]
          }

        ]
      }
      };

       try {
      const response = await axios.post(this.baseUrl, template, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
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
