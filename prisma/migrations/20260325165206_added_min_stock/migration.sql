/*
  Warnings:

  - Added the required column `minStock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "minStock" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MinStock" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinStock_pkey" PRIMARY KEY ("id")
);
