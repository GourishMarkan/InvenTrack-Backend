import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import axios from 'axios';
import { PdfService } from 'src/pdf/pdf.service';
@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private accessToken=process.env.WHATSAPP_ACCESS_TOKEN
  private phoneNumberId=process.env.WHATSAPP_PHONE_NUMBER_ID
  private baseUrl=`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
    private readonly maxParameter = 40;
  constructor( private readonly pdfService:PdfService){
     this.logger.log(`WhatsApp Phone Number ID: ${process.env.WHATSAPP_PHONE_NUMBER_ID}`);
    this.logger.log(`Access Token exists: ${!!this.accessToken}`)
    
  }

  //   private formatItemsToString(items: Array<{ name: string; quantity: number }>) {
  //   return items.map((i, ind) => `${i.name}  Quantity: ${i.quantity}`).join('/n');
  // }

  async sendOrderToSupplier(phoneNumber:any,

    messageTemplate:any,
    parameter:any){

      console.log("parameter are",parameter)
      // in parameter there is items array with item name and item quantity converting it to formatted String
         const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    const fullPhone = '91' + cleanPhone; 

      // const productChunks = this.chunkArray(parameter.products, this.maxParameter);
      try{
      //  const results = [];
      //  for (let i = 0; i < productChunks.length; i++) {
        // const itemParameters = productChunks[i].map((item: any) => ({
        //   type: 'text',
        //   text: `${item.name} - Quantity: ${item.quantity}`,
        // }));
     
         // Pad parameters to match template if less than MAX_PARAMETERS
        // while (itemParameters.length < this.maxParameter) {
        //   itemParameters.push({
        //     type: 'text',
        //     text: '',
        //   });
        // }
        // creating pdf
         const pdf=await this.pdfService.createPdf(parameter)as string;
        //  uploading pdf to meta
        const mediaId=await this.uploadMediaWhatsapp(pdf);
        //   const itemsText = parameter.products
        // .map((item: any) => `${item.name} - Quantity: ${item.quantity}`)
        // .join('\n');
      const template={
           messaging_product: 'whatsapp',
      to:fullPhone,
      type: 'template',
      template:{
        name:"ordertemplatepdf",
        language:{code:"en"},
        // language:{code:"en_US"},
         components: [
          
          {
            type: 'header',
            // parameters:itemParameters,
            parameters: [
              {
                type: 'document',
                // "parameter_name":"items",
                // text:itemsText,
                 document: {
                  id: mediaId,
                  filename: 'purchase-order.pdf',
                },
              },
            ],
          },
        ],
      }
      };

    
            this.logger.log(`Sending WhatsApp to ${fullPhone}`);

      this.logger.log(`Template payload: ${JSON.stringify(template, null, 2)}`);
      const response = await axios.post(this.baseUrl, template, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
 
          'Content-Type': 'application/json',
        },
      });
        // results.push(response.data);
        // console.log(`Message batch ${i + 1} sent:`, response.data);

        //  if (i < productChunks.length - 1) {
        //   await this.delay(1000);
        // }
    // }
      return response.data;
      //  return { success: true, batches: productChunks.length, results }
    } catch (error) {
      console.error(
        'Error sending message:',
        error.response?.data || error.message,
      );
       throw error;
    }
    }
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async uploadMediaWhatsapp(filePath:string){
    try {
      const fileBuffer=await fs.promises.readFile(filePath);
      const filename = filePath.split('/').pop();
    
     // Create Blob from buffer
      const blob = new Blob([fileBuffer], { type: 'application/pdf' });
      const formData=new FormData()
      formData.append(
        'file',
        blob,
        filename
       
      );
      formData.append(
        'messaging_product',
        'whatsapp'
      )

      const response=await axios.post(`https://graph.facebook.com/v22.0/${this.phoneNumberId}/media`,
        formData,{
          headers:{
            Authorization:`Bearer ${this.accessToken}`,
           
          },
          maxBodyLength: Infinity,
        },
      );

      this.logger.log(
        `Media uploaded successfully: ${response.data.id}`,
      );

      return response.data.id;

      
    } catch (error) {
       this.logger.error(
        'Error uploading media',
        error.response?.data || error.message,
      );

      throw error;
    }

  }

}
