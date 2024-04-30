-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_writerId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "writerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
