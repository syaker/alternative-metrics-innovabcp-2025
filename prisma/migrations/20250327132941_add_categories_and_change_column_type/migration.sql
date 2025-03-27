/*
 Warnings:

 - Changed the type of `amount` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
 - Changed the type of `category` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
 */
-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM(
  'RENT',
  'WATER',
  'ELECTRICITY',
  'TELEPHONY',
  'INTERNET',
  'COLLEGE',
  'CERTIFICATIONS',
  'UNIVERSITY',
  'ONLINE_SHOPPING',
  'SALARY'
);

-- AlterTable
ALTER TABLE "transactions"
  DROP COLUMN "amount",
  ADD COLUMN "amount" integer NOT NULL,
  DROP COLUMN "category",
  ADD COLUMN "category" "ExpenseType" NOT NULL;

