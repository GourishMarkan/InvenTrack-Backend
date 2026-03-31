-- AddForeignKey
ALTER TABLE "MinStock" ADD CONSTRAINT "MinStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
