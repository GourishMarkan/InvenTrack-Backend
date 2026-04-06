/*
  Warnings:

  - Added the required column `name` to the `Expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expenses" ADD COLUMN     "name" TEXT NOT NULL;
