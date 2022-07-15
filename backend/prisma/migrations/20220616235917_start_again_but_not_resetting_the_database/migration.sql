/*
  Warnings:

  - You are about to drop the `insurances` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_insurance_id_fkey";

-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_category_id_fkey";

-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_user_id_fkey";

-- DropTable
DROP TABLE "insurances";

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vehicleName" TEXT NOT NULL,
    "vehicleYear" TEXT NOT NULL,
    "VehiclePrice" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_insurance_id_fkey" FOREIGN KEY ("insurance_id") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
