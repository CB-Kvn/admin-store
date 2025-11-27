/*
  Warnings:

  - The primary key for the `DiscountFamily` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `familySlug` on the `DiscountFamily` table. All the data in the column will be lost.
  - Added the required column `familyId` to the `DiscountFamily` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DiscountFamily" DROP CONSTRAINT "DiscountFamily_familySlug_fkey";

-- AlterTable
ALTER TABLE "CatalogItem" ALTER COLUMN "attributes" SET DEFAULT '[]'::jsonb;

-- AlterTable
ALTER TABLE "DiscountFamily" DROP CONSTRAINT "DiscountFamily_pkey",
DROP COLUMN "familySlug",
ADD COLUMN     "familyId" TEXT NOT NULL,
ADD CONSTRAINT "DiscountFamily_pkey" PRIMARY KEY ("discountId", "familyId");
