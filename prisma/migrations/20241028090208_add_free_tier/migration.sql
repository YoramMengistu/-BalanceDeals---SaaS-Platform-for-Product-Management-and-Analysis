/*
  Warnings:

  - The values [Free] on the enum `Tier` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Tier_new" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'PRO');
ALTER TABLE "UserSubscription" ALTER COLUMN "tier" TYPE "Tier_new" USING ("tier"::text::"Tier_new");
ALTER TYPE "Tier" RENAME TO "Tier_old";
ALTER TYPE "Tier_new" RENAME TO "Tier";
DROP TYPE "Tier_old";
COMMIT;
