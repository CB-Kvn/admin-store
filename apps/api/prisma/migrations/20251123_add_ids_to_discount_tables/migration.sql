-- Formal migration: add auto-increment IDs to discount join tables
-- and convert composite primary keys to unique constraints.
-- Safe and idempotent: checks existence before altering.

-- DiscountProduct: add id, switch PK to id, keep unique on (discountId, itemId)
ALTER TABLE "DiscountProduct" ADD COLUMN IF NOT EXISTS "id" SERIAL;
ALTER TABLE "DiscountProduct" DROP CONSTRAINT IF EXISTS "DiscountProduct_pkey";
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'DiscountProduct_pkey'
      AND conrelid = '"DiscountProduct"'::regclass
  ) THEN
    ALTER TABLE "DiscountProduct" ADD CONSTRAINT "DiscountProduct_pkey" PRIMARY KEY ("id");
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS "DiscountProduct_discountId_itemId_key" ON "DiscountProduct"("discountId","itemId");

-- DiscountCategory: add id, switch PK to id, keep unique on (discountId, categoryId)
ALTER TABLE "DiscountCategory" ADD COLUMN IF NOT EXISTS "id" SERIAL;
ALTER TABLE "DiscountCategory" DROP CONSTRAINT IF EXISTS "DiscountCategory_pkey";
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'DiscountCategory_pkey'
      AND conrelid = '"DiscountCategory"'::regclass
  ) THEN
    ALTER TABLE "DiscountCategory" ADD CONSTRAINT "DiscountCategory_pkey" PRIMARY KEY ("id");
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS "DiscountCategory_discountId_categoryId_key" ON "DiscountCategory"("discountId","categoryId");

-- DiscountFamily: add id, switch PK to id, keep unique on (discountId, familyId)
ALTER TABLE "DiscountFamily" ADD COLUMN IF NOT EXISTS "id" SERIAL;
ALTER TABLE "DiscountFamily" DROP CONSTRAINT IF EXISTS "DiscountFamily_pkey";
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'DiscountFamily_pkey'
      AND conrelid = '"DiscountFamily"'::regclass
  ) THEN
    ALTER TABLE "DiscountFamily" ADD CONSTRAINT "DiscountFamily_pkey" PRIMARY KEY ("id");
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS "DiscountFamily_discountId_familyId_key" ON "DiscountFamily"("discountId","familyId");

-- DiscountUser: add id, switch PK to id, keep unique on (discountId, userId)
ALTER TABLE "DiscountUser" ADD COLUMN IF NOT EXISTS "id" SERIAL;
ALTER TABLE "DiscountUser" DROP CONSTRAINT IF EXISTS "DiscountUser_pkey";
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'DiscountUser_pkey'
      AND conrelid = '"DiscountUser"'::regclass
  ) THEN
    ALTER TABLE "DiscountUser" ADD CONSTRAINT "DiscountUser_pkey" PRIMARY KEY ("id");
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS "DiscountUser_discountId_userId_key" ON "DiscountUser"("discountId","userId");