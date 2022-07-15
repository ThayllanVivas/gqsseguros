/*
  Warnings:

  - Added the required column `admin_mode` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "admin_mode" BOOLEAN NOT NULL;
