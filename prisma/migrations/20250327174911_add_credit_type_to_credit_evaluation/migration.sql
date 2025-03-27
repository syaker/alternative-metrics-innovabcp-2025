/*
  Warnings:

  - Added the required column `credit_type` to the `credit_evaluations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreditType" AS ENUM ('MORTGAGE', 'VEHICLE', 'PERSONAL');

-- AlterTable
ALTER TABLE "credit_evaluations" ADD COLUMN     "credit_type" "CreditType" NOT NULL;
