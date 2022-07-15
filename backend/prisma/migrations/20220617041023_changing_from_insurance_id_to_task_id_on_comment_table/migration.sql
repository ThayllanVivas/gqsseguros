/*
  Warnings:

  - You are about to drop the column `insurance_id` on the `comments` table. All the data in the column will be lost.
  - Added the required column `task_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_insurance_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "insurance_id",
ADD COLUMN     "task_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
