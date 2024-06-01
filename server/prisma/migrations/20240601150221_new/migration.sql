/*
  Warnings:

  - Added the required column `orderId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `PaymentRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `PaymentRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PaymentRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'BIDDED';

-- DropIndex
DROP INDEX "PaymentRequest_requestedById_idx";

-- AlterTable
ALTER TABLE "Fine" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentRequestId" TEXT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaymentRequest" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invoiceNumber" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_paymentRequestId_fkey" FOREIGN KEY ("paymentRequestId") REFERENCES "PaymentRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
