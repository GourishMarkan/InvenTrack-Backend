import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async createPdf(data: any): Promise<string> {
    try {
      // Validate input
      if (!data || !data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid data: products array is required');
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        this.logger.log(`Created uploads directory: ${uploadsDir}`);
      }

      const fileName = `po-${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      doc.fontSize(20).text('Purchase Order', {
        align: 'center',
      });

      doc.moveDown();

      doc.fontSize(14).text(`Supplier: ${data.supplierName}`);
      doc.text(`Mobile: ${data.supplierMobileNumber}`);

      doc.moveDown();

      doc.text('Items:', {
        underline: true,
      });

      data.products.forEach((product: any, index: number) => {
        doc.text(
          `${index + 1}. ${product.name} - Quantity: ${product.quantity}`,
        );
      });

      doc.end();

      // Wait for PDF to be written before returning
      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          this.logger.log(`PDF created successfully: ${filePath}`);
          resolve(filePath);
        });

        writeStream.on('error', (error) => {
          this.logger.error(`PDF write error: ${error.message}`);
          reject(error);
        });

        doc.on('error', (error) => {
          this.logger.error(`PDF generation error: ${error.message}`);
          reject(error);
        });
      });
    } catch (error) {
      this.logger.error(`PDF creation error: ${error.message}`);
      throw error;
    }
  }
}