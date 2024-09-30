/*
  Warnings:

  - You are about to drop the column `projectManagerUserIf` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "projectManagerUserIf",
ADD COLUMN     "projectManagerUserId" INTEGER;
