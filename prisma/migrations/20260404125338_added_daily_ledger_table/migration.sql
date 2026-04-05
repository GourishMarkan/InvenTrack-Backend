-- CreateEnum
CREATE TYPE "ExpensesType" AS ENUM ('ShopExpense', 'HouseExpense');

-- CreateTable
CREATE TABLE "DailyLedger" (
    "id" SERIAL NOT NULL,
    "totalSales" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cashInHand" INTEGER,
    "upiAmount" INTEGER,
    "dues" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "dailyLedgerId" INTEGER NOT NULL,
    "type" "ExpensesType" NOT NULL DEFAULT 'ShopExpense',
    "paymentMode" "PaymentType" NOT NULL DEFAULT 'Cash',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyLedger_date_key" ON "DailyLedger"("date");

-- CreateIndex
CREATE INDEX "Expenses_dailyLedgerId_idx" ON "Expenses"("dailyLedgerId");

-- CreateIndex
CREATE INDEX "Purchase_createdAt_idx" ON "Purchase"("createdAt");

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_dailyLedgerId_fkey" FOREIGN KEY ("dailyLedgerId") REFERENCES "DailyLedger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
