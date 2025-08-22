/*
  Warnings:

  - You are about to drop the column `value` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."User_value_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "value",
ADD COLUMN     "masp" TEXT;
