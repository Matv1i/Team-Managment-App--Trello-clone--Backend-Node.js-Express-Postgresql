/*
  Warnings:

  - Made the column `productOwnerUserId` on table `Team` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectManagerUserId` on table `Team` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "productOwnerUserId" SET NOT NULL,
ALTER COLUMN "productOwnerUserId" SET DATA TYPE TEXT,
ALTER COLUMN "projectManagerUserId" SET NOT NULL,
ALTER COLUMN "projectManagerUserId" SET DATA TYPE TEXT;
