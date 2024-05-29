/*
  Warnings:

  - The values [Seller] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Buyer', 'Player');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "buyerId" INTEGER,
ADD COLUMN     "purchased" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
