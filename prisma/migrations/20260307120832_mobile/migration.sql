/*
  Warnings:

  - Added the required column `mobileNumber` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "mobileNumber" TEXT NOT NULL;
