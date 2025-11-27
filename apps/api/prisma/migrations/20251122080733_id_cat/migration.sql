/*
  Warnings:

  - The primary key for the `DiscountFamily` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "CatalogItem_familySlug_key";

-- AlterTable
ALTER TABLE "CatalogItem" ALTER COLUMN "attributes" SET DEFAULT '[]'::jsonb;

-- AlterTable
ALTER TABLE "DiscountFamily" DROP CONSTRAINT "DiscountFamily_pkey",
ADD CONSTRAINT "DiscountFamily_pkey" PRIMARY KEY ("discountId");
