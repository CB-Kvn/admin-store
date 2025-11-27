/*
  Warnings:

  - You are about to drop the column `color` on the `CatalogItem` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `CatalogItem` table. All the data in the column will be lost.
  - You are about to drop the `_CatalogItemToClosureType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CatalogItemToColor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CatalogItemToMaterial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CatalogItemToClosureType" DROP CONSTRAINT "_CatalogItemToClosureType_A_fkey";

-- DropForeignKey
ALTER TABLE "_CatalogItemToClosureType" DROP CONSTRAINT "_CatalogItemToClosureType_B_fkey";

-- DropForeignKey
ALTER TABLE "_CatalogItemToColor" DROP CONSTRAINT "_CatalogItemToColor_A_fkey";

-- DropForeignKey
ALTER TABLE "_CatalogItemToColor" DROP CONSTRAINT "_CatalogItemToColor_B_fkey";

-- DropForeignKey
ALTER TABLE "_CatalogItemToMaterial" DROP CONSTRAINT "_CatalogItemToMaterial_A_fkey";

-- DropForeignKey
ALTER TABLE "_CatalogItemToMaterial" DROP CONSTRAINT "_CatalogItemToMaterial_B_fkey";

-- AlterTable
ALTER TABLE "CatalogItem" DROP COLUMN "color",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "discountAmount" DOUBLE PRECISION,
ADD COLUMN     "discountId" INTEGER;

-- DropTable
DROP TABLE "_CatalogItemToClosureType";

-- DropTable
DROP TABLE "_CatalogItemToColor";

-- DropTable
DROP TABLE "_CatalogItemToMaterial";

-- CreateTable
CREATE TABLE "Size" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Size_name_key" ON "Size"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stone_name_key" ON "Stone"("name");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
